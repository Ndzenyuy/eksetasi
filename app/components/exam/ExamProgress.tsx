'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface ExamProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
  onQuestionSelect: (questionNumber: number) => void;
  isReviewMode?: boolean;
}

export default function ExamProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onQuestionSelect,
  isReviewMode = false,
}: ExamProgressProps) {
  const getQuestionStatus = (questionNumber: number) => {
    if (questionNumber === currentQuestion) {
      return 'current';
    }
    if (answeredQuestions.includes(questionNumber)) {
      return 'answered';
    }
    return 'unanswered';
  };

  const getQuestionStyle = (questionNumber: number) => {
    const status = getQuestionStatus(questionNumber);
    
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-500';
      case 'answered':
        return 'bg-green-500 text-white border-green-500';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:border-gray-400';
    }
  };

  const progressPercentage = (answeredQuestions.length / totalQuestions) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {isReviewMode ? 'Review Progress' : 'Exam Progress'}
          </h3>
          <span className="text-sm text-gray-500">
            {answeredQuestions.length} of {totalQuestions} answered
          </span>
        </div>
        
        {/* Overall progress bar */}
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
            <span>100%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Question grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            return (
              <button
                key={questionNumber}
                onClick={() => onQuestionSelect(questionNumber)}
                className={`
                  w-10 h-10 rounded-lg border-2 text-sm font-medium
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${getQuestionStyle(questionNumber)}
                `}
                title={`Question ${questionNumber} - ${getQuestionStatus(questionNumber)}`}
              >
                {questionNumber}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-500"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-500"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white rounded border-2 border-gray-300"></div>
            <span className="text-gray-600">Unanswered</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{currentQuestion}</div>
            <div className="text-xs text-blue-600">Current</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{answeredQuestions.length}</div>
            <div className="text-xs text-green-600">Answered</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{totalQuestions - answeredQuestions.length}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => onQuestionSelect(Math.max(1, currentQuestion - 1))}
            disabled={currentQuestion === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-500">
            Question {currentQuestion} of {totalQuestions}
          </span>
          
          <button
            onClick={() => onQuestionSelect(Math.min(totalQuestions, currentQuestion + 1))}
            disabled={currentQuestion === totalQuestions}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
