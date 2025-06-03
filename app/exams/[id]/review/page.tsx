'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Question, { QuestionData } from '@/app/components/exam/Question';
import ExamProgress from '@/app/components/exam/ExamProgress';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface ReviewQuestion extends QuestionData {
  userAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean;
}

interface ExamReview {
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number;
    totalQuestions: number;
    questions: ReviewQuestion[];
  };
  result: {
    id: string;
    score: number;
    grade: string;
    passed: boolean;
    submittedAt: string;
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;
  };
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface ExamReviewPageProps {
  params: {
    id: string;
  };
}

export default function ExamReviewPage({ params }: ExamReviewPageProps) {
  const router = useRouter();
  const [reviewData, setReviewData] = useState<ExamReview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReviewData = async () => {
      try {
        const response = await fetch(`/api/exams/${params.id}/review`);
        const data = await response.json();

        if (response.ok) {
          setReviewData(data);
        } else {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          setError(data.message || 'Failed to load exam review');
        }
      } catch (err) {
        console.error('Error loading review:', err);
        setError('Failed to load exam review');
      } finally {
        setLoading(false);
      }
    };

    loadReviewData();
  }, [params.id, router]);

  const handleQuestionSelect = (questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
  };

  const handleNext = () => {
    if (reviewData && currentQuestionIndex < reviewData.exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam review...</p>
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
          <div className="mt-4 space-x-4">
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Review Not Available</h1>
          <p className="mt-2 text-gray-600">Unable to load exam review data.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = reviewData.exam.questions[currentQuestionIndex];
  const answeredQuestions = reviewData.exam.questions.map((_, index) => index + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                📝 Exam Review: {reviewData.exam.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Review your answers and learn from explanations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/exams/${params.id}/results?score=${reviewData.result.score}`}>
                <Button variant="outline">
                  📊 View Results
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  🏠 Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content - Question */}
          <div className="lg:col-span-3">
            <Question
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={reviewData.exam.questions.length}
              selectedAnswer={currentQuestion.userAnswer}
              onAnswerSelect={() => {}} // No-op in review mode
              showCorrectAnswer={true}
              isReviewMode={true}
            />

            {/* Answer Analysis */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  📊 Answer Analysis
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${currentQuestion.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {currentQuestion.isCorrect ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {currentQuestion.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentQuestion.userAnswer ? 
                        String.fromCharCode(65 + currentQuestion.options.findIndex(opt => opt.id === currentQuestion.userAnswer)) : 
                        'N/A'
                      }
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Your Answer</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {String.fromCharCode(65 + currentQuestion.options.findIndex(opt => opt.isCorrect))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Correct Answer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous Question
              </Button>

              <div className="flex space-x-3">
                <Link href={`/exams/${params.id}/results?score=${reviewData.result.score}`}>
                  <Button variant="outline">
                    📊 View Results
                  </Button>
                </Link>
                
                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === reviewData.exam.questions.length - 1}
                >
                  Next Question →
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Summary */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  📋 Review Summary
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className={`font-bold ${reviewData.result.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                      {reviewData.result.score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-bold">{reviewData.result.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-bold ${reviewData.result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {reviewData.result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct:</span>
                    <span className="font-bold text-green-600">{reviewData.result.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incorrect:</span>
                    <span className="font-bold text-red-600">{reviewData.result.incorrectAnswers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium text-sm">
                      {new Date(reviewData.result.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <ExamProgress
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={reviewData.exam.questions.length}
              answeredQuestions={answeredQuestions}
              onQuestionSelect={handleQuestionSelect}
              isReviewMode={true}
            />

            {/* Question Status Legend */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  🎯 Question Status
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviewData.exam.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        index === currentQuestionIndex ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuestionSelect(index + 1)}
                    >
                      <span className="text-sm font-medium">
                        Question {index + 1}
                      </span>
                      <span className="text-lg">
                        {question.isCorrect ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
