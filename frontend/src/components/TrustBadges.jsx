import React from 'react';
import { ShieldCheck, Clock, Award, Package, Truck, Banknote, CreditCard, Headphones } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: Award,
      title: 'Extrait de Parfum',
      desc: '30%+ precious perfume oil concentration for unrivaled depth'
    },
    {
      icon: Clock,
      title: '12+ Hour Sillage',
      desc: 'Macerated for 90 days to ensure remarkable longevity on Indian skin'
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      desc: 'Formulated with certified indigenous Indian botanicals & rare resins'
    },
    {
      icon: Package,
      title: 'Secure Luxury Packaging',
      desc: 'Double-walled flacon protection with velvet sleeve & tamper seal'
    },
    {
      icon: Truck,
      title: 'Pan-India Express',
      desc: 'Dispatched via blazingly fast air courier to all major Indian pincodes'
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      desc: 'Pay conveniently upon receiving your flacon at your doorstep'
    },
    {
      icon: CreditCard,
      title: 'Encrypted Payments',
      desc: 'Seamless UPI, Cards & Netbanking with military-grade 256-bit encryption'
    },
    {
      icon: Headphones,
      title: 'Dedicated Concierge',
      desc: 'Personalized fragrance consultation via WhatsApp & telephone'
    }
  ];

  return (
    <section className="py-16 bg-luxury-cream border-b border-luxury-lightBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block mb-1">
            The IDITZ Assurance
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black tracking-tight">
            WHY CONNOISSEURS CHOOSE IDITZ
          </h2>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto my-2.5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white p-5 border border-luxury-lightBorder/80 hover:border-luxury-gold transition-all duration-300 text-center flex flex-col items-center justify-start shadow-subtle group"
              >
                <div className="w-11 h-11 bg-luxury-ivory text-luxury-goldDark border border-luxury-gold/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-luxury-gold group-hover:text-luxury-black transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-luxury-black mb-1">
                  {b.title}
                </h4>
                <p className="text-[11px] text-luxury-charcoal/70 font-light leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
