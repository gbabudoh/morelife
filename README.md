# MoreLife Healthcare

A digital ecosystem connecting patients with quality healthcare providers across Africa. MoreLife Healthcare provides transparent, fixed-price healthcare packages and a comprehensive marketplace for accessible healthcare services.

## Features

### For Patients
- **Patient Registration & Dashboard**: Create an account and manage your healthcare profile
- **Digital Health Card**: Unique MH-Number with QR code for seamless access at provider facilities
- **Subscription Management**: Choose from Single, Family, or Corporate subscription plans
- **Healthcare Marketplace**: Browse and purchase transparent, fixed-price healthcare packages
- **Account Details**: Manage personal information including name, date of birth, location, and mobile number

### For Healthcare Providers
- **Provider Registration**: Free registration for hospitals, clinics, health centres, and mobile clinics
- **Provider Dashboard**: Manage provider information and create healthcare packages
- **Package Creation**: Create and manage healthcare packages with:
  - Fixed pricing (or free for charity/government programs)
  - Treatment types (Maternity, Dental, Malaria, Eye Treatment, etc.)
  - Duration settings (2 weeks, 6 months, 1 year, etc.)
  - Comprehensive descriptions

## Tech Stack

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma with SQLite
- **Authentication**: bcryptjs for password hashing
- **QR Code**: qrcode.react for digital health cards

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd morelife
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Create .env file
echo 'DATABASE_URL="file:./dev.db"' > .env

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
morelife/
├── app/
│   ├── api/              # API routes for authentication
│   ├── patient/          # Patient pages (register, login, dashboard, marketplace)
│   ├── provider/         # Provider pages (register, login, dashboard)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   └── DigitalCard.tsx   # Digital health card component with QR code
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets (logo, icon, favicon)
```

## Database Schema

The application uses Prisma with the following main models:
- **Patient**: User accounts with subscription information
- **HealthcareProvider**: Provider accounts and business information
- **HealthcarePackage**: Healthcare service packages created by providers
- **PatientPackage**: Relationship between patients and purchased packages

## Features Overview

### Landing Page
- Two access points: Patient Access and Healthcare Provider Access
- Feature highlights and benefits

### Patient Flow
1. Register/Login → Patient Dashboard
2. View account details and subscription information
3. Access digital health card with QR code
4. Browse marketplace for healthcare packages

### Provider Flow
1. Register/Login → Provider Dashboard
2. Manage provider information
3. Create and manage healthcare packages
4. Set pricing, duration, and treatment types

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
```

## Development

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio
```

### Build for Production

```bash
npm run build
npm start
```

## License

This project is private and proprietary.

## Support

For support and inquiries, please contact the MoreLife Healthcare team.

---

**MoreLife: Providing access to healthcare for a better tomorrow.**
