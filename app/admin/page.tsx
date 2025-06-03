'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminStatsCard from '@/app/components/admin/AdminStatsCard';
import RecentActivity from '@/app/components/admin/RecentActivity';
import QuickActions from '@/app/components/admin/QuickActions';

interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalExams: number;
  totalAttempts: number;
  recentUsers: number;
  recentQuestions: number;
  recentExams: number;
  recentAttempts: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardData {
  user: User;
  stats: AdminStats;
  permissions: {
    canManageUsers: boolean;
    canManageQuestions: boolean;
    canManageExams: boolean;
    canViewAnalytics: boolean;
    canDeleteContent: boolean;
    canModerateContent: boolean;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Failed to fetch admin data');
      }
      const adminData = await response.json();
      setData(adminData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAdminData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to access the admin panel.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {data.user.name}! Manage your MCQ exam system.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/questions"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Questions
              </Link>
              <Link
                href="/admin/exams"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Exam Library
              </Link>
              {data.permissions.canViewAnalytics && (
                <Link
                  href="/admin/analytics"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Analytics
                </Link>
              )}
              {data.permissions.canManageUsers && (
                <Link
                  href="/admin/users"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Users
                </Link>
              )}
              <Link
                href="/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Users"
            value={data.stats.totalUsers}
            change={data.stats.recentUsers}
            changeLabel="new this week"
            icon="👥"
            color="blue"
          />
          <AdminStatsCard
            title="Total Questions"
            value={data.stats.totalQuestions}
            change={data.stats.recentQuestions}
            changeLabel="added this week"
            icon="❓"
            color="green"
          />
          <AdminStatsCard
            title="Total Exams"
            value={data.stats.totalExams}
            change={data.stats.recentExams}
            changeLabel="created this week"
            icon="📝"
            color="purple"
          />
          <AdminStatsCard
            title="Total Attempts"
            value={data.stats.totalAttempts}
            change={data.stats.recentAttempts}
            changeLabel="this week"
            icon="🎯"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions permissions={data.permissions} />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Role-based Features */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${data.permissions.canManageUsers ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="mr-2">{data.permissions.canManageUsers ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium">Manage Users</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${data.permissions.canManageQuestions ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="mr-2">{data.permissions.canManageQuestions ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium">Manage Questions</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${data.permissions.canManageExams ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="mr-2">{data.permissions.canManageExams ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium">Manage Exams</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${data.permissions.canViewAnalytics ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="mr-2">{data.permissions.canViewAnalytics ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium">View Analytics</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${data.permissions.canDeleteContent ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="mr-2">{data.permissions.canDeleteContent ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium">Delete Content</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${data.permissions.canModerateContent ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="mr-2">{data.permissions.canModerateContent ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium">Moderate Content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
