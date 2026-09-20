import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as couponController from '../controllers/couponController.js';
import * as customerController from '../controllers/customerController.js';
import * as inventoryController from '../controllers/inventoryController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// ================= PUBLIC STOREFRONT ROUTES =================
// Products
router.get('/products', productController.getProducts);
router.get('/products/:slug', productController.getProductBySlug);

// Orders & Payment
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders/:id/verify-payment', orderController.verifyPayment);
router.post('/orders/:id/payment-failed', orderController.recordPaymentFailure);
router.get('/payment/config', orderController.getPaymentConfig);

// Coupons
router.post('/coupons/validate', couponController.validateCoupon);

// Settings
router.get('/settings', settingsController.getSettings);

// Auth
router.post('/auth/login', authController.login);

// ================= PROTECTED ADMIN ROUTES =================
router.get('/auth/me', requireAdmin, authController.getMe);
router.get('/dashboard', requireAdmin, dashboardController.getDashboardMetrics);

// Admin Product Management
router.get('/admin/products/:id', requireAdmin, productController.getProductById);
router.post('/admin/products', requireAdmin, productController.createProduct);
router.put('/admin/products/:id', requireAdmin, productController.updateProduct);
router.delete('/admin/products/:id', requireAdmin, productController.deleteProduct);
router.post('/admin/upload', requireAdmin, upload.single('image'), productController.uploadImage);
router.post('/admin/upload-multiple', requireAdmin, upload.array('images', 12), productController.uploadMultipleImages);

// Admin Order Management
router.get('/admin/orders', requireAdmin, orderController.getAllOrders);
router.get('/admin/orders/:id', requireAdmin, orderController.getOrderById);
router.put('/admin/orders/:id/status', requireAdmin, orderController.updateOrderStatus);

// Admin Customer Management
router.get('/admin/customers', requireAdmin, customerController.getAllCustomers);
router.get('/admin/customers/:id/orders', requireAdmin, customerController.getCustomerOrders);

// Admin Coupon Management
router.get('/admin/coupons', requireAdmin, couponController.getAllCoupons);
router.post('/admin/coupons', requireAdmin, couponController.createCoupon);
router.put('/admin/coupons/:id', requireAdmin, couponController.updateCoupon);
router.delete('/admin/coupons/:id', requireAdmin, couponController.deleteCoupon);

// Admin Inventory Management
router.get('/admin/inventory', requireAdmin, inventoryController.getInventory);
router.put('/admin/inventory/:id', requireAdmin, inventoryController.updateStock);

// Admin Settings
router.put('/admin/settings', requireAdmin, settingsController.updateSettings);

// 404 for unhandled API routes
router.use((req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

export default router;
