import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Get or create payment settings
    let settings = await prisma.providerPaymentSettings.findUnique({
      where: { providerId },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.providerPaymentSettings.create({
        data: {
          providerId,
          flutterwaveEnabled: false,
          paystackEnabled: false,
          mobileMoneyEnabled: false,
          bankTransferEnabled: false,
          defaultGateway: "flutterwave",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, settings } = body;

    if (!providerId) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Validate that at least one gateway is enabled if keys are provided
    if (settings.flutterwaveEnabled && (!settings.flutterwavePublicKey || !settings.flutterwaveSecretKey)) {
      return NextResponse.json(
        { error: "Flutterwave keys are required when enabled" },
        { status: 400 }
      );
    }

    if (settings.paystackEnabled && (!settings.paystackPublicKey || !settings.paystackSecretKey)) {
      return NextResponse.json(
        { error: "Paystack keys are required when enabled" },
        { status: 400 }
      );
    }

    // Update or create payment settings
    const updatedSettings = await prisma.providerPaymentSettings.upsert({
      where: { providerId },
      update: {
        flutterwaveEnabled: settings.flutterwaveEnabled,
        flutterwavePublicKey: settings.flutterwavePublicKey,
        flutterwaveSecretKey: settings.flutterwaveSecretKey,
        paystackEnabled: settings.paystackEnabled,
        paystackPublicKey: settings.paystackPublicKey,
        paystackSecretKey: settings.paystackSecretKey,
        mobileMoneyEnabled: settings.mobileMoneyEnabled,
        bankTransferEnabled: settings.bankTransferEnabled,
        defaultGateway: settings.defaultGateway,
      },
      create: {
        providerId,
        flutterwaveEnabled: settings.flutterwaveEnabled,
        flutterwavePublicKey: settings.flutterwavePublicKey,
        flutterwaveSecretKey: settings.flutterwaveSecretKey,
        paystackEnabled: settings.paystackEnabled,
        paystackPublicKey: settings.paystackPublicKey,
        paystackSecretKey: settings.paystackSecretKey,
        mobileMoneyEnabled: settings.mobileMoneyEnabled,
        bankTransferEnabled: settings.bankTransferEnabled,
        defaultGateway: settings.defaultGateway,
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error: any) {
    console.error("Error saving payment settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save payment settings" },
      { status: 500 }
    );
  }
}
