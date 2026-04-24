import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    try {
      await db.providerSession.delete({ where: { token } });
    } catch {
      // session already gone — fine
    }
  }
  return NextResponse.json({ message: "Logged out" });
}
