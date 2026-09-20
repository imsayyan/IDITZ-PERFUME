import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Check, Settings, Save, Store, Truck, MessageCircle } from 'lucide-react';

export const AdminSettings = () => {
  const { settings: globalSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({ ...globalSettings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({ ...globalSettings });
  }, [globalSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? '1' : '0') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await api.updateSettings(formData);
      await refreshSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Settings save error:', err);
      setError(err.message || 'Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-luxury-lightBorder pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
            ATELIER & STORE SETTINGS
          </h1>
          <p className="text-xs text-luxury-charcoal/70 mt-1">
            Global brand configuration, shipping thresholds, concierge numbers, and policies.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings updated successfully! Changes are immediately active across your boutique.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Identity Card */}
        <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-luxury-goldDark" /> 1. BRAND IDENTITY
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                name="brand_name"
                value={formData.brand_name || ''}
                onChange={handleChange}
                className="luxury-input"
              />
              <p className="text-[10px] text-luxury-charcoal/60 mt-1">Displayed in headers, invoices, and titles.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                name="brand_tagline"
                value={formData.brand_tagline || ''}
                onChange={handleChange}
                className="luxury-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
              Top Announcement Bar Marquee Text
            </label>
            <input
              type="text"
              name="announcement_text"
              value={formData.announcement_text || ''}
              onChange={handleChange}
              placeholder="e.g. FREE EXPRESS COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹999 across INDIA"
              className="luxury-input"
            />
          </div>
        </div>

        {/* Shipping & Commerce Rules */}
        <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-luxury-goldDark" /> 2. SHIPPING & COMMERCE LOGISTICS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                required
                name="free_shipping_threshold"
                value={formData.free_shipping_threshold || '999'}
                onChange={handleChange}
                className="luxury-input"
              />
              <p className="text-[10px] text-luxury-charcoal/60 mt-1">Orders at or above this get free shipping.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                required
                name="shipping_charge"
                value={formData.shipping_charge || '150'}
                onChange={handleChange}
                className="luxury-input"
              />
              <p className="text-[10px] text-luxury-charcoal/60 mt-1">Applied if order is below threshold.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency || '₹'}
                onChange={handleChange}
                className="luxury-input"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 font-semibold text-xs text-luxury-black cursor-pointer">
              <input
                type="checkbox"
                name="cod_available"
                checked={formData.cod_available === '1' || formData.cod_available === 1}
                onChange={handleChange}
                className="accent-luxury-gold"
              />
              <span>Enable Cash on Delivery (COD) Checkout across India</span>
            </label>
          </div>
        </div>

        {/* Concierge & Social Coordinates */}
        <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-luxury-goldDark" /> 3. CONCIERGE & ATELIER COORDINATES
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Store Concierge Email
              </label>
              <input
                type="email"
                name="store_email"
                value={formData.store_email || ''}
                onChange={handleChange}
                className="luxury-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Telephone Number
              </label>
              <input
                type="text"
                name="store_phone"
                value={formData.store_phone || ''}
                onChange={handleChange}
                className="luxury-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                WhatsApp Concierge (Digits Only)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number || ''}
                onChange={handleChange}
                placeholder="e.g. 919876543210"
                className="luxury-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
              Atelier Physical Addresses
            </label>
            <textarea
              rows={2}
              name="store_address"
              value={formData.store_address || ''}
              onChange={handleChange}
              className="luxury-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleChange}
                className="luxury-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                name="facebook_url"
                value={formData.facebook_url || ''}
                onChange={handleChange}
                className="luxury-input"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="luxury-btn-primary py-3 px-8 text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'SAVING CONFIGURATION...' : 'SAVE SETTINGS'}
          </button>
        </div>

      </form>
    </div>
  );
};
