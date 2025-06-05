import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: examId } = await params;

    // Fetch exam from database
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
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

    if (!exam) {
      return NextResponse.json(
        { message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeAnswers = searchParams.get('includeAnswers') === 'true';

    // Transform questions and remove correct answers for students taking the exam (not in review mode)
    const questionsToReturn = exam.questions.map(examQuestion => {
      const question = examQuestion.question;
      const options = question.options as Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;

      if (!includeAnswers) {
        return {
          id: question.id,
          text: question.text,
          options: options.map(option => ({
            id: option.id,
            text: option.text,
            // Don't include isCorrect for active exams
          })),
          // Don't include explanation for active exams
          explanation: undefined,
          difficulty: question.difficulty.toLowerCase(),
          category: question.category,
        };
      }

      return {
        id: question.id,
        text: question.text,
        options: options,
        explanation: question.explanation,
        difficulty: question.difficulty.toLowerCase(),
        category: question.category,
      };
    });

    return NextResponse.json(
      {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration: exam.timeLimit,
        totalQuestions: exam.questions.length,
        questions: questionsToReturn,
        user: {
          id: session.userId,
          name: session.name,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get exam error:', error);
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
