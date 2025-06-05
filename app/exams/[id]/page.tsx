'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ExamInterface from '@/app/components/exam/ExamInterface';
import { QuestionData } from '@/app/components/exam/Question';

// Mock data - In a real app, this would come from an API
/*
const _mockExams = {
  "1": {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    duration: 30, // minutes
    questions: [
      {
        id: "q1",
        text: "What is the correct way to declare a variable in JavaScript?",
        options: [
          { id: "a", text: "var myVariable;" },
          { id: "b", text: "variable myVariable;" },
          { id: "c", text: "v myVariable;" },
          { id: "d", text: "declare myVariable;" },
        ],
        explanation:
          "In JavaScript, variables can be declared using var, let, or const keywords.",
        difficulty: "easy" as const,
        category: "Variables",
      },
      {
        id: "q2",
        text: "Which of the following is NOT a JavaScript data type?",
        options: [
          { id: "a", text: "String" },
          { id: "b", text: "Boolean" },
          { id: "c", text: "Float" },
          { id: "d", text: "Number" },
        ],
        explanation:
          "JavaScript has Number type for all numeric values, there is no separate Float type.",
        difficulty: "medium" as const,
        category: "Data Types",
      },
      {
        id: "q3",
        text: 'What does the "===" operator do in JavaScript?',
        options: [
          { id: "a", text: "Assigns a value" },
          { id: "b", text: "Compares values only" },
          { id: "c", text: "Compares values and types" },
          { id: "d", text: "Declares a constant" },
        ],
        explanation:
          "The === operator performs strict equality comparison, checking both value and type.",
        difficulty: "medium" as const,
        category: "Operators",
      },
      {
        id: "q4",
        text: "Which method is used to add an element to the end of an array?",
        options: [
          { id: "a", text: "push()" },
          { id: "b", text: "add()" },
          { id: "c", text: "append()" },
          { id: "d", text: "insert()" },
        ],
        explanation:
          "The push() method adds one or more elements to the end of an array.",
        difficulty: "easy" as const,
        category: "Arrays",
      },
      {
        id: "q5",
        text: "What is a closure in JavaScript?",
        options: [
          { id: "a", text: "A way to close the browser" },
          {
            id: "b",
            text: "A function that has access to outer scope variables",
          },
          { id: "c", text: "A method to end a loop" },
          { id: "d", text: "A type of error" },
        ],
        explanation:
          "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
        difficulty: "hard" as const,
        category: "Functions",
      },
    ] as QuestionData[],
  },
  "2": {
    id: "2",
    title: "Python Basics",
    description: "Test your Python programming knowledge",
    duration: 25,
    questions: [
      {
        id: "q1",
        text: "Which of the following is the correct way to create a list in Python?",
        options: [
          { id: "a", text: "list = []" },
          { id: "b", text: "list = {}" },
          { id: "c", text: "list = ()" },
          { id: "d", text: 'list = ""' },
        ],
        explanation: "Square brackets [] are used to create lists in Python.",
        difficulty: "easy" as const,
        category: "Data Structures",
      },
      {
        id: "q2",
        text: "What is the output of print(type(5.0))?",
        options: [
          { id: "a", text: "<class 'int'>" },
          { id: "b", text: "<class 'float'>" },
          { id: "c", text: "<class 'number'>" },
          { id: "d", text: "<class 'decimal'>" },
        ],
        explanation: "Numbers with decimal points are float type in Python.",
        difficulty: "easy" as const,
        category: "Data Types",
      },
    ] as QuestionData[],
  },
};
*/

interface ExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExamPage({ params }: ExamPageProps) {
  const router = useRouter();
  const [exam, setExam] = useState<{
    id: string;
    title: string;
    description: string;
    duration: number;
    questions: QuestionData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap the params Promise
  const { id } = use(params);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exams/${id}`);
        const data = await response.json();

        if (response.ok) {
          setExam({
            id: data.id,
            title: data.title,
            description: data.description,
            duration: data.duration,
            questions: data.questions,
          });
        } else {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          // Exam not found or other error
          console.error("Error loading exam:", data.message);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error loading exam:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id, router]);

  const handleSubmit = async (
    answers: Array<{
      questionId: string;
      selectedOption: string;
      timeSpent?: number;
    }>
  ) => {
    try {
      console.log("Submitting answers:", answers);

      const response = await fetch(`/api/exams/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answers,
          timeSpent: 25, // You could track actual time spent
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to results page with actual score
        router.push(`/exams/${id}/results?score=${data.result.score}`);
      } else {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        alert(data.message || "Error submitting exam. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error submitting exam. Please try again.");
    }
  };

  const handleSave = async (
    answers: Array<{
      questionId: string;
      selectedOption: string;
      timeSpent?: number;
    }>
  ) => {
    try {
      // Auto-save functionality
      console.log("Auto-saving answers:", answers);
      // In a real app, you'd save to an API
    } catch (error) {
      console.error("Error saving exam:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Exam Not Found</h1>
          <p className="mt-2 text-gray-600">
            The exam you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamInterface
      examTitle={exam.title}
      questions={exam.questions}
      duration={exam.duration}
      onSubmit={handleSubmit}
      onSave={handleSave}
    />
  );
}
