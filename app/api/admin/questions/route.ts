import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/rbac';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { questionSchema } from '@/lib/validations/exam';
import { validateRequest } from '@/lib/validations/utils';

export async function GET(request: NextRequest) {
  try {
    // Check permission to manage questions
    const accessError = await requirePermission('canManageQuestions');
    if (accessError) {
      return accessError;
    }

    // Get all questions with related data
    const questions = await prisma.question.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            exams: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get unique categories
    const categories = await prisma.question.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Get unique creators
    const creators = await prisma.user.findMany({
      where: {
        createdQuestions: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(
      {
        questions: questions.map(question => ({
          id: question.id,
          text: question.text,
          category: question.category,
          difficulty: question.difficulty,
          explanation: question.explanation,
          createdAt: question.createdAt.toISOString(),
          createdBy: question.createdBy,
          _count: question._count,
        })),
        categories: categories.map(c => c.category),
        creators,
        total: questions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin questions error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check permission to manage questions
    const accessError = await requirePermission('canManageQuestions');
    if (accessError) {
      return accessError;
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(questionSchema, body);
    if (!validation.success) {
      return validation.error;
    }

    const { text, options, correctAnswer, explanation, category, difficulty } = validation.data;

    // Create question in database
    const question = await prisma.question.create({
      data: {
        text,
        options,
        correctAnswer,
        explanation: explanation || null,
        category,
        difficulty,
        createdById: session.userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Question created successfully',
        question: {
          id: question.id,
          text: question.text,
          category: question.category,
          difficulty: question.difficulty,
          explanation: question.explanation,
          createdAt: question.createdAt.toISOString(),
          createdBy: question.createdBy,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create question error:', error);
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
