'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ExamTable from '@/app/components/admin/ExamTable';
import ExamFilters from '@/app/components/admin/ExamFilters';

interface Exam {
  id: string;
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  isActive: boolean;
  availableFrom?: string;
  availableUntil?: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  _count: {
    questions: number;
    attempts: number;
  };
}

interface Filters {
  search: string;
  isActive: string;
  createdBy: string;
}

export default function ExamsManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    isActive: '',
    createdBy: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creators, setCreators] = useState<Array<{ id: string; name: string }>>([]);
  const router = useRouter();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [exams, filters]);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/admin/exams');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Failed to fetch exams');
      }
      const data = await response.json();
      setExams(data.exams || []);
      setCreators(data.creators || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...exams];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Active status filter
    if (filters.isActive) {
      const isActive = filters.isActive === 'true';
      filtered = filtered.filter(exam => exam.isActive === isActive);
    }

    // Creator filter
    if (filters.createdBy) {
      filtered = filtered.filter(exam => exam.createdBy.name === filters.createdBy);
    }

    setFilteredExams(filtered);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      isActive: '',
      createdBy: '',
    });
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }

      // Remove exam from state
      setExams(prev => prev.filter(e => e.id !== examId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete exam');
    }
  };

  const handleToggleActive = async (examId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update exam status');
      }

      // Update exam in state
      setExams(prev => prev.map(exam => 
        exam.id === examId ? { ...exam, isActive } : exam
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update exam status');
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
            onClick={fetchExams}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
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
              <h1 className="text-3xl font-bold text-gray-900">Exam Library</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and organize your exam collection
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/exams/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Exam
              </Link>
              <Link
                href="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{exams.length}</div>
            <div className="text-sm text-gray-600">Total Exams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {exams.filter(e => e.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Exams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{creators.length}</div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{filteredExams.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ExamFilters
            filters={filters}
            creators={creators}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalExams={exams.length}
            filteredExams={filteredExams.length}
          />
        </div>

        {/* Exams Table */}
        <ExamTable
          exams={filteredExams}
          onDeleteExam={handleDeleteExam}
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  );
}
