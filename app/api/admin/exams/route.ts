import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for creating an exam
const createExamSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  instructions: z.string().optional(),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute').max(480, 'Time limit cannot exceed 8 hours'),
  passingScore: z.number().min(0, 'Passing score cannot be negative').max(100, 'Passing score cannot exceed 100'),
  maxAttempts: z.number().min(1, 'Must allow at least 1 attempt').max(10, 'Cannot exceed 10 attempts').optional(),
  questionIds: z.array(z.string()).min(1, 'At least one question is required'),
  isActive: z.boolean().optional().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// GET - Fetch all exams (for admin/teacher)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin or teacher privileges
    if (session.role !== 'ADMIN' && session.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Access denied. Admin or teacher privileges required.' },
        { status: 403 }
      );
    }

    // For teachers, only show their own exams. For admins, show all exams.
    const whereClause = session.role === 'TEACHER' 
      ? { createdById: session.userId }
      : {};

    const exams = await prisma.exam.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        questions: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
                category: true,
                difficulty: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data for frontend consumption
    const transformedExams = exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      instructions: exam.instructions,
      timeLimit: exam.timeLimit,
      passingScore: exam.passingScore,
      isActive: exam.isActive,
      availableFrom: exam.availableFrom?.toISOString(),
      availableUntil: exam.availableUntil?.toISOString(),
      createdAt: exam.createdAt.toISOString(),
      updatedAt: exam.updatedAt.toISOString(),
      createdBy: exam.createdBy,
      questionCount: exam.questions.length,
      attemptCount: exam._count.attempts,
      questions: exam.questions.map(eq => ({
        id: eq.question.id,
        text: eq.question.text,
        category: eq.question.category,
        difficulty: eq.question.difficulty,
        order: eq.order,
      })),
    }));

    return NextResponse.json(
      {
        exams: transformedExams,
        total: transformedExams.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get exams error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new exam
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin or teacher privileges
    if (session.role !== 'ADMIN' && session.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Access denied. Admin or teacher privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate the request body
    const validationResult = createExamSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      instructions,
      timeLimit,
      passingScore,
      maxAttempts,
      questionIds,
      isActive,
      startDate,
      endDate,
    } = validationResult.data;

    // Verify that all question IDs exist
    const existingQuestions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingQuestions.length !== questionIds.length) {
      return NextResponse.json(
        { message: 'One or more question IDs are invalid' },
        { status: 400 }
      );
    }

    // Create the exam
    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        instructions,
        timeLimit,
        passingScore,
        isActive,
        availableFrom: startDate ? new Date(startDate) : null,
        availableUntil: endDate ? new Date(endDate) : null,
        createdById: session.userId,
        questions: {
          create: questionIds.map((questionId, index) => ({
            questionId,
            order: index + 1,
          })),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Exam created successfully',
        exam: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          questionCount: exam.questions.length,
          createdBy: exam.createdBy.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create exam error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
