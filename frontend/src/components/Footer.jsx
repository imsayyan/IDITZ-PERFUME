import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, MessageCircle, Check, ArrowRight } from 'lucide-react';

const cleanWhatsappNumber = (num) => {
  if (!num) return '919986324619';
  const clean = String(num).replace(/[^0-9]/g, '');
  if (clean.length === 10) return `91${clean}`;
  return clean;
};

const cleanPhoneNumber = (num) => {
  if (!num) return '+919986324619';
  return String(num).replace(/\s+/g, '');
};

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

export const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const brandName = settings.brand_name || 'IDITZ PERFUME';
  const whatsappNumber = cleanWhatsappNumber(settings.whatsapp_number || '9986324619');
  const storePhone = settings.store_phone || '+91 99863 24619';
  const storeEmail = settings.store_email || 'concierge@iditzperfume.com';
  const storeAddress = settings.store_address || 'IDITZ Atelier, Bangalore South';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4500);
  };

  return (
    <footer className="bg-[#0b0a09] text-luxury-ivory border-t border-luxury-gold/30 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14">
          
          {/* COLUMN 1: IDITZ PERFUME */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/iditz-logo.jpg"
                alt={brandName}
                className="w-11 h-11 rounded-full object-cover border border-luxury-gold/50 shadow-md group-hover:border-luxury-gold transition-colors"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <h3 className="font-display font-extrabold tracking-[0.2em] text-lg sm:text-xl text-white block leading-tight">
                  {brandName}
                </h3>
                <span className="text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block mt-0.5">
                  More Than A Fragrance • India
                </span>
              </div>
            </Link>

            <p className="text-xs text-luxury-ivory/70 font-light leading-relaxed">
              Artisanal Indian haute parfumerie handcrafted in small batches using ancient hydro-distillation and aged botanical extraits for fine living connoisseurs.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center space-x-2.5">
              <a
                href={settings.instagram_url || 'https://instagram.com/iditzperfume'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold flex items-center justify-center transition-colors hover:bg-luxury-gold/10"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings.facebook_url || 'https://facebook.com/iditzperfume'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold flex items-center justify-center transition-colors hover:bg-luxury-gold/10"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Greetings%20IDITZ%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20IDITZ%20Perfumes`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold flex items-center justify-center transition-colors hover:bg-luxury-gold/10"
                aria-label="WhatsApp Concierge"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: SHOP */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold border-b border-luxury-gold/20 pb-2">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-luxury-ivory/75 font-light">
              <li>
                <Link to="/shop" className="hover:text-luxury-gold transition-colors block">
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=men" className="hover:text-luxury-gold transition-colors block">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=women" className="hover:text-luxury-gold transition-colors block">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=unisex" className="hover:text-luxury-gold transition-colors block">
                  Unisex
                </Link>
              </li>
              <li>
                <Link to="/shop?is_bestseller=1" className="hover:text-luxury-gold transition-colors block">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/shop?sortBy=newest" className="hover:text-luxury-gold transition-colors block">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CUSTOMER CARE */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold border-b border-luxury-gold/20 pb-2">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-luxury-ivory/75 font-light">
              <li>
                <Link to="/contact" className="hover:text-luxury-gold transition-colors block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=shipping" className="hover:text-luxury-gold transition-colors block">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=shipping" className="hover:text-luxury-gold transition-colors block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=refund" className="hover:text-luxury-gold transition-colors block">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=privacy" className="hover:text-luxury-gold transition-colors block">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=terms" className="hover:text-luxury-gold transition-colors block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold border-b border-luxury-gold/20 pb-2">
              CONTACT
            </h4>
            <div className="space-y-3 text-xs text-luxury-ivory/80 font-light">
              
              {/* Atelier Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-luxury-gold/80 uppercase tracking-wider font-semibold block">IDITZ Atelier</span>
                  <span className="leading-relaxed">{storeAddress}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-luxury-gold/80 uppercase tracking-wider font-semibold block">Phone</span>
                  <a
                    href={`tel:${cleanPhoneNumber(storePhone)}`}
                    className="hover:text-luxury-gold transition-colors"
                  >
                    {storePhone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-luxury-gold/80 uppercase tracking-wider font-semibold block">Email</span>
                  <a
                    href={`mailto:${storeEmail}`}
                    className="hover:text-luxury-gold transition-colors break-all"
                  >
                    {storeEmail}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-2.5 pt-1">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold block">WhatsApp</span>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Greetings%20IDITZ%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20IDITZ%20Perfumes`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-300 transition-colors underline font-medium"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* STAY IN THE SCENT Newsletter Section */}
        <div className="py-8 border-t border-luxury-gold/20">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold">
              STAY IN THE SCENT
            </h4>
            <p className="text-xs text-luxury-ivory/70 font-light">
              Receive private invitations, olfactory archives & limited batch releases.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 bg-white/10 border border-luxury-gold/40 text-xs px-4 py-2.5 text-luxury-ivory placeholder:text-luxury-ivory/40 focus:outline-none focus:border-luxury-gold"
              />
              <button
                type="submit"
                className="luxury-btn-primary text-xs py-2.5 px-6 whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3 h-3 text-luxury-gold" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent my-6" />

        {/* Bottom Bar: Copyright & Policies */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-luxury-ivory/60 font-light gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-luxury-ivory/90 font-medium">
              © {new Date().getFullYear()} {brandName}
            </p>
            <p className="text-[11px] text-luxury-ivory/50">
              Made in India • Prices in INR (₹)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11.5px]">
            <Link to="/policies?tab=privacy" className="hover:text-luxury-gold transition-colors">
              Privacy
            </Link>
            <span className="text-luxury-gold/40">•</span>
            <Link to="/policies?tab=terms" className="hover:text-luxury-gold transition-colors">
              Terms
            </Link>
            <span className="text-luxury-gold/40">•</span>
            <Link to="/policies?tab=refund" className="hover:text-luxury-gold transition-colors">
              Returns
            </Link>
            <span className="text-luxury-gold/40">•</span>
            <Link to="/admin" className="hover:text-luxury-gold transition-colors text-luxury-goldDark">
              Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
