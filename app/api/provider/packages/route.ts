import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Casting prisma to any is a temporary workaround to resolve "property does not exist" 
// TypeScript errors until the local environment's type generation fully synchronizes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaClient = prisma as any;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, description, price, duration, treatmentType, 
      isFree, validFrom, validUntil, termsAndConditions, 
      mhpId, providerId, isVideoConsultation, sessionCount, validityDays 
    } = body;

    if (!providerId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = await prismaClient.healthcarePackage.create({
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        duration,
        treatmentType,
        isFree,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        termsAndConditions,
        mhpId,
        providerId,
        isVideoConsultation: isVideoConsultation || false,
        sessionCount: parseInt(sessionCount) || 1,
        validityDays: parseInt(validityDays) || 180,
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, name, description, price, duration, treatmentType, 
      isFree, validFrom, validUntil, termsAndConditions, 
      mhpId, isVideoConsultation, sessionCount, validityDays, isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = await prismaClient.healthcarePackage.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        duration,
        treatmentType,
        isFree,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        termsAndConditions,
        mhpId,
        isVideoConsultation,
        sessionCount: sessionCount !== undefined ? parseInt(sessionCount) : undefined,
        validityDays: validityDays !== undefined ? parseInt(validityDays) : undefined,
        isActive,
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prismaClient.healthcarePackage.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
