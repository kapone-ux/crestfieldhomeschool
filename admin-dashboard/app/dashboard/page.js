'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, logOut, getApplicationStats, subscribeToApplications, getUnreadNotifications } from '../../lib/firebase';
import { 
  Users, FileText, CheckCircle, XCircle, Clock, TrendingUp, 
  Bell, Search, Filter, Download, RefreshCw, LogOut, Menu, X,
  GraduationCap, Code, MessageSquare, Home
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user);
        loadData();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadData = async () => {
    try {
      // Load stats
      const statsResult = await getApplicationStats();
      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      // Subscribe to recent applications
      const unsubscribe = subscribeToApplications(null, (applications) => {
        setRecentApplications(applications.slice(0, 10));
      });

      // Load notifications
      const notifResult = await getUnreadNotifications();
      if (notifResult.success) {
        setNotifications(notifResult.notifications.slice(0, 5));
      }

      return unsubscribe;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  const filteredApplications = recentApplications.filter(app => {
    if (activeTab !== 'all' && app.type !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.fullName?.toLowerCase().includes(query) ||
        app.email?.toLowerCase().includes(query) ||
        app.program?.toLowerCase().includes(query) ||
        app.phone?.includes(query)
      );
    }
    return true;
  });

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
        return <span className="badge badge-warning">Pending</span>;
      case 'approved':
        return <span className="badge badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-neutral">Unknown</span>;
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white">
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/applications" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
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
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-800">{stats?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-800">{stats?.pending || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-yellow-600 font-medium">Action needed</span>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-gray-800">{stats?.approved || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-500 ml-2">success rate</span>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-gray-800">{stats?.rejected || 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Review recommended</span>
              </div>
            </div>
          </div>

          {/* Applications by Type */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { type: 'all', label: 'All', count: stats?.total || 0, color: 'bg-gray-600' },
              { type: 'student', label: 'Students', count: stats?.byType?.student || 0, color: 'bg-blue-500' },
              { type: 'teacher', label: 'Teachers', count: stats?.byType?.teacher || 0, color: 'bg-purple-500' },
              { type: 'coding', label: 'Coding', count: stats?.byType?.coding || 0, color: 'bg-green-500' },
              { type: 'homeschool', label: 'Homeschool', count: stats?.byType?.homeschool || 0, color: 'bg-orange-500' },
              { type: 'contact', label: 'Messages', count: stats?.byType?.contact || 0, color: 'bg-cyan-500' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setActiveTab(item.type)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeTab === item.type 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-gray-200 bg-white hover:border-primary'
                }`}
              >
                <p className={`text-sm ${activeTab === item.type ? 'text-primary-light' : 'text-gray-500'} mb-1`}>
                  {item.label}
                </p>
                <p className="text-2xl font-bold">{item.count}</p>
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="btn btn-secondary flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="btn btn-outline flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button onClick={loadData} className="btn btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
              <Link href="/dashboard/applications" className="text-primary font-medium hover:underline text-sm">
                View All →
              </Link>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Type</th>
                    <th>Program</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
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
                        <td className="text-sm">{app.program || app.position || 'N/A'}</td>
                        <td>
                          <div className="text-sm">
                            <p>{app.email}</p>
                            <p className="text-gray-500">{app.phone}</p>
                          </div>
                        </td>
                        <td className="text-sm">{formatDate(app.createdAt)}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/applications/${app.id}`} className="text-primary hover:text-primary-dark">
                              View
                            </Link>
                            <span className="text-gray-300">|</span>
                            <button className="text-green-600 hover:text-green-700">Approve</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-red-600 hover:text-red-700">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}