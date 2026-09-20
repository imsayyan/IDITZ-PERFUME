import { dbAll, dbGet, dbRun } from '../database/db.js';

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      gender,
      fragrance_family,
      minPrice,
      maxPrice,
      inStock,
      is_featured,
      is_bestseller,
      is_new_arrival,
      sortBy,
      adminView
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Filter out inactive products unless admin
    if (adminView !== 'true') {
      query += ' AND is_active = 1';
    }

    if (search) {
      query += ' AND (name LIKE ? OR short_description LIKE ? OR top_notes LIKE ? OR heart_notes LIKE ? OR base_notes LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    if (gender && gender !== 'all') {
      query += ' AND gender = ?';
      params.push(gender.toLowerCase());
    }

    if (category && category !== 'all') {
      query += ' AND (category_name LIKE ? OR slug LIKE ?)';
      params.push(`%${category}%`, `%${category}%`);
    }

    if (fragrance_family && fragrance_family !== 'all') {
      query += ' AND LOWER(fragrance_family) = LOWER(?)';
      params.push(fragrance_family);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (inStock === 'true' || inStock === '1') {
      query += ' AND stock_quantity > 0';
    }

    if (is_featured === 'true' || is_featured === '1') {
      query += ' AND is_featured = 1';
    }

    if (is_bestseller === 'true' || is_bestseller === '1') {
      query += ' AND is_bestseller = 1';
    }

    if (is_new_arrival === 'true' || is_new_arrival === '1') {
      query += ' AND is_new_arrival = 1';
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'name':
        query += ' ORDER BY name ASC';
        break;
      case 'newest':
      default:
        query += ' ORDER BY id DESC';
        break;
    }

    const rows = await dbAll(query, params);
    
    // Parse JSON images
    const products = rows.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : r.images
    }));

    return res.json({ products, total: products.length });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await dbGet('SELECT * FROM products WHERE slug = ? OR id = ?', [slug, slug]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images;

    // Fetch related products (same family or category, excluding self)
    const related = await dbAll(
      'SELECT id, name, slug, price, mrp, discount, fragrance_family, gender, size, rating, images FROM products WHERE id != ? AND (fragrance_family = ? OR gender = ?) AND is_active = 1 LIMIT 4',
      [product.id, product.fragrance_family, product.gender]
    );

    const parsedRelated = related.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : r.images
    }));

    return res.json({ product, relatedProducts: parsedRelated });
  } catch (err) {
    console.error('getProductBySlug error:', err);
    return res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images;
    return res.json({ product });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category_name,
      gender = 'unisex',
      fragrance_family,
      price,
      mrp,
      size = '100ml',
      stock_quantity = 0,
      short_description,
      full_description,
      top_notes,
      heart_notes,
      base_notes,
      longevity,
      occasion,
      images,
      is_featured,
      is_bestseller,
      is_new_arrival,
      is_active
    } = req.body;

    if (!name || price === undefined || price === null || !sku) {
      return res.status(400).json({ error: 'Perfume Name, SKU and Retail Price are required' });
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const parsedPrice = Number(price);
    const parsedMrp = mrp !== undefined && mrp !== '' ? Number(mrp) : parsedPrice;
    const discount = parsedMrp > parsedPrice ? Math.round(((parsedMrp - parsedPrice) / parsedMrp) * 100) : 0;

    const assignedCategory = category_name || (
      gender === 'men' ? "Men's Perfumes" : gender === 'women' ? "Women's Perfumes" : 'Unisex Perfumes'
    );

    const defaultImages = ['/images/perfumes/kashmir-saffron-amber.svg'];
    let formattedImages = defaultImages;
    if (Array.isArray(images) && images.length > 0 && images[0]) {
      formattedImages = images;
    } else if (typeof images === 'string' && images.trim()) {
      formattedImages = [images.trim()];
    }

    const result = await dbRun(`
      INSERT INTO products (
        name, slug, sku, category_name, gender, fragrance_family,
        price, mrp, discount, size, stock_quantity, short_description, full_description,
        top_notes, heart_notes, base_notes, longevity, occasion,
        images, is_featured, is_bestseller, is_new_arrival, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name.trim(),
      slug,
      sku.trim().toUpperCase(),
      assignedCategory,
      gender.toLowerCase(),
      fragrance_family || 'Woody',
      parsedPrice,
      parsedMrp,
      discount,
      size || '100ml',
      Math.max(0, Number(stock_quantity || 0)),
      short_description || `${name} Extrait de Parfum (${size || '100ml'})`,
      full_description || `Artisanal Indian luxury fragrance formulated to linger for 12+ hours. Bottled in a signature ${size || '100ml'} crystal flacon.`,
      top_notes || 'Assam Bergamot, Kashmiri Saffron',
      heart_notes || 'Kannauj Hydro-Distilled Rose, Spices',
      base_notes || 'Mysore Sandalwood, Golden Amber',
      longevity || '12+ Hours (Extrait)',
      occasion || 'Versatile Luxury',
      JSON.stringify(formattedImages),
      is_featured ? 1 : 0,
      is_bestseller ? 1 : 0,
      is_new_arrival !== undefined ? (is_new_arrival ? 1 : 0) : 1,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    const created = await dbGet('SELECT * FROM products WHERE id = ?', [result.lastID]);
    created.images = JSON.parse(created.images || '[]');
    return res.status(201).json({ message: 'Product created successfully', product: created });
  } catch (err) {
    console.error('createProduct error:', err);
    if (err.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'A product with this SKU or Name already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      sku,
      category_name,
      gender,
      fragrance_family,
      price,
      mrp,
      size,
      stock_quantity,
      short_description,
      full_description,
      top_notes,
      heart_notes,
      base_notes,
      longevity,
      occasion,
      images,
      is_featured,
      is_bestseller,
      is_new_arrival,
      is_active
    } = req.body;

    const existing = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    let updatedSlug = existing.slug;
    if (name && name.trim() !== existing.name) {
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      updatedSlug = `${baseSlug}-${existing.id}`;
    }

    const parsedPrice = price !== undefined ? Number(price) : existing.price;
    const parsedMrp = mrp !== undefined && mrp !== '' ? Number(mrp) : (existing.mrp || parsedPrice);
    const discount = parsedMrp > parsedPrice ? Math.round(((parsedMrp - parsedPrice) / parsedMrp) * 100) : 0;

    const updatedGender = gender !== undefined ? gender.toLowerCase() : existing.gender;
    const updatedCategory = category_name || (
      gender !== undefined
        ? (updatedGender === 'men' ? "Men's Perfumes" : updatedGender === 'women' ? "Women's Perfumes" : 'Unisex Perfumes')
        : existing.category_name
    );

    let updatedImages = existing.images;
    if (images !== undefined) {
      if (Array.isArray(images)) {
        updatedImages = JSON.stringify(images.filter(Boolean));
      } else if (typeof images === 'string') {
        updatedImages = JSON.stringify(images.trim() ? [images.trim()] : []);
      }
    }

    await dbRun(`
      UPDATE products SET
        name = ?,
        slug = ?,
        sku = ?,
        category_name = ?,
        gender = ?,
        fragrance_family = ?,
        price = ?,
        mrp = ?,
        discount = ?,
        size = ?,
        stock_quantity = ?,
        short_description = ?,
        full_description = ?,
        top_notes = ?,
        heart_notes = ?,
        base_notes = ?,
        longevity = ?,
        occasion = ?,
        images = ?,
        is_featured = ?,
        is_bestseller = ?,
        is_new_arrival = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      updatedName,
      updatedSlug,
      sku ? sku.trim().toUpperCase() : existing.sku,
      updatedCategory,
      updatedGender,
      fragrance_family || existing.fragrance_family,
      parsedPrice,
      parsedMrp,
      discount,
      size !== undefined ? size : existing.size,
      stock_quantity !== undefined ? Math.max(0, Number(stock_quantity)) : existing.stock_quantity,
      short_description !== undefined ? short_description : existing.short_description,
      full_description !== undefined ? full_description : existing.full_description,
      top_notes !== undefined ? top_notes : existing.top_notes,
      heart_notes !== undefined ? heart_notes : existing.heart_notes,
      base_notes !== undefined ? base_notes : existing.base_notes,
      longevity !== undefined ? longevity : existing.longevity,
      occasion !== undefined ? occasion : existing.occasion,
      updatedImages,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      is_bestseller !== undefined ? (is_bestseller ? 1 : 0) : existing.is_bestseller,
      is_new_arrival !== undefined ? (is_new_arrival ? 1 : 0) : existing.is_new_arrival,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    ]);

    const updated = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    updated.images = JSON.parse(updated.images || '[]');
    return res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await dbRun('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const uploadImage = (req, res) => {
  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ message: 'Image uploaded successfully', url: imageUrl, urls: [imageUrl] });
  }
  if (req.files && req.files.length > 0) {
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    return res.json({ message: 'Images uploaded successfully', url: urls[0], urls });
  }
  return res.status(400).json({ error: 'No image uploaded' });
};

export const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  return res.json({ message: 'Images uploaded successfully', urls, count: urls.length });
};
