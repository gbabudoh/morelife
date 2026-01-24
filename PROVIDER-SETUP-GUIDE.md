# Provider Payment & MHP ID - Setup Guide

## Quick Fix for Current Error

The error you're seeing is because the database schema hasn't been updated yet. Follow these steps:

### Step 1: Update Database Schema

Run the Prisma migration to add the new fields:

```bash
npx prisma migrate dev --name add_provider_payment_and_mhp
```

This will:
- Add `mhpNumber` field to HealthcareProvider
- Add `isActive`, `isRevoked`, `revokedAt`, `revokedBy`, `revokedReason` fields
- Create `ProviderPaymentSettings` table

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Add MHP IDs to Existing Providers (Optional)

If you have existing providers, run this script to add MHP IDs:

```bash
npx ts-node scripts/migrate-add-mhp-ids.ts
```

Or manually using Prisma Studio:
```bash
npx prisma studio
```

### Step 4: Restart Your Dev Server

```bash
npm run dev
```

## Alternative: Rollback Changes (If Needed)

If you want to use the system without the new features temporarily:

### Option 1: Revert Schema Changes

1. Open `prisma/schema.prisma`
2. Remove the new fields from `HealthcareProvider`:
   - `mhpNumber`
   - `isActive`
   - `isRevoked`
   - `revokedAt`
   - `revokedBy`
   - `revokedReason`
   - `paymentSettings` relation

3. Remove the `ProviderPaymentSettings` model

4. Run migration:
```bash
npx prisma migrate dev --name revert_provider_changes
npx prisma generate
```

### Option 2: Use Backward Compatible Version

The API has been updated to be backward compatible. It will:
- Show "Pending Migration" for MHP ID if not available
- Skip payment settings if table doesn't exist
- Default to active status if fields don't exist

## Verification Steps

After migration, verify everything works:

### 1. Check Database
```bash
npx prisma studio
```
- Open HealthcareProvider table
- Verify `mhpNumber` field exists
- Check if existing providers have MHP IDs

### 2. Test Provider Login
1. Go to `/provider/login`
2. Login with existing credentials
3. Should see dashboard without errors

### 3. Check MHP ID Display
- Look for "MHP ID" in provider information section
- Should show formatted MHP number (e.g., MHP 1234 5678 90)
- Or "Pending Migration" if not set yet

### 4. Test Payment Settings
1. Click "Payments" button (green) in header
2. Should open payment settings modal
3. Try enabling Flutterwave or Paystack
4. Enter test keys and save

## Troubleshooting

### Error: "Column 'mhpNumber' does not exist"
**Solution:** Run the migration:
```bash
npx prisma migrate dev --name add_provider_payment_and_mhp
npx prisma generate
```

### Error: "Table 'ProviderPaymentSettings' does not exist"
**Solution:** Same as above - run the migration

### MHP ID shows "Pending Migration"
**Solution:** Run the migration script:
```bash
npx ts-node scripts/migrate-add-mhp-ids.ts
```

### Payment Settings button doesn't work
**Solution:** 
1. Check browser console for errors
2. Verify migration was successful
3. Check if `ProviderPaymentSettings` table exists

### Provider can't login after migration
**Solution:**
1. Check if `isActive` field is set to `true`
2. Check if `isRevoked` field is set to `false`
3. Update manually in Prisma Studio if needed

## Manual Database Update (If Needed)

If migrations fail, you can manually update the database:

### Add mhpNumber column:
```sql
ALTER TABLE "HealthcareProvider" 
ADD COLUMN "mhpNumber" TEXT UNIQUE;

ALTER TABLE "HealthcareProvider" 
ADD COLUMN "isActive" BOOLEAN DEFAULT true;

ALTER TABLE "HealthcareProvider" 
ADD COLUMN "isRevoked" BOOLEAN DEFAULT false;

ALTER TABLE "HealthcareProvider" 
ADD COLUMN "revokedAt" TIMESTAMP;

ALTER TABLE "HealthcareProvider" 
ADD COLUMN "revokedBy" TEXT;

ALTER TABLE "HealthcareProvider" 
ADD COLUMN "revokedReason" TEXT;
```

### Create ProviderPaymentSettings table:
```sql
CREATE TABLE "ProviderPaymentSettings" (
  "id" TEXT PRIMARY KEY,
  "providerId" TEXT UNIQUE NOT NULL,
  "flutterwaveEnabled" BOOLEAN DEFAULT false,
  "flutterwavePublicKey" TEXT,
  "flutterwaveSecretKey" TEXT,
  "flutterwaveAccountId" TEXT,
  "paystackEnabled" BOOLEAN DEFAULT false,
  "paystackPublicKey" TEXT,
  "paystackSecretKey" TEXT,
  "paystackAccountId" TEXT,
  "mobileMoneyEnabled" BOOLEAN DEFAULT false,
  "mobileMoneyProvider" TEXT,
  "mobileMoneyAccountId" TEXT,
  "bankTransferEnabled" BOOLEAN DEFAULT false,
  "bankName" TEXT,
  "bankAccountNumber" TEXT,
  "bankAccountName" TEXT,
  "defaultGateway" TEXT DEFAULT 'flutterwave',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("providerId") REFERENCES "HealthcareProvider"("id") ON DELETE CASCADE
);
```

### Generate MHP IDs for existing providers:
```sql
-- This is a PostgreSQL example
UPDATE "HealthcareProvider"
SET "mhpNumber" = 'MHP' || LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0')
WHERE "mhpNumber" IS NULL;
```

## Testing Checklist

After setup, test these features:

- [ ] Provider can login successfully
- [ ] Dashboard loads without errors
- [ ] MHP ID is displayed (or shows "Pending Migration")
- [ ] "Payments" button appears in header
- [ ] Payment settings modal opens
- [ ] Can enable/disable payment gateways
- [ ] Can save payment settings
- [ ] Provider information shows all fields correctly

## Support

If you continue to have issues:

1. Check the browser console for detailed error messages
2. Check the server logs for API errors
3. Verify database connection is working
4. Ensure all migrations have been applied
5. Try clearing browser cache and restarting dev server

## Quick Commands Reference

```bash
# Run migration
npx prisma migrate dev --name add_provider_payment_and_mhp

# Generate Prisma client
npx prisma generate

# Add MHP IDs to existing providers
npx ts-node scripts/migrate-add-mhp-ids.ts

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

---

**Need Help?** Check the detailed documentation in `PROVIDER-PAYMENT-INTEGRATION.md`
