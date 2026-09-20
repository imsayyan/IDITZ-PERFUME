import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const cleanWhatsappNumber = (num) => {
  if (!num) return '919986324619';
  const clean = String(num).replace(/[^0-9]/g, '');
  if (clean.length === 10) return `91${clean}`;
  return clean;
};

export const Footer = () => {
  const { settings } = useSettings();

  const brandName = settings.brand_name || 'IDITZ PERFUME';
  const whatsappNumber = cleanWhatsappNumber(settings.whatsapp_number || '9986324619');

  return (
    <footer className="bg-luxury-black text-luxury-ivory border-t border-luxury-gold/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-luxury-gold/20">
          
          {/* Col 1 & 2: Brand Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <img
                src="/iditz-logo.jpg"
                alt={brandName}
                className="w-12 h-12 rounded-full object-cover border border-luxury-gold/50 shadow-md group-hover:border-luxury-gold transition-colors"
              />
              <div>
                <span className="font-display font-extrabold tracking-[0.22em] text-xl sm:text-2xl text-white block leading-tight">
                  {brandName}
                </span>
                <span className="text-[9px] tracking-[0.3em] text-luxury-gold uppercase font-semibold block mt-1">
                  MORE THAN A FRAGRANCE • INDIA
                </span>
              </div>
            </Link>

            <p className="text-xs text-luxury-ivory/70 font-light leading-relaxed max-w-sm">
              Artisanal Indian fragrances handcrafted in small batches using ancient hydro-distillation in Kannauj and aged in sandalwood flacons. Formulated for the connoisseurs of fine living.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings.instagram_url || 'https://instagram.com/iditzperfume'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook_url || 'https://facebook.com/iditzperfume'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Greetings%2C%20I%20would%20like%20to%20inquire%20about%20IDITZ%20Perfume`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold flex items-center justify-center transition-colors"
                aria-label="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold">
              Olfactory Realms
            </h4>
            <ul className="space-y-2 text-xs text-luxury-ivory/70 font-light">
              <li>
                <Link to="/shop" className="hover:text-luxury-gold transition-colors">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=men" className="hover:text-luxury-gold transition-colors">
                  Men's Extrait
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=women" className="hover:text-luxury-gold transition-colors">
                  Women's Flacons
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=unisex" className="hover:text-luxury-gold transition-colors">
                  Unisex Elixirs
                </Link>
              </li>
              <li>
                <Link to="/shop?fragrance_family=Oud" className="hover:text-luxury-gold transition-colors">
                  Royal Assam Oud
                </Link>
              </li>
              <li>
                <Link to="/shop?category=attar" className="hover:text-luxury-gold transition-colors">
                  Heritage Attar Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: The House & Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold">
              Client Care & Policies
            </h4>
            <ul className="space-y-2 text-xs text-luxury-ivory/70 font-light">
              <li>
                <Link to="/about" className="hover:text-luxury-gold transition-colors">
                  The IDITZ Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-luxury-gold transition-colors">
                  Atelier Concierge
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=shipping" className="hover:text-luxury-gold transition-colors">
                  Pan-India Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=refund" className="hover:text-luxury-gold transition-colors">
                  Refund & Bottle Replacement
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=privacy" className="hover:text-luxury-gold transition-colors">
                  Privacy Governance
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=terms" className="hover:text-luxury-gold transition-colors">
                  Terms of Haute Parfumerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Ateliers & Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold">
              Private Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-luxury-ivory/75 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                <span>{settings.store_address || 'IDITZ Atelier, Heritage Quarter'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <span>{settings.store_phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <span>{settings.store_email || 'concierge@iditzperfume.com'}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[11px] font-semibold tracking-wider hover:bg-emerald-900 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp Chat
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & INR Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-luxury-ivory/50 font-light gap-4">
          <p>© {new Date().getFullYear()} {brandName}. All Rights Reserved. Mastercrafted in India.</p>
          <div className="flex items-center gap-4">
            <span>Prices displayed in Indian Rupees (₹ INR)</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('play-iditz-intro'))}
              className="hover:text-luxury-gold transition-colors text-luxury-gold/70"
            >
              Replay Intro
            </button>
            <span>•</span>
            <Link to="/admin" className="hover:text-luxury-gold transition-colors text-luxury-goldDark">
              Administrative Suite
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
