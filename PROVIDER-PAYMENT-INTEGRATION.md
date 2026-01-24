# Provider Payment Integration & MHP ID System

## Overview
This document outlines the new features added to the provider system:
1. **Payment Gateway Integration** - Providers can configure their own payment gateways
2. **MHP ID System** - Unique provider identification (MHP + 10 digits)
3. **Admin Revocation** - MoreLife admin can revoke provider accounts for breaches

## Features Implemented

### 1. MHP ID System

#### What is MHP ID?
- **Format:** MHP followed by 10 digits (e.g., MHP1234567890)
- **Purpose:** Unique identifier for each healthcare provider
- **Display:** Formatted as MHP 1234 5678 90 for readability
- **Visibility:** Shows on provider dashboard and all their packages

#### Implementation:
- Auto-generated during provider registration
- Guaranteed unique across all providers
- Cannot be changed once assigned
- Displayed in provider information section

### 2. Provider Payment Gateway Integration

#### Supported Gateways:
✅ **Flutterwave** (Active)
- Cards, Bank Transfer, Mobile Money, USSD
- Configure with Public Key and Secret Key

✅ **Paystack** (Active)
- Cards, Bank Transfer, USSD, QR
- Configure with Public Key and Secret Key

⏳ **Mobile Money** (Coming Soon)
- M-Pesa, MTN Money, Airtel Money

⏳ **Bank Transfer** (Coming Soon)
- Direct bank account transfers

#### How It Works:
1. Provider clicks "Payments" button in dashboard
2. Opens payment settings modal
3. Enables desired gateway(s)
4. Enters API keys from gateway dashboard
5. Sets default gateway
6. Saves settings

#### Security:
- API keys are encrypted and stored securely
- Secret keys are masked in UI (show/hide toggle)
- Only provider can view their own keys
- Keys are never exposed in client-side code

### 3. Admin Revocation System

#### Revocation Features:
- Admin can revoke provider account for policy breaches
- Revoked providers cannot access dashboard
- All provider packages are automatically deactivated
- Revocation includes:
  - Timestamp
  - Admin ID who revoked
  - Reason for revocation

#### Restoration:
- Admin can restore revoked accounts
- Clears revocation data
- Reactivates provider account
- Packages remain inactive (manual reactivation needed)

## Database Schema Changes

### HealthcareProvider Model Updates:
```prisma
model HealthcareProvider {
  // ... existing fields
  
  // New fields
  mhpNumber         String   @unique  // MHP ID
  isActive          Boolean  @default(true)
  isRevoked         Boolean  @default(false)
  revokedAt         DateTime?
  revokedBy         String?
  revokedReason     String?
  
  // New relation
  paymentSettings   ProviderPaymentSettings?
}
```

### New ProviderPaymentSettings Model:
```prisma
model ProviderPaymentSettings {
  id                      String   @id @default(cuid())
  providerId              String   @unique
  
  // Flutterwave
  flutterwaveEnabled      Boolean  @default(false)
  flutterwavePublicKey    String?
  flutterwaveSecretKey    String?
  
  // Paystack
  paystackEnabled         Boolean  @default(false)
  paystackPublicKey       String?
  paystackSecretKey       String?
  
  // Mobile Money (Coming Soon)
  mobileMoneyEnabled      Boolean  @default(false)
  
  // Bank Transfer (Coming Soon)
  bankTransferEnabled     Boolean  @default(false)
  bankName                String?
  bankAccountNumber       String?
  
  // Default Gateway
  defaultGateway          String?  @default("flutterwave")
  
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}
```

## API Endpoints

### 1. Payment Settings
**GET** `/api/provider/payment-settings?providerId={id}`
- Fetch provider's payment settings
- Creates default settings if none exist

**POST** `/api/provider/payment-settings`
```json
{
  "providerId": "provider_id",
  "settings": {
    "flutterwaveEnabled": true,
    "flutterwavePublicKey": "FLWPUBK-xxx",
    "flutterwaveSecretKey": "FLWSECK-xxx",
    "paystackEnabled": false,
    "defaultGateway": "flutterwave"
  }
}
```

### 2. Admin Revocation
**POST** `/api/admin/revoke-provider`
```json
{
  "providerId": "provider_id",
  "reason": "Policy violation",
  "adminId": "admin_id"
}
```

**PUT** `/api/admin/revoke-provider` (Restore)
```json
{
  "providerId": "provider_id",
  "adminId": "admin_id"
}
```

## Migration Steps

### Step 1: Update Database Schema
```bash
# Run Prisma migration
npx prisma migrate dev --name add_provider_payment_and_mhp

# Generate Prisma client
npx prisma generate
```

### Step 2: Update Existing Providers
Run this script to add MHP IDs to existing providers:

```typescript
// scripts/add-mhp-to-existing-providers.ts
import { prisma } from "@/lib/prisma";
import { generateMHPNumber } from "@/lib/mhp-generator";

async function addMHPToExistingProviders() {
  const providers = await prisma.healthcareProvider.findMany({
    where: { mhpNumber: null },
  });

  for (const provider of providers) {
    let mhpNumber = generateMHPNumber();
    
    // Ensure uniqueness
    let exists = await prisma.healthcareProvider.findUnique({
      where: { mhpNumber },
    });
    
    while (exists) {
      mhpNumber = generateMHPNumber();
      exists = await prisma.healthcareProvider.findUnique({
        where: { mhpNumber },
      });
    }

    await prisma.healthcareProvider.update({
      where: { id: provider.id },
      data: { mhpNumber },
    });

    console.log(`Added MHP ID ${mhpNumber} to ${provider.providerName}`);
  }

  console.log(`Updated ${providers.length} providers`);
}

addMHPToExistingProviders();
```

### Step 3: Test Payment Integration
1. Login as a provider
2. Click "Payments" button
3. Enable Flutterwave or Paystack
4. Enter test API keys
5. Save settings
6. Verify settings are saved

### Step 4: Test MHP ID Display
1. Check provider dashboard
2. Verify MHP ID is displayed in provider info
3. Check package listings (MHP ID should show on packages)

## UI Components

### 1. Payment Settings Button
Located in provider dashboard header:
```tsx
<button onClick={() => setShowPaymentSettings(true)}>
  <CreditCard /> Payments
</button>
```

### 2. Payment Settings Modal
Full-screen modal with:
- Gateway toggle switches
- API key input fields (with show/hide)
- Coming soon sections
- Default gateway selector
- Save/Cancel buttons

### 3. MHP ID Display
Shown in provider information card:
```tsx
<div>
  <label>MHP ID</label>
  <p>{formatMHPNumber(provider.mhpNumber)}</p>
</div>
```

## Provider Dashboard Updates

### New Features:
1. **Payments Button** - Green button in header
2. **MHP ID Display** - In provider information section
3. **Payment Settings Modal** - Configure gateways
4. **Revocation Check** - Blocks access if revoked

### Updated Interface:
```typescript
interface ProviderData {
  // ... existing fields
  mhpNumber: string;
  isActive: boolean;
  isRevoked: boolean;
}
```

## Security Considerations

### 1. API Key Storage:
- Stored encrypted in database
- Never exposed in API responses to clients
- Only accessible by provider owner

### 2. Revocation:
- Immediate effect (no grace period)
- All packages deactivated
- Provider cannot login
- Clear audit trail

### 3. Payment Processing:
- Provider's own gateway accounts
- Direct payment to provider
- Platform doesn't handle funds
- Provider responsible for gateway fees

## Testing Checklist

### Payment Integration:
- [ ] Provider can open payment settings
- [ ] Can enable/disable Flutterwave
- [ ] Can enter Flutterwave keys
- [ ] Can enable/disable Paystack
- [ ] Can enter Paystack keys
- [ ] Can set default gateway
- [ ] Settings are saved correctly
- [ ] Settings persist after logout/login

### MHP ID:
- [ ] New providers get MHP ID on registration
- [ ] MHP ID is unique
- [ ] MHP ID displays correctly (formatted)
- [ ] MHP ID shows in provider info
- [ ] MHP ID shows on packages

### Revocation:
- [ ] Admin can revoke provider
- [ ] Revoked provider cannot login
- [ ] Revoked provider's packages are deactivated
- [ ] Revocation reason is stored
- [ ] Admin can restore provider
- [ ] Restored provider can login

## Future Enhancements

### Phase 2 (3 months):
- [ ] Mobile Money integration
- [ ] Bank Transfer setup
- [ ] Payment analytics dashboard
- [ ] Transaction history

### Phase 3 (6 months):
- [ ] Multi-currency support
- [ ] Automatic settlement reports
- [ ] Payment reconciliation
- [ ] Dispute management

### Phase 4 (12 months):
- [ ] Split payments
- [ ] Subscription billing
- [ ] Payment plans
- [ ] Refund automation

## Support

### For Providers:
- Payment setup guide in dashboard
- Links to gateway documentation
- Support email for payment issues

### For Admins:
- Revocation guidelines
- Restoration procedures
- Audit log access

## Troubleshooting

### Payment Settings Not Saving:
1. Check API keys are correct format
2. Verify at least one gateway is enabled
3. Check browser console for errors
4. Verify database connection

### MHP ID Not Showing:
1. Run migration script
2. Check database for mhpNumber field
3. Verify provider record has MHP ID
4. Clear browser cache

### Revocation Not Working:
1. Verify admin permissions
2. Check provider ID is correct
3. Verify API endpoint is accessible
4. Check database update logs

---

**Implementation Status:** ✅ Complete and Ready for Testing

**Migration Required:** Yes (database schema update)

**Breaking Changes:** None (backward compatible)
