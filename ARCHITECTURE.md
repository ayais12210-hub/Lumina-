# ARCHITECTURE DOCUMENT: LUMINA DROPSHIP PLATFORM

## 1. PHASE_INTENT
This document outlines the foundational architecture for "Lumina," a premium dropshipping platform. The focus is on a high-performance Single Page Application (SPA) that separates the customer storefront from the operator admin dashboard while sharing core data models and services.

## 2. SYSTEM_ARCHITECTURE

### High-Level Components
1.  **Frontend Layer (React 18 + Tailwind)**
    *   **Storefront**: Public-facing e-commerce experience. Optimized for speed, conversion, and visual impact.
    *   **Admin Console**: Protected route for store operators. Focus on data density, management, and analytics.
    *   **Service Layer**: Abstraction layer (`services/`) handling communication with the "backend" (mocked for this demo) and external APIs.

2.  **State Management**
    *   **Context API**: Used for global, session-specific state (Cart, User Auth, Toast Notifications).
    *   **Local State**: React Hooks (`useState`, `useReducer`) for component-level interactions.

3.  **Data Flow**
    *   `UI Component` -> `Service Layer` -> `Mock Database/API`
    *   Real-time feedback provided via Toast notifications.

## 3. UI_UX_ARCHITECTURE

### Aesthetic Direction
*   **Style**: "Invisible Tech". Minimal chrome, maximum content focus.
*   **Typography**: Inter (Sans-serif). Headers are tight-tracking, light weights. Body is legible, high-contrast.
*   **Palette**: 
    *   Primary: White (`#ffffff`) & Slate 950 (`#020617`).
    *   Accent: Electric Blue (`#3b82f6`) - used sparingly for primary actions.
    *   Surface: Subtle greys (`#f8fafc`) for depth.
*   **Grid**: 12-column grid system, collapsing to single column on mobile.

### Core Layouts
*   **Storefront Layout**: Sticky minimal header, immersive hero sections, clean product grids with generous whitespace.
*   **Admin Layout**: Sidebar navigation, breadcrumb headers, data tables with filtering.

## 4. DATA_MODEL_ARCHITECTURE

### Core Entities
*   **Product**: `id`, `title`, `price`, `supplierId`, `variants[]`, `images[]`, `status` (Active/Draft).
*   **Variant**: `sku`, `size`, `color`, `inventoryLevel`.
*   **Order**: `id`, `customerId`, `items[]`, `paymentStatus`, `fulfillmentStatus`, `trackingCode`.
*   **Supplier**: `id`, `name`, `apiEndpoint`, `syncFrequency`.

## 5. INTEGRATION_ARCHITECTURE (Mocked)
*   **Supplier Sync**: Simulated async functions in `productService.ts`.
*   **Cart Persistence**: `localStorage` mirroring in `CartContext.tsx`.
*   **Routing**: `react-router-dom` (HashRouter) for client-side transitions without server config.

## 6. RISKS & TRADEOFFS
*   **Client-Side Mocking**: For this demo, logic resides in the client. A real implementation would move the "Service Layer" to a Node.js backend to protect API keys and handle heavy logic.
*   **SEO**: A standard SPA has SEO challenges. Production version would use Next.js (SSR) for the Storefront.

## 7. NEXT_PHASE_SUGGESTION
The next phase should focus on the **Backend Implementation**:
1.  Migration of `services/` to a Node.js/Express API.
2.  Integration with a real Database (PostgreSQL).
3.  Connection to Stripe for actual payments.
