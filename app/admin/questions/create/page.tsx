'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateQuestionForm from '@/app/components/admin/CreateQuestionForm';

export default function CreateQuestionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (questionData: {
    text: string;
    options: Array<{ text: string; isCorrect: boolean }>;
    correctAnswer: string;
    explanation?: string;
    category: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create question");
      }

      // Redirect to questions list with success message
      router.push("/admin/questions?created=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Question</h1>
              <p className="mt-1 text-sm text-gray-500">
                Add a new question to the question bank
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/questions"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Questions
              </Link>
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error creating question</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Question Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the information below to create a new question
            </p>
          </div>
          <div className="px-6 py-6">
            <CreateQuestionForm
              onSubmit={handleSubmit}
              loading={loading}
              submitButtonText="Create Question"
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Question Creation Tips</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5">💡</span>
              <p className="ml-2">
                <strong>Clear and Concise:</strong> Write questions that are easy to understand and unambiguous.
              </p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5">✅</span>
              <p className="ml-2">
                <strong>Single Correct Answer:</strong> Ensure only one option is marked as correct.
              </p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5">📚</span>
              <p className="ml-2">
                <strong>Helpful Explanations:</strong> Provide detailed explanations to help students learn.
              </p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5">🏷️</span>
              <p className="ml-2">
                <strong>Proper Categorization:</strong> Use consistent categories to organize questions effectively.
              </p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5">⚖️</span>
              <p className="ml-2">
                <strong>Appropriate Difficulty:</strong> Set the difficulty level to match the question complexity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
