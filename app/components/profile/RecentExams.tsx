'use client';

import Link from 'next/link';

interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  grade: string;
  passed: boolean;
  submittedAt: string;
  timeSpent?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

interface RecentExamsProps {
  results: ExamResult[];
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A':
      return 'bg-green-100 text-green-800';
    case 'B':
      return 'bg-blue-100 text-blue-800';
    case 'C':
      return 'bg-yellow-100 text-yellow-800';
    case 'D':
      return 'bg-orange-100 text-orange-800';
    case 'F':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};

export default function RecentExams({ results }: RecentExamsProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No exams taken yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start taking exams to see your results here.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {results.map((result) => (
          <li key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {result.examTitle}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Completed {new Date(result.submittedAt).toLocaleDateString()}
                      </span>
                      {result.timeSpent && (
                        <span>
                          {Math.floor(result.timeSpent / 60)}h {result.timeSpent % 60}m
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Grade Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                      Grade {result.grade}
                    </span>
                    
                    {/* Pass/Fail Status */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.passed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Score */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Score:</span>
                      <span className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </div>
                    
                    {/* Questions Answered */}
                    {result.correctAnswers !== undefined && result.totalQuestions !== undefined && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Correct:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {result.correctAnswers}/{result.totalQuestions}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    href={`/exams/${result.examId}/review`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Review Answers
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* View All Link */}
      {results.length > 0 && (
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-center">
            <Link
              href="/profile/history"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all exam results →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
