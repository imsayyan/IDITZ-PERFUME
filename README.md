# NOORÉ PARFUMS — Artisanal Luxury Indian Fragrance E-Commerce

A complete, production-ready luxury Indian perfume e-commerce store and dedicated administrative management suite built with **React**, **Vite**, **Tailwind CSS**, **Node.js / Express**, and **SQLite**.

---

## Brand Identity & Aesthetic Direction

- **Brand**: NOORÉ PARFUMS (Haute Parfumerie • India)
- **Positioning**: Modern Indian luxury fragrance house celebrating indigenous botanicals (Assam Wild Agarwood, Kannauj Hydro-Distilled Rose, Kashmiri Saffron, and Mysore Sandalwood).
- **Aesthetic**: Deep luxury obsidian & charcoal (`#0F0E0E`), warm ivory/linen (`#FAF8F5`), polished warm gold & champagne brass accents (`#C5A880`, `#D4AF37`), fine typography (*Cinzel*, *Playfair Display*, *Plus Jakarta Sans*), generous whitespace, and realistic perfume flacon presentation.
- **Currency**: Indian Rupee (₹ INR) displayed uniformly across the store, cart, checkout, invoices, and admin portal.

---

## Project Architecture

```
d:/Photo/Perfume 19/
├── backend/
│   ├── data/
│   │   └── noore.db          # SQLite Database (Products, Orders, Customers, Coupons, Inventory, Settings)
│   ├── uploads/              # Uploaded perfume flacon photography assets
│   ├── src/
│   │   ├── config/           # Database paths, JWT secrets, environment
│   │   ├── database/         # SQLite schema migrations & Indian perfume seed data
│   │   ├── middleware/       # JWT Auth guard & Multer image upload
│   │   ├── controllers/      # Products, Orders, Customers, Coupons, Inventory, Settings, Dashboard
│   │   ├── routes/           # Express REST API routes (/api/*)
│   │   └── server.js         # Express server entrypoint (Port 5000)
│   ├── test-e2e.js           # Automated end-to-end integration test suite
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   ├── images/perfumes/  # High-fidelity realistic perfume flacons (Assam Oud, Kashmir Saffron, Kannauj Rose, etc.)
    │   ├── favicon.svg       # Luxury branded monogram favicon
    │   └── robots.txt        # SEO crawler directives
    ├── src/
    │   ├── admin/            # Administrative suite: Dashboard, Products CRUD, Orders pipeline,
    │   │                     # Customers directory, Coupons manager, Vault Inventory, Store Settings
    │   ├── components/       # Header, Footer, Hero, ProductCard, QuickView, CartDrawer, TrustBadges, etc.
    │   ├── context/          # CartContext, WishlistContext, SettingsContext, AuthContext
    │   ├── pages/            # Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation, About, Contact, Policies
    │   ├── services/         # Unified API client service (api.js)
    │   ├── App.jsx           # React Router setup
    │   ├── index.css         # Tailwind CSS & custom luxury utility classes
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Credentials & Access

### Customer Boutique
- **URL**: [http://localhost:5173](http://localhost:5173)
- Features: Live search, Olfactory family filter, Size selection, Wishlist, Slide-over Cart Drawer with Free Shipping meter, Indian Checkout (28 States + UTs, 6-digit PIN code, COD & Online payments), Order Confirmation with receipt printing.

### Administrator Portal
- **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Admin Email**: `admin@nooreparfums.com`
- **Admin Password**: `NooreAdmin@2026`
- Features:
  - **Dashboard**: Real-time revenue (₹), order counters, low stock alerts, top selling flacons.
  - **Products**: Add, edit, delete, activate/deactivate, toggle featured/bestseller, upload flacon imagery.
  - **Orders**: Full pipeline status management (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Out for Delivery` → `Delivered` / `Cancelled`).
  - **Inventory**: Real-time stock tracking with one-click increment/decrement (+10, +5, -1) and threshold alerts.
  - **Customers**: Patron lifetime spending, order counts, and historical order inspection.
  - **Coupons**: Create percentage or flat INR discounts with minimum order thresholds and expiry limits.
  - **Store Settings**: Dynamically update Brand Name, Tagline, Phone, Email, WhatsApp number, Shipping threshold, and Announcement banner without restarting the server!

---

## Running the Project

### 1. Start Backend Server
```powershell
cd "d:\Photo\Perfume 19\backend"
npm start
# Runs on http://localhost:5000
```

### 2. Start Frontend Application
```powershell
cd "d:\Photo\Perfume 19\frontend"
npm run dev
# Runs on http://localhost:5173
```

### 3. Run Automated E2E Verification Tests
```powershell
cd "d:\Photo\Perfume 19\backend"
node test-e2e.js
# Runs 16 automated tests covering product catalog, checkout, stock reduction, and admin flows.
```

---

## Active Launch Coupons
- `NOORE10`: 10% off orders above ₹1,499
- `FIRSTBUY`: Flat ₹500 off orders above ₹2,499
- `ROYAL15`: 15% off orders above ₹4,999
