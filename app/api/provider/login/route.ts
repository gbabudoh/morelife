import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(request: NextRequest) {
  try {
    console.log("--- Provider Login Started ---");
    let body;
    try {
      body = await request.json();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("JSON parse error:", message);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    const { email, password } = body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find provider
    console.log("Querying database for provider...");
    const provider = await prisma.healthcareProvider.findUnique({
      where: { email },
    });

    if (!provider) {
      console.log("Provider not found:", email);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    console.log("Verifying password for:", email);
    const isValidPassword = await bcrypt.compare(password, provider.password);
    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.providerSession.create({ data: { token, providerId: provider.id, expiresAt } });

    return NextResponse.json(
      { message: "Login successful", providerId: provider.id, token },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Login error:", message);
    return NextResponse.json({ 
      error: "Login failed", 
      details: message 
    }, { status: 500 });
  }
}
