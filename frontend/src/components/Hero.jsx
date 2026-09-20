import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const Hero = () => {
  const [heroProduct, setHeroProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHeroProduct = async () => {
      try {
        const data = await api.getProducts({ limit: 20 });
        if (isMounted && data.products && data.products.length > 0) {
          // Select flagship product: bestseller/featured or highest price, or first active
          const premier =
            data.products.find((p) => p.is_bestseller === 1 || p.is_featured === 1) ||
            data.products.find((p) => p.price >= 2500) ||
            data.products[0];
          setHeroProduct(premier);
        }
      } catch (err) {
        console.error('Failed to load hero product:', err);
      }
    };

    fetchHeroProduct();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroImage = heroProduct
    ? Array.isArray(heroProduct.images) && heroProduct.images.length > 0
      ? heroProduct.images[0]
      : typeof heroProduct.images === 'string'
      ? heroProduct.images
      : null
    : null;

  return (
    <section className="relative bg-luxury-black text-luxury-ivory overflow-hidden border-b border-luxury-gold/30">
      {/* Background Radial Glow & Watermarks */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-luxury-charcoal via-luxury-noir to-luxury-black opacity-90" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Gold Border Lines */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-luxury-gold/15 pointer-events-none hidden sm:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-luxury-gold/40 bg-luxury-gold/10 text-luxury-gold text-[11px] font-semibold tracking-luxury uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ROYAL INDIAN FRAGRANCE COLLECTION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-[1.15] text-white">
              SCENTS THAT <br />
              <span className="italic font-normal bg-gradient-to-r from-luxury-goldLight via-luxury-gold to-luxury-goldDark bg-clip-text text-transparent">
                DEFINE YOU
              </span>
            </h1>

            <p className="text-luxury-ivory/80 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Discover refined Extrait de Parfum handcrafted with rare Assam Agarwood, Kannauj hydro-distilled Rose, Kashmiri Saffron, and Mysore Sandalwood. Hand-bottled to transcend time.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop?gender=men"
                className="w-full sm:w-auto luxury-btn-gold text-center"
              >
                SHOP MEN
              </Link>
              <Link
                to="/shop?gender=women"
                className="w-full sm:w-auto luxury-btn-primary text-center"
              >
                SHOP WOMEN
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold tracking-luxury uppercase text-luxury-gold hover:text-white transition-colors inline-flex items-center justify-center gap-2 group"
              >
                EXPLORE ALL <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-luxury-gold/20 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="font-serif text-lg font-bold text-luxury-goldLight">100%</p>
                <p className="text-[10px] uppercase tracking-luxury text-luxury-ivory/60 font-medium">Extrait Strength</p>
              </div>
              <div className="text-center lg:text-left border-x border-luxury-gold/20 px-2">
                <p className="font-serif text-lg font-bold text-luxury-goldLight">14+ Hrs</p>
                <p className="text-[10px] uppercase tracking-luxury text-luxury-ivory/60 font-medium">Long-Lasting</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-serif text-lg font-bold text-luxury-goldLight">Pan-India</p>
                <p className="text-[10px] uppercase tracking-luxury text-luxury-ivory/60 font-medium">Express Shipping</p>
              </div>
            </div>
          </div>

          {/* Right Hero Cinematic Product Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Back Glow Ring */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-luxury-gold/30 via-luxury-goldLight/10 to-transparent blur-2xl animate-pulse" />

            {/* Featured Flacon Presentation Card */}
            <div className="relative group max-w-sm w-full">
              <div className="relative bg-gradient-to-b from-luxury-charcoal/80 to-luxury-black/90 p-6 border border-luxury-gold/40 shadow-2xl backdrop-blur-sm">
                
                {/* Product Tag */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-semibold tracking-luxury uppercase text-luxury-gold">
                    SIGNATURE EXTRAIT
                  </span>
                  <span className="text-[10px] font-medium tracking-luxury uppercase bg-luxury-gold/20 text-luxury-goldLight px-2 py-0.5 border border-luxury-gold/30">
                    CROWN CREATION
                  </span>
                </div>

                {/* Hero Perfume Graphic */}
                {heroProduct ? (
                  <Link
                    to={`/product/${heroProduct.slug}`}
                    className="block relative overflow-hidden aspect-[4/5] bg-luxury-noir/60 border border-luxury-gold/20 flex items-center justify-center p-4 group-hover:border-luxury-gold/50 transition-colors"
                  >
                    {heroImage ? (
                      <img
                        src={heroImage}
                        alt={heroProduct.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                      />
                    ) : (
                      <div className="text-luxury-gold/60 text-xs font-serif">IDITZ Parfums</div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 bg-luxury-black/85 backdrop-blur-md p-2.5 border border-luxury-gold/30 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-serif font-bold text-luxury-ivory truncate">{heroProduct.name}</p>
                        <p className="text-[10px] text-luxury-gold truncate">
                          Extrait de Parfum • {heroProduct.size || '100ml'}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        ₹{heroProduct.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="aspect-[4/5] bg-luxury-noir/60 border border-luxury-gold/20 flex items-center justify-center">
                    <span className="text-xs font-serif text-luxury-gold/60">Loading Crown Creation...</span>
                  </div>
                )}

                {/* Quick Action under hero bottle */}
                <div className="mt-4 pt-4 border-t border-luxury-gold/20 flex items-center justify-between text-xs">
                  <span className="text-luxury-ivory/70 text-[11px]">Hand-blended in Kannauj & Jaipur</span>
                  {heroProduct && (
                    <Link
                      to={`/product/${heroProduct.slug}`}
                      className="text-luxury-gold hover:text-white font-semibold flex items-center gap-1 group/link"
                    >
                      Discover Notes <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
