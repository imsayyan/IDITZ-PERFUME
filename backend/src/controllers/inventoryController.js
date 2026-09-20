import { dbAll, dbGet, dbRun } from '../database/db.js';

export const getInventory = async (req, res) => {
  try {
    const { lowStockOnly, search } = req.query;
    let query = `
      SELECT id, name, sku, category_name, price, stock_quantity, is_active, images
      FROM products
      WHERE 1=1
    `;
    const params = [];

    if (lowStockOnly === 'true') {
      query += ' AND stock_quantity <= 10';
    }

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY stock_quantity ASC, id ASC';
    const rows = await dbAll(query, params);

    const inventory = rows.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : r.images,
      isLowStock: r.stock_quantity <= 10,
      isOutOfStock: r.stock_quantity === 0
    }));

    const lowStockCount = await dbGet('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 10');
    const outOfStockCount = await dbGet('SELECT COUNT(*) as count FROM products WHERE stock_quantity = 0');
    const totalUnits = await dbGet('SELECT SUM(stock_quantity) as count FROM products');

    return res.json({
      inventory,
      summary: {
        totalProducts: inventory.length,
        lowStockCount: lowStockCount.count,
        outOfStockCount: outOfStockCount.count,
        totalUnitsInStock: totalUnits.count || 0
      }
    });
  } catch (err) {
    console.error('getInventory error:', err);
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, adjustment } = req.body;

    const product = await dbGet('SELECT id, name, stock_quantity FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let newStock = product.stock_quantity;
    if (quantity !== undefined) {
      newStock = Math.max(0, Number(quantity));
    } else if (adjustment !== undefined) {
      newStock = Math.max(0, newStock + Number(adjustment));
    }

    await dbRun('UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStock, id]);
    return res.json({
      message: 'Stock updated successfully',
      productId: id,
      newStock
    });
  } catch (err) {
    console.error('updateStock error:', err);
    return res.status(500).json({ error: 'Failed to update stock' });
  }
};
