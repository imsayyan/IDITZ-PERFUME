const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper for authorized headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('noore_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Public Store APIs
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch store settings');
    return res.json();
  },

  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductBySlug(slug) {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async validateCoupon(code, cartTotal) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid coupon code');
    return data;
  },

  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async verifyPayment(orderId, paymentData) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment verification failed');
    return data;
  },

  async recordPaymentFailure(orderId, failureData) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/payment-failed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(failureData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to record payment failure');
    return data;
  },

  async getPaymentConfig() {
    const res = await fetch(`${API_BASE}/payment/config`);
    if (!res.ok) throw new Error('Failed to fetch payment configuration');
    return res.json();
  },

  // Auth APIs
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  // Admin APIs
  async getDashboardMetrics() {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  },

  async getAdminProducts(params = {}) {
    const query = new URLSearchParams({ adminView: 'true', ...params });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },

  async getAdminProductById(id) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load product');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('noore_admin_token');
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload image');
    return data;
  },

  async uploadProductImages(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const token = localStorage.getItem('noore_admin_token');
    const res = await fetch(`${API_BASE}/admin/upload-multiple`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload images');
    return data;
  },

  async getAdminOrders(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json();
  },

  async updateOrderStatus(id, statusData) {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order');
    return data;
  },

  async getAdminCustomers(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/customers?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load customers');
    return res.json();
  },

  async getCustomerOrders(customerId) {
    const res = await fetch(`${API_BASE}/admin/customers/${customerId}/orders`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load customer orders');
    return res.json();
  },

  async getAdminCoupons() {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load coupons');
    return res.json();
  },

  async createCoupon(couponData) {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create coupon');
    return data;
  },

  async updateCoupon(id, couponData) {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update coupon');
    return data;
  },

  async deleteCoupon(id) {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
    return res.json();
  },

  async getAdminInventory(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/inventory?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load inventory');
    return res.json();
  },

  async updateInventoryStock(id, stockData) {
    const res = await fetch(`${API_BASE}/admin/inventory/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(stockData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update stock');
    return data;
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  }
};
