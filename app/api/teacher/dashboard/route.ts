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

    // Check if user is a teacher or admin
    if (session.role !== "TEACHER" && session.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied. Teacher privileges required." },
        { status: 403 }
      );
    }

    // Get teacher's exams
    const teacherExams = await prisma.exam.findMany({
      where: {
        createdById: session.userId,
      },
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
        questions: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all attempts for teacher's exams
    const examIds = teacherExams.map((exam) => exam.id);
    const allAttempts = await prisma.attempt.findMany({
      where: {
        examId: {
          in: examIds,
        },
        status: "COMPLETED",
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
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
    const totalExams = teacherExams.length;
    const totalAttempts = allAttempts.length;

    // Get unique students who have taken teacher's exams
    const uniqueStudentIds = new Set(
      allAttempts.map((attempt) => attempt.studentId)
    );
    const totalStudents = uniqueStudentIds.size;

    // Calculate average score
    let averageScore = 0;
    if (totalAttempts > 0) {
      const totalScore = allAttempts.reduce((sum, attempt) => {
        return sum + (attempt.result?.percentage || 0);
      }, 0);
      averageScore = Math.round(totalScore / totalAttempts);
    }

    // Transform recent exams
    const recentExams = teacherExams.slice(0, 5).map((exam) => ({
      id: exam.id,
      title: exam.title,
      totalQuestions: exam.questions.length,
      isActive: exam.isActive,
      createdAt: exam.createdAt.toISOString(),
      _count: {
        attempts: exam._count.attempts,
      },
    }));

    // Transform recent attempts
    const recentAttempts = allAttempts.slice(0, 10).map((attempt) => ({
      id: attempt.id,
      studentName: attempt.student.name,
      examTitle: attempt.exam.title,
      score: attempt.result?.percentage || 0,
      passed: attempt.result?.passed || false,
      completedAt:
        attempt.endTime?.toISOString() || attempt.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        statistics: {
          totalExams,
          totalStudents,
          totalAttempts,
          averageScore,
        },
        recentExams,
        recentAttempts,
        user: {
          id: session.userId,
          name: session.name,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get teacher dashboard data error:", error);
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
