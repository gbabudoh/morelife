import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("id");

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Return patient data with defaults for new fields
    return NextResponse.json({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      dateOfBirth: patient.dateOfBirth,
      mhNumber: patient.mhNumber,
      location: patient.location,
      mobileNumber: patient.mobileNumber,
      subscriptionType: patient.subscriptionType,
      subscriptionStatus: patient.subscriptionStatus || "INACTIVE",
      subscriptionPlanType: patient.subscriptionPlanType || "PAID",
      subscriptionExpiresAt: patient.subscriptionExpiresAt || null,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Failed to fetch patient data" }, { status: 500 });
  }
}
