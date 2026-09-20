import { dbAll, dbGet } from '../database/db.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const totalProducts = await dbGet('SELECT COUNT(*) as count FROM products');
    const totalOrders = await dbGet('SELECT COUNT(*) as count FROM orders');
    const pendingOrders = await dbGet("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('Pending', 'Processing')");
    const completedOrders = await dbGet("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Delivered'");
    const totalCustomers = await dbGet('SELECT COUNT(*) as count FROM customers');
    const revenueData = await dbGet("SELECT SUM(total_amount) as total FROM orders WHERE order_status != 'Cancelled'");
    const lowStock = await dbGet('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 10');

    // Recent orders
    const recentOrders = await dbAll(`
      SELECT id, order_number, customer_name, total_amount, payment_method, order_status, created_at
      FROM orders
      ORDER BY id DESC
      LIMIT 6
    `);

    // Top selling perfumes
    const topSelling = await dbAll(`
      SELECT product_id, product_name, SUM(quantity) as units_sold, SUM(total) as revenue, product_image
      FROM order_items
      GROUP BY product_id
      ORDER BY units_sold DESC
      LIMIT 5
    `);

    return res.json({
      metrics: {
        totalProducts: totalProducts.count || 0,
        totalOrders: totalOrders.count || 0,
        pendingOrders: pendingOrders.count || 0,
        completedOrders: completedOrders.count || 0,
        totalCustomers: totalCustomers.count || 0,
        totalRevenue: revenueData.total || 0,
        lowStockProducts: lowStock.count || 0
      },
      recentOrders,
      topSelling
    });
  } catch (err) {
    console.error('getDashboardMetrics error:', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};
