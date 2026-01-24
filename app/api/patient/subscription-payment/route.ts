import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SUBSCRIPTION_PRICES = {
  SINGLE: 2000,
  FAMILY: 10000,
  CORPORATE: 100000,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, gateway } = body;

    if (!patientId || !gateway) {
      return NextResponse.json({ error: "Patient ID and gateway are required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const price = SUBSCRIPTION_PRICES[patient.subscriptionType as keyof typeof SUBSCRIPTION_PRICES] || 2000;
    const reference = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create payment transaction record
    await prisma.paymentTransaction.create({
      data: {
        reference,
        patientId,
        packageId: "SUBSCRIPTION", // Special ID for subscription payments
        amount: price,
        gateway,
        status: "PENDING",
      },
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/patient/dashboard?payment=subscription&reference=${reference}`;

    if (gateway === "flutterwave") {
      const flutterwavePayload = {
        tx_ref: reference,
        amount: price,
        currency: "NGN",
        redirect_url: callbackUrl,
        customer: {
          email: patient.email,
          name: patient.name,
          phonenumber: patient.mobileNumber,
        },
        customizations: {
          title: "MoreLife Subscription",
          description: `${patient.subscriptionType} Subscription - Annual`,
          logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
        },
      };

      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flutterwavePayload),
      });

      const data = await response.json();
      if (data.status === "success") {
        return NextResponse.json({ paymentUrl: data.data.link, reference });
      }
      return NextResponse.json({ error: "Failed to initialize Flutterwave payment" }, { status: 500 });
    }

    if (gateway === "paystack") {
      const paystackPayload = {
        email: patient.email,
        amount: price * 100, // Paystack uses kobo
        reference,
        callback_url: callbackUrl,
        metadata: {
          patient_id: patientId,
          subscription_type: patient.subscriptionType,
          payment_type: "subscription",
        },
      };

      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackPayload),
      });

      const data = await response.json();
      if (data.status) {
        return NextResponse.json({ paymentUrl: data.data.authorization_url, reference });
      }
      return NextResponse.json({ error: "Failed to initialize Paystack payment" }, { status: 500 });
    }

    return NextResponse.json({ error: "Invalid payment gateway" }, { status: 400 });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
