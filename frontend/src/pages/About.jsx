import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { Droplets, Award, Feather, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const About = () => {
  const [featuredProduct, setFeaturedProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        const data = await api.getProducts({ limit: 10 });
        if (isMounted && data.products && data.products.length > 0) {
          const premier =
            data.products.find((p) => p.is_bestseller === 1 || p.is_featured === 1) ||
            data.products.find((p) => p.price >= 2000) ||
            data.products[0];
          setFeaturedProduct(premier);
        }
      } catch (err) {
        console.error('Failed to load featured perfume for About page:', err);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, []);

  const productImage = featuredProduct
    ? Array.isArray(featuredProduct.images) && featuredProduct.images.length > 0
      ? featuredProduct.images[0]
      : typeof featuredProduct.images === 'string'
      ? featuredProduct.images
      : null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        
        {/* Editorial Hero */}
        <section className="bg-luxury-black text-luxury-ivory py-20 px-4 sm:px-6 lg:px-8 border-b border-luxury-gold/30 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-[11px] font-semibold tracking-wide-luxury uppercase text-luxury-gold">
              The Heritage of IDITZ
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              MODERN INDIAN HAUTE PARFUMERIE
            </h1>
            <div className="w-16 h-0.5 bg-luxury-gold mx-auto my-3" />
            <p className="text-xs sm:text-sm text-luxury-ivory/80 font-light leading-relaxed max-w-xl mx-auto">
              Reclaiming India’s rightful stature as the historic cradle of world fragrance through artisanal distillation, uncompromising extrait concentration, and modern aesthetics.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-xs text-luxury-charcoal leading-relaxed font-light">
              <span className="text-[11px] font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block">
                Chapter I
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
                The Forgotten Crucible of Scent
              </h2>
              <p>
                Centuries before modern Grasse established its perfume guilds, the royal courts of Kannauj, Ujjain, and Jaipur were producing sophisticated aromatic compositions referenced in classical Sanskrit treatises like the <em>Brihat Samhita</em>.
              </p>
              <p>
                At <strong>IDITZ PERFUME</strong>, we refuse to dilute this legacy with synthetic shortcuts. Every formulation begins with genuine botanical absolutes sourced directly from multi-generational family growers across India.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-luxury uppercase text-luxury-goldDark hover:text-luxury-black transition-colors"
                >
                  Explore Our Creations <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Real Database Flacon Showcase */}
            <div className="bg-white p-6 sm:p-8 border border-luxury-lightBorder shadow-luxury flex flex-col items-center justify-center relative group">
              <div className="relative w-full aspect-[4/5] bg-[#F8F6F2] flex items-center justify-center p-6 border border-luxury-lightBorder/70 overflow-hidden">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={featuredProduct?.name || 'IDITZ Artisanal Flacon'}
                    className="max-h-72 w-auto object-contain filter drop-shadow-lg transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-luxury-charcoal/40 text-xs font-serif">
                    IDITZ Artisanal Flacon
                  </div>
                )}
              </div>

              {featuredProduct && (
                <div className="w-full mt-4 pt-3 border-t border-luxury-lightBorder/80 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-serif font-bold text-luxury-black truncate">
                      {featuredProduct.name}
                    </p>
                    <p className="text-[10px] text-luxury-goldDark uppercase tracking-wider font-semibold">
                      Extrait de Parfum • {featuredProduct.size || '100ml'}
                    </p>
                  </div>
                  <Link
                    to={`/product/${featuredProduct.slug}`}
                    className="text-xs font-semibold text-luxury-black hover:text-luxury-goldDark transition-colors whitespace-nowrap"
                  >
                    View Flacon →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-luxury-lightBorder">
            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-3">
              <div className="w-10 h-10 bg-luxury-ivory border border-luxury-gold/30 text-luxury-goldDark flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-luxury-black">Wood-Fired Stills</h3>
              <p className="text-xs text-luxury-charcoal/80 font-light leading-relaxed">
                Hydro-distillation in copper degs sealed with organic clay, capturing fragile floral notes without thermal breakdown.
              </p>
            </div>

            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-3">
              <div className="w-10 h-10 bg-luxury-ivory border border-luxury-gold/30 text-luxury-goldDark flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-luxury-black">30% Extrait Strength</h3>
              <p className="text-xs text-luxury-charcoal/80 font-light leading-relaxed">
                Formulated at pure Extrait concentration, guaranteeing unprecedented sillage and longevity on skin across seasons.
              </p>
            </div>

            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-3">
              <div className="w-10 h-10 bg-luxury-ivory border border-luxury-gold/30 text-luxury-goldDark flex items-center justify-center">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-luxury-black">Small-Batch Harvests</h3>
              <p className="text-xs text-luxury-charcoal/80 font-light leading-relaxed">
                Every batch is aged 90 days and stamped by our master perfumer, ensuring unyielding exclusivity and fidelity.
              </p>
            </div>
          </div>

          {/* Invitation CTA */}
          <div className="bg-luxury-ivory p-8 sm:p-12 border border-luxury-gold/40 text-center space-y-4">
            <h3 className="text-2xl font-serif font-bold text-luxury-black">
              Experience the Olfactory Transcendence
            </h3>
            <p className="text-xs text-luxury-charcoal max-w-md mx-auto">
              Find the scent that encapsulates your aura. Our bespoke flacons are delivered express across all corners of India.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="luxury-btn-primary text-xs py-3 px-8">
                EXPLORE ALL EXTRAITS
              </Link>
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};
