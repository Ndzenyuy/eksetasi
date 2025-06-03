'use client';

import { useState, useEffect } from 'react';
import { questionSchema } from '@/lib/validations/exam';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionData {
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface CreateQuestionFormProps {
  initialData?: Partial<QuestionData>;
  onSubmit: (data: QuestionData) => void;
  loading: boolean;
  submitButtonText: string;
}

export default function CreateQuestionForm({
  initialData,
  onSubmit,
  loading,
  submitButtonText,
}: CreateQuestionFormProps) {
  const [formData, setFormData] = useState<QuestionData>({
    text: '',
    options: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false },
    ],
    correctAnswer: '',
    explanation: '',
    category: '',
    difficulty: 'MEDIUM',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Transform form data to match validation schema
    const transformedData = {
      ...formData,
      options: formData.options.map(option => ({
        ...option,
        isCorrect: option.id === formData.correctAnswer,
      })),
    };

    // Validate transformed data
    const validation = questionSchema.safeParse(transformedData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(transformedData);
  };

  const handleOptionChange = (optionId: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId ? { ...option, text } : option
      ),
    }));
  };

  const handleCorrectAnswerChange = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
      correctAnswer: optionId,
    }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      const newId = (formData.options.length + 1).toString();
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, { id: newId, text: '', isCorrect: false }],
      }));
    }
  };

  const removeOption = (optionId: string) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter(option => option.id !== optionId),
        correctAnswer: prev.correctAnswer === optionId ? '' : prev.correctAnswer,
      }));
    }
  };

  // Check if form is ready for submission
  const isFormReady = () => {
    const hasQuestionText = formData.text.trim().length > 0;
    const hasCategory = formData.category.trim().length > 0;
    const hasIndicatedCorrectAnswer = formData.correctAnswer.length > 0; // User has selected which answer is correct
    const hasValidOptions = formData.options.filter(opt => opt.text.trim().length > 0).length >= 2;

    // Check if the selected answer option has text content
    const selectedAnswerHasText = formData.correctAnswer ?
      (formData.options.find(opt => opt.id === formData.correctAnswer)?.text.trim().length || 0) > 0 : false;

    return hasQuestionText && hasCategory && hasIndicatedCorrectAnswer && hasValidOptions && selectedAnswerHasText;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Text */}
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Question Text *
        </label>
        <div className="mt-1">
          <textarea
            id="text"
            rows={4}
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.text ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Type your multiple choice question here. Be clear and specific."
          />
          {errors.text && (
            <p className="mt-2 text-sm text-red-600">{errors.text}</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Answer Options * <span className="text-sm font-normal text-gray-500">(Select the correct answer)</span>
          </label>
          <button
            type="button"
            onClick={addOption}
            disabled={formData.options.length >= 6}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            + Add Option
          </button>
        </div>
        <div className="space-y-3">
          {formData.options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={option.id}
                  checked={formData.correctAnswer === option.id}
                  onChange={() => handleCorrectAnswerChange(option.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Enter answer choice ${index + 1}`}
                />
              </div>
              {formData.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="flex-shrink-0 text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.options && (
          <p className="mt-2 text-sm text-red-600">{errors.options}</p>
        )}
        {!formData.correctAnswer && (
          <p className="mt-2 text-sm text-orange-600">Please indicate correct answer by clicking on the radio button</p>
        )}
      </div>

      {/* Category and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., JavaScript, Mathematics, Science, History"
            />
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty *
          </label>
          <div className="mt-1">
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
          Explanation (Optional)
        </label>
        <div className="mt-1">
          <textarea
            id="explanation"
            rows={3}
            value={formData.explanation}
            onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Explain why this is the correct answer. This helps students learn from their mistakes."
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          This explanation will be shown to students when they review their answers.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !isFormReady()}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading || !isFormReady()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}
