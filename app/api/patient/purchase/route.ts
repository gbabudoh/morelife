import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { patientId, packageId } = await request.json();

    if (!patientId || !packageId) {
      return NextResponse.json(
        { error: "Patient ID and Package ID are required" },
        { status: 400 }
      );
    }

    // 1. Fetch package and patient details
    const pkg = await prisma.healthcarePackage.findUnique({
      where: { id: packageId },
      include: { provider: true },
    });

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!pkg || !patient) {
      return NextResponse.json(
        { error: "Package or Patient not found" },
        { status: 404 }
      );
    }

    // 2. Generate Serial Number (PKG-YYYY-XXXXXX)
    const year = new Date().getFullYear();
    const randomStr = uuidv4().split('-')[0].toUpperCase();
    const serialNumber = `PKG-${year}-${randomStr}`;

    // 3. Prepare QR Code Data
    // Storing essential verification data in JSON format
    const qrData = JSON.stringify({
      serial: serialNumber,
      mhNumber: patient.mhNumber,
      packageId: pkg.id,
      patientId: patient.id,
      timestamp: new Date().toISOString()
    });

    // 4. Create Purchase Record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const purchase = await (prisma as any).packagePurchase.create({
      data: {
        serialNumber,
        patientId,
        packageId,
        providerId: pkg.providerId,
        price: pkg.price,
        qrCodeData: qrData,
        redemptionStatus: "PENDING",
      },
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
