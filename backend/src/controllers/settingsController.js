import { dbAll, dbRun } from '../database/db.js';

export const getSettings = async (req, res) => {
  try {
    const rows = await dbAll('SELECT key, value FROM settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    // Provide default fallbacks if missing
    const defaults = {
      brand_name: 'IDITZ PERFUME',
      brand_tagline: 'More Than A Fragrance',
      store_email: 'concierge@iditzperfume.com',
      store_phone: '+91 98765 43210',
      whatsapp_number: '919876543210',
      store_address: 'IDITZ Atelier, Heritage Quarter, Mumbai & Jaipur',
      shipping_charge: '150',
      free_shipping_threshold: '999',
      cod_available: '1',
      currency: '₹',
      instagram_url: 'https://instagram.com/iditzperfume',
      facebook_url: 'https://facebook.com/iditzperfume',
      announcement_text: 'COMPLIMENTARY EXPRESS AIR DELIVERY ACROSS INDIA ON ORDERS ABOVE ₹999'
    };

    return res.json({ settings: { ...defaults, ...settings } });
  } catch (err) {
    console.error('getSettings error:', err);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settingsObject = req.body;
    if (!settingsObject || typeof settingsObject !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    for (const [key, value] of Object.entries(settingsObject)) {
      await dbRun(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, String(value)]
      );
    }

    const rows = await dbAll('SELECT key, value FROM settings');
    const updated = {};
    rows.forEach(r => {
      updated[r.key] = r.value;
    });

    return res.json({ message: 'Settings updated successfully', settings: updated });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};
