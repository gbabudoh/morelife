import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Confirm the provider exists and is active
    const provider = await prismaClient.healthcareProvider.findUnique({
      where: { id: providerId },
      select: { id: true, isRevoked: true },
    });
    if (!provider || provider.isRevoked) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
      id, providerId,
      name, description, price, duration, treatmentType,
      isFree, validFrom, validUntil, termsAndConditions,
      mhpId, isVideoConsultation, sessionCount, validityDays, isActive
    } = body;

    if (!id || !providerId) {
      return NextResponse.json({ error: "Package ID and Provider ID are required" }, { status: 400 });
    }

    // Verify ownership before updating
    const existing = await prismaClient.healthcarePackage.findUnique({
      where: { id },
      select: { providerId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    if (existing.providerId !== providerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    const providerId = searchParams.get("providerId");

    if (!id || !providerId) {
      return NextResponse.json({ error: "Package ID and Provider ID are required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await prismaClient.healthcarePackage.findUnique({
      where: { id },
      select: { providerId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    if (existing.providerId !== providerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.healthcarePackage.delete({ where: { id } });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
