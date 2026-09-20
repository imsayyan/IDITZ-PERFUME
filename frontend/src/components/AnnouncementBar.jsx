import React from 'react';
import { useSettings } from '../context/SettingsContext';

export const AnnouncementBar = () => {
  const { settings } = useSettings();
  const text = settings.announcement_text || 'COMPLIMENTARY EXPRESS AIR DELIVERY ACROSS INDIA ON ORDERS ABOVE ₹999';

  return (
    <div className="bg-[#0c0c0c] text-luxury-gold/90 text-[10.5px] sm:text-[11px] tracking-[0.25em] uppercase py-2 px-4 border-b border-luxury-gold/25 flex items-center justify-center font-medium text-center">
      <span>{text}</span>
    </div>
  );
};
