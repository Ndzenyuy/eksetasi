'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface ReviewResultsProps {
  result: {
    score: number;
    grade: string;
    passed: boolean;
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;
    submittedAt: string;
  };
  questions: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    difficulty?: string;
    category?: string;
  }>;
}

export default function ReviewResults({ result, questions }: ReviewResultsProps) {
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

  // Calculate statistics by difficulty and category
  const difficultyStats = questions.reduce((acc, question) => {
    const difficulty = question.difficulty || 'unknown';
    if (!acc[difficulty]) {
      acc[difficulty] = { total: 0, correct: 0 };
    }
    acc[difficulty].total++;
    if (question.isCorrect) {
      acc[difficulty].correct++;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const categoryStats = questions.reduce((acc, question) => {
    const category = question.category || 'unknown';
    if (!acc[category]) {
      acc[category] = { total: 0, correct: 0 };
    }
    acc[category].total++;
    if (question.isCorrect) {
      acc[category].correct++;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">
            📊 Overall Performance
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getScoreColor(result.score)} mb-2`}>
              {result.score}%
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${getGradeColor(result.grade)}`}>
              Grade: {result.grade}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{result.incorrectAnswers}</div>
              <div className="text-sm text-red-600">Incorrect</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  result.score >= 80 ? 'bg-green-500' : 
                  result.score >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="text-red-500">60% (Pass)</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Difficulty */}
      {Object.keys(difficultyStats).length > 1 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              🎯 Performance by Difficulty
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(difficultyStats).map(([difficulty, stats]) => {
                const percentage = Math.round((stats.correct / stats.total) * 100);
                const getDifficultyColor = (diff: string) => {
                  switch (diff) {
                    case 'easy': return 'bg-green-500';
                    case 'medium': return 'bg-yellow-500';
                    case 'hard': return 'bg-red-500';
                    default: return 'bg-gray-500';
                  }
                };

                return (
                  <div key={difficulty} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(difficulty)}`} />
                      <span className="text-sm font-medium capitalize">{difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {stats.correct}/{stats.total}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance by Category */}
      {Object.keys(categoryStats).length > 1 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              📚 Performance by Category
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const percentage = Math.round((stats.correct / stats.total) * 100);

                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {stats.correct}/{stats.total}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Recommendations */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">
            💡 Study Recommendations
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.score < 60 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Focus on fundamentals:</strong> Your score indicates you need to review the basic concepts. 
                  Consider retaking this exam after studying the material more thoroughly.
                </p>
              </div>
            )}
            
            {result.score >= 60 && result.score < 80 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Good foundation:</strong> You have a solid understanding but there's room for improvement. 
                  Review the questions you got wrong and practice similar problems.
                </p>
              </div>
            )}
            
            {result.score >= 80 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Excellent work:</strong> You have a strong grasp of the material. 
                  Consider taking more advanced exams to further challenge yourself.
                </p>
              </div>
            )}

            {/* Specific recommendations based on incorrect answers */}
            {Object.entries(difficultyStats).map(([difficulty, stats]) => {
              const percentage = (stats.correct / stats.total) * 100;
              if (percentage < 60) {
                return (
                  <div key={difficulty} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Focus on {difficulty} questions:</strong> You scored {Math.round(percentage)}% 
                      on {difficulty} level questions. Consider reviewing these topics more carefully.
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
