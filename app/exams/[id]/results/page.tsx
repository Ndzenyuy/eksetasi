'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface ExamResult {
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  completedAt: string;
  grade: string;
  passed: boolean;
}

interface ExamResultsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExamResultsPage({ params }: ExamResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap the params Promise
  const { id } = use(params);

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Get score from URL params (in a real app, you'd fetch from API)
        const score = parseInt(searchParams.get('score') || '0');
        
        // Mock exam data - in a real app, this would come from an API
        const mockResult: ExamResult = {
          examId: id,
          examTitle: id === '1' ? 'JavaScript Fundamentals' : 'Python Basics',
          score: score,
          totalQuestions: id === '1' ? 5 : 2,
          correctAnswers: Math.floor((score / 100) * (id === '1' ? 5 : 2)),
          timeSpent: Math.floor(Math.random() * 20) + 10, // Random time between 10-30 minutes
          completedAt: new Date().toISOString(),
          grade: getGrade(score),
          passed: score >= 60,
        };

        setResult(mockResult);
      } catch (error) {
        console.error('Error loading results:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [id, searchParams, router]);

  const getGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Results Not Found</h1>
          <p className="mt-2 text-gray-600">Unable to load exam results.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
            <p className="mt-2 text-lg text-gray-600">{result.examTitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result Status */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
              result.passed
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {result.passed
              ? "🎉 Congratulations! You Passed!"
              : "😔 You Did Not Pass"}
          </div>
        </div>

        {/* Score Card */}
        <Card className="mb-8">
          <CardContent className="text-center py-8">
            <div className="mb-4">
              <div
                className={`text-6xl font-bold ${getScoreColor(result.score)}`}
              >
                {result.score}%
              </div>
              <div className="text-xl text-gray-600 mt-2">Your Score</div>
            </div>

            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getGradeColor(
                result.grade
              )}`}
            >
              Grade: {result.grade}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Summary
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{result.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-semibold text-green-600">
                    {result.correctAnswers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Incorrect Answers:</span>
                  <span className="font-semibold text-red-600">
                    {result.totalQuestions - result.correctAnswers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold">
                    {Math.round(
                      (result.correctAnswers / result.totalQuestions) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Exam Details
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Spent:</span>
                  <span className="font-semibold">
                    {result.timeSpent} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed At:</span>
                  <span className="font-semibold">
                    {new Date(result.completedAt).toLocaleDateString()}{" "}
                    {new Date(result.completedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold ${
                      result.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="font-semibold">60%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Score Progress</span>
                <span>{result.score}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  result.score >= 80
                    ? "bg-green-500"
                    : result.score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="text-red-500">60% (Pass)</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/exams/${id}/review`}>
            <Button variant="outline" className="w-full sm:w-auto">
              📝 Review Answers & Explanations
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">🏠 Back to Dashboard</Button>
          </Link>

          {!result.passed && (
            <Link href={`/exams/${id}`}>
              <Button variant="secondary" className="w-full sm:w-auto">
                🔄 Retake Exam
              </Button>
            </Link>
          )}
        </div>

        {/* Review Preview */}
        <Card className="mt-8">
          <CardContent className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📚 Want to Learn More?
            </h3>
            <p className="text-gray-600 mb-4">
              Review your answers with detailed explanations to understand the
              concepts better and improve your knowledge.
            </p>
            <Link href={`/exams/${id}/review`}>
              <Button variant="primary">Start Review Session →</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        <Card className="mt-8">
          <CardContent className="text-center">
            {result.passed ? (
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 Excellent Work!
                </h3>
                <p className="text-green-700">
                  You&apos;ve successfully completed this exam. Keep up the
                  great work and continue learning!
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  💪 Don&apos;t Give Up!
                </h3>
                <p className="text-red-700">
                  Learning is a journey. Review the material, practice more, and
                  try again. You&apos;ve got this!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
