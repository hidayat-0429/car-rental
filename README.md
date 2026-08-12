# Hidayat Garage - Premium Supercar Rental 🏎️✨

Hidayat Garage is a luxury and premium supercar rental platform built with modern web technologies. The platform offers a seamless booking experience and a powerful admin dashboard for managing the fleet and customer transactions.

## 🌟 Features

- **Premium UI/UX**: Elegant dark mode design with glassmorphism, champagne accents, and fluid animations.
- **Client-Facing Booking Flow**: 3-step seamless checkout process (Customer Info, Dates, Payment Simulation).
- **Admin Dashboard**: Secure admin panel to manage the car fleet (CRUD operations) and track customer transactions/bookings.
- **Fully Responsive**: Optimized for both desktop and mobile devices with thumb-friendly controls.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Auth.js)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A Supabase account (or any PostgreSQL database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hidayat-0429/car-rental.git
   cd car-rental
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Connect to Supabase via connection pooling with Supavisor.
   DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true&connection_limit=1"
   
   # Direct connection to the database. Used for migrations.
   DIRECT_URL="postgresql://user:password@host:5432/postgres"
   
   # NextAuth Secret
   AUTH_SECRET="generate_a_random_secret_here"
   ```

4. **Database Migration & Seeding:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Default Admin Login
To access the admin dashboard (`/admin` or `/login`):
- **Username:** `hidayat`
- **Password:** `hidayat123`

*(Note: Ensure you change these default credentials if deploying to production).*

---
&copy; 2026 Hidayat Garage. All rights reserved.
