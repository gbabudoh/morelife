import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 });
    }

    // Try to fetch with new fields, but handle if they don't exist
    let provider;
    let paymentSettings = null;
    
    try {
      provider = await prisma.healthcareProvider.findUnique({
        where: { id: providerId },
        include: {
          packages: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // Try to fetch payment settings if the table exists
      try {
        paymentSettings = await prisma.providerPaymentSettings.findUnique({
          where: { providerId },
        });
      } catch (e) {
        // Payment settings table doesn't exist yet, ignore
        console.log("Payment settings not available yet");
      }
    } catch (error: any) {
      console.error("Database error:", error);
      return NextResponse.json({ 
        error: "Database error",
        details: error.message 
      }, { status: 500 });
    }

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // Check if account is revoked (only if field exists)
    if (provider.hasOwnProperty('isRevoked') && (provider as any).isRevoked) {
      return NextResponse.json(
        { 
          error: "Account has been revoked",
          reason: (provider as any).revokedReason,
          revokedAt: (provider as any).revokedAt,
        },
        { status: 403 }
      );
    }

    // Remove sensitive data
    const { password, ...safeProvider } = provider;

    // Add default values for new fields if they don't exist
    const providerData = {
      ...safeProvider,
      mhpNumber: (safeProvider as any).mhpNumber || "MHP0000000000", // Temporary default
      isActive: (safeProvider as any).isActive !== undefined ? (safeProvider as any).isActive : true,
      isRevoked: (safeProvider as any).isRevoked !== undefined ? (safeProvider as any).isRevoked : false,
    };

    return NextResponse.json({
      provider: providerData,
      packages: provider.packages,
      paymentSettings: paymentSettings,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
}
