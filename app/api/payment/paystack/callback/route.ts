import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackPayment } from "@/lib/payment-service";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/dashboard?payment=failed`
      );
    }

    // Verify payment
    const isVerified = await verifyPaystackPayment(reference);

    if (!isVerified) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/dashboard?payment=failed`
      );
    }

    // Get payment transaction
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { reference },
    });

    if (!transaction) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/dashboard?payment=failed`
      );
    }

    // Update transaction status
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: { status: "SUCCESS" },
    });

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        patientId: transaction.patientId,
        packageId: transaction.packageId,
        price: transaction.amount,
        serialNumber: `PSK-${Date.now()}`,
        redemptionStatus: "PENDING",
        qrCodeData: JSON.stringify({
          purchaseId: `temp-${Date.now()}`,
          patientId: transaction.patientId,
          packageId: transaction.packageId,
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
          patientId: transaction.patientId,
          packageId: transaction.packageId,
          timestamp: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/patient/dashboard?payment=success`
    );
  } catch (error) {
    console.error("Paystack callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/patient/dashboard?payment=failed`
    );
  }
}
