'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Only used for review mode
}

export interface QuestionData {
  id: string;
  text: string;
  options: QuestionOption[];
  explanation?: string; // Shown after answering or in review mode
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

interface QuestionProps {
  question: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswerSelect: (questionId: string, optionId: string) => void;
  showCorrectAnswer?: boolean; // For review mode
  isReviewMode?: boolean;
}

export default function Question({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  isReviewMode = false,
}: QuestionProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOptionStyle = (option: QuestionOption) => {
    const isSelected = selectedAnswer === option.id;
    const isCorrect = option.isCorrect;
    const isWrong = isSelected && !isCorrect && showCorrectAnswer;

    if (showCorrectAnswer) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50 text-green-900';
      }
      if (isWrong) {
        return 'border-red-500 bg-red-50 text-red-900';
      }
      if (isSelected) {
        return 'border-blue-500 bg-blue-50 text-blue-900';
      }
    } else if (isSelected) {
      return 'border-blue-500 bg-blue-50 text-blue-900';
    }

    return 'border-gray-300 hover:border-gray-400 text-gray-600 hover:bg-gray-50';
  };

  const getOptionIcon = (option: QuestionOption) => {
    const isSelected = selectedAnswer === option.id;
    const isCorrect = option.isCorrect;
    const isWrong = isSelected && !isCorrect && showCorrectAnswer;

    if (showCorrectAnswer) {
      if (isCorrect) {
        return '✅';
      }
      if (isWrong) {
        return '❌';
      }
    }

    return isSelected ? '🔵' : '⚪';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            {question.difficulty && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  question.difficulty
                )}`}
              >
                {question.difficulty.charAt(0).toUpperCase() +
                  question.difficulty.slice(1)}
              </span>
            )}
            {question.category && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {question.category}
              </span>
            )}
          </div>

          {/* Progress indicator */}
          <div className="text-sm text-gray-500">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Question text */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {question.text}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() =>
                !isReviewMode && onAnswerSelect(question.id, option.id)
              }
              disabled={isReviewMode}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${getOptionStyle(option)}
                ${isReviewMode ? "cursor-default" : "cursor-pointer"}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg mt-0.5">{getOptionIcon(option)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-gray-500">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-sm font-medium">
                      {option.text}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation (shown in review mode or after answering) */}
        {question.explanation && showCorrectAnswer && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              💡 Explanation
            </h4>
            <p className="text-sm text-blue-800">{question.explanation}</p>
          </div>
        )}

        {/* Answer status */}
        {selectedAnswer && !isReviewMode && (
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Selected:</span> Option{" "}
            {String.fromCharCode(
              65 +
                question.options.findIndex((opt) => opt.id === selectedAnswer)
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
