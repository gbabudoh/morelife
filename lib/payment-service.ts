// Payment Service - Handles Flutterwave and Paystack integrations

import Flutterwave from 'flutterwave-node-v3';

export interface PaymentInitData {
  amount: number;
  currency: string;
  email: string;
  name: string;
  phone: string;
  packageId: string;
  patientId: string;
  gateway: 'flutterwave' | 'paystack';
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  reference?: string;
  error?: string;
}

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY || '',
  process.env.FLUTTERWAVE_SECRET_KEY || ''
);

// Flutterwave Payment Initialization
export async function initializeFlutterwavePayment(
  data: PaymentInitData
): Promise<PaymentResponse> {
  try {
    const payload = {
      tx_ref: `MW-${Date.now()}-${data.patientId}`,
      amount: data.amount,
      currency: data.currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/flutterwave/callback`,
      customer: {
        email: data.email,
        name: data.name,
        phonenumber: data.phone,
      },
      customizations: {
        title: 'MoreLife Healthcare',
        description: `Payment for healthcare package`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
      meta: {
        packageId: data.packageId,
        patientId: data.patientId,
      },
    };

    const response = await flw.Charge.card(payload);

    if (response.status === 'success') {
      return {
        success: true,
        paymentUrl: response.meta.authorization.redirect,
        reference: payload.tx_ref,
      };
    }

    return {
      success: false,
      error: 'Failed to initialize payment',
    };
  } catch (error: any) {
    console.error('Flutterwave error:', error);
    return {
      success: false,
      error: error.message || 'Payment initialization failed',
    };
  }
}

// Paystack Payment Initialization
export async function initializePaystackPayment(
  data: PaymentInitData
): Promise<PaymentResponse> {
  try {
    const reference = `MW-${Date.now()}-${data.patientId}`;
    
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100, // Paystack uses kobo
        currency: data.currency,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/paystack/callback`,
        metadata: {
          packageId: data.packageId,
          patientId: data.patientId,
          custom_fields: [
            {
              display_name: 'Patient Name',
              variable_name: 'patient_name',
              value: data.name,
            },
            {
              display_name: 'Phone Number',
              variable_name: 'phone',
              value: data.phone,
            },
          ],
        },
      }),
    });

    const result = await response.json();

    if (result.status && result.data) {
      return {
        success: true,
        paymentUrl: result.data.authorization_url,
        reference,
      };
    }

    return {
      success: false,
      error: result.message || 'Failed to initialize payment',
    };
  } catch (error: any) {
    console.error('Paystack error:', error);
    return {
      success: false,
      error: error.message || 'Payment initialization failed',
    };
  }
}

// Verify Flutterwave Payment
export async function verifyFlutterwavePayment(transactionId: string): Promise<boolean> {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });
    return response.status === 'success' && response.data.status === 'successful';
  } catch (error) {
    console.error('Flutterwave verification error:', error);
    return false;
  }
}

// Verify Paystack Payment
export async function verifyPaystackPayment(reference: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const result = await response.json();
    return result.status && result.data.status === 'success';
  } catch (error) {
    console.error('Paystack verification error:', error);
    return false;
  }
}
