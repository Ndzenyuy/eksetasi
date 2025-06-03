import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const isActive = searchParams.get('active');

    // Build where clause for filtering
    const whereClause: any = {};

    if (category) {
      whereClause.questions = {
        some: {
          question: {
            category: {
              contains: category,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }

    // For students, only show active exams
    if (session.role === 'STUDENT') {
      whereClause.isActive = true;
    }

    // Fetch exams from database
    const exams = await prisma.exam.findMany({
      where: whereClause,
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform exams to include question count and categories
    const transformedExams = exams.map(exam => {
      const categories = [...new Set(exam.questions.map(q => q.question.category))];
      const difficulties = [...new Set(exam.questions.map(q => q.question.difficulty))];

      return {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration: exam.timeLimit,
        totalQuestions: exam.questions.length,
        difficulty: difficulties.length === 1 ? difficulties[0].toLowerCase() : 'mixed',
        category: categories.join(', '),
        isActive: exam.isActive,
        createdAt: exam.createdAt.toISOString(),
        updatedAt: exam.updatedAt.toISOString(),
        createdBy: exam.createdBy.name,
      };
    });

    return NextResponse.json(
      {
        exams: transformedExams,
        total: transformedExams.length,
        user: {
          id: session.userId,
          name: session.name,
          role: session.role,
        },
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

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
