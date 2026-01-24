// Payment Gateway Configuration for African Markets

export const PAYMENT_GATEWAYS = {
  FLUTTERWAVE: 'flutterwave',
  PAYSTACK: 'paystack',
  MOBILE_MONEY: 'mobile_money',
  BANK_TRANSFER: 'bank_transfer',
} as const;

export type PaymentGateway = typeof PAYMENT_GATEWAYS[keyof typeof PAYMENT_GATEWAYS];

export interface PaymentConfig {
  id: PaymentGateway;
  name: string;
  description: string;
  logo: string;
  countries: string[];
  methods: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  enabled: boolean;
}

export const PAYMENT_CONFIGS: Record<PaymentGateway, PaymentConfig> = {
  flutterwave: {
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'Cards, Bank Transfer, Mobile Money',
    logo: '💳',
    countries: ['NG', 'GH', 'KE', 'UG', 'TZ', 'ZA', 'RW'],
    methods: ['card', 'bank_transfer', 'mobile_money', 'ussd'],
    fees: {
      percentage: 1.4,
      fixed: 0,
      currency: 'NGN',
    },
    enabled: true,
  },
  paystack: {
    id: 'paystack',
    name: 'Paystack',
    description: 'Cards, Bank Transfer, USSD',
    logo: '🔷',
    countries: ['NG', 'GH', 'ZA', 'KE'],
    methods: ['card', 'bank_transfer', 'ussd', 'qr'],
    fees: {
      percentage: 1.5,
      fixed: 100,
      currency: 'NGN',
    },
    enabled: true,
  },
  mobile_money: {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'M-Pesa, MTN, Airtel Money',
    logo: '📱',
    countries: ['KE', 'UG', 'TZ', 'RW', 'GH', 'ZM'],
    methods: ['mpesa', 'mtn_money', 'airtel_money', 'vodafone_cash'],
    fees: {
      percentage: 1.0,
      fixed: 0,
      currency: 'KES',
    },
    enabled: true,
  },
  bank_transfer: {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    logo: '🏦',
    countries: ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ'],
    methods: ['bank_transfer'],
    fees: {
      percentage: 0,
      fixed: 0,
      currency: 'NGN',
    },
    enabled: true,
  },
};

// Get available payment methods for a country
export function getAvailablePaymentMethods(countryCode: string): PaymentConfig[] {
  return Object.values(PAYMENT_CONFIGS).filter(
    (config) => config.enabled && config.countries.includes(countryCode)
  );
}

// Calculate payment fee
export function calculatePaymentFee(
  amount: number,
  gateway: PaymentGateway
): number {
  const config = PAYMENT_CONFIGS[gateway];
  const percentageFee = (amount * config.fees.percentage) / 100;
  return percentageFee + config.fees.fixed;
}

// Get total amount including fees
export function getTotalWithFees(
  amount: number,
  gateway: PaymentGateway
): number {
  return amount + calculatePaymentFee(amount, gateway);
}
