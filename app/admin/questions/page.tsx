'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuestionTable from '@/app/components/admin/QuestionTable';
import QuestionFilters from '@/app/components/admin/QuestionFilters';

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  _count: {
    exams: number;
  };
}

interface Filters {
  search: string;
  category: string;
  difficulty: string;
  createdBy: string;
}

export default function QuestionsManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    difficulty: '',
    createdBy: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [creators, setCreators] = useState<Array<{ id: string; name: string }>>([]);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data.questions || []);
      setCategories(data.categories || []);
      setCreators(data.creators || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(question =>
        question.text.toLowerCase().includes(filters.search.toLowerCase()) ||
        question.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(question => question.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(question => question.difficulty === filters.difficulty);
    }

    // Creator filter
    if (filters.createdBy) {
      filtered = filtered.filter(question => question.createdBy.name === filters.createdBy);
    }

    setFilteredQuestions(filtered);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      difficulty: '',
      createdBy: '',
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      // Remove question from state
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete question');
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
            onClick={fetchQuestions}
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
              <h1 className="text-3xl font-bold text-gray-900">Question Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your question bank and create new questions
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/questions/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Question
              </Link>
              <Link
                href="/admin/questions/import"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Import Questions
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
            <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{creators.length}</div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{filteredQuestions.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <QuestionFilters
            filters={filters}
            categories={categories}
            creators={creators}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalQuestions={questions.length}
            filteredQuestions={filteredQuestions.length}
          />
        </div>

        {/* Questions Table */}
        <QuestionTable
          questions={filteredQuestions}
          onDeleteQuestion={handleDeleteQuestion}
        />
      </div>
    </div>
  );
}
