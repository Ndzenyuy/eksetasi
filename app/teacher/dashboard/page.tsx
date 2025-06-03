'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TeacherStats {
  totalExams: number;
  totalStudents: number;
  totalAttempts: number;
  averageScore: number;
}

interface RecentExam {
  id: string;
  title: string;
  totalQuestions: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    attempts: number;
  };
}

interface RecentAttempt {
  id: string;
  studentName: string;
  examTitle: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<TeacherStats>({
    totalExams: 0,
    totalStudents: 0,
    totalAttempts: 0,
    averageScore: 0,
  });
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch('/api/teacher/dashboard');
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setStats(data.statistics);
          setRecentExams(data.recentExams);
          setRecentAttempts(data.recentAttempts);
        } else {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          if (response.status === 403) {
            router.push('/dashboard'); // Redirect non-teachers to student dashboard
            return;
          }
          setError(data.message || 'Failed to load teacher dashboard');
        }
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError('Failed to load teacher dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
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
          <p className="mt-4 text-gray-600">Loading teacher dashboard...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">MCQ Exam System - Teacher Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <Link
                href="/admin/questions/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Question
              </Link>
              <Link
                href="/admin/exams/create"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Exam
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/profile"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Profile
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
            <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your exams and monitor student progress
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                        My Exams
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalExams}</dd>
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
                      <span className="text-white font-semibold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Students
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalStudents}</dd>
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
                        Total Attempts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalAttempts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">🎯</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg Score
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalAttempts > 0 ? `${stats.averageScore}%` : 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quick Actions
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Common tasks for teachers
              </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/questions/create"
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
                >
                  <div className="text-blue-600 text-2xl mb-2">➕</div>
                  <div className="font-medium text-blue-900">Create Question</div>
                  <div className="text-sm text-blue-600">Add new questions to the question bank</div>
                </Link>
                
                <Link
                  href="/admin/exams/create"
                  className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
                >
                  <div className="text-green-600 text-2xl mb-2">📝</div>
                  <div className="font-medium text-green-900">Create Exam</div>
                  <div className="text-sm text-green-600">Build new exams from questions</div>
                </Link>
                
                <Link
                  href="/admin/questions"
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
                >
                  <div className="text-purple-600 text-2xl mb-2">📚</div>
                  <div className="font-medium text-purple-900">Question Bank</div>
                  <div className="text-sm text-purple-600">Manage existing questions</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Exams */}
          {recentExams.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  My Recent Exams
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your recently created exams and their activity
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {recentExams.map((exam) => (
                  <li key={exam.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            exam.isActive ? 'bg-green-500' : 'bg-gray-500'
                          }`}>
                            <span className="text-white font-semibold text-xs">
                              {exam.isActive ? '✓' : '⏸'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exam.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {exam.totalQuestions} questions • {exam._count.attempts} attempts
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Created on {new Date(exam.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          exam.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Student Attempts */}
          {recentAttempts.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Student Attempts
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Latest exam attempts by students on your exams
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {recentAttempts.map((attempt) => (
                  <li key={attempt.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            attempt.passed ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            <span className="text-white font-semibold text-xs">
                              {attempt.passed ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {attempt.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.examTitle}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Completed on {new Date(attempt.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          attempt.passed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.score}%
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
