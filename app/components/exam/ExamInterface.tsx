'use client';

import React, { useState, useCallback } from 'react';
import Question, { QuestionData } from './Question';
import Timer from './Timer';
import ExamProgress from './ExamProgress';
import Button from '../ui/Button';
import { ConfirmModal } from '../ui/Modal';

interface ExamAnswer {
  questionId: string;
  selectedOption: string;
  timeSpent?: number;
}

interface ExamInterfaceProps {
  examTitle: string;
  questions: QuestionData[];
  duration: number; // in minutes
  onSubmit: (answers: ExamAnswer[]) => void;
  onSave?: (answers: ExamAnswer[]) => void; // Auto-save functionality
  isReviewMode?: boolean;
  existingAnswers?: ExamAnswer[];
}

export default function ExamInterface({
  examTitle,
  questions,
  duration,
  onSubmit,
  onSave,
  isReviewMode = false,
  existingAnswers = [],
}: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>(existingAnswers);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestionNumbers = answers.map(answer => 
    questions.findIndex(q => q.id === answer.questionId) + 1
  ).filter(num => num > 0);

  const handleAnswerSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      const newAnswer: ExamAnswer = {
        questionId,
        selectedOption: optionId,
        timeSpent: 0, // You could track this if needed
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });

    // Auto-save if function provided
    if (onSave) {
      setTimeout(() => onSave(answers), 100);
    }
  }, [answers, onSave]);

  const handleQuestionSelect = useCallback((questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(answers);
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  }, [onSubmit, answers]);

  const handleTimeUp = useCallback(() => {
    // Auto-submit when time is up
    handleSubmit();
  }, [handleSubmit]);

  const getSelectedAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.selectedOption;
  };

  const unansweredCount = questions.length - answers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {examTitle}
            </h1>
            {!isReviewMode && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitModal(true)}
                  disabled={answers.length === 0}
                >
                  Submit Exam
                </Button>
              </div>
            )}
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
              totalQuestions={questions.length}
              selectedAnswer={getSelectedAnswer(currentQuestion.id)}
              onAnswerSelect={handleAnswerSelect}
              showCorrectAnswer={isReviewMode}
              isReviewMode={isReviewMode}
            />

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
                {!isReviewMode && (
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitModal(true)}
                    disabled={answers.length === 0}
                  >
                    Submit Exam
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next Question →
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timer (only in exam mode) */}
            {!isReviewMode && (
              <Timer
                duration={duration}
                onTimeUp={handleTimeUp}
                isActive={true}
              />
            )}

            {/* Progress */}
            <ExamProgress
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              answeredQuestions={answeredQuestionNumbers}
              onQuestionSelect={handleQuestionSelect}
              isReviewMode={isReviewMode}
            />

            {/* Summary card */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {isReviewMode ? 'Review Summary' : 'Exam Summary'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">{answers.length}</span>
                </div>
                {!isReviewMode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-orange-600">{unansweredCount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">
                    {Math.round((answers.length / questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmit}
        title="Submit Exam"
        message={
          unansweredCount > 0
            ? `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
            : 'Are you sure you want to submit your exam? This action cannot be undone.'
        }
        confirmText={isSubmitting ? 'Submitting...' : 'Submit Exam'}
        variant="primary"
      />
    </div>
  );
}
