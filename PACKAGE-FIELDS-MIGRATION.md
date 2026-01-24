# Healthcare Package Fields Migration Guide

## Overview
This guide covers the migration to add new fields to the HealthcarePackage model:
- `validFrom` (DateTime) - Start date of package validity
- `validUntil` (DateTime) - End date of package validity
- `termsAndConditions` (String) - Terms and conditions of use
- `mhpId` (String) - Provider's MHP ID associated with the package

## Migration Status: ✅ COMPLETED

The database schema has been updated and synced successfully.

## What Was Done

### 1. Database Schema Updated
- Added `validFrom`, `validUntil`, `termsAndConditions`, `mhpId` fields to HealthcarePackage
- Made `mhpNumber` optional in HealthcareProvider for backward compatibility
- Ran `npx prisma db push` to sync schema
- Generated new Prisma client

### 2. Existing Providers Updated
- Ran migration script to add MHP IDs to existing providers
- 2 providers updated with unique MHP IDs

### 3. UI Components Updated
- Create Package Form: Added date inputs, MHP ID field, terms textarea
- Update Package Modal: Added all new fields
- Review Package Modal: Displays validity dates, MHP ID, terms
- Package Display Cards: Shows validity dates and MHP ID badges

## New Field Details

### validFrom (DateTime, Optional)
- Start date when the package becomes valid
- Displayed in package cards and review modal
- Used in date range validation (validUntil must be after validFrom)

### validUntil (DateTime, Optional)
- End date when the package expires
- Displayed in package cards and review modal
- Must be after validFrom date

### termsAndConditions (String, Optional)
- Full terms and conditions text for the package
- Displayed in review modal
- Can include usage restrictions, exclusions, etc.
- Supports multi-line text

### mhpId (String, Optional)
- Provider's MHP ID associated with this package
- Format: MHP followed by 10 digits (e.g., MHP1234567890)
- Displayed in package cards and review modal
- Manually entered during package creation/update

## UI Updates

### Create Package Form
- Added date inputs for Valid From and Valid Until dates
- Added MHP ID input with format validation
- Added Terms & Conditions textarea (4 rows)

### Update Package Modal
- Added all new fields to the update form
- Same validation as create form

### Review Package Modal
- Displays validity date range if present
- Shows MHP ID if present
- Shows terms and conditions in a dedicated section

### Package Display Cards
- Shows validity date range badge if dates are present
- Shows MHP ID badge if present

## Validation Rules

1. **Valid From Date**: Required when creating/updating packages
2. **Valid Until Date**: Required, must be after Valid From date
3. **MHP ID**: Required, must match pattern `MHP\d{10}` (MHP + 10 digits)
4. **Terms & Conditions**: Required, minimum 4 rows of text

## Backward Compatibility

All new fields are optional in the database schema, ensuring backward compatibility with existing packages. The UI gracefully handles missing values:

- If validity dates are not set, they won't be displayed
- If MHP ID is not set, it won't be displayed
- If terms and conditions are not set, the section won't be displayed in the review modal

## Testing

After migration, test the following:

1. ✅ Create a new package with all fields
2. ✅ Update an existing package
3. ✅ View package details in review modal
4. ✅ Verify date validation (validUntil > validFrom)
5. ✅ Verify MHP ID format validation
6. ✅ Check that existing packages still display correctly

## Rollback (If Needed)

If you need to rollback the migration:

```bash
npx prisma migrate resolve --rolled-back add_package_validity_and_terms
```

Then manually revert the schema changes in `prisma/schema.prisma`.

## Support

If you encounter any issues during migration:
1. Check the Prisma migration logs
2. Verify your database connection
3. Ensure all required fields are properly set
4. Check the browser console for any frontend errors
