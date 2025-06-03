import { z } from 'zod';

// Question option validation schema
export const questionOptionSchema = z.object({
  id: z.string().min(1, 'Option ID is required'),
  text: z.string().min(1, 'Option text is required').max(500, 'Option text must be less than 500 characters'),
  isCorrect: z.boolean().optional(),
});

// Question validation schema
export const questionSchema = z.object({
  text: z
    .string()
    .min(1, 'Question text is required')
    .max(1000, 'Question text must be less than 1000 characters'),
  options: z
    .array(questionOptionSchema)
    .min(2, 'At least 2 options are required')
    .max(6, 'Maximum 6 options allowed')
    .refine(
      (options) => options.filter(opt => opt.isCorrect).length === 1,
      'Exactly one option must be marked as correct'
    ),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z
    .string()
    .max(1000, 'Explanation must be less than 1000 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'], {
    errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
  }),
});

// Exam validation schema
export const examSchema = z.object({
  title: z
    .string()
    .min(1, 'Exam title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  timeLimit: z
    .number()
    .min(5, 'Time limit must be at least 5 minutes')
    .max(300, 'Time limit cannot exceed 300 minutes'),
  passingScore: z
    .number()
    .min(0, 'Passing score cannot be negative')
    .max(100, 'Passing score cannot exceed 100'),
  availableFrom: z.date().optional(),
  availableUntil: z.date().optional(),
  isActive: z.boolean().default(true),
  questionIds: z
    .array(z.string())
    .min(1, 'At least one question is required')
    .max(100, 'Maximum 100 questions allowed'),
}).refine(
  (data) => {
    if (data.availableFrom && data.availableUntil) {
      return data.availableFrom < data.availableUntil;
    }
    return true;
  },
  {
    message: 'Available from date must be before available until date',
    path: ['availableUntil'],
  }
);

// Exam answer validation schema
export const examAnswerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedOption: z.string().min(1, 'Selected option is required'),
  timeSpent: z.number().min(0).optional(),
});

// Exam submission validation schema
export const examSubmissionSchema = z.object({
  answers: z
    .array(examAnswerSchema)
    .min(1, 'At least one answer is required'),
  timeSpent: z
    .number()
    .min(0, 'Time spent cannot be negative')
    .max(500, 'Time spent cannot exceed 500 minutes'),
  submittedAt: z.string().datetime().optional(),
});

// Exam query parameters validation schema
export const examQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  active: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// Types
export type QuestionOption = z.infer<typeof questionOptionSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type ExamAnswer = z.infer<typeof examAnswerSchema>;
export type ExamSubmission = z.infer<typeof examSubmissionSchema>;
export type ExamQuery = z.infer<typeof examQuerySchema>;
