import { dbAll, dbGet } from '../database/db.js';

export const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY total_spent DESC, id DESC';
    const customers = await dbAll(query, params);

    return res.json({ customers, total: customers.length });
  } catch (err) {
    console.error('getAllCustomers error:', err);
    return res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await dbGet('SELECT * FROM customers WHERE id = ?', [id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const orders = await dbAll('SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC', [id]);
    for (const ord of orders) {
      ord.items = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [ord.id]);
    }

    return res.json({ customer, orders });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
};
