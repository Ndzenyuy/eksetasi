'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  difficulty: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface DashboardStats {
  availableExams: number;
  completedExams: number;
  averageScore: number;
}

interface RecentResult {
  id: string;
  examTitle: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    availableExams: 0,
    completedExams: 0,
    averageScore: 0,
  });
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        if (response.ok) {
          // Check if user should be redirected to their role-specific dashboard
          if (data.user.role === 'ADMIN') {
            router.push('/admin');
            return;
          }
          if (data.user.role === 'TEACHER') {
            router.push('/teacher/dashboard');
            return;
          }

          setExams(data.exams);
          setUser(data.user);
          setStats(data.statistics);
          setRecentResults(data.recentResults);
        } else {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          setError(data.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">MCQ Exam System - Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome back, {user?.name}!</span>
              {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                <Link
                  href="/admin"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <Link
                href="/profile/history"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                History
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
            <p className="mt-1 text-sm text-gray-600">
              Take exams and track your academic progress
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Available Exams
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.availableExams}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Exams
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.completedExams}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Average Score
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completedExams > 0 ? `${stats.averageScore}%` : 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Exam Results
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your latest exam performances
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {recentResults.map((result) => (
                  <li key={result.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            result.passed ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            <span className="text-white font-semibold text-xs">
                              {result.passed ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {result.examTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            Completed on {new Date(result.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          result.passed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.score}%
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Exams */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Available Exams
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Click on an exam to start taking it
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {exams.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <p className="text-gray-500">No exams available at the moment.</p>
                </li>
              ) : (
                exams.map((exam) => {
                  const getExamIcon = (category: string) => {
                    switch (category.toLowerCase()) {
                      case 'programming': return 'JS';
                      case 'frontend': return 'FE';
                      case 'database': return 'DB';
                      case 'architecture': return 'AR';
                      default: return exam.title.substring(0, 2).toUpperCase();
                    }
                  };

                  const getExamColor = (difficulty: string) => {
                    switch (difficulty) {
                      case 'beginner': return 'bg-green-500';
                      case 'intermediate': return 'bg-yellow-500';
                      case 'advanced': return 'bg-red-500';
                      default: return 'bg-blue-500';
                    }
                  };

                  return (
                    <li key={exam.id}>
                      <Link href={`/exams/${exam.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className={`h-10 w-10 rounded-full ${getExamColor(exam.difficulty)} flex items-center justify-center`}>
                                  <span className="text-white font-semibold text-xs">
                                    {getExamIcon(exam.category)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {exam.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {exam.totalQuestions} questions • {exam.duration} minutes
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {exam.category} • {exam.difficulty}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Available
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
