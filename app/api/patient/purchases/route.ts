import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const purchases = await (prisma as any).packagePurchase.findMany({
      where: { patientId },
      include: {
        package: {
          include: {
            provider: {
              select: {
                providerName: true,
                location: true,
                providerType: true
              }
            }
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });

    return NextResponse.json(purchases, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient purchases:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
