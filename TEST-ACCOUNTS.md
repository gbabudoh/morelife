# Test Provider Accounts

## 🧪 Test Credentials

### Nigeria Provider Account

- **Provider Name:** Lagos General Hospital
- **Contact Person:** Dr. Adebayo Okonkwo
- **Email:** `lagos.general@test.com`
- **Password:** `Test123456`
- **Category:** Hospital
- **Type:** General Hospital
- **Location:** Lagos, Lagos, Nigeria
- **Phone:** +234 801 234 5678

### South Africa Provider Account

- **Provider Name:** Cape Town Medical Centre
- **Contact Person:** Dr. Thabo Mbeki
- **Email:** `capetown.medical@test.com`
- **Password:** `Test123456`
- **Category:** Medical Centre
- **Type:** Medical Centre
- **Location:** Cape Town, Western Cape, South Africa
- **Phone:** +27 21 123 4567

## 📝 How to Create Test Accounts

**Option 1: Use the Registration Form**

1. Go to http://localhost:3001/provider/register
2. Fill in the 4-step form with the details above
3. Skip file uploads for testing (they're optional)
4. Submit the application

**Option 2: Run the Script** (once database is migrated)

```bash
npx tsx create-test-providers.ts
```

## 🔐 Login

After creating accounts, login at:

- **URL:** http://localhost:3001/provider/login
- Use the email and password from above

## ⚠️ Note

The database schema needs to be migrated before test accounts can be created programmatically. For now, use the registration form to create test accounts manually.
