import { prisma } from "./prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function verifyPatientSession(
  request: Request,
  patientId: string
): Promise<boolean> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  try {
    const session = await db.patientSession.findUnique({
      where: { token },
      select: { patientId: true, expiresAt: true },
    });
    return !!session && session.patientId === patientId && session.expiresAt > new Date();
  } catch {
    return false;
  }
}

export async function verifyProviderSession(
  request: Request,
  providerId: string
): Promise<boolean> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  try {
    const session = await db.providerSession.findUnique({
      where: { token },
      select: { providerId: true, expiresAt: true },
    });
    return !!session && session.providerId === providerId && session.expiresAt > new Date();
  } catch {
    return false;
  }
}
