import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for budget validation
const budgetItemSchema = z.object({
  categoryId: z.string(),
  amount: z.number().positive("Amount must be positive"),
});

const budgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  budgetItems: z.array(budgetItemSchema),
});

// GET /api/budgets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const current = searchParams.get("current") === "true";

    // Build filter conditions
    const where: any = {
      userId: session.user.id,
    };

    if (current) {
      const now = new Date();
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    // Get budgets
    const budgets = await prisma.budget.findMany({
      where,
      include: {
        budgetItems: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/budgets
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = budgetSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { name, startDate, endDate, budgetItems } = validationResult.data;

    // Create budget with items
    const budget = await prisma.budget.create({
      data: {
        name,
        startDate,
        endDate,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        budgetItems: {
          create: budgetItems.map((item) => ({
            amount: item.amount,
            category: {
              connect: {
                id: item.categoryId,
              },
            },
          })),
        },
      },
      include: {
        budgetItems: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 