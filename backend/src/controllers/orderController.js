import { dbAll, dbGet, dbRun } from '../database/db.js';
import { paymentService } from '../services/paymentService.js';

export const createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      apartment,
      area,
      city,
      state,
      pincode,
      payment_method,
      coupon_code,
      items,
      notes
    } = req.body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Please fill in all required shipping and contact details.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    // Phone number validation (Indian 10-digit check)
    const cleanPhone = customer_phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    // Pincode validation (Indian 6-digit check)
    const cleanPincode = pincode.replace(/[^0-9]/g, '');
    if (cleanPincode.length !== 6) {
      return res.status(400).json({ error: 'Please provide a valid 6-digit Indian PIN code.' });
    }

    // 1. Fetch DB prices & verify stock for each item
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await dbGet('SELECT * FROM products WHERE id = ?', [item.product_id || item.id]);
      if (!dbProduct) {
        return res.status(400).json({ error: `Perfume "${item.product_name || 'Item'}" is no longer available.` });
      }

      if (!dbProduct.is_active) {
        return res.status(400).json({ error: `Perfume "${dbProduct.name}" is currently unavailable.` });
      }

      const requestedQty = Number(item.quantity || 1);
      if (dbProduct.stock_quantity < requestedQty) {
        return res.status(400).json({
          error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock_quantity} remaining.`
        });
      }

      const itemTotal = dbProduct.price * requestedQty;
      calculatedSubtotal += itemTotal;

      let itemImage = '/images/perfumes/kashmir-saffron-amber.svg';
      if (dbProduct.images) {
        try {
          const parsed = JSON.parse(dbProduct.images);
          if (parsed && parsed.length > 0) itemImage = parsed[0];
        } catch (e) {
          // ignore
        }
      }

      verifiedItems.push({
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        product_sku: dbProduct.sku,
        product_image: itemImage,
        size: item.size || dbProduct.size || '100ml',
        price: dbProduct.price,
        quantity: requestedQty,
        total: itemTotal,
        current_stock: dbProduct.stock_quantity
      });
    }

    // 2. Fetch shipping settings
    const freeShippingThresholdSetting = await dbGet("SELECT value FROM settings WHERE key = 'free_shipping_threshold'");
    const shippingChargeSetting = await dbGet("SELECT value FROM settings WHERE key = 'shipping_charge'");
    
    const freeThreshold = freeShippingThresholdSetting ? Number(freeShippingThresholdSetting.value) : 999;
    const standardShipping = shippingChargeSetting ? Number(shippingChargeSetting.value) : 150;

    let shippingFee = calculatedSubtotal >= freeThreshold ? 0 : standardShipping;

    // 3. Process coupon if applied
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (coupon_code) {
      const coupon = await dbGet('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1', [coupon_code.trim()]);
      if (coupon) {
        const isNotExpired = !coupon.expiry_date || new Date(coupon.expiry_date) >= new Date();
        const meetsMinOrder = calculatedSubtotal >= (coupon.min_order_value || 0);
        const hasUsesLeft = coupon.usage_limit > coupon.times_used;

        if (isNotExpired && meetsMinOrder && hasUsesLeft) {
          appliedCouponCode = coupon.code;
          if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round((calculatedSubtotal * coupon.discount_amount) / 100);
          } else {
            discountAmount = Math.min(coupon.discount_amount, calculatedSubtotal);
          }
        }
      }
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // 4. Generate unique Indian luxury order number: e.g. IDITZ-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `IDITZ-2026-${randomSuffix}`;

    // 5. Upsert Customer Record
    let customer = await dbGet('SELECT id, total_orders, total_spent FROM customers WHERE email = ?', [customer_email.trim().toLowerCase()]);
    let customerId = null;

    if (customer) {
      customerId = customer.id;
      await dbRun(`
        UPDATE customers SET
          full_name = ?,
          phone = ?,
          address = ?,
          city = ?,
          state = ?,
          pincode = ?,
          total_orders = total_orders + 1,
          total_spent = total_spent + ?,
          last_order_date = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [customer_name, customer_phone, shipping_address, city, state, pincode, finalTotal, customerId]);
    } else {
      const newCust = await dbRun(`
        INSERT INTO customers (full_name, email, phone, address, city, state, pincode, total_orders, total_spent, last_order_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
      `, [customer_name, customer_email.trim().toLowerCase(), customer_phone, shipping_address, city, state, pincode, finalTotal]);
      customerId = newCust.lastID;
    }

    // 6. Insert Order
    const chosenPaymentMethod = (payment_method || 'COD').toUpperCase();
    const isOnlinePayment = chosenPaymentMethod === 'ONLINE';

    // Status: For COD -> 'Pending', for ONLINE -> 'Payment Pending'
    const initialOrderStatus = isOnlinePayment ? 'Payment Pending' : 'Pending';
    const initialPaymentStatus = isOnlinePayment ? 'pending_payment' : 'pending';

    const orderResult = await dbRun(`
      INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        shipping_address, apartment, area, city, state, pincode,
        payment_method, payment_status, order_status,
        subtotal, discount, shipping_fee, total_amount, coupon_code, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNumber,
      customerId,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      apartment || '',
      area || '',
      city,
      state,
      pincode,
      chosenPaymentMethod,
      initialPaymentStatus,
      initialOrderStatus,
      calculatedSubtotal,
      discountAmount,
      shippingFee,
      finalTotal,
      appliedCouponCode,
      notes || ''
    ]);

    const orderId = orderResult.lastID;

    // 7. Insert Order Items
    for (const item of verifiedItems) {
      await dbRun(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_sku, product_image, size, price, quantity, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderId,
        item.product_id,
        item.product_name,
        item.product_sku,
        item.product_image,
        item.size,
        item.price,
        item.quantity,
        item.total
      ]);

      // ONLY for Cash on Delivery (COD), decrement stock immediately!
      // For ONLINE orders, inventory will ONLY be decremented AFTER cryptographic payment verification!
      if (!isOnlinePayment) {
        await dbRun(`
          UPDATE products SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?
        `, [item.quantity, item.product_id]);
      }
    }

    // 8. Update coupon times used if applied (only for COD immediately; for ONLINE, upon verification)
    if (!isOnlinePayment && appliedCouponCode) {
      await dbRun('UPDATE coupons SET times_used = times_used + 1 WHERE code = ?', [appliedCouponCode]);
    }

    // Fetch complete placed order
    const createdOrder = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
    const orderItems = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    // If ONLINE payment, initialize payment gateway order session
    if (isOnlinePayment) {
      const gatewaySession = await paymentService.createGatewayOrder({
        orderId,
        orderNumber,
        amount: finalTotal,
        currency: 'INR',
        customer: {
          name: customer_name,
          email: customer_email,
          phone: customer_phone
        }
      });

      await dbRun(
        'UPDATE orders SET gateway_order_id = ?, payment_gateway = ? WHERE id = ?',
        [gatewaySession.gateway_order_id, gatewaySession.provider, orderId]
      );

      return res.status(201).json({
        message: 'Order initiated. Please complete payment via gateway.',
        order: {
          ...createdOrder,
          gateway_order_id: gatewaySession.gateway_order_id,
          payment_gateway: gatewaySession.provider,
          items: orderItems
        },
        gatewaySession
      });
    }

    // COD order placed successfully
    return res.status(201).json({
      message: 'Order placed successfully',
      order: {
        ...createdOrder,
        items: orderItems
      }
    });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND order_status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const orders = await dbAll(query, params);

    // Fetch items for each order
    for (const ord of orders) {
      ord.items = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [ord.id]);
    }

    const totalCount = await dbGet('SELECT COUNT(*) as count FROM orders');
    const pendingCount = await dbGet("SELECT COUNT(*) as count FROM orders WHERE LOWER(order_status) = 'pending'");

    return res.json({
      orders,
      total: totalCount.count,
      pending_count: pendingCount ? pendingCount.count : 0
    });
  } catch (err) {
    console.error('getAllOrders error:', err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await dbGet('SELECT * FROM orders WHERE id = ? OR order_number = ?', [id, id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.items = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    return res.json({ order });
  } catch (err) {
    console.error('getOrderById error:', err);
    return res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If transitioning to Cancelled and wasn't cancelled before, restore stock
    if (order_status === 'Cancelled' && order.order_status !== 'Cancelled') {
      const items = await dbAll('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id]);
      for (const item of items) {
        await dbRun('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [item.quantity, item.product_id]);
      }
    }

    await dbRun(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        payment_status = COALESCE(?, payment_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [order_status || null, payment_status || null, id]);

    const updated = await dbGet('SELECT * FROM orders WHERE id = ?', [id]);
    updated.items = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [id]);

    const pendingCount = await dbGet("SELECT COUNT(*) as count FROM orders WHERE LOWER(order_status) = 'pending'");

    return res.json({
      message: 'Order status updated successfully',
      order: updated,
      pending_count: pendingCount ? pendingCount.count : 0
    });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};

/**
 * Cryptographic Payment Gateway Verification
 * Verifies gateway signature before marking order as paid and reducing inventory.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      gateway_order_id,
      gateway_payment_id,
      gateway_signature,
      payment_gateway = 'razorpay'
    } = req.body;

    if (!gateway_order_id || !gateway_payment_id || !gateway_signature) {
      return res.status(400).json({
        error: 'Missing required payment verification parameters (gateway_order_id, gateway_payment_id, gateway_signature).'
      });
    }

    const order = await dbGet('SELECT * FROM orders WHERE id = ? OR order_number = ?', [id, id]);
    if (!order) {
      return res.status(404).json({ error: 'Order record not found.' });
    }

    if (order.payment_status === 'paid') {
      order.items = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return res.json({
        success: true,
        message: 'Order is already marked as paid and confirmed.',
        order
      });
    }

    if (order.payment_method !== 'ONLINE') {
      return res.status(400).json({ error: 'This order was not configured for online payment gateway verification.' });
    }

    // Cryptographically verify HMAC SHA256 payment signature
    const isValid = paymentService.verifyPaymentSignature({
      gateway_order_id,
      gateway_payment_id,
      gateway_signature
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: Invalid cryptographic signature. Order will NOT be marked as paid and inventory will NOT be reduced.'
      });
    }

    // ONLY after verified: Decrement stock
    const orderItems = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    for (const item of orderItems) {
      await dbRun(
        'UPDATE products SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Increment coupon usage if applied
    if (order.coupon_code) {
      await dbRun('UPDATE coupons SET times_used = times_used + 1 WHERE code = ?', [order.coupon_code]);
    }

    // Update customer spend stats
    if (order.customer_id) {
      await dbRun(`
        UPDATE customers SET
          total_orders = total_orders + 1,
          total_spent = total_spent + ?,
          last_order_date = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [order.total_amount, order.customer_id]);
    }

    // Mark order as PAID and CONFIRMED
    await dbRun(`
      UPDATE orders SET
        payment_status = 'paid',
        order_status = 'Confirmed',
        payment_gateway = ?,
        gateway_order_id = ?,
        gateway_payment_id = ?,
        gateway_signature = ?,
        payment_verified_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      payment_gateway,
      gateway_order_id,
      gateway_payment_id,
      gateway_signature,
      order.id
    ]);

    const updatedOrder = await dbGet('SELECT * FROM orders WHERE id = ?', [order.id]);
    updatedOrder.items = orderItems;

    return res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order: updatedOrder
    });
  } catch (err) {
    console.error('verifyPayment error:', err);
    return res.status(500).json({ error: 'Failed to verify payment.' });
  }
};

/**
 * Payment Failure or Cancellation Handler
 * Marks status as failed without touching inventory.
 */
export const recordPaymentFailure = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Payment cancelled or declined by customer bank' } = req.body;

    const order = await dbGet('SELECT * FROM orders WHERE id = ? OR order_number = ?', [id, id]);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.payment_status === 'pending_payment') {
      await dbRun(`
        UPDATE orders SET
          payment_status = 'failed',
          order_status = 'Payment Failed',
          notes = COALESCE(notes || ' | ', '') || 'Payment Failed: ' || ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [reason, order.id]);
    }

    return res.json({
      success: true,
      message: 'Payment failure recorded. Inventory has NOT been reduced.'
    });
  } catch (err) {
    console.error('recordPaymentFailure error:', err);
    return res.status(500).json({ error: 'Failed to record payment failure.' });
  }
};

/**
 * Public Payment Configuration (Safe public credentials)
 */
export const getPaymentConfig = (req, res) => {
  return res.json({
    config: paymentService.getPublicConfig()
  });
};
