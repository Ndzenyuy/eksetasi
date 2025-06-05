import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

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

    // Note: We allow all roles to access this endpoint for role-based redirects
    // The frontend will handle redirecting teachers and admins to their dashboards

    // Get available exams (active exams for students)
    const availableExams = await prisma.exam.findMany({
      where: {
        isActive: true,
      },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: "asc",
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
        createdAt: "desc",
      },
    });

    // Get user's completed exams (attempts with results)
    const completedAttempts = await prisma.attempt.findMany({
      where: {
        studentId: session.userId,
        status: "COMPLETED",
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
          },
        },
        result: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const completedExamsCount = completedAttempts.length;

    // Calculate average score from results
    let averageScore = 0;
    if (completedAttempts.length > 0) {
      const totalScore = completedAttempts.reduce((sum, attempt) => {
        return sum + (attempt.result?.percentage || 0);
      }, 0);
      averageScore = Math.round(totalScore / completedAttempts.length);
    }

    // Transform available exams
    const transformedExams = availableExams.map((exam) => {
      const categories = [
        ...new Set(exam.questions.map((q) => q.question.category)),
      ];
      const difficulties = [
        ...new Set(exam.questions.map((q) => q.question.difficulty)),
      ];

      return {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration: exam.timeLimit,
        totalQuestions: exam.questions.length,
        difficulty:
          difficulties.length === 1 ? difficulties[0].toLowerCase() : "mixed",
        category: categories.join(", "),
        isActive: exam.isActive,
        createdAt: exam.createdAt.toISOString(),
        updatedAt: exam.updatedAt.toISOString(),
        createdBy: exam.createdBy.name,
      };
    });

    // Get recent exam results for additional context
    const recentResults = completedAttempts.slice(0, 5).map((attempt) => ({
      id: attempt.id,
      examTitle: attempt.exam.title,
      score: attempt.result?.percentage || 0,
      passed: attempt.result?.passed || false,
      completedAt:
        attempt.endTime?.toISOString() || attempt.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        statistics: {
          availableExams: transformedExams.length,
          completedExams: completedExamsCount,
          averageScore: averageScore,
        },
        exams: transformedExams,
        recentResults: recentResults,
        user: {
          id: session.userId,
          name: session.name,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get dashboard data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
