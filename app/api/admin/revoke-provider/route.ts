import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, reason, adminId } = body;

    if (!providerId || !reason || !adminId) {
      return NextResponse.json(
        { error: "Provider ID, reason, and admin ID are required" },
        { status: 400 }
      );
    }

    // Update provider to revoked status
    const provider = await prisma.healthcareProvider.update({
      where: { id: providerId },
      data: {
        isRevoked: true,
        isActive: false,
        revokedAt: new Date(),
        revokedBy: adminId,
        revokedReason: reason,
      },
    });

    // Deactivate all provider packages
    await prisma.healthcarePackage.updateMany({
      where: { providerId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Provider account has been revoked",
      provider,
    });
  } catch (error: any) {
    console.error("Error revoking provider:", error);
    return NextResponse.json(
      { error: error.message || "Failed to revoke provider account" },
      { status: 500 }
    );
  }
}

// Restore provider account
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, adminId } = body;

    if (!providerId || !adminId) {
      return NextResponse.json(
        { error: "Provider ID and admin ID are required" },
        { status: 400 }
      );
    }

    // Restore provider account
    const provider = await prisma.healthcareProvider.update({
      where: { id: providerId },
      data: {
        isRevoked: false,
        isActive: true,
        revokedAt: null,
        revokedBy: null,
        revokedReason: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Provider account has been restored",
      provider,
    });
  } catch (error: any) {
    console.error("Error restoring provider:", error);
    return NextResponse.json(
      { error: error.message || "Failed to restore provider account" },
      { status: 500 }
    );
  }
}
