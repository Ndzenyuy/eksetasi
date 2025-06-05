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

    // Fetch exam with questions from database
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

    // Find user's most recent completed attempt for this exam
    const userAttempt = await prisma.attempt.findFirst({
      where: {
        studentId: session.userId,
        examId: examId,
        status: 'COMPLETED',
      },
      include: {
        result: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!userAttempt || !userAttempt.result) {
      return NextResponse.json(
        { message: 'No exam submission found. You must complete the exam before reviewing it.' },
        { status: 404 }
      );
    }

    // Get user's answers from the attempt
    const userAnswers = userAttempt.answers as Record<string, string>;

    // Prepare questions with user answers and correct answers
    const questionsWithAnswers = exam.questions.map(examQuestion => {
      const question = examQuestion.question;
      const options = question.options as Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;
      const correctOption = options.find(opt => opt.isCorrect);
      const userAnswer = userAnswers[question.id];
      
      return {
        id: question.id,
        text: question.text,
        options: options.map(option => ({
          ...option,
          isSelected: userAnswer === option.id,
        })),
        explanation: question.explanation,
        difficulty: question.difficulty.toLowerCase(),
        category: question.category,
        userAnswer: userAnswer || null,
        correctAnswer: correctOption?.id || null,
        isCorrect: userAnswer === correctOption?.id,
      };
    });

    // Calculate review statistics
    const totalQuestions = questionsWithAnswers.length;
    const correctAnswers = questionsWithAnswers.filter(q => q.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;

    // Calculate grade
    const getGrade = (score: number): string => {
      if (score >= 90) return 'A';
      if (score >= 80) return 'B';
      if (score >= 70) return 'C';
      if (score >= 60) return 'D';
      return 'F';
    };

    return NextResponse.json(
      {
        exam: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          duration: exam.timeLimit,
          totalQuestions: totalQuestions,
          questions: questionsWithAnswers,
        },
        result: {
          id: userAttempt.result.id,
          score: Math.round(userAttempt.result.percentage),
          grade: getGrade(userAttempt.result.percentage),
          passed: userAttempt.result.passed,
          submittedAt: userAttempt.endTime?.toISOString() || userAttempt.createdAt.toISOString(),
          correctAnswers,
          incorrectAnswers,
          totalQuestions,
        },
        user: {
          id: session.userId,
          name: session.name,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get exam review error:', error);
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
