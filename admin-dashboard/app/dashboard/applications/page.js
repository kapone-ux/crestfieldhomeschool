'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, subscribeToApplications, logOut, getApplications } from '../../../lib/firebase';
import { 
  Search, Filter, Download, RefreshCw, Menu, X, LogOut, 
  FileText, GraduationCap, Users, Code, Home, MessageSquare,
  ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, Clock
} from 'lucide-react';

export default function AllApplicationsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 20;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user);
        loadApplications();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadApplications = async () => {
    try {
      const result = await getApplications();
      if (result.success) {
        setApplications(result.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  useEffect(() => {
    let filtered = [...applications];

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(app => app.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.fullName?.toLowerCase().includes(query) ||
        app.email?.toLowerCase().includes(query) ||
        app.phone?.includes(query) ||
        app.program?.toLowerCase().includes(query) ||
        app.specialization?.toLowerCase().includes(query)
      );
    }

    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [applications, searchQuery, typeFilter, statusFilter]);

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-KE', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'student': return <GraduationCap className="w-4 h-4" />;
      case 'teacher': return <Users className="w-4 h-4" />;
      case 'coding': return <Code className="w-4 h-4" />;
      case 'homeschool': return <Home className="w-4 h-4" />;
      case 'contact': return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'student': return 'bg-blue-100 text-blue-700';
      case 'teacher': return 'bg-purple-100 text-purple-700';
      case 'coding': return 'bg-green-100 text-green-700';
      case 'homeschool': return 'bg-orange-100 text-orange-700';
      case 'contact': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning"><Clock className="w-3 h-3 mr-1" />Pending</span>;
      case 'approved':
        return <span className="badge badge-success"><CheckCircle className="w-3 h-3 mr-1" />Approved</span>;
      case 'rejected':
        return <span className="badge badge-danger"><XCircle className="w-3 h-3 mr-1" />Rejected</span>;
      default:
        return <span className="badge badge-neutral">Unknown</span>;
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Program', 'Status', 'Date'];
    const rows = filteredApps.map(app => [
      app.fullName,
      app.email,
      app.phone,
      app.type,
      app.program || app.specialization || 'N/A',
      app.status,
      formatDate(app.createdAt)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Crestfield</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <FileText className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/applications" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white">
              <FileText className="w-5 h-5" />
              <span>All Applications</span>
            </Link>
            <Link href="/dashboard/students" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <GraduationCap className="w-5 h-5" />
              <span>Students</span>
            </Link>
            <Link href="/dashboard/teachers" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Users className="w-5 h-5" />
              <span>Teachers</span>
            </Link>
            <Link href="/dashboard/coding" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Code className="w-5 h-5" />
              <span>Coding Courses</span>
            </Link>
            <Link href="/dashboard/homeschool" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Homeschool</span>
            </Link>
            <Link href="/dashboard/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">All Applications</h1>
                <p className="text-sm text-gray-500">{filteredApps.length} applications found</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="coding">Coding Courses</option>
                <option value="homeschool">Homeschool</option>
                <option value="contact">Messages</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={loadApplications} className="btn btn-secondary">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button onClick={exportToCSV} className="btn btn-outline">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Type</th>
                    <th>Program / Position</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApps.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500">
                        No applications found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedApps.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar avatar-primary">
                              {app.fullName?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="font-medium">{app.fullName}</p>
                              <p className="text-xs text-gray-500">ID: {app.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTypeColor(app.type)}`}>
                            {getTypeIcon(app.type)}
                            {app.type?.charAt(0).toUpperCase() + app.type?.slice(1)}
                          </span>
                        </td>
                        <td className="text-sm">{app.program || app.specialization || 'N/A'}</td>
                        <td>
                          <div className="text-sm">
                            <p className="text-gray-900">{app.email}</p>
                            <p className="text-gray-500">{app.phone}</p>
                          </div>
                        </td>
                        <td className="text-sm">{formatDate(app.createdAt)}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>
                          <Link 
                            href={`/dashboard/applications/${app.id}`}
                            className="btn btn-secondary text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredApps.length)} of {filteredApps.length} applications
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}