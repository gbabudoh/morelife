import { NextRequest, NextResponse } from "next/server";
import { initializeFlutterwavePayment, initializePaystackPayment } from "@/lib/payment-service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, packageId, gateway } = body;

    // Validate required fields
    if (!patientId || !packageId || !gateway) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get patient details
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Get package details
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        provider: true,
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Handle free packages
    if (pkg.isFree) {
      // Create purchase record directly
      const purchase = await prisma.purchase.create({
        data: {
          patientId,
          packageId,
          price: 0,
          serialNumber: `FREE-${Date.now()}`,
          redemptionStatus: "PENDING",
          qrCodeData: JSON.stringify({
            purchaseId: `temp-${Date.now()}`,
            patientId,
            packageId,
            timestamp: new Date().toISOString(),
          }),
        },
      });

      // Update QR code with actual purchase ID
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          qrCodeData: JSON.stringify({
            purchaseId: purchase.id,
            patientId,
            packageId,
            timestamp: new Date().toISOString(),
          }),
        },
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        purchaseId: purchase.id,
      });
    }

    // Initialize payment based on gateway
    const paymentData = {
      amount: pkg.price,
      currency: "NGN", // You can make this dynamic based on location
      email: patient.email,
      name: patient.name,
      phone: patient.mobileNumber,
      packageId,
      patientId,
      gateway,
    };

    let paymentResponse;

    if (gateway === "flutterwave") {
      paymentResponse = await initializeFlutterwavePayment(paymentData);
    } else if (gateway === "paystack") {
      paymentResponse = await initializePaystackPayment(paymentData);
    } else {
      return NextResponse.json(
        { error: "Invalid payment gateway" },
        { status: 400 }
      );
    }

    if (!paymentResponse.success) {
      return NextResponse.json(
        { error: paymentResponse.error || "Payment initialization failed" },
        { status: 500 }
      );
    }

    // Store payment reference in database
    await prisma.paymentTransaction.create({
      data: {
        reference: paymentResponse.reference!,
        patientId,
        packageId,
        amount: pkg.price,
        gateway,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.paymentUrl,
      reference: paymentResponse.reference,
    });
  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
