import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Subscription prices in NGN
const SUBSCRIPTION_PRICES = {
  SINGLE: 2000,
  FAMILY: 10000,
  CORPORATE: 100000,
};

// Valid GFP codes (in production, these would be in a database)
const VALID_GFP_CODES = [
  "GFP-2024-001", "GFP-2024-002", "GFP-2024-003",
  "GFP-2025-001", "GFP-2025-002", "GFP-2025-003",
  "GFP-MORELIFE-FREE", "GFP-GOV-NG-2025",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, activationType, gfpCode, paymentReference } = body;

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // GFP Activation
    if (activationType === "GFP") {
      if (!gfpCode) {
        return NextResponse.json({ error: "GFP code is required" }, { status: 400 });
      }

      const normalizedCode = gfpCode.trim().toUpperCase();
      if (!VALID_GFP_CODES.includes(normalizedCode)) {
        return NextResponse.json({ error: "Invalid GFP code" }, { status: 400 });
      }

      // Check if code already used
      const existingGfp = await prisma.patient.findFirst({
        where: { gfpCode: normalizedCode, id: { not: patientId } }
      });
      if (existingGfp) {
        return NextResponse.json({ error: "This GFP code has already been used" }, { status: 400 });
      }

      // Activate with GFP
      const updatedPatient = await prisma.patient.update({
        where: { id: patientId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlanType: "GFP",
          gfpCode: normalizedCode,
          gfpActivatedAt: new Date(),
          subscriptionExpiresAt: null, // GFP doesn't expire
        },
      });

      return NextResponse.json({
        success: true,
        message: "Account activated with Government Free Programme",
        patient: {
          subscriptionStatus: updatedPatient.subscriptionStatus,
          subscriptionPlanType: updatedPatient.subscriptionPlanType,
        },
      });
    }

    // Paid Activation - verify payment
    if (activationType === "PAID") {
      if (!paymentReference) {
        return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
      }

      // Verify payment transaction
      const transaction = await prisma.paymentTransaction.findUnique({
        where: { reference: paymentReference },
      });

      if (!transaction || transaction.status !== "SUCCESS") {
        return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
      }

      // Calculate expiry (1 year from now)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const price = SUBSCRIPTION_PRICES[patient.subscriptionType as keyof typeof SUBSCRIPTION_PRICES] || 2000;

      const updatedPatient = await prisma.patient.update({
        where: { id: patientId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlanType: "PAID",
          subscriptionPrice: price,
          subscriptionExpiresAt: expiresAt,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Subscription activated successfully",
        patient: {
          subscriptionStatus: updatedPatient.subscriptionStatus,
          subscriptionPlanType: updatedPatient.subscriptionPlanType,
          subscriptionExpiresAt: updatedPatient.subscriptionExpiresAt,
        },
      });
    }

    return NextResponse.json({ error: "Invalid activation type" }, { status: 400 });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        subscriptionStatus: true,
        subscriptionPlanType: true,
        subscriptionType: true,
        subscriptionPrice: true,
        subscriptionExpiresAt: true,
        gfpCode: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check if subscription expired
    if (patient.subscriptionStatus === "ACTIVE" && 
        patient.subscriptionPlanType === "PAID" && 
        patient.subscriptionExpiresAt && 
        new Date(patient.subscriptionExpiresAt) < new Date()) {
      await prisma.patient.update({
        where: { id: patientId },
        data: { subscriptionStatus: "EXPIRED" },
      });
      patient.subscriptionStatus = "EXPIRED";
    }

    return NextResponse.json({ subscription: patient });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
