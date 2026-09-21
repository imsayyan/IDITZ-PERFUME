import bcrypt from 'bcryptjs';
import { initDb, dbRun, dbGet } from './db.js';

export async function seedDatabase() {
  await initDb();

  // Check if admin exists
  const existingAdmin = await dbGet('SELECT id FROM admin_users WHERE email = ?', ['admin@nooreparfums.com']);
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('NooreAdmin@2026', 10);
    await dbRun(
      'INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Master Perfumer & Admin', 'admin@nooreparfums.com', passwordHash, 'superadmin']
    );
    console.log('Seeded admin user: admin@nooreparfums.com / NooreAdmin@2026');
  }

  // Seed Store Settings
  const settingsList = [
    ['brand_name', 'IDITZ PERFUME'],
    ['brand_tagline', 'More Than A Fragrance'],
    ['store_email', 'concierge@iditzperfume.com'],
    ['store_phone', '+91 98765 43210'],
    ['whatsapp_number', '919876543210'],
    ['store_address', 'IDITZ Atelier, Bangalore South'],
    ['shipping_charge', '150'],
    ['free_shipping_threshold', '999'],
    ['cod_available', '1'],
    ['currency', '₹'],
    ['instagram_url', 'https://instagram.com/iditzperfume'],
    ['facebook_url', 'https://facebook.com/iditzperfume'],
    ['announcement_text', 'COMPLIMENTARY EXPRESS AIR DELIVERY ACROSS INDIA ON ORDERS ABOVE ₹999']
  ];

  for (const [key, value] of settingsList) {
    const existing = await dbGet('SELECT key FROM settings WHERE key = ?', [key]);
    if (!existing) {
      await dbRun('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
    }
  }

  // Seed Categories
  const categoriesList = [
    { name: "Men's Perfumes", slug: 'men', description: 'Bold, deep, magnetic woody, spicy and smoky compositions crafted for gentlemen.' },
    { name: "Women's Perfumes", slug: 'women', description: 'Sensual, intoxicating florals, velvety musks and amber elixirs celebrating timeless grace.' },
    { name: "Unisex Perfumes", slug: 'unisex', description: 'Transcendent, genderless artisanal scents driven by rare woods and spiced resins.' },
    { name: "Oud Collection", slug: 'oud', description: 'Precious wild agarwood from Assam, distilled in copper degs for regal intensity.' },
    { name: "Attar Collection", slug: 'attar', description: 'Alcohol-free pure concentrated perfume oils rooted in Kannauj heritage.' }
  ];

  for (const cat of categoriesList) {
    const existing = await dbGet('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
    if (!existing) {
      await dbRun('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [cat.name, cat.slug, cat.description]);
    }
  }

  // Seed Coupons
  const couponsList = [
    { code: 'IDITZ10', discount_type: 'percentage', discount_amount: 10, min_order_value: 1499, expiry_date: '2027-12-31' },
    { code: 'NOORE10', discount_type: 'percentage', discount_amount: 10, min_order_value: 1499, expiry_date: '2027-12-31' },
    { code: 'FIRSTBUY', discount_type: 'fixed', discount_amount: 500, min_order_value: 2499, expiry_date: '2027-12-31' },
    { code: 'ROYAL15', discount_type: 'percentage', discount_amount: 15, min_order_value: 4999, expiry_date: '2027-12-31' }
  ];

  for (const c of couponsList) {
    const existing = await dbGet('SELECT id FROM coupons WHERE code = ?', [c.code]);
    if (!existing) {
      await dbRun(
        'INSERT INTO coupons (code, discount_type, discount_amount, min_order_value, expiry_date) VALUES (?, ?, ?, ?, ?)',
        [c.code, c.discount_type, c.discount_amount, c.min_order_value, c.expiry_date]
      );
    }
  }

  // Seed Products
  const productsCount = await dbGet('SELECT COUNT(*) as count FROM products');
  if (productsCount.count === 0) {
    const products = [
      {
        name: 'Kashmir Saffron & Royal Amber',
        slug: 'kashmir-saffron-royal-amber',
        sku: 'NP-KSR-01',
        category_name: 'Unisex Perfumes',
        gender: 'unisex',
        fragrance_family: 'Amber',
        price: 3999,
        mrp: 4999,
        discount: 20,
        size: '100ml',
        stock_quantity: 45,
        short_description: 'Pure sun-drenched Pampore saffron woven with aged golden amber and Madagascar vanilla bourbon.',
        full_description: 'An ode to the mystical valleys of Kashmir. Sourced from the autumn harvest of Pampore, hand-plucked saffron threads are blended with rich royal amber, Damascena rose, and Mysore sandalwood. The dry down leaves an intoxicating trail of warm golden woods and velvety balsamic resins.',
        top_notes: 'Kashmiri Saffron, Bergamot, Bitter Almond',
        heart_notes: 'Rose Damascena, Warm Amber Resin, Spanish Labdanum',
        base_notes: 'Mysore Sandalwood, Bourbon Vanilla, Ambroxan',
        longevity: '14+ Hours (Extrait Concentration)',
        occasion: 'Evening Galas, Winter Soirées, Grand Weddings',
        images: JSON.stringify(['/images/perfumes/kashmir-saffron-amber.svg']),
        is_featured: 1,
        is_bestseller: 1,
        is_new_arrival: 0,
        rating: 4.9,
        reviews_count: 48
      },
      {
        name: 'Assam Oud Imperial',
        slug: 'assam-oud-imperial',
        sku: 'NP-AOI-02',
        category_name: "Men's Perfumes",
        gender: 'men',
        fragrance_family: 'Oud',
        price: 5499,
        mrp: 6999,
        discount: 21,
        size: '100ml',
        stock_quantity: 28,
        short_description: 'Wild-harvested vintage Assam agarwood enveloped in smoky cedar, dark leather, and crushed black pepper.',
        full_description: 'A sovereign creation built around natural Aquilaria agallocha from Upper Assam, aged for 12 years. Uncompromisingly regal, it unfolds with brisk black pepper and frankincense before unveiling a rich heart of Moroccan leather, smoked birch, and dark honeyed animalic warmth.',
        top_notes: 'Wild Assam Oud, Malabar Black Pepper, Incense',
        heart_notes: 'Atlas Cedarwood, Aged Leather, Frankincense',
        base_notes: 'Smoked Birch, Indonesian Patchouli, Black Musk',
        longevity: '16+ Hours (Extrait Concentration)',
        occasion: 'Black Tie, Formal Evenings, Power Meetings',
        images: JSON.stringify(['/images/perfumes/assam-oud-imperial.svg']),
        is_featured: 1,
        is_bestseller: 1,
        is_new_arrival: 0,
        rating: 5.0,
        reviews_count: 62
      },
      {
        name: 'Kannauj Rose & Velvet Musk',
        slug: 'kannauj-rose-velvet-musk',
        sku: 'NP-KRM-03',
        category_name: "Women's Perfumes",
        gender: 'women',
        fragrance_family: 'Floral',
        price: 3299,
        mrp: 4199,
        discount: 21,
        size: '100ml',
        stock_quantity: 52,
        short_description: 'Fresh morning Gulab petals hydro-distilled in Kannauj, cradled by creamy white musk and sweet mandarin.',
        full_description: 'Capturing the scent of dawn over the ancient perfume capital of Kannauj. Thousands of Damask rose petals are distilled over slow wood fires in historic copper stills, balanced delicately against crystalline white musk, morning dew drops, and pink peony blossoms.',
        top_notes: 'Kannauj Rose Water, Italian Mandarin, Pink Lychee',
        heart_notes: 'Damask Rose Absolute, Pink Peony, Saffron Thread',
        base_notes: 'Velvet White Musk, Cashmeran, Soft Sandalwood',
        longevity: '10+ Hours',
        occasion: 'Daytime Elegance, Intimate Dinners, High Tea',
        images: JSON.stringify(['/images/perfumes/kannauj-rose-musk.svg']),
        is_featured: 1,
        is_bestseller: 1,
        is_new_arrival: 0,
        rating: 4.8,
        reviews_count: 37
      },
      {
        name: 'Mysore Sandalwood & Cardamom',
        slug: 'mysore-sandalwood-cardamom',
        sku: 'NP-MSC-04',
        category_name: 'Unisex Perfumes',
        gender: 'unisex',
        fragrance_family: 'Woody',
        price: 4499,
        mrp: 5499,
        discount: 18,
        size: '100ml',
        stock_quantity: 34,
        short_description: 'Creamy sustainable Santalum album from Mysore paired with green Idukki cardamom and crushed nutmeg.',
        full_description: 'An opulent reverence to Indias sacred wood. Creamy, buttery Mysore sandalwood meets the spicy brightness of Kerala green cardamom and delicate Florentine orris root. Grounded in warm benzoin and roasted tonka bean for an addictive, serene sillage.',
        top_notes: 'Green Idukki Cardamom, Calabrian Bergamot, Pink Peppercorn',
        heart_notes: 'Mysore Sandalwood Heart, Nutmeg, Orris Root',
        base_notes: 'Tonka Bean, Siamese Benzoin, Cedarwood',
        longevity: '12+ Hours (Extrait Concentration)',
        occasion: 'Festive Occasions, Meditative Evenings, Signature Daily Luxury',
        images: JSON.stringify(['/images/perfumes/mysore-sandalwood-cardamom.svg']),
        is_featured: 1,
        is_bestseller: 0,
        is_new_arrival: 1,
        rating: 4.9,
        reviews_count: 29
      },
      {
        name: 'Monsoon Ruh Khus (Heritage Vetiver)',
        slug: 'monsoon-ruh-khus',
        sku: 'NP-MRK-05',
        category_name: 'Unisex Perfumes',
        gender: 'unisex',
        fragrance_family: 'Fresh',
        price: 2899,
        mrp: 3699,
        discount: 22,
        size: '100ml',
        stock_quantity: 40,
        short_description: 'The exhilarating scent of Indian monsoon rain touching sun-baked earth, infused with wild green Ruh Khus roots.',
        full_description: 'The poetic essence of petrichor (Mitti Attar) distilled with northern Indian wild vetiver roots. Refreshingly crisp, earthy, and mineral-toned. Evokes cool breezes across rain-soaked gardens, wet grass, and damp cedar forests.',
        top_notes: 'Baked Earth Petrichor, Crushed Spearmint, Bergamot',
        heart_notes: 'Heritage Green Ruh Khus (Wild Vetiver), Clary Sage',
        base_notes: 'Damp Oakmoss, White Cedarwood, Mineral Amber',
        longevity: '11+ Hours',
        occasion: 'Summer Days, Humid Evenings, Rejuvenating Morning Wear',
        images: JSON.stringify(['/images/perfumes/monsoon-ruh-khus.svg']),
        is_featured: 0,
        is_bestseller: 0,
        is_new_arrival: 1,
        rating: 4.7,
        reviews_count: 24
      },
      {
        name: 'Himalayan Cedar & Bergamot',
        slug: 'himalayan-cedar-bergamot',
        sku: 'NP-HCB-06',
        category_name: "Men's Perfumes",
        gender: 'men',
        fragrance_family: 'Citrus',
        price: 2799,
        mrp: 3499,
        discount: 20,
        size: '100ml',
        stock_quantity: 60,
        short_description: 'Crisp alpine mountain air, frosted Himalayan cedar needles, sun-kissed bergamot and juniper berries.',
        full_description: 'Inspired by the snow-crested pines and ancient deodar groves of Himachal Pradesh. Bracing citrus and icy juniper berries transition gracefully into aromatic cedarwood and soft oakmoss, creating an effortlessly crisp and magnetic silhouette.',
        top_notes: 'Zesty Bergamot, Grapefruit, Juniper Berry',
        heart_notes: 'Himalayan Deodar Cedar, French Lavender, Rosemary',
        base_notes: 'Ambroxan, Vetiver Bourbon, White Musk',
        longevity: '10+ Hours',
        occasion: 'Boardroom Meetings, Morning Travel, Smart Casual Outings',
        images: JSON.stringify(['/images/perfumes/himalayan-cedar-bergamot.svg']),
        is_featured: 0,
        is_bestseller: 0,
        is_new_arrival: 1,
        rating: 4.8,
        reviews_count: 31
      },
      {
        name: 'Jasmine Sambac & Night Queen',
        slug: 'jasmine-sambac-night-queen',
        sku: 'NP-JSN-07',
        category_name: "Women's Perfumes",
        gender: 'women',
        fragrance_family: 'Floral',
        price: 3499,
        mrp: 4299,
        discount: 19,
        size: '100ml',
        stock_quantity: 38,
        short_description: 'Intoxicating Madurai Jasmine Sambac, midnight Rajnigandha (Tuberose), and sensual warm amberwood.',
        full_description: 'An ode to moonlit Indian courtyards filled with blooming Mogra and Tuberose. Heady, creamy, and hypnotic floral nectar enhanced with golden neroli and lingering warm benzoin that melts seamlessly into the skin.',
        top_notes: 'Madurai Mogra (Jasmine Sambac), Orange Blossom, Neroli',
        heart_notes: 'Rajnigandha (Tuberose Absolute), Ylang Ylang Extra, Frangipani',
        base_notes: 'Golden Amberwood, Siam Benzoin, Warm Musk',
        longevity: '12+ Hours',
        occasion: 'Romantic Dinners, Sangeet Nights, Starlit Celebrations',
        images: JSON.stringify(['/images/perfumes/jasmine-sambac-night-queen.svg']),
        is_featured: 0,
        is_bestseller: 1,
        is_new_arrival: 0,
        rating: 4.9,
        reviews_count: 42
      },
      {
        name: 'Temple Incense & Black Pepper',
        slug: 'temple-incense-black-pepper',
        sku: 'NP-TIB-08',
        category_name: 'Unisex Perfumes',
        gender: 'unisex',
        fragrance_family: 'Spicy',
        price: 3899,
        mrp: 4899,
        discount: 20,
        size: '100ml',
        stock_quantity: 31,
        short_description: 'Resinous temple myrrh, charred sacred woods, crushed Tellicherry black pepper and smoky labdanum.',
        full_description: 'Recreating the profound serenity of stone temple sanctums lit by brass oil lamps. Sacred olibanum, myrrh, and roasted spices swirl with charred guaiacwood and deep earthy patchouli for an enigmatic, contemplative aura.',
        top_notes: 'Tellicherry Black Pepper, Cardamom Pods, Pink Berry',
        heart_notes: 'Temple Olibanum (Frankincense), Somali Myrrh, Cistus Labdanum',
        base_notes: 'Charred Guaiacwood, Indian Patchouli, Dark Amber',
        longevity: '14+ Hours (Extrait Concentration)',
        occasion: 'Intimate Evenings, Autumn Nights, Artistic Gatherings',
        images: JSON.stringify(['/images/perfumes/dark-incense-black-pepper.svg']),
        is_featured: 0,
        is_bestseller: 0,
        is_new_arrival: 1,
        rating: 4.8,
        reviews_count: 19
      },
      {
        name: 'Smoky Birch & Warm Cinnamon',
        slug: 'smoky-birch-warm-cinnamon',
        sku: 'NP-SBC-09',
        category_name: "Men's Perfumes",
        gender: 'men',
        fragrance_family: 'Woody',
        price: 2999,
        mrp: 3799,
        discount: 21,
        size: '100ml',
        stock_quantity: 42,
        short_description: 'Toasted Ceylon cinnamon bark, smoky birch wood, roasted coffee and supple Russian leather.',
        full_description: 'A roaring hearth on a crisp winter night. Warm sweet cinnamon and toasted cloves ignite into smoldering birch tar and aged leather, mellowed by amber crystals and cacao pods.',
        top_notes: 'Ceylon Cinnamon Bark, Blood Orange, Nutmeg',
        heart_notes: 'Smoky Birch Tar, Dark Leather, Roasted Cacao',
        base_notes: 'Virginia Cedarwood, Tobacco Leaf, Amber',
        longevity: '11+ Hours',
        occasion: 'Winter Evenings, Fireside Gatherings, Night Out',
        images: JSON.stringify(['/images/perfumes/smoky-birch-warm-cinnamon.svg']),
        is_featured: 0,
        is_bestseller: 0,
        is_new_arrival: 0,
        rating: 4.6,
        reviews_count: 22
      },
      {
        name: 'Vanilla Bourbon & Golden Tobacco',
        slug: 'vanilla-bourbon-golden-tobacco',
        sku: 'NP-VBT-10',
        category_name: 'Unisex Perfumes',
        gender: 'unisex',
        fragrance_family: 'Vanilla',
        price: 3699,
        mrp: 4599,
        discount: 20,
        size: '100ml',
        stock_quantity: 50,
        short_description: 'Aged Madagascar vanilla beans macerated in smoky bourbon, golden honeyed tobacco leaf and warm tonka.',
        full_description: 'Decadently smooth and comforting. Rich Madagascar vanilla pod extract paired with warm blonde tobacco leaf, roasted tonka bean, and spun caramel, backed by creamy Australian sandalwood.',
        top_notes: 'Bourbon Vanilla Bean, Bitter Almond, Candied Orange',
        heart_notes: 'Golden Tobacco Leaf, Honeycomb, Tonka Bean',
        base_notes: 'Creamy Sandalwood, Dark Amber, Cocoa Butter',
        longevity: '13+ Hours (Extrait Concentration)',
        occasion: 'Date Nights, Special Dinners, Winter Comfort',
        images: JSON.stringify(['/images/perfumes/vanilla-bourbon-golden-tobacco.svg']),
        is_featured: 1,
        is_bestseller: 0,
        is_new_arrival: 1,
        rating: 4.9,
        reviews_count: 36
      }
    ];

    for (const p of products) {
      await dbRun(`
        INSERT INTO products (
          name, slug, sku, category_name, gender, fragrance_family,
          price, mrp, discount, size, stock_quantity, short_description, full_description,
          top_notes, heart_notes, base_notes, longevity, occasion,
          images, is_featured, is_bestseller, is_new_arrival, rating, reviews_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.name, p.slug, p.sku, p.category_name, p.gender, p.fragrance_family,
        p.price, p.mrp, p.discount, p.size, p.stock_quantity, p.short_description, p.full_description,
        p.top_notes, p.heart_notes, p.base_notes, p.longevity, p.occasion,
        p.images, p.is_featured, p.is_bestseller, p.is_new_arrival, p.rating, p.reviews_count
      ]);
    }
    console.log(`Seeded ${products.length} luxury perfumes into database.`);
  }

  // Seed Initial Demo Customer & Orders so Admin Dashboard has real data to display
  const customerCount = await dbGet('SELECT COUNT(*) as count FROM customers');
  if (customerCount.count === 0) {
    const cust1 = await dbRun(`
      INSERT INTO customers (full_name, email, phone, address, city, state, pincode, total_orders, total_spent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Vikramaditya Singhania', 'vikram@singhaniagroup.com', '+91 98201 12345',
      'Villa 14, Royal Palms, Alipore', 'Kolkata', 'West Bengal', '700027', 2, 9498
    ]);

    const cust2 = await dbRun(`
      INSERT INTO customers (full_name, email, phone, address, city, state, pincode, total_orders, total_spent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Ananya Deshmukh', 'ananya.deshmukh@gmail.com', '+91 99304 98765',
      '402 Horizon Tower, Worli Sea Face', 'Mumbai', 'Maharashtra', '400018', 1, 3299
    ]);

    // Orders
    const ord1 = await dbRun(`
      INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        shipping_address, apartment, city, state, pincode, payment_method, payment_status,
        order_status, subtotal, discount, shipping_fee, total_amount, coupon_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'NP-2026-84912', cust1.lastID, 'Vikramaditya Singhania', 'vikram@singhaniagroup.com', '+91 98201 12345',
      'Royal Palms, Alipore', 'Villa 14', 'Kolkata', 'West Bengal', '700027', 'ONLINE', 'paid',
      'Delivered', 9498, 0, 0, 9498, null
    ]);

    await dbRun(`
      INSERT INTO order_items (order_id, product_id, product_name, product_sku, product_image, size, price, quantity, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord1.lastID, 1, 'Kashmir Saffron & Royal Amber', 'NP-KSR-01', '/images/perfumes/kashmir-saffron-amber.svg', '100ml', 3999, 1, 3999
    ]);
    await dbRun(`
      INSERT INTO order_items (order_id, product_id, product_name, product_sku, product_image, size, price, quantity, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord1.lastID, 2, 'Assam Oud Imperial', 'NP-AOI-02', '/images/perfumes/assam-oud-imperial.svg', '100ml', 5499, 1, 5499
    ]);

    const ord2 = await dbRun(`
      INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        shipping_address, apartment, city, state, pincode, payment_method, payment_status,
        order_status, subtotal, discount, shipping_fee, total_amount, coupon_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'NP-2026-92147', cust2.lastID, 'Ananya Deshmukh', 'ananya.deshmukh@gmail.com', '+91 99304 98765',
      'Worli Sea Face', '402 Horizon Tower', 'Mumbai', 'Maharashtra', '400018', 'COD', 'pending',
      'Processing', 3299, 0, 0, 3299, null
    ]);

    await dbRun(`
      INSERT INTO order_items (order_id, product_id, product_name, product_sku, product_image, size, price, quantity, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ord2.lastID, 3, 'Kannauj Rose & Velvet Musk', 'NP-KRM-03', '/images/perfumes/kannauj-rose-musk.svg', '100ml', 3299, 1, 3299
    ]);

    console.log('Seeded demo customers and realistic orders.');
  }

  console.log('Database initialization and seeding completed successfully!');
}

// Run directly if invoked from command line
if (process.argv[1]?.includes('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
