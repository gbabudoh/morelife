import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, dateOfBirth, location, mobileNumber, subscriptionType, mhNumber, memberCount } = body;

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });

    if (existingPatient) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient
    const patientData = {
      name,
      email,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      location,
      mobileNumber,
      subscriptionType,
      mhNumber,
      memberCount: memberCount ? Number(memberCount) : 1,
    };

    const patient = await prisma.patient.create({
      data: patientData,
    });

    return NextResponse.json(
      { message: "Patient registered successfully", patientId: patient.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
