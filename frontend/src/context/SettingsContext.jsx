import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    brand_name: 'IDITZ PERFUME',
    brand_tagline: 'More Than A Fragrance',
    store_email: 'concierge@iditzperfume.com',
    store_phone: '+91 98765 43210',
    whatsapp_number: '919876543210',
    store_address: 'IDITZ Atelier, Bangalore South',
    shipping_charge: '150',
    free_shipping_threshold: '999',
    cod_available: '1',
    currency: '₹',
    instagram_url: 'https://instagram.com/iditzperfume',
    facebook_url: 'https://facebook.com/iditzperfume',
    announcement_text: 'COMPLIMENTARY EXPRESS AIR DELIVERY ACROSS INDIA ON ORDERS ABOVE ₹999'
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Using default store settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
