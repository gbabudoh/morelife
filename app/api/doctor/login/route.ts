import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

// Casting prisma to any is a temporary workaround to resolve the "Property 'doctor' does not exist" 
// TypeScript error until the local environment's type generation fully synchronizes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaClient = prisma as any;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const doctor = await prismaClient.doctor.findUnique({
      where: { email },
      include: { provider: true },
    });

    if (!doctor || !doctor.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, doctor.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      userId: doctor.id,
      role: 'provider', // Using 'provider' role for now to reuse dashboard middleware, or can add 'doctor'
    });

    const response = NextResponse.json({
      message: "Login successful",
      token,
      doctorId: doctor.id,
      providerId: doctor.providerId,
      doctorName: doctor.name,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Doctor login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
