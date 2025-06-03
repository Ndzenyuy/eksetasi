import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess } from '@/lib/auth/rbac';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const accessError = await requireAdminAccess();
    if (accessError) {
      return accessError;
    }

    // Get recent activities (last 50 items)
    const limit = 50;

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Get recent questions
    const recentQuestions = await prisma.question.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent exams
    const recentExams = await prisma.exam.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent exam attempts
    const recentAttempts = await prisma.attempt.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        exam: {
          select: {
            title: true,
          },
        },
        result: {
          select: {
            percentage: true,
          },
        },
      },
    });

    // Combine and format activities
    const activities = [
      // User registrations
      ...recentUsers.map(user => ({
        id: `user_${user.id}`,
        type: 'user_registered' as const,
        description: 'New user registered',
        user: {
          name: user.name,
          email: user.email,
        },
        timestamp: user.createdAt.toISOString(),
      })),

      // Question creations
      ...recentQuestions.map(question => ({
        id: `question_${question.id}`,
        type: 'question_created' as const,
        description: 'New question created',
        user: {
          name: question.createdBy.name,
          email: question.createdBy.email,
        },
        timestamp: question.createdAt.toISOString(),
        metadata: {
          questionText: question.text.substring(0, 100) + (question.text.length > 100 ? '...' : ''),
        },
      })),

      // Exam creations
      ...recentExams.map(exam => ({
        id: `exam_${exam.id}`,
        type: 'exam_created' as const,
        description: 'New exam created',
        user: {
          name: exam.createdBy.name,
          email: exam.createdBy.email,
        },
        timestamp: exam.createdAt.toISOString(),
        metadata: {
          examTitle: exam.title,
        },
      })),

      // Exam attempts
      ...recentAttempts.map(attempt => ({
        id: `attempt_${attempt.id}`,
        type: 'exam_taken' as const,
        description: 'Exam completed',
        user: {
          name: attempt.student.name,
          email: attempt.student.email,
        },
        timestamp: attempt.createdAt.toISOString(),
        metadata: {
          examTitle: attempt.exam.title,
          score: attempt.result ? Math.round(attempt.result.percentage) : undefined,
        },
      })),
    ];

    // Sort by timestamp (most recent first) and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json(
      {
        activities: sortedActivities,
        total: sortedActivities.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin activity error:', error);
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
