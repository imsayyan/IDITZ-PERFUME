import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FragranceFamilyFilter = () => {
  const families = [
    {
      name: 'Oud',
      desc: 'Rare wild Assam agarwood, aged resinous intensity & smoked leather',
      icon: '🪵',
      bg: 'from-amber-950/20 to-stone-900/10'
    },
    {
      name: 'Woody',
      desc: 'Creamy Mysore Santalum album, Himalayan cedar & guaiacwood',
      icon: '🌲',
      bg: 'from-amber-900/15 to-stone-900/10'
    },
    {
      name: 'Floral',
      desc: 'Hydro-distilled Kannauj Gulab, Madurai Mogra & Rajnigandha',
      icon: '🌸',
      bg: 'from-rose-900/15 to-pink-900/10'
    },
    {
      name: 'Fresh',
      desc: 'Monsoon petrichor, wild green Ruh Khus & mountain dew',
      icon: '🍃',
      bg: 'from-emerald-950/20 to-teal-900/10'
    },
    {
      name: 'Citrus',
      desc: 'Calabrian bergamot, Nagpur mandarin & crisp juniper',
      icon: '🍊',
      bg: 'from-orange-950/15 to-amber-900/10'
    },
    {
      name: 'Amber',
      desc: 'Golden Baltic ambergris, labdanum resin & warm benzoin',
      icon: '✨',
      bg: 'from-amber-900/20 to-yellow-950/15'
    },
    {
      name: 'Musk',
      desc: 'Velvety white musk, cashmeran cocoon & soft sandalwood',
      icon: '🕊️',
      bg: 'from-stone-900/10 to-stone-800/10'
    },
    {
      name: 'Vanilla',
      desc: 'Madagascar bourbon vanilla pod, blonde tobacco & tonka',
      icon: '🍦',
      bg: 'from-amber-950/15 to-orange-950/10'
    },
    {
      name: 'Spicy',
      desc: 'Pampore saffron, Idukki cardamom & Tellicherry pepper',
      icon: '🌶️',
      bg: 'from-red-950/15 to-amber-950/10'
    }
  ];

  return (
    <section className="py-20 bg-luxury-ivory/60 border-b border-luxury-lightBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-luxury-goldDark text-xs font-semibold tracking-wide-luxury uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Botanical Taxonomies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-black tracking-tight">
            SHOP BY FRAGRANCE FAMILY
          </h2>
          <div className="w-16 h-0.5 bg-luxury-gold mx-auto my-3" />
          <p className="text-luxury-charcoal/80 text-sm font-light">
            Navigate through our 9 distinct olfactory dimensions, each masterfully composed to harmonize with body chemistry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((fam) => (
            <Link
              key={fam.name}
              to={`/shop?fragrance_family=${fam.name}`}
              className="group bg-white p-6 border border-luxury-lightBorder hover:border-luxury-gold transition-all duration-300 shadow-subtle hover:shadow-luxury flex items-start gap-4"
            >
              <div className="w-12 h-12 flex-shrink-0 bg-luxury-cream border border-luxury-gold/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {fam.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-luxury-black group-hover:text-luxury-goldDark transition-colors">
                    {fam.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-luxury-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-luxury-charcoal/70 mt-1 font-light leading-relaxed">
                  {fam.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
