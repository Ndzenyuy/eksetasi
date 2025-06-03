'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ExamHistoryTable from '@/app/components/profile/ExamHistoryTable';
import FilterControls from '@/app/components/profile/FilterControls';

interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  grade: string;
  passed: boolean;
  submittedAt: string;
  timeSpent: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  statistics: {
    totalExamsTaken: number;
    totalExamsPassed: number;
    passRate: number;
    averageScore: number;
    totalTimeSpent: number;
  };
  allResults: ExamResult[];
}

interface Filters {
  search: string;
  grade: string;
  passed: string;
  dateRange: string;
}

export default function ExamHistoryPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    grade: '',
    passed: '',
    dateRange: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      applyFilters();
    }
  }, [profile, filters]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!profile) return;

    let results = [...profile.allResults];

    // Search filter
    if (filters.search) {
      results = results.filter(result =>
        result.examTitle.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Grade filter
    if (filters.grade) {
      results = results.filter(result => result.grade === filters.grade);
    }

    // Pass/Fail filter
    if (filters.passed) {
      const passed = filters.passed === 'true';
      results = results.filter(result => result.passed === passed);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      results = results.filter(result =>
        new Date(result.submittedAt) >= startDate
      );
    }

    setFilteredResults(results);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      grade: '',
      passed: '',
      dateRange: '',
    });
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
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
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
              <h1 className="text-3xl font-bold text-gray-900">Exam History</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete history of your exam attempts and performance
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/profile"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Profile
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Take New Exam
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{profile.statistics.totalExamsTaken}</div>
            <div className="text-sm text-gray-600">Total Exams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{profile.statistics.totalExamsPassed}</div>
            <div className="text-sm text-gray-600">Exams Passed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{profile.statistics.passRate}%</div>
            <div className="text-sm text-gray-600">Pass Rate</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{profile.statistics.averageScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>

        {/* Performance Overview */}
        {profile.allResults.length > 0 && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div className="text-sm text-gray-600">
              You have taken {profile.allResults.length} exams with an average score of {profile.statistics.averageScore}%.
              {profile.statistics.passRate >= 80 && (
                <span className="text-green-600 font-medium"> Excellent performance!</span>
              )}
              {profile.statistics.passRate >= 60 && profile.statistics.passRate < 80 && (
                <span className="text-yellow-600 font-medium"> Good progress, keep it up!</span>
              )}
              {profile.statistics.passRate < 60 && (
                <span className="text-red-600 font-medium"> Consider reviewing the material more thoroughly.</span>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalResults={profile.allResults.length}
            filteredResults={filteredResults.length}
          />
        </div>

        {/* Results Table */}
        <ExamHistoryTable results={filteredResults} />
      </div>
    </div>
  );
}
