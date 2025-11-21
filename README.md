# Lumina - Premium Dropshipping Platform

> A high-performance, aesthetically precise headless commerce platform designed for the modern dropshipper.

![Lumina Preview](https://via.placeholder.com/1200x600?text=Lumina+Platform+Preview)

## 🏗 Architecture Overview

Lumina operates on a **Headless Architecture** pattern, separating the presentation layer from the business logic and data layer.

### 1. Frontend (Storefront & Admin)
- **Framework:** React 18 (Vite) + TypeScript
- **Styling:** Tailwind CSS (Custom "Obsidian" Design System)
- **State:** React Context (Cart, Auth, Toast)
- **Routing:** React Router v6
- **Type Safety:** Shared TypeScript interfaces with Backend

### 2. Backend (API Layer)
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Security:** Helmet, CORS, JWT

### 3. Integrations
- **Payments:** Stripe (Simulated API pattern)
- **Dropshipping:** Adapter pattern for AliExpress/CJ Dropshipping (Simulated)
- **Auth:** JWT-based authentication with Role-Based Access Control (RBAC)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (Local or Docker)
- NPM or PNPM

### 1. Installation

```bash
# Clone repository
git clone https://github.com/your-username/lumina.git
cd lumina

# Install Frontend Dependencies
npm install

# Install Backend Dependencies
cd server
npm install
```

### 2. Environment Setup

**Frontend (.env)**
(No file needed if using default proxy configuration in `vite.config.ts`)

**Backend (server/.env)**
```env
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/lumina?schema=public"
NODE_ENV=development
JWT_SECRET="dev-secret-key-change-in-prod"
```

### 3. Database Setup (Local)

If you have Docker installed, you can spin up the DB easily:

```bash
# From root
docker-compose up -d db
```

Then run migrations and seed data:

```bash
cd server
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Running Development Servers

**Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

**Frontend:**
```bash
# In root directory
npm run dev
# Runs on http://localhost:3000
```

### 5. Accessing the App

*   **Storefront:** `http://localhost:3000`
*   **Admin Dashboard:** `http://localhost:3000/admin`
*   **Login Credentials (Seeded):**
    *   **Admin:** `admin@lumina.store` / `password`
    *   **Customer:** `customer@lumina.store` / `password`

---

## 📦 Project Structure

```text
lumina/
├── src/
│   ├── api/            # Frontend API clients (connects to backend)
│   ├── components/     # Shared UI components (Atomic design)
│   ├── contexts/       # Global state (Auth, Cart, Toast)
│   ├── pages/          # Route views (Storefront + Admin)
│   └── types.ts        # Shared Data Models
├── server/
│   ├── prisma/         # Database Schema & Seed
│   ├── src/
│   │   ├── controllers/# Business logic
│   │   ├── middleware/ # Auth & Error handling
│   │   └── routes/     # API Endpoint definitions
│   └── index.ts        # Entry point
└── vite.config.ts      # Frontend Build Config
```

## 🛡 Security Notes

*   **Authentication:** Uses HTTP-only patterns conceptually, but MVP uses `localStorage` for JWT storage. Production apps should ideally use HttpOnly Cookies or BFF pattern.
*   **Payments:** The Checkout flow simulates Stripe API calls. To go live, replace `checkoutApi.processPayment` with `@stripe/react-stripe-js`.

---

## 🔮 Future Roadmap

1.  **Real-time Webhooks:** Replace simulated integration delays with actual Webhook endpoints for Stripe and AliExpress.
2.  **Redis Caching:** Implement Redis for session storage and API response caching.
3.  **Mobile Native:** Wrap the Storefront in React Native for iOS/Android apps.