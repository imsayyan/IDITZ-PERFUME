import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Droplets, Feather } from 'lucide-react';

export const IndianLuxuryStory = () => {
  const pillars = [
    {
      icon: Droplets,
      title: 'Deg & Bhapka Distillation',
      desc: 'Our florals are steam-distilled in Kannauj using centuries-old wood-fired copper stills that preserve volatile botanical facets impossible to replicate with modern chemical solvents.'
    },
    {
      icon: Award,
      title: 'Regulated Wild Assam Agarwood',
      desc: 'Sourced ethically from aged Aquilaria trees in Upper Assam, macerated in vintage barrels to yield rich, authentic animalic nuances without synthetic boosters.'
    },
    {
      icon: Feather,
      title: 'True Mysore Sandalwood',
      desc: 'Formulated exclusively with legal, government-certified Santalum album heartwood from Karnataka, prized worldwide for its creamy, buttery longevity.'
    }
  ];

  return (
    <section className="py-24 bg-luxury-noir text-luxury-ivory relative overflow-hidden border-b border-luxury-gold/30">
      {/* Subtle gold ambient glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-luxury-gold/30 p-4 bg-luxury-charcoal/40 shadow-2xl">
              <div className="aspect-[4/5] bg-luxury-black/80 flex items-center justify-center p-8 overflow-hidden relative">
                {/* Visual Graphic Representation of Mysore Sandalwood & Cardamom */}
                <img
                  src="/images/perfumes/mysore-sandalwood-cardamom.svg"
                  alt="Crafted with the Soul of India"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.9)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 border border-luxury-gold/40 bg-luxury-noir/80 backdrop-blur-md p-4 text-center">
                  <p className="text-[10px] uppercase tracking-wide-luxury text-luxury-gold font-semibold">
                    THE INDIAN BOTANICAL GUILD
                  </p>
                  <p className="font-serif text-sm font-bold text-white mt-0.5">
                    Kannauj • Assam • Kashmir • Mysore
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-luxury-gold text-xs font-semibold tracking-wide-luxury uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Indian Haute Parfumerie</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              CRAFTED WITH THE <br />
              <span className="italic font-normal text-luxury-goldLight">SOUL OF INDIA</span>
            </h2>

            <div className="w-20 h-0.5 bg-luxury-gold" />

            <p className="text-luxury-ivory/80 text-sm sm:text-base font-light leading-relaxed">
              For thousands of years, India was the aromatic center of the civilized world — supplier of frankincense to Babylon, saffron to Rome, and sandalwood to celestial temples. 
              <strong className="text-white font-medium"> IDITZ PERFUME</strong> was born to reclaim this heritage through a modern lens: uncompromising luxury, pristine European flacon architecture, and the deepest natural distillates our soil can produce.
            </p>

            {/* 3 Pillars */}
            <div className="pt-4 space-y-5">
              {pillars.map((pil) => {
                const Icon = pil.icon;
                return (
                  <div key={pil.title} className="flex items-start gap-4 p-3.5 border border-luxury-gold/15 bg-luxury-charcoal/20">
                    <div className="p-2.5 bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white tracking-wide">
                        {pil.title}
                      </h4>
                      <p className="text-xs text-luxury-ivory/70 mt-1 font-light leading-relaxed">
                        {pil.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="luxury-btn-gold inline-flex"
              >
                READ THE HERITAGE MANIFESTO
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
