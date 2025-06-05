import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Find user data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get user's exam results
    const userResults = await prisma.result.findMany({
      where: { studentId: session.userId },
      include: {
        exam: {
          select: {
            title: true,
          },
        },
        attempt: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const totalExamsTaken = userResults.length;
    const totalExamsPassed = userResults.filter(
      (result) => result.passed
    ).length;
    const averageScore =
      totalExamsTaken > 0
        ? Math.round(
            userResults.reduce((sum, result) => sum + result.percentage, 0) /
              totalExamsTaken
          )
        : 0;

    // Calculate total time spent (in minutes)
    const totalTimeSpent = userResults.reduce((sum, result) => {
      if (result.attempt?.startTime && result.attempt?.endTime) {
        const timeSpentMs =
          new Date(result.attempt.endTime).getTime() -
          new Date(result.attempt.startTime).getTime();
        return sum + Math.round(timeSpentMs / (1000 * 60)); // Convert to minutes
      }
      return sum;
    }, 0);

    // Transform results for response
    const transformedResults = userResults.map((result) => {
      // Calculate time spent for this attempt (in minutes)
      let timeSpent = 0;
      if (result.attempt?.startTime && result.attempt?.endTime) {
        const timeSpentMs =
          new Date(result.attempt.endTime).getTime() -
          new Date(result.attempt.startTime).getTime();
        timeSpent = Math.round(timeSpentMs / (1000 * 60)); // Convert to minutes
      }

      return {
        id: result.id,
        examId: result.examId,
        examTitle: result.exam.title,
        score: Math.round(result.percentage),
        grade: getGrade(result.percentage),
        passed: result.passed,
        totalQuestions: result.score, // This is the raw score (number of correct answers)
        correctAnswers: result.score,
        timeSpent,
        submittedAt:
          result.attempt?.endTime?.toISOString() ||
          result.createdAt.toISOString(),
      };
    });

    // Get recent exam results (last 5)
    const recentResults = transformedResults.slice(0, 5);

    // Helper function to calculate grade
    function getGrade(score: number): string {
      if (score >= 90) return "A";
      if (score >= 80) return "B";
      if (score >= 70) return "C";
      if (score >= 60) return "D";
      return "F";
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        statistics: {
          totalExamsTaken,
          totalExamsPassed,
          passRate:
            totalExamsTaken > 0
              ? Math.round((totalExamsPassed / totalExamsTaken) * 100)
              : 0,
          averageScore,
          totalTimeSpent, // in minutes
        },
        recentResults,
        allResults: transformedResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    // Find and update user in database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
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
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
