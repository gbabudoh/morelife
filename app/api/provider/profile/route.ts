import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define local interfaces to handle data safely without 'any'
interface HealthcarePackage {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Doctor {
  id: string;
  name: string;
  providerId: string;
  [key: string]: unknown;
}

interface ProviderProfile {
  id: string;
  password?: string;
  packages: HealthcarePackage[];
  [key: string]: unknown;
}

interface PrismaWithDoctor {
  doctor: {
    findMany: (args: Record<string, unknown>) => Promise<Doctor[]>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 });
    }

    // 1. Fetch provider with only known relations (packages)
    const provider = await prisma.healthcareProvider.findUnique({
      where: { id: providerId },
      include: {
        packages: {
          orderBy: { createdAt: "desc" },
        },
      },
    }) as unknown as ProviderProfile | null;

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // 2. Fetch doctors separately to avoid runtime Prisma error if the relation is out of sync
    let doctors: Doctor[] = [];
    try {
      // Cast prisma to specific interface for the separate query
      doctors = await (prisma as unknown as PrismaWithDoctor).doctor.findMany({
        where: { providerId },
        orderBy: { createdAt: "desc" },
      });
    } catch (docError) {
      console.warn("Could not fetch doctors separately:", docError);
      // Fallback to empty array if the Doctor table doesn't exist yet
    }

    // Remove sensitive data
    const safeProvider = { ...provider } as Record<string, unknown>;
    delete safeProvider.password;

    return NextResponse.json({
      provider: safeProvider,
      packages: provider.packages || [],
      doctors: doctors,
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
