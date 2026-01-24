# Payment Gateway Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1. Add Your API Keys

Open `.env.local` and replace the placeholder keys:

```env
# Get these from https://dashboard.flutterwave.com/settings/apis
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-your-key-here"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-your-key-here"

# Get these from https://dashboard.paystack.com/#/settings/developers
PAYSTACK_PUBLIC_KEY="pk_test_your-key-here"
PAYSTACK_SECRET_KEY="sk_test_your-key-here"
```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name add_payment_transactions
npx prisma generate
```

### 3. Test the Payment Flow

1. Start your dev server: `npm run dev`
2. Go to marketplace: http://localhost:3000/patient/marketplace
3. Select any package
4. Choose a payment method (Flutterwave or Paystack)
5. Use test cards to complete payment

### 4. Test Cards

**Flutterwave Test Card:**
```
Card: 5531 8866 5214 2950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

**Paystack Test Card:**
```
Card: 4084 0840 8408 4081
CVV: 408
Expiry: 12/30
OTP: 123456
```

## ✅ What's Implemented

### For Patients:
- ✅ Choose between Flutterwave and Paystack
- ✅ See gateway fees before payment
- ✅ Free packages (no payment required)
- ✅ Secure payment redirect
- ✅ Automatic package activation
- ✅ Payment confirmation

### For Providers:
- ✅ Receive payments directly
- ✅ Include gateway fees in pricing
- ✅ Track all transactions
- ✅ Automatic settlement

### Payment Methods Available:
- ✅ Credit/Debit Cards (Visa, Mastercard, Verve)
- ✅ Bank Transfer
- ✅ USSD Codes
- ⏳ Mobile Money (Coming Soon)
- ⏳ QR Code Payments (Coming Soon)

## 📱 Other African Payment Methods

### Recommended for Future Integration:

1. **M-Pesa (Kenya, Tanzania)**
   - Most popular in East Africa
   - 30M+ users
   - Instant payments

2. **MTN Mobile Money (Ghana, Uganda, Rwanda)**
   - 60M+ users across Africa
   - Low transaction fees
   - USSD-based

3. **Airtel Money (Kenya, Uganda, Tanzania, Zambia)**
   - 25M+ users
   - Cross-border payments
   - Agent network

4. **Chipper Cash**
   - Free cross-border transfers
   - Popular with millennials
   - 7 African countries

5. **Wave (Senegal, Ivory Coast, Mali)**
   - Zero fees
   - Fast growing
   - Mobile-first

6. **OPay (Nigeria)**
   - Ride-hailing + payments
   - Large user base
   - Instant transfers

## 🔧 Configuration Options

### Gateway Fees (Customizable in `lib/payment-config.ts`):

```typescript
flutterwave: {
  percentage: 1.4,  // 1.4% of transaction
  fixed: 0,         // No fixed fee
}

paystack: {
  percentage: 1.5,  // 1.5% of transaction
  fixed: 100,       // ₦100 fixed fee
}
```

### Supported Countries:

**Flutterwave:** Nigeria, Ghana, Kenya, Uganda, Tanzania, South Africa, Rwanda

**Paystack:** Nigeria, Ghana, South Africa, Kenya

## 🎯 Testing Scenarios

### Scenario 1: Free Package
1. Select a free package (e.g., "Free Vaccination Drive")
2. Click "View Details"
3. See "No payment required" message
4. Click "Complete Purchase"
5. Package activates immediately

### Scenario 2: Paid Package with Flutterwave
1. Select a paid package
2. Choose "Flutterwave" payment method
3. Review total with fees
4. Click "Complete Purchase"
5. Redirected to Flutterwave
6. Enter test card details
7. Complete payment
8. Redirected back to dashboard

### Scenario 3: Paid Package with Paystack
1. Select a paid package
2. Choose "Paystack" payment method
3. Review total with fees
4. Click "Complete Purchase"
5. Redirected to Paystack
6. Enter test card details
7. Complete payment
8. Redirected back to dashboard

## 🔐 Security Notes

- ✅ All payments processed via secure gateways
- ✅ No card details stored on your server
- ✅ PCI DSS compliant
- ✅ 3D Secure authentication
- ✅ Encrypted transactions

## 📊 Payment Flow Diagram

```
Patient → Select Package → Choose Gateway → 
Initialize Payment → Redirect to Gateway → 
Enter Card Details → Gateway Processes → 
Verify Payment → Create Purchase → 
Activate Package → Redirect to Dashboard
```

## 🆘 Common Issues

### "Payment initialization failed"
- Check API keys are correct
- Verify internet connection
- Check gateway status page

### "Payment not completing"
- Ensure callback URL is accessible
- Check database connection
- Review server logs

### "Free package not activating"
- Verify package `isFree` field is true
- Check purchase API endpoint
- Review database records

## 📞 Need Help?

1. Check `PAYMENT-SETUP.md` for detailed documentation
2. Review gateway documentation:
   - Flutterwave: https://developer.flutterwave.com
   - Paystack: https://paystack.com/docs
3. Contact gateway support if payment issues persist

## 🚀 Going Live

Before going to production:

1. Replace test keys with live keys
2. Update `NEXT_PUBLIC_APP_URL` to your domain
3. Enable HTTPS
4. Test with small real transactions
5. Set up webhooks for payment notifications
6. Configure settlement accounts
7. Enable monitoring and alerts

## 💡 Pro Tips

1. **Always show fees upfront** - Patients appreciate transparency
2. **Offer multiple payment options** - Increases conversion
3. **Test regularly** - Payment systems can change
4. **Monitor failed payments** - Identify and fix issues quickly
5. **Provide clear instructions** - Reduce support requests

---

**Ready to accept payments!** 🎉

Start your server and test the payment flow with the test cards above.
