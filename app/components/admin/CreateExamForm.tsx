'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  explanation?: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    exams: number;
  };
}

interface CreateExamFormProps {
  onSubmit: (examData: {
    title: string;
    description?: string;
    instructions?: string;
    timeLimit: number;
    passingScore: number;
    questionIds: string[];
    isActive: boolean;
    startDate?: string;
    endDate?: string;
  }) => void;
  loading: boolean;
}

export default function CreateExamForm({ onSubmit, loading }: CreateExamFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    timeLimit: 60,
    passingScore: 70,
    maxAttempts: 3,
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  // Fetch available questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/admin/questions');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure we have a valid response structure
        if (data && typeof data === 'object' && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          console.error('Invalid response structure:', data);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value,
    }));
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question for the exam.');
      return;
    }

    const examData = {
      ...formData,
      questionIds: selectedQuestions,
    };

    onSubmit(examData);
  };

  // Filter questions based on search and filters
  const filteredQuestions = Array.isArray(questions) ? questions.filter(question => {
    if (!question || typeof question !== 'object') return false;

    const matchesSearch = question.text?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesCategory = !categoryFilter || question.category === categoryFilter;
    const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  }) : [];

  const categories = Array.isArray(questions) ? [...new Set(questions.map(q => q?.category).filter(Boolean))] : [];
  const difficulties = Array.isArray(questions) ? [...new Set(questions.map(q => q?.difficulty).filter(Boolean))] : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Exam Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter exam title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what this exam covers"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
              Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={2}
              value={formData.instructions}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Special instructions for students taking this exam"
            />
          </div>
        </div>
      </div>

      {/* Exam Settings */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
              Time Limit (minutes) *
            </label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              required
              min="1"
              max="480"
              value={formData.timeLimit}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700">
              Passing Score (%) *
            </label>
            <input
              type="number"
              id="passingScore"
              name="passingScore"
              required
              min="0"
              max="100"
              value={formData.passingScore}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">
              Max Attempts
            </label>
            <input
              type="number"
              id="maxAttempts"
              name="maxAttempts"
              min="1"
              max="10"
              value={formData.maxAttempts}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Make exam active immediately</span>
          </label>
        </div>
      </div>

      {/* Question Selection */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Questions ({selectedQuestions.length} selected)
        </h3>

        {/* Search and Filters */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        {/* Questions List */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
          {questionsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading questions...</div>
          ) : !Array.isArray(questions) || questions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {!Array.isArray(questions) ? 'Error loading questions' : 'No questions found'}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No questions match your filters</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="p-4 hover:bg-gray-50">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleQuestionToggle(question.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{question.text}</p>
                      <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                        <span>Category: {question.category}</span>
                        <span>Difficulty: {question.difficulty}</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || selectedQuestions.length === 0}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Exam...' : 'Create Exam'}
        </button>
      </div>
    </form>
  );
}
