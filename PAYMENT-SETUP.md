# Payment Gateway Setup Guide

## Overview
MoreLife Healthcare Platform supports multiple payment gateways optimized for African markets:

1. **Flutterwave** - Primary gateway (Nigeria, Ghana, Kenya, Uganda, Tanzania, South Africa, Rwanda)
2. **Paystack** - Secondary gateway (Nigeria, Ghana, South Africa, Kenya)
3. **Mobile Money** - Coming Soon (M-Pesa, MTN Money, Airtel Money)
4. **Bank Transfer** - Coming Soon (Direct bank transfers)

## Features Implemented

### 1. Multi-Gateway Support
- Patients can choose between Flutterwave and Paystack
- Automatic fee calculation per gateway
- Gateway-specific payment flows

### 2. Free Package Handling
- No payment required for free packages
- Direct checkout without payment gateway
- Instant activation

### 3. Provider Payment Integration
- Providers receive payments directly
- Gateway fees can be included in package pricing
- Transparent fee display to patients

### 4. Payment Flow
```
Patient selects package → Chooses payment method → 
Redirects to gateway → Completes payment → 
Callback verification → Package activation → 
Dashboard redirect
```

## Setup Instructions

### Step 1: Get API Keys

#### Flutterwave
1. Sign up at https://flutterwave.com
2. Go to Settings → API Keys
3. Copy your Public Key and Secret Key
4. Test Mode keys for development
5. Live Mode keys for production

#### Paystack
1. Sign up at https://paystack.com
2. Go to Settings → API Keys & Webhooks
3. Copy your Public Key and Secret Key
4. Test Mode keys for development
5. Live Mode keys for production

### Step 2: Configure Environment Variables

Update your `.env.local` file:

```env
# Flutterwave
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx"

# Paystack
PAYSTACK_PUBLIC_KEY="pk_test_your_public_key_here"
PAYSTACK_SECRET_KEY="sk_test_your_secret_key_here"

# Application URL (for callbacks)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Update Database Schema

Run Prisma migration to add PaymentTransaction model:

```bash
npx prisma migrate dev --name add_payment_transactions
npx prisma generate
```

### Step 4: Test Payment Flow

#### Test Cards for Flutterwave:
- **Successful Payment:** 5531886652142950 (CVV: 564, Expiry: 09/32, PIN: 3310)
- **Failed Payment:** 5143010522339965 (CVV: 276, Expiry: 09/32, PIN: 3310)

#### Test Cards for Paystack:
- **Successful Payment:** 4084084084084081 (CVV: 408, Expiry: any future date)
- **Failed Payment:** 5060666666666666666 (CVV: 123, Expiry: any future date)

## Payment Gateway Comparison

| Feature | Flutterwave | Paystack |
|---------|-------------|----------|
| **Countries** | 7+ African countries | 4 African countries |
| **Transaction Fee** | 1.4% | 1.5% + ₦100 |
| **Payment Methods** | Cards, Bank Transfer, Mobile Money, USSD | Cards, Bank Transfer, USSD, QR |
| **Settlement** | T+1 | T+1 |
| **Multi-currency** | Yes | Limited |
| **Mobile Money** | Yes | No |

## Additional Payment Methods (Coming Soon)

### 1. Mobile Money Integration
**Supported Services:**
- M-Pesa (Kenya, Tanzania)
- MTN Mobile Money (Ghana, Uganda, Rwanda)
- Airtel Money (Kenya, Uganda, Tanzania, Zambia)
- Vodafone Cash (Ghana)

**Benefits:**
- Lower fees (1%)
- Direct from mobile wallet
- No card required
- Instant confirmation

### 2. Bank Transfer
**Features:**
- Zero gateway fees
- Direct to provider account
- Manual verification
- 24-48 hour processing

### 3. USSD Payments
**Available via Flutterwave & Paystack:**
- Dial USSD code
- No internet required
- Works on any phone
- Instant deduction

## Provider Payment Configuration

### For Healthcare Providers:

1. **Include Gateway Fees in Pricing:**
```typescript
// Example: Package costs ₦10,000
// Flutterwave fee: 1.4% = ₦140
// Set package price: ₦10,140
```

2. **Direct Payment Reception:**
- Payments go directly to provider's gateway account
- Platform takes commission separately
- Instant settlement notification

3. **Fee Transparency:**
- Patients see breakdown:
  - Package cost
  - Gateway fee
  - Total amount

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always verify payments** on the server
3. **Use HTTPS** in production
4. **Implement webhook verification** for payment callbacks
5. **Log all transactions** for audit trail

## Webhook Setup (Optional but Recommended)

### Flutterwave Webhook:
```
URL: https://yourdomain.com/api/payment/flutterwave/webhook
Events: charge.completed, transfer.completed
```

### Paystack Webhook:
```
URL: https://yourdomain.com/api/payment/paystack/webhook
Events: charge.success, transfer.success
```

## Troubleshooting

### Payment Not Completing:
1. Check API keys are correct
2. Verify callback URLs are accessible
3. Check database for transaction records
4. Review gateway dashboard for errors

### Callback Not Working:
1. Ensure NEXT_PUBLIC_APP_URL is correct
2. Check firewall/security settings
3. Test callback URL manually
4. Review server logs

### Free Packages Not Working:
1. Verify `isFree` field is set to `true`
2. Check package creation logic
3. Review purchase API logs

## Production Checklist

- [ ] Replace test API keys with live keys
- [ ] Update NEXT_PUBLIC_APP_URL to production domain
- [ ] Enable HTTPS
- [ ] Set up webhooks
- [ ] Test with real cards (small amounts)
- [ ] Configure payment notifications
- [ ] Set up monitoring and alerts
- [ ] Review gateway dashboard settings
- [ ] Enable 3D Secure for cards
- [ ] Configure settlement accounts

## Support

### Flutterwave Support:
- Email: support@flutterwavego.com
- Phone: +234 1 888 3666
- Docs: https://developer.flutterwave.com

### Paystack Support:
- Email: support@paystack.com
- Phone: +234 1 888 3666
- Docs: https://paystack.com/docs

## Future Enhancements

1. **Subscription Payments** - Recurring billing for memberships
2. **Split Payments** - Automatic commission splitting
3. **Refunds** - Automated refund processing
4. **Payment Plans** - Installment payments
5. **Crypto Payments** - Bitcoin/USDT support
6. **International Cards** - Visa, Mastercard, Amex
7. **Payment Analytics** - Transaction insights dashboard
