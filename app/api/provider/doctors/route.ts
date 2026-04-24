import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Casting prisma to any is a temporary workaround to resolve the "Property 'doctor' does not exist" 
// TypeScript error until the local environment's type generation fully synchronizes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaClient = prisma as any;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 });
    }

    const doctors = await prismaClient.doctor.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, specialty, email, phone, licenseNumber, providerId, password } = body;

    if (!providerId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if doctor already exists
    const existing = await prismaClient.doctor.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Doctor with this email already exists" }, { status: 400 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const doctor = await prismaClient.doctor.create({
      data: {
        name,
        specialty,
        email,
        phone,
        licenseNumber,
        providerId,
        password: hashedPassword,
      },
    });

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctorId, providerId, isOnline, password } = body;

    if (!doctorId || !providerId) {
      return NextResponse.json({ error: "Doctor ID and Provider ID are required" }, { status: 400 });
    }

    // Verify the doctor belongs to this provider
    const existing = await prismaClient.doctor.findUnique({
      where: { id: doctorId },
      select: { providerId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    if (existing.providerId !== providerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (isOnline !== undefined) updateData.isOnline = isOnline;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const doctor = await prismaClient.doctor.update({
      where: { id: doctorId },
      data: updateData,
    });

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const providerId = searchParams.get("providerId");

    if (!doctorId || !providerId) {
      return NextResponse.json({ error: "Doctor ID and Provider ID are required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await prismaClient.doctor.findUnique({
      where: { id: doctorId },
      select: { providerId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    if (existing.providerId !== providerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.doctor.delete({ where: { id: doctorId } });

    return NextResponse.json({ message: "Doctor removed successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
  }
}
