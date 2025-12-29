# MoreLife - Healthcare Package Management System

A modern healthcare package management platform connecting patients with healthcare providers across Africa.

## 🌟 Features

### For Patients

- **Multi-tier Registration**: Single, Family, and Corporate membership options
- **Package Marketplace**: Browse and purchase healthcare packages from verified providers
- **QR Code Redemption**: Secure package redemption via unique QR codes
- **Purchase History**: Track all purchased packages and redemption status
- **Premium Dashboard**: Modern, glassmorphic UI with real-time updates

### For Healthcare Providers

- **Provider Registration**: Comprehensive onboarding with document verification
- **Package Management**: Create, edit, and manage healthcare packages
- **Redemption System**: Scan and verify patient QR codes
- **Analytics Dashboard**: Track redemptions, revenue, and package performance
- **Multi-currency Support**: African currency support with automatic conversion

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Custom session-based auth
- **QR Codes**: qrcode library

## 📦 Database Schema

### Core Models

- **Patient**: User accounts with subscription tiers (Single/Family/Corporate)
- **HealthcareProvider**: Verified healthcare service providers
- **HealthcarePackage**: Service packages offered by providers
- **PackagePurchase**: Transaction records with QR codes for redemption

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/gbabudoh/morelife.git
cd morelife
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Configure your `.env` file with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/morelife"
```

4. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Structure

```
morelife/
├── app/
│   ├── patient/          # Patient-facing pages
│   │   ├── register/     # Multi-step registration
│   │   ├── login/        # Patient authentication
│   │   └── dashboard/    # Patient dashboard with purchases
│   ├── provider/         # Provider-facing pages
│   │   ├── register/     # Provider onboarding
│   │   ├── login/        # Provider authentication
│   │   └── dashboard/    # Provider management interface
│   └── api/              # API routes
│       ├── patient/      # Patient APIs
│       └── provider/     # Provider APIs
├── lib/                  # Utilities and configurations
│   ├── prisma.ts        # Database client
│   ├── african-locations.ts
│   └── african-country-codes.ts
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## 🎨 Design Features

- **Off-White Premium Theme**: Sophisticated glassmorphic design
- **Responsive Layout**: Mobile-first, fully responsive
- **Smooth Animations**: Micro-interactions and transitions
- **High Contrast**: Accessibility-focused color choices
- **Modern Typography**: Clean, readable font hierarchy

## 🔐 Authentication

- Session-based authentication using localStorage
- Separate auth flows for patients and providers
- Protected routes with middleware

## 💳 Payment & Redemption Flow

1. **Purchase**: Patient selects and purchases packages
2. **QR Generation**: Unique QR code created for each purchase
3. **Verification**: Provider scans QR code
4. **Redemption**: Package marked as redeemed with timestamp

## 🌍 African Market Focus

- Support for 54+ African countries
- Regional subdivision selection (States/Provinces)
- African currency support (NGN, KES, ZAR, etc.)
- Dial code integration for all African nations

## 📊 Recent Updates

### Latest Features (Dec 2024)

- ✅ Added membership quantity selection for Family/Corporate plans
- ✅ Enhanced registration UI with premium quantity controls
- ✅ Improved form visibility with high-contrast borders
- ✅ Database schema updated with `memberCount` field
- ✅ Refactored API with better type safety

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Godwin Babudoh** - [GitHub](https://github.com/gbabudoh)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for African healthcare accessibility
- Focus on user experience and data security

---

**⚠️ Note**: This is an active development project. Features and documentation are continuously updated.
