import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

// Ensure data directory exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// If target DB path doesn't exist yet, preserve existing data from default database
const defaultDbPath = path.resolve(process.cwd(), 'backend/data/noore.db');
if (!fs.existsSync(config.dbPath) && fs.existsSync(defaultDbPath) && path.resolve(config.dbPath) !== path.resolve(defaultDbPath)) {
  try {
    fs.copyFileSync(defaultDbPath, config.dbPath);
    console.log('Preserved existing database data into persistent path:', config.dbPath);
  } catch (copyErr) {
    console.warn('Notice: Could not copy initial database file:', copyErr.message);
  }
}

// Ensure uploads directory exists
if (!fs.existsSync(config.uploadsPath)) {
  fs.mkdirSync(config.uploadsPath, { recursive: true });
}

const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(config.dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', config.dbPath);
  }
});

// Promisified DB helpers
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const initDb = async () => {
  // Foreign keys enabled
  await dbRun('PRAGMA foreign_keys = ON;');

  // Admin users
  await dbRun(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Categories
  await dbRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Products
  await dbRun(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      category_id INTEGER,
      category_name TEXT,
      gender TEXT NOT NULL, -- men, women, unisex
      fragrance_family TEXT NOT NULL, -- Oud, Woody, Floral, Fresh, Citrus, Amber, Musk, Vanilla, Spicy
      price REAL NOT NULL,
      mrp REAL NOT NULL,
      discount REAL DEFAULT 0,
      size TEXT DEFAULT '100ml',
      stock_quantity INTEGER DEFAULT 0,
      short_description TEXT,
      full_description TEXT,
      top_notes TEXT,
      heart_notes TEXT,
      base_notes TEXT,
      longevity TEXT,
      occasion TEXT,
      images TEXT, -- JSON array of image URLs
      is_featured INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_new_arrival INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      rating REAL DEFAULT 4.8,
      reviews_count INTEGER DEFAULT 18,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Coupons
  await dbRun(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL, -- percentage or fixed
      discount_amount REAL NOT NULL,
      min_order_value REAL DEFAULT 0,
      expiry_date TEXT,
      usage_limit INTEGER DEFAULT 1000,
      times_used INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Customers
  await dbRun(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      total_orders INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      last_order_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Orders
  await dbRun(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      apartment TEXT,
      area TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      payment_method TEXT NOT NULL, -- COD, ONLINE
      payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
      order_status TEXT DEFAULT 'Pending', -- Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered, Cancelled
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      shipping_fee REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      coupon_code TEXT,
      notes TEXT,
      payment_gateway TEXT,
      gateway_order_id TEXT,
      gateway_payment_id TEXT,
      gateway_signature TEXT,
      payment_verified_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migration for payment gateway columns if existing table doesn't have them
  try {
    const orderCols = await dbAll('PRAGMA table_info(orders)');
    const colNames = orderCols.map(c => c.name);
    if (!colNames.includes('payment_gateway')) {
      await dbRun('ALTER TABLE orders ADD COLUMN payment_gateway TEXT');
    }
    if (!colNames.includes('gateway_order_id')) {
      await dbRun('ALTER TABLE orders ADD COLUMN gateway_order_id TEXT');
    }
    if (!colNames.includes('gateway_payment_id')) {
      await dbRun('ALTER TABLE orders ADD COLUMN gateway_payment_id TEXT');
    }
    if (!colNames.includes('gateway_signature')) {
      await dbRun('ALTER TABLE orders ADD COLUMN gateway_signature TEXT');
    }
    if (!colNames.includes('payment_verified_at')) {
      await dbRun('ALTER TABLE orders ADD COLUMN payment_verified_at DATETIME');
    }
  } catch (e) {
    console.warn('Orders table migration check notice:', e.message);
  }

  // Order Items
  await dbRun(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_sku TEXT,
      product_image TEXT,
      size TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // Store Settings
  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
};
