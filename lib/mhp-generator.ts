// MHP ID Generator for Healthcare Providers
// Format: MHP + 10 digits (e.g., MHP1234567890)

export function generateMHPNumber(): string {
  // Generate 10 random digits
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `MHP${digits}`;
}

export function validateMHPNumber(mhpNumber: string): boolean {
  // Check format: MHP followed by exactly 10 digits
  const mhpRegex = /^MHP\d{10}$/;
  return mhpRegex.test(mhpNumber);
}

export function formatMHPNumber(mhpNumber: string): string {
  // Format: MHP 1234 5678 90
  if (!validateMHPNumber(mhpNumber)) {
    return mhpNumber;
  }
  
  const digits = mhpNumber.substring(3);
  return `MHP ${digits.substring(0, 4)} ${digits.substring(4, 8)} ${digits.substring(8)}`;
}
