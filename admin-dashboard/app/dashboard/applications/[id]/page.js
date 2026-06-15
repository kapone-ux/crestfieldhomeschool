'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Email, Phone, Calendar, FileText, 
  Download, CheckCircle, XCircle, Star, Clock,
  MessageSquare, Briefcase, GraduationCap, Award, Link as LinkIcon,
  ExternalLink, MoreVertical, Edit, Trash2, Send,
  Brain, Target, Lightbulb, AlertCircle
} from 'lucide-react';
import { 
  doc, getDoc, updateDoc, deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, storage } from '../../../../lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { analyzeApplication, generateInterviewQuestions } from '../../../../lib/openai';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadApplication();
    }
  }, [params.id]);

  const loadApplication = async () => {
    try {
      const docRef = doc(db, 'applications', params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApplication({ id: docSnap.id, ...data });
        if (data.aiAnalysis) {
          setAiAnalysis(data.aiAnalysis);
        }
      } else {
        router.push('/dashboard/applications');
      }
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setStatusUpdating(true);
      const docRef = doc(db, 'applications', params.id);
      await updateDoc(docRef, {
        status: newStatus,
        reviewed: true,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setApplication(prev => ({
        ...prev,
        status: newStatus,
        reviewed: true
      }));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const deleteApplication = async () => {
    try {
      await deleteDoc(doc(db, 'applications', params.id));
      router.push('/dashboard/applications');
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const runAIAnalysis = async () => {
    try {
      setAnalyzing(true);
      
      // Run AI analysis
      const analysisResult = await analyzeApplication(application);
      if (analysisResult.success) {
        setAiAnalysis(analysisResult.analysis);
        
        // Save to database
        const docRef = doc(db, 'applications', params.id);
        await updateDoc(docRef, {
          aiAnalysis: analysisResult.analysis,
          analyzedAt: serverTimestamp()
        });
      }

      // Generate interview questions
      const questionsResult = await generateInterviewQuestions(application);
      if (questionsResult.success) {
        setInterviewQuestions(questionsResult.questions);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setAnalyzing(false);
      setShowAiPanel(true);
    }
  };

  const downloadCV = async () => {
    if (application.cvUrl) {
      window.open(application.cvUrl, '_blank');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-KE', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type) => {
    const colors = {
      student: 'bg-blue-100 text-blue-700',
      teacher: 'bg-purple-100 text-purple-700',
      coding: 'bg-green-100 text-green-700',
      homeschool: 'bg-orange-100 text-orange-700',
      contact: 'bg-cyan-100 text-cyan-700',
      consultation: 'bg-pink-100 text-pink-700'
    };

    const icons = {
      student: <GraduationCap className="w-4 h-4" />,
      teacher: <Briefcase className="w-4 h-4" />,
      coding: <FileText className="w-4 h-4" />,
      homeschool: <Home className="w-4 h-4" />,
      contact: <MessageSquare className="w-4 h-4" />,
      consultation: <Calendar className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
        {icons[type] || <FileText className="w-4 h-4" />}
        {type?.charAt(0).toUpperCase() + type?.slice(1)}
      </span>
    );
  };

  const getStatusActions = () => {
    switch (application?.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => updateStatus('approved')}
              disabled={statusUpdating}
              className="btn btn-success flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button 
              onClick={() => updateStatus('rejected')}
              disabled={statusUpdating}
              className="btn btn-danger flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        );
      case 'approved':
        return (
          <button 
            onClick={() => updateStatus('pending')}
            disabled={statusUpdating}
            className="btn btn-secondary"
          >
            Mark as Pending
          </button>
        );
      case 'rejected':
        return (
          <button 
            onClick={() => updateStatus('pending')}
            disabled={statusUpdating}
            className="btn btn-secondary"
          >
            Restore Application
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/applications" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{application.fullName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeBadge(application.type)}
                  <span className={`badge ${
                    application.status === 'pending' ? 'badge-warning' :
                    application.status === 'approved' ? 'badge-success' :
                    'badge-danger'
                  }`}>
                    {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusActions()}
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-secondary text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Email className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${application.email}`} className="text-primary hover:underline">
                      {application.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                      {application.phone}
                    </a>
                  </div>
                </div>
                {application.country && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="text-gray-800">{application.country}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-gray-800">{formatDate(application.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Application Details
              </h2>
              <div className="space-y-4">
                {application.program && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Program / Position</p>
                    <p className="text-gray-800 font-medium">{application.program}</p>
                  </div>
                )}
                {application.specialization && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Specialization</p>
                    <p className="text-gray-800 font-medium">{application.specialization}</p>
                  </div>
                )}
                {application.experience !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Years of Experience</p>
                    <p className="text-gray-800 font-medium">{application.experience} years</p>
                  </div>
                )}
                {application.qualifications && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                    <p className="text-gray-800">{application.qualifications}</p>
                  </div>
                )}
                {application.certifications && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Certifications</p>
                    <p className="text-gray-800">{application.certifications}</p>
                  </div>
                )}
                {application.curriculum && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Curriculum Experience</p>
                    <p className="text-gray-800">{application.curriculum}</p>
                  </div>
                )}
                {application.message && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Message</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{application.message}</p>
                    </div>
                  </div>
                )}
                {application.coverLetter && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{application.coverLetter}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Files */}
            {(application.cvUrl || application.photoUrl) && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Uploaded Files
                </h2>
                <div className="space-y-3">
                  {application.cvUrl && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Curriculum Vitae</p>
                          <p className="text-sm text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <button onClick={downloadCV} className="btn btn-primary">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  )}
                  {application.photoUrl && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Passport Photo</p>
                          <p className="text-sm text-gray-500">Image</p>
                        </div>
                      </div>
                      <a href={application.photoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {(application.linkedin || application.portfolio) && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  External Links
                </h2>
                <div className="space-y-3">
                  {application.linkedin && (
                    <a 
                      href={application.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">LinkedIn Profile</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">{application.linkedin}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                  )}
                  {application.portfolio && (
                    <a 
                      href={application.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Portfolio</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">{application.portfolio}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Analysis
                </h2>
                <button 
                  onClick={runAIAnalysis}
                  disabled={analyzing}
                  className="btn btn-primary text-sm"
                >
                  {analyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>

              {analyzing && (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing application...</p>
                </div>
              )}

              {aiAnalysis && !analyzing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {aiAnalysis.suitabilityScore || aiAnalysis.suitability_score}/10
                      </div>
                      <p className="text-sm text-gray-500">Suitability Score</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(aiAnalysis.suitabilityScore || aiAnalysis.suitability_score) * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Recommendation</p>
                    <p className="font-medium text-gray-800">
                      {aiAnalysis.recommendedCategory || aiAnalysis.recommended_category}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {aiAnalysis.strengths?.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Areas of Concern</p>
                    <ul className="space-y-1">
                      {aiAnalysis.concerns?.map((concern, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-yellow-700">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Interview Recommendation</p>
                    <p className="font-medium text-gray-800 capitalize">
                      {aiAnalysis.interviewRecommendation || aiAnalysis.interview_recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interview Questions */}
            {interviewQuestions.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Suggested Questions
                </h2>
                <div className="space-y-3">
                  {interviewQuestions.map((question, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium text-primary mr-2">{idx + 1}.</span>
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a 
                  href={`mailto:${application.email}?subject=Re: Your Application to Crestfield Academy`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Send className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Send Email</span>
                </a>
                <a 
                  href={`tel:${application.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Call Applicant</span>
                </a>
                <button 
                  onClick={() => {/* Schedule meeting functionality */}}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Schedule Meeting</span>
                </button>
                <button 
                  onClick={() => {/* Add note functionality */}}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <Edit className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Add Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Application</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={deleteApplication}
                className="btn btn-danger"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}