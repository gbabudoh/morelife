import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma, RedemptionStatus } from "@prisma/client";
import { verifyPatientSession } from "@/lib/session";

interface HealthcarePackageWithProvider {
  id: string;
  providerId: string;
  price: number;
  isVideoConsultation: boolean;
  videoRoomId: string | null;
  maxAttendees: number | null;
  currentAttendees: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, packageId } = body;

    if (!patientId || !packageId) {
      return NextResponse.json(
        { error: "Patient ID and Package ID are required" },
        { status: 400 }
      );
    }

    if (!(await verifyPatientSession(request, patientId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // 1.5. Check for attendee limits (NGO Outreaches)
    const pkgTyped = pkg as unknown as HealthcarePackageWithProvider;
    if (pkgTyped.maxAttendees !== null && pkgTyped.currentAttendees >= pkgTyped.maxAttendees) {
      return NextResponse.json(
        { error: "This outreach has reached its maximum capacity (Manifest Full)" },
        { status: 400 }
      );
    }

    // 2. Generate Serial Number (PKG-YYYY-XXXXXX)
    const year = new Date().getFullYear();
    const randomStr = uuidv4().split('-')[0].toUpperCase();
    const serialNumber = `PKG-${year}-${randomStr}`;

    // 3. Prepare QR Code Data
    const qrData = JSON.stringify({
      serial: serialNumber,
      mhNumber: patient.mhNumber,
      packageId: pkg.id,
      patientId: patient.id,
      timestamp: new Date().toISOString()
    });

    // 4. Create Purchase Record & Increment Attendees
    const purchase = await prisma.$transaction([
      prisma.packagePurchase.create({
        data: {
          serialNumber,
          patientId,
          packageId,
          providerId: pkg.providerId,
          price: pkg.price,
          qrCodeData: qrData,
          redemptionStatus: RedemptionStatus.PENDING,
          isVideoConsultation: pkgTyped.isVideoConsultation,
          videoRoomId: pkgTyped.videoRoomId || uuidv4(),
        } as unknown as Prisma.PackagePurchaseCreateInput,
      }),
      prisma.healthcarePackage.update({
        where: { id: packageId },
        data: { currentAttendees: { increment: 1 } } as unknown as Prisma.HealthcarePackageUpdateInput,
      }),
    ]);

    return NextResponse.json(purchase[0]);
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
