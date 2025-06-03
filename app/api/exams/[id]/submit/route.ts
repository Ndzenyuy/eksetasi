import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { examSubmissionSchema } from '@/lib/validations/exam';
import { validateRequest } from '@/lib/validations/utils';

interface ExamAnswer {
  questionId: string;
  selectedOption: string;
  timeSpent?: number;
}

interface ExamSubmission {
  answers: ExamAnswer[];
  timeSpent: number; // total time in minutes
  submittedAt: string;
}

export async function POST(
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

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(examSubmissionSchema, body);
    if (!validation.success) {
      return validation.error;
    }

    const { answers, timeSpent, submittedAt } = validation.data;

    // Create attempt record
    const attempt = await prisma.attempt.create({
      data: {
        studentId: session.userId,
        examId: examId,
        startTime: new Date(Date.now() - (timeSpent * 60 * 1000)), // Calculate start time
        endTime: new Date(submittedAt || new Date()),
        answers: answers.reduce((acc, answer) => {
          acc[answer.questionId] = answer.selectedOption;
          return acc;
        }, {} as Record<string, string>),
        status: 'COMPLETED',
      },
    });

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    const detailedResults = exam.questions.map(examQuestion => {
      const question = examQuestion.question;
      const options = question.options as any[];
      const correctOption = options.find(opt => opt.isCorrect);
      const userAnswer = answers.find(a => a.questionId === question.id);
      const isCorrect = userAnswer?.selectedOption === correctOption?.id;
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += 1; // Each question worth 1 point
      }

      return {
        questionId: question.id,
        userAnswer: userAnswer?.selectedOption || null,
        correctAnswer: correctOption?.id || null,
        isCorrect,
        points: isCorrect ? 1 : 0,
        maxPoints: 1,
      };
    });

    const totalPossiblePoints = exam.questions.length;
    const scorePercentage = Math.round((totalPoints / totalPossiblePoints) * 100);
    const passed = scorePercentage >= exam.passingScore;

    // Calculate grade
    const getGrade = (score: number): string => {
      if (score >= 90) return 'A';
      if (score >= 80) return 'B';
      if (score >= 70) return 'C';
      if (score >= 60) return 'D';
      return 'F';
    };

    // Update attempt with score
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        score: totalPoints,
      },
    });

    // Create result record
    const result = await prisma.result.create({
      data: {
        attemptId: attempt.id,
        studentId: session.userId,
        examId: examId,
        score: totalPoints,
        percentage: scorePercentage,
        passed: passed,
        feedback: passed 
          ? `Congratulations! You passed with ${scorePercentage}%.`
          : `You scored ${scorePercentage}%. Keep studying and try again!`,
      },
    });

    // Return result summary
    return NextResponse.json(
      {
        message: 'Exam submitted successfully',
        result: {
          id: result.id,
          examId: examId,
          examTitle: exam.title,
          score: scorePercentage,
          grade: getGrade(scorePercentage),
          passed: passed,
          totalQuestions: exam.questions.length,
          correctAnswers: correctAnswers,
          timeSpent: timeSpent,
          submittedAt: attempt.endTime?.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submit exam error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
