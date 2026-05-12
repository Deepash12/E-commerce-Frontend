# LUXE Shop — E-Commerce Frontend

A production-ready, luxury-themed e-commerce frontend built with **React 18 + TypeScript + Vite + Tailwind CSS**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Forms | React Hook Form + Yup |
| HTTP | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |

## Prerequisites

- **Node.js** ≥ 18
- Backend running at `http://localhost:8080`

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Type check + build for production
npm run build
```

Open **http://localhost:3000** in your browser.

## Features

### Authentication
- Register with validated phone (10-digit, starts 6-9) and email
- JWT login with persistent token storage
- Logout with server-side token blacklisting
- Forgot password / Reset password flow

### Product Catalog
- Browse with keyword search, price range filters, sort
- Paginated product grid
- Product detail page with quantity selector
- Wishlist toggle from grid and detail

### Shopping Cart
- Add/update/remove items
- Real-time grand total
- Quantity controls with +/- buttons

### Checkout Flow
- Address selection (up to 5 addresses)
- Add new address with full validation
- Place order → redirect to payment

### Payments
- 4 payment methods: Card, UPI, NetBanking, COD
- Initiate payment → get transaction ID → complete
- Mock gateway integration

### Orders
- Order history with expandable details
- Cancel PENDING/CONFIRMED orders
- Status badges: Pending, Confirmed, Shipped, Delivered, Cancelled

### Wishlist
- Save/remove products
- Add wishlist items directly to cart

### Coupons
- View active coupons with copy-to-clipboard
- Apply coupon codes manually

### Admin Panel
- Product CRUD (Create, Read, Update, Delete)
- Paginated product table
- Role-gated route (ADMIN only)

## Project Structure

```
src/
├── api/
│   ├── client.ts       # Axios instance with JWT interceptors
│   └── services.ts     # All API service functions
├── components/
│   ├── address/        # AddressForm component
│   ├── auth/           # ProtectedRoute, AdminRoute
│   ├── layout/         # Navbar
│   └── ui/             # Spinner, Modal, Pagination, Field, etc.
├── context/
│   ├── AuthContext.tsx  # Global auth state
│   └── CartContext.tsx  # Global cart state
├── pages/              # All page components
├── types/              # TypeScript interfaces
├── utils/              # Helpers: formatPrice, formatDate, cn
└── main.tsx            # App entry point
```

## Environment

The API base URL is configured in `src/api/client.ts`:
```ts
const BASE_URL = 'http://localhost:8080/api';
```

Change this to point to your backend server.

## Design System

- **Fonts**: Playfair Display (display) + DM Sans (body)
- **Palette**: Obsidian dark scale + Gold accent (`gold-400`)
- **Component classes**: `.btn`, `.input`, `.card`, `.badge`, `.label` etc.
- **Animation**: `animate-fade-up`, `animate-fade-in`, `animate-slide-in`

