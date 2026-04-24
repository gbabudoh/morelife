import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find patient
    const patient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, patient.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.patientSession.create({ data: { token, patientId: patient.id, expiresAt } });

    return NextResponse.json(
      { message: "Login successful", patientId: patient.id, token },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Login error:", message);
    return NextResponse.json({ 
      error: "Login failed", 
      details: message 
    }, { status: 500 });
  }
}
