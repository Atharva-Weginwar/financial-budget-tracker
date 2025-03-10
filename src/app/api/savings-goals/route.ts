import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for savings goal validation
const savingsGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().nonnegative("Current amount must be non-negative").default(0),
  targetDate: z.string().transform((str) => new Date(str)).optional(),
});

// GET /api/savings-goals
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get savings goals
    const savingsGoals = await prisma.savingsGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(savingsGoals);
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/savings-goals
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = savingsGoalSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { name, targetAmount, currentAmount, targetDate } = validationResult.data;

    // Create savings goal
    const savingsGoal = await prisma.savingsGoal.create({
      data: {
        name,
        targetAmount,
        currentAmount,
        targetDate,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(savingsGoal, { status: 201 });
  } catch (error) {
    console.error("Error creating savings goal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/savings-goals
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: "Savings goal ID is required" }, { status: 400 });
    }

    // Validate that the savings goal belongs to the user
    const existingGoal = await prisma.savingsGoal.findFirst({
      where: {
        id: body.id,
        userId: session.user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Savings goal not found" }, { status: 404 });
    }

    // Update the savings goal
    const updatedGoal = await prisma.savingsGoal.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        targetAmount: body.targetAmount !== undefined ? body.targetAmount : undefined,
        currentAmount: body.currentAmount !== undefined ? body.currentAmount : undefined,
        targetDate: body.targetDate !== undefined ? new Date(body.targetDate) : undefined,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Error updating savings goal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 