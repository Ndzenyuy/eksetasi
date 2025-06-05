import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check permission to manage users (admin only)
    const accessError = await requirePermission("canManageUsers");
    if (accessError) {
      return accessError;
    }

    // Get all users with related data
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            createdQuestions: true,
            createdExams: true,
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        users: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          _count: user._count,
        })),
        total: users.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin users error:", error);
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
