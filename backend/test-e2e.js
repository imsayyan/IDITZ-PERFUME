// Automated End-to-End Test Suite for IDITZ PERFUME
const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING COMPREHENSIVE END-TO-END TEST SUITE');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    assert(health.status === 'ok' && health.brand.includes('IDITZ'), 'API health check responded with status: ok and brand: IDITZ');

    // 2. Public Settings
    const settingsRes = await fetch(`${API_BASE}/settings`);
    const settingsData = await settingsRes.json();
    assert(settingsData.settings?.brand_name === 'IDITZ PERFUME', 'Public settings returns IDITZ PERFUME brand name');

    // 3. Products List & Filtering
    const productsRes = await fetch(`${API_BASE}/products`);
    const productsData = await productsRes.json();
    assert(productsData.products?.length >= 5, `Retrieved ${productsData.products?.length} perfumes in public catalog`);

    // Test gender filter
    const menRes = await fetch(`${API_BASE}/products?gender=men`);
    const menData = await menRes.json();
    assert(menData.products.every(p => p.gender === 'men'), 'Gender filter correctly returns only Mens perfumes');

    // 4. Product Details by Slug
    const targetProduct = productsData.products[0];
    const targetRes = await fetch(`${API_BASE}/products/${targetProduct.slug}`);
    const targetData = await targetRes.json();
    assert(targetData.product?.id === targetProduct.id, `Product by slug fetched correctly: ${targetData.product?.name}`);

    const initialStock = targetData.product.stock_quantity;
    console.log(`ℹ️ Initial stock for product ${targetData.product.id} (${targetData.product.name}): ${initialStock}`);

    // 5. Coupon Validation
    const validCouponRes = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'IDITZ10', cartTotal: 3999 })
    });
    const validCoupon = await validCouponRes.json();
    assert(validCoupon.valid === true && validCoupon.calculatedDiscount === 400, 'Coupon IDITZ10 gives valid 10% discount');

    const invalidCouponRes = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FAKEDISCOUNT', cartTotal: 3999 })
    });
    assert(invalidCouponRes.status === 404, 'Invalid coupon rejected with 404 status');

    // 6. Customer Checkout & Atomic Stock Reduction
    const orderPayload = {
      customer_name: 'Rajeshwar Pratap',
      customer_email: 'rajeshwar@pratapestate.in',
      customer_phone: '9811122233',
      shipping_address: '7 Civil Lines, Near Raj Mandir',
      apartment: 'Pratap Haveli',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      payment_method: 'COD',
      coupon_code: 'IDITZ10',
      items: [
        {
          product_id: targetData.product.id,
          product_name: targetData.product.name,
          quantity: 1,
          size: targetData.product.size || '100ml'
        }
      ]
    };

    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201 && orderData.order?.order_number?.startsWith('IDITZ-2026-'), `Order placed successfully with ID: ${orderData.order?.order_number}`);

    // Verify stock decrement
    const recheckedRes = await fetch(`${API_BASE}/products/${targetProduct.slug}`);
    const recheckedData = await recheckedRes.json();
    const newStock = recheckedData.product.stock_quantity;
    assert(newStock === initialStock - 1, `Product stock decremented accurately: ${initialStock} -> ${newStock}`);

    // 7. Admin Authentication & Token Verification
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nooreparfums.com', password: 'NooreAdmin@2026' })
    });
    const loginData = await loginRes.json();
    assert(loginData.token && loginData.user?.role === 'superadmin', 'Admin login succeeded with JWT token');

    const adminToken = loginData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    };

    // 8. Admin Dashboard Metrics
    const dashRes = await fetch(`${API_BASE}/dashboard`, { headers: authHeaders });
    const dashData = await dashRes.json();
    assert(dashData.metrics?.totalOrders > 0, `Admin Dashboard reports ${dashData.metrics.totalOrders} total orders & revenue ₹${dashData.metrics.totalRevenue}`);

    // 9. Admin Order Status Pipeline Update
    const orderId = orderData.order.id;
    const statusUpdateRes = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ order_status: 'Confirmed' })
    });
    const statusUpdated = await statusUpdateRes.json();
    assert(statusUpdated.order?.order_status === 'Confirmed', 'Admin successfully updated order status to Confirmed');

    // 10. Admin Product Creation, Edit & Deletion (CRUD)
    const newPerfume = {
      name: 'Jaisalmer Royal Sandal & Amber',
      sku: 'IDZ-JSA-99',
      category_name: 'Unisex Perfumes',
      gender: 'unisex',
      fragrance_family: 'Woody',
      price: 4799,
      mrp: 5999,
      size: '100ml',
      stock_quantity: 25,
      short_description: 'Golden desert sands, roasted saffron, and Mysore sandalwood.',
      full_description: 'A tribute to the golden fortress of Jaisalmer at sunset.',
      images: ['/images/perfumes/mysore-sandalwood-cardamom.svg'],
      is_active: 1
    };

    const createProductRes = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(newPerfume)
    });
    const createdProduct = await createProductRes.json();
    assert(createProductRes.status === 201 && createdProduct.product?.id, `Created test perfume: ${createdProduct.product?.name}`);

    // Verify it appears in public catalog
    const checkPublicNew = await fetch(`${API_BASE}/products?search=Jaisalmer`);
    const checkPublicData = await checkPublicNew.json();
    assert(checkPublicData.products?.length === 1, 'Newly created perfume instantly appears on customer storefront');

    // Clean up created test perfume
    const deleteRes = await fetch(`${API_BASE}/admin/products/${createdProduct.product.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200, 'Test perfume successfully cleaned up / deleted by admin');

    console.log('====================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================');

    if (failed === 0) {
      console.log('🎉 ALL BACKEND & FRONTEND INTEGRATION TESTS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exit(1);
  }
}

runTests();
