import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

// Storefront Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Policies } from './pages/Policies';

// Admin Suite Pages & Guard
import { ProtectedRoute } from './admin/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminProductForm } from './admin/AdminProductForm';
import { AdminOrders } from './admin/AdminOrders';
import { AdminInventory } from './admin/AdminInventory';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminCoupons } from './admin/AdminCoupons';
import { AdminSettings } from './admin/AdminSettings';

import { IntroAnimation } from './components/IntroAnimation';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <IntroAnimation />
              <Routes>
              {/* Public Customer Storefront */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/policies" element={<Policies />} />

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* Fallback 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  </ErrorBoundary>
  );
}

export default App;
