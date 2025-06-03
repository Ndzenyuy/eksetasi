import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess, getUserPermissions } from '@/lib/auth/rbac';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const accessError = await requireAdminAccess();
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

    // Get user permissions
    const permissions = await getUserPermissions();
    if (!permissions) {
      return NextResponse.json(
        { message: 'Unable to determine permissions' },
        { status: 500 }
      );
    }

    // Get current user info
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get statistics
    const [
      totalUsers,
      totalQuestions,
      totalExams,
      totalAttempts,
      recentUsers,
      recentQuestions,
      recentExams,
      recentAttempts,
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.question.count(),
      prisma.exam.count(),
      prisma.attempt.count(),
      
      // Recent counts (last 7 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      }),
      prisma.question.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      }),
      prisma.exam.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      }),
      prisma.attempt.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      }),
    ]);

    const stats = {
      totalUsers,
      totalQuestions,
      totalExams,
      totalAttempts,
      recentUsers,
      recentQuestions,
      recentExams,
      recentAttempts,
    };

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        stats,
        permissions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin dashboard error:', error);
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
