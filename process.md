# Home Service Marketplace Web App Development Guide

## Project Overview
A comprehensive guide to building a home services platform using Next.js, focusing on creating a robust, scalable marketplace connecting service providers with customers.

## Prerequisites
- Node.js (v22.12.0+)
- Next.js (v15.1.0+)
- React (v19.0.0+)
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL
- NextAuth.js for authentication
- Stripe for payments

## Project Setup

### Step 1: Initial Project Configuration [Done]
1. Create a new Next.js project with TypeScript
```bash
npx create-next-app@latest home-service-marketplace \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir
```

2. Install additional dependencies
```bash
npm install @prisma/client \
  @next-auth/prisma-adapter \
  stripe \
  zod \
  react-hook-form \
  @hookform/resolvers \
  shadcn/ui
```

### Step 2: Database Schema Design
Create Prisma schema in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(CUSTOMER)
  
  serviceProvider ServiceProvider?
  bookings        Booking[]
}

enum UserRole {
  CUSTOMER
  SERVICE_PROVIDER
  ADMIN
}

model ServiceCategory {
  id          String    @id @default(cuid())
  name        String
  description String?
  services    Service[]
}

model Service {
  id             String           @id @default(cuid())
  name           String
  description    String
  basePrice      Decimal
  categoryId     String
  category       ServiceCategory  @relation(fields: [categoryId], references: [id])
  serviceProviders ServiceProviderService[]
}

model ServiceProvider {
  id           String    @id @default(cuid())
  userId       String    @unique
  user         User      @relation(fields: [userId], references: [id])
  
  companyName  String?
  description  String?
  rating       Float     @default(0)
  
  services     ServiceProviderService[]
  bookings     Booking[]
}

model ServiceProviderService {
  serviceProviderId String
  serviceId         String
  serviceProvider   ServiceProvider @relation(fields: [serviceProviderId], references: [id])
  service           Service         @relation(fields: [serviceId], references: [id])
  
  @@id([serviceProviderId, serviceId])
}

model Booking {
  id                 String           @id @default(cuid())
  customerId         String
  serviceProviderId  String
  serviceId          String
  
  customer           User             @relation(fields: [customerId], references: [id])
  serviceProvider    ServiceProvider  @relation(fields: [serviceProviderId], references: [id])
  service            Service          @relation(fields: [serviceId], references: [id])
  
  scheduledAt        DateTime
  status            BookingStatus     @default(PENDING)
  totalPrice        Decimal
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### Step 3: Authentication Setup
Configure Auth.js in `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
```

### Step 4: Service Provider Onboarding Flow
1. Create registration form for service providers
2. Implement multi-step onboarding
3. Validate and save provider details
4. Allow service and pricing configuration

### Step 5: Marketplace Core Features
- Service category browsing
- Service provider search and filtering
- Detailed service provider profiles
- Booking and scheduling system
- Real-time availability tracking
- Rating and review mechanism

### Step 6: Payment Integration
Implement Stripe checkout for bookings:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

async function createBookingCheckout(booking) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: booking.service.name
        },
        unit_amount: booking.totalPrice * 100
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/bookings/${booking.id}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/bookings/${booking.id}/cancel`
  });

  return session.url;
}
```

### Step 7: Admin Dashboard
- User management
- Service category management
- Booking oversight
- Revenue tracking
- Dispute resolution interface

### Step 8: Performance & Scalability
- Implement server-side rendering (SSR)
- Use React Server Components
- Optimize database queries
- Implement caching strategies
- Use incremental static regeneration (ISR)

### Step 9: Security Considerations
- Role-based access control
- Input validation with Zod
- Secure authentication flows
- CSRF protection
- Rate limiting
- Sanitize user inputs

### Step 10: Deployment
- Vercel for Next.js deployment
- Supabase or AWS RDS for PostgreSQL
- Implement CI/CD pipeline
- Set up monitoring and error tracking

## Estimated Development Timeline
- Planning & Design: 2-3 weeks
- Core Development: 3-4 months
- Testing & Refinement: 1-2 months
- Total: 6-9 months for MVP

## Recommended Tech Stack
- Frontend: Next.js 14 (React)
- Backend: Next.js API Routes
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Auth.js
- Payments: Stripe
- Styling: Tailwind CSS
- State Management: React Context/Zustand
- Validation: Zod
- Deployment: Vercel

## Estimated Costs
- Development: $50,000 - $150,000
- Monthly Hosting: $200 - $500
- Payment Processing: 2.9% + $0.30 per transaction