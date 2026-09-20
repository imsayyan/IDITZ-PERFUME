import { dbAll, dbGet, dbRun } from '../database/db.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const coupon = await dbGet('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?)', [code.trim()]);
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (!coupon.is_active) {
      return res.status(400).json({ error: 'This coupon is no longer active' });
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({ error: 'This coupon has expired' });
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit has been reached' });
    }

    const subtotal = Number(cartTotal || 0);
    if (coupon.min_order_value && subtotal < coupon.min_order_value) {
      return res.status(400).json({
        error: `Minimum order value of ₹${coupon.min_order_value.toLocaleString('en-IN')} required for this coupon.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * coupon.discount_amount) / 100);
    } else {
      discount = Math.min(coupon.discount_amount, subtotal);
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_amount: coupon.discount_amount,
      calculatedDiscount: discount,
      message: `Coupon applied: ₹${discount.toLocaleString('en-IN')} saved!`
    });
  } catch (err) {
    console.error('validateCoupon error:', err);
    return res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await dbAll('SELECT * FROM coupons ORDER BY id DESC');
    return res.json({ coupons });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discount_type, discount_amount, min_order_value, expiry_date, usage_limit, is_active } = req.body;

    if (!code || !discount_amount || !discount_type) {
      return res.status(400).json({ error: 'Code, discount type, and amount are required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await dbGet('SELECT id FROM coupons WHERE code = ?', [cleanCode]);
    if (existing) {
      return res.status(400).json({ error: 'A coupon with this code already exists' });
    }

    const result = await dbRun(`
      INSERT INTO coupons (code, discount_type, discount_amount, min_order_value, expiry_date, usage_limit, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      cleanCode,
      discount_type,
      Number(discount_amount),
      Number(min_order_value || 0),
      expiry_date || null,
      Number(usage_limit || 1000),
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    const created = await dbGet('SELECT * FROM coupons WHERE id = ?', [result.lastID]);
    return res.status(201).json({ message: 'Coupon created successfully', coupon: created });
  } catch (err) {
    console.error('createCoupon error:', err);
    return res.status(500).json({ error: 'Failed to create coupon' });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_type, discount_amount, min_order_value, expiry_date, usage_limit, is_active } = req.body;

    const existing = await dbGet('SELECT * FROM coupons WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    await dbRun(`
      UPDATE coupons SET
        code = ?,
        discount_type = ?,
        discount_amount = ?,
        min_order_value = ?,
        expiry_date = ?,
        usage_limit = ?,
        is_active = ?
      WHERE id = ?
    `, [
      code ? code.trim().toUpperCase() : existing.code,
      discount_type || existing.discount_type,
      discount_amount !== undefined ? Number(discount_amount) : existing.discount_amount,
      min_order_value !== undefined ? Number(min_order_value) : existing.min_order_value,
      expiry_date !== undefined ? expiry_date : existing.expiry_date,
      usage_limit !== undefined ? Number(usage_limit) : existing.usage_limit,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    ]);

    const updated = await dbGet('SELECT * FROM coupons WHERE id = ?', [id]);
    return res.json({ message: 'Coupon updated successfully', coupon: updated });
  } catch (err) {
    console.error('updateCoupon error:', err);
    return res.status(500).json({ error: 'Failed to update coupon' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM coupons WHERE id = ?', [id]);
    return res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete coupon' });
  }
};
