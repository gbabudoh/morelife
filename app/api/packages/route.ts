import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.healthcarePackage.findMany({
      where: {
        isActive: true,
      },
      include: {
        provider: {
          select: {
            providerName: true,
            providerType: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to match the frontend expected format if necessary
    const formattedPackages = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price,
      duration: pkg.duration,
      treatmentType: pkg.treatmentType,
      isFree: pkg.isFree,
      providerName: pkg.provider.providerName,
      providerType: pkg.provider.providerType,
      location: pkg.provider.location,
    }));

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
