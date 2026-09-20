import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000/api';
const UPLOADS_BASE = 'http://localhost:5000';

const logPass = (title, details = '') => console.log(`\x1b[32m✅ PASS: ${title}\x1b[0m ${details}`);
const logFail = (title, err) => {
  console.error(`\x1b[31m❌ FAIL: ${title}\x1b[0m`, err);
  process.exit(1);
};

async function runVerification() {
  console.log('====================================================');
  console.log('🧪 VERIFYING ADMIN PRODUCT SYSTEM & CUSTOMER SYNC');
  console.log('====================================================\n');

  let adminToken = '';
  let createdProductId = null;
  let createdProductSlug = '';
  let uploadedImageUrl = '';

  // STEP 0: Admin Authentication
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nooreparfums.com',
        password: 'NooreAdmin@2026'
      })
    });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(data.error || 'Login failed');
    adminToken = data.token;
    logPass('Step 0: Admin Login authenticated', `Token acquired`);
  } catch (err) {
    logFail('Step 0: Admin Login', err.message);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };

  // Pre-cleanup any previous test perfumes
  try {
    const checkOld = await fetch(`${BASE_URL}/products?search=Jaipur&adminView=true`, { headers: authHeaders });
    const oldData = await checkOld.json();
    for (const oldP of oldData.products || []) {
      if (oldP.sku.startsWith('NP-JPR') || oldP.sku.startsWith('NP-TEST')) {
        await fetch(`${BASE_URL}/admin/products/${oldP.id}`, { method: 'DELETE', headers: authHeaders });
      }
    }
  } catch (e) {
    // ignore
  }

  // TEST 2 (First upload image so we can use it in Test 1 creation):
  // Admin uploads a new perfume image.
  // Verify: Persistent storage on server, available via HTTP.
  try {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const testSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#D4AF37"/><text x="10" y="50" fill="#000">NOORE</text></svg>`;
    
    // Construct multipart/form-data manually with Buffer
    const bodyParts = [
      `--${boundary}\r\n`,
      `Content-Disposition: form-data; name="image"; filename="jaipur-marigold.svg"\r\n`,
      `Content-Type: image/svg+xml\r\n\r\n`,
      testSvgContent,
      `\r\n--${boundary}--\r\n`
    ];
    const multipartBody = bodyParts.join('');

    const uploadRes = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: multipartBody
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.url) throw new Error(uploadData.error || 'Image upload failed');
    uploadedImageUrl = uploadData.url;

    // Verify image is accessible on server via HTTP
    const imgCheck = await fetch(`${UPLOADS_BASE}${uploadedImageUrl}`);
    if (!imgCheck.ok) throw new Error(`Uploaded image not retrievable: status ${imgCheck.status}`);

    logPass('TEST 2: Admin uploads a new perfume image', `Saved permanently at ${uploadedImageUrl} (HTTP ${imgCheck.status})`);
  } catch (err) {
    logFail('TEST 2: Image Upload', err.message);
  }

  // TEST 1:
  // Admin creates a new perfume using the simplified product schema:
  // 1. Name, 2. SKU, 3. Gender, 4. Size, 5. Retail Price, 6. Original MRP, 7. Stock, 8. Image
  // Verify: The perfume appears on the customer Shop page.
  const testSku = `NP-JPR-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const newProductPayload = {
      name: 'Jaipur Royal Marigold & Saffron',
      sku: testSku,
      gender: 'unisex',
      size: '100ml',
      price: 3499,
      mrp: 4999,
      stock_quantity: 25,
      images: [uploadedImageUrl]
    };

    const createRes = await fetch(`${BASE_URL}/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(newProductPayload)
    });

    const createData = await createRes.json();
    if (!createRes.ok || !createData.product) throw new Error(createData.error || 'Creation failed');
    createdProductId = createData.product.id;
    createdProductSlug = createData.product.slug;

    // Verify customer shop page retrieves it
    const shopRes = await fetch(`${BASE_URL}/products?search=Jaipur+Royal+Marigold`);
    const shopData = await shopRes.json();
    const foundOnCustomerShop = shopData.products.find(p => p.id === createdProductId);

    if (!foundOnCustomerShop) throw new Error('New product not found in customer shop query');
    if (foundOnCustomerShop.images[0] !== uploadedImageUrl) throw new Error('Customer shop does not reflect uploaded image');

    logPass('TEST 1: Admin creates a new perfume & customer shop reflects it', `Found ID ${createdProductId} on customer shop`);
  } catch (err) {
    logFail('TEST 1: Product Creation', err.message);
  }

  // TEST 3:
  // Admin changes the perfume name.
  // Verify: Customer website shows the new name.
  try {
    const updatedName = 'Jaipur Royal Marigold & Imperial Saffron';
    const updateRes = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: updatedName })
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.error || 'Failed to update name');
    if (updateData.product && updateData.product.slug) {
      createdProductSlug = updateData.product.slug;
    }

    // Customer shop check
    const custRes = await fetch(`${BASE_URL}/products?search=Imperial+Saffron`);
    const custData = await custRes.json();
    const match = custData.products.find(p => p.id === createdProductId);

    if (!match || match.name !== updatedName) {
      throw new Error(`Customer shop did not show updated name. Found: ${match?.name}`);
    }

    logPass('TEST 3: Admin changes perfume name', `Customer storefront displays updated name: "${match.name}"`);
  } catch (err) {
    logFail('TEST 3: Name Update', err.message);
  }

  // TEST 4:
  // Admin changes Retail Price.
  // Verify: Customer website shows the new price.
  try {
    const newPrice = 2899;
    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ price: newPrice })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Customer check
    const custCheck = await fetch(`${BASE_URL}/products/${createdProductSlug}`);
    const custProduct = (await custCheck.json()).product;

    if (custProduct.price !== newPrice) {
      throw new Error(`Expected customer price ₹${newPrice}, got ₹${custProduct.price}`);
    }

    logPass('TEST 4: Admin changes Retail Price', `Customer storefront reflects updated price: ₹${custProduct.price}`);
  } catch (err) {
    logFail('TEST 4: Price Update', err.message);
  }

  // TEST 5:
  // Admin changes Original MRP.
  // Verify: Customer website shows the new MRP and correct discount.
  try {
    const newMrp = 5999;
    const currentPrice = 2899;
    const expectedDiscount = Math.round(((newMrp - currentPrice) / newMrp) * 100); // 52%

    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ mrp: newMrp, price: currentPrice })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Customer check
    const custCheck = await fetch(`${BASE_URL}/products/${createdProductSlug}`);
    const custProduct = (await custCheck.json()).product;

    if (custProduct.mrp !== newMrp) throw new Error(`Expected MRP ₹${newMrp}, got ₹${custProduct.mrp}`);
    if (custProduct.discount !== expectedDiscount) throw new Error(`Expected discount ${expectedDiscount}%, got ${custProduct.discount}%`);

    logPass('TEST 5: Admin changes Original MRP', `Customer storefront shows MRP ₹${custProduct.mrp} with ${custProduct.discount}% discount`);
  } catch (err) {
    logFail('TEST 5: MRP and Discount Update', err.message);
  }

  // TEST 6:
  // Admin changes Gender.
  // Verify: Correct customer category/filter is updated.
  try {
    const newGender = 'women';
    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ gender: newGender })
    });
    if (!res.ok) throw new Error((await res.json()).error);

    // Customer filter check: query products with gender=women
    const womenRes = await fetch(`${BASE_URL}/products?gender=women`);
    const womenData = await womenRes.json();
    const foundInWomen = womenData.products.some(p => p.id === createdProductId);

    if (!foundInWomen) throw new Error('Product not found in women category filter');

    // Also verify NOT in men filter
    const menRes = await fetch(`${BASE_URL}/products?gender=men`);
    const menData = await menRes.json();
    const foundInMen = menData.products.some(p => p.id === createdProductId);

    if (foundInMen) throw new Error('Product should not appear in men filter');

    logPass('TEST 6: Admin changes Gender', `Customer category correctly lists under Women's Perfumes`);
  } catch (err) {
    logFail('TEST 6: Gender Filter Update', err.message);
  }

  // TEST 7:
  // Admin changes Flacon Size.
  // Verify: Customer product page shows the new size.
  try {
    const newSize = '120ml';
    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ size: newSize })
    });
    if (!res.ok) throw new Error((await res.json()).error);

    const custRes = await fetch(`${BASE_URL}/products/${createdProductSlug}`);
    const custProduct = (await custRes.json()).product;

    if (custProduct.size !== newSize) throw new Error(`Expected size ${newSize}, got ${custProduct.size}`);

    logPass('TEST 7: Admin changes Flacon Size', `Customer product page reflects new size: ${custProduct.size}`);
  } catch (err) {
    logFail('TEST 7: Size Update', err.message);
  }

  // TEST 8:
  // Admin changes Stock Quantity.
  // Verify: Customer website shows the correct availability.
  try {
    const newStock = 12;
    const res = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ stock_quantity: newStock })
    });
    if (!res.ok) throw new Error((await res.json()).error);

    const custRes = await fetch(`${BASE_URL}/products/${createdProductSlug}`);
    const custProduct = (await custRes.json()).product;

    if (custProduct.stock_quantity !== newStock) {
      throw new Error(`Expected stock ${newStock}, got ${custProduct.stock_quantity}`);
    }

    logPass('TEST 8: Admin changes Stock Quantity', `Customer website shows correct stock availability (${custProduct.stock_quantity} units)`);
  } catch (err) {
    logFail('TEST 8: Stock Quantity Update', err.message);
  }

  // TEST 9:
  // Customer purchases product.
  // Verify: Admin inventory automatically decreases.
  try {
    const initialStock = 12;
    const purchasedQty = 3;
    const expectedStock = initialStock - purchasedQty; // 9

    const orderPayload = {
      customer_name: 'Devraj Chauhan',
      customer_email: 'devraj@royalindia.com',
      customer_phone: '9820098200',
      shipping_address: 'Palace Road, Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302006',
      payment_method: 'COD',
      items: [{
        product_id: createdProductId,
        quantity: purchasedQty,
        size: '120ml'
      }]
    };

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.error || 'Failed to place customer order');

    // Verify in Admin Inventory API
    const invRes = await fetch(`${BASE_URL}/admin/inventory?search=Jaipur`, {
      headers: authHeaders
    });
    const invData = await invRes.json();
    const itemInInv = invData.inventory.find(p => p.id === createdProductId);

    if (!itemInInv) throw new Error('Product not found in Admin Inventory');
    if (itemInInv.stock_quantity !== expectedStock) {
      throw new Error(`Expected inventory stock to decrease to ${expectedStock}, got ${itemInInv.stock_quantity}`);
    }

    logPass('TEST 9: Customer purchases product & inventory synchronizes', `Order placed. Admin stock auto-decreased from ${initialStock} -> ${itemInInv.stock_quantity}`);
  } catch (err) {
    logFail('TEST 9: Order and Inventory Sync', err.message);
  }

  // TEST 10:
  // Stock reaches zero.
  // Verify: Customer website shows Out of Stock and prevents purchase.
  try {
    // Admin sets stock to 0
    const setZeroRes = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ stock_quantity: 0 })
    });
    if (!setZeroRes.ok) throw new Error('Failed to set stock to 0');

    // Verify customer product reports 0 stock
    const custRes = await fetch(`${BASE_URL}/products/${createdProductSlug}`);
    const custProduct = (await custRes.json()).product;
    if (custProduct.stock_quantity !== 0) throw new Error('Customer product does not show 0 stock');

    // Attempt purchase - must be rejected by backend
    const overPurchaseOrder = {
      customer_name: 'Ananya Sharma',
      customer_email: 'ananya@sharma.com',
      customer_phone: '9811198111',
      shipping_address: 'Golf Links',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110003',
      payment_method: 'COD',
      items: [{
        product_id: createdProductId,
        quantity: 1,
        size: '120ml'
      }]
    };

    const failOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overPurchaseOrder)
    });

    if (failOrderRes.ok) {
      throw new Error('Order succeeded when product was out of stock! It should have been rejected.');
    }

    const failData = await failOrderRes.json();
    logPass('TEST 10: Stock reaches zero', `Customer site shows Out of Stock & order rejected: "${failData.error}"`);
  } catch (err) {
    logFail('TEST 10: Zero Stock Purchase Prevention', err.message);
  }

  // TEST 11:
  // Admin edits existing product.
  // Verify: Customer website shows the updated product.
  try {
    const editPayload = {
      name: 'Jaipur Grand Reserve Saffron',
      price: 3999,
      mrp: 5999,
      stock_quantity: 40,
      size: '150ml'
    };

    const editRes = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(editPayload)
    });
    if (!editRes.ok) throw new Error('Failed to update product');

    // Customer check
    const custRes = await fetch(`${BASE_URL}/products?search=Jaipur+Grand+Reserve`);
    const custData = await custRes.json();
    const updatedProd = custData.products.find(p => p.id === createdProductId);

    if (!updatedProd) throw new Error('Updated product not found on customer storefront');
    if (updatedProd.price !== 3999 || updatedProd.stock_quantity !== 40 || updatedProd.size !== '150ml') {
      throw new Error('Customer storefront does not match updated product attributes');
    }

    logPass('TEST 11: Admin edits existing product', `Customer website accurately reflects updated name, price ₹3999, size 150ml & stock 40`);
  } catch (err) {
    logFail('TEST 11: Edit Existing Product', err.message);
  }

  // TEST 12:
  // Admin deactivates / deletes product.
  // Verify: It is no longer available for purchase on the customer website.
  try {
    // 12a: Deactivate
    const deactRes = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ is_active: 0 })
    });
    if (!deactRes.ok) throw new Error('Failed to deactivate product');

    // Customer storefront must not include deactivated products
    const custShopAfterDeact = await fetch(`${BASE_URL}/products?search=Jaipur`);
    const shopData = await custShopAfterDeact.json();
    const foundDeactivated = shopData.products.some(p => p.id === createdProductId);

    if (foundDeactivated) throw new Error('Deactivated product still appears on customer shop!');

    // 12b: Delete product completely
    const delRes = await fetch(`${BASE_URL}/admin/products/${createdProductId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (!delRes.ok) throw new Error('Failed to delete product');

    // Customer check
    const custShopAfterDel = await fetch(`${BASE_URL}/products?search=Jaipur`);
    const finalShopData = await custShopAfterDel.json();
    const foundDeleted = finalShopData.products.some(p => p.id === createdProductId);

    if (foundDeleted) throw new Error('Deleted product still appears in customer shop database query!');

    logPass('TEST 12: Admin deactivates and deletes product', `Product immediately removed from customer website upon deactivation & deletion`);
  } catch (err) {
    logFail('TEST 12: Deactivate / Delete', err.message);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL 12 USER TESTS PASSED WITH 100% SUCCESS!');
  console.log('====================================================\n');
}

runVerification();
