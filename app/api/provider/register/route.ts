import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateMHPNumber } from "@/lib/mhp-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      providerName,
      contactPerson,
      email,
      password,
      category,
      providerType,
      location,
      contactTelephone,
    } = body;

    // Check if provider already exists
    const existingProvider = await prisma.healthcareProvider.findUnique({
      where: { email },
    });

    if (existingProvider) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique MHP ID
    let mhpNumber = generateMHPNumber();
    let mhpExists = await prisma.healthcareProvider.findUnique({
      where: { mhpNumber },
    });

    // Ensure MHP ID is unique
    while (mhpExists) {
      mhpNumber = generateMHPNumber();
      mhpExists = await prisma.healthcareProvider.findUnique({
        where: { mhpNumber },
      });
    }

    // Create provider with all validation fields
    const provider = await prisma.healthcareProvider.create({
      data: {
        providerName,
        contactPerson,
        email,
        password: hashedPassword,
        category,
        providerType,
        location,
        contactTelephone,
        mhpNumber,
      },
    });

    return NextResponse.json(
      {
        message: "Provider registered successfully.",
        providerId: provider.id,
        mhpNumber: provider.mhpNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
