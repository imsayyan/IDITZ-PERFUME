import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const FeaturedCollections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const res = await api.getProducts({ limit: 50 });
        if (isMounted && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load featured collection products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to safely get the first valid image URL
  const getProductImage = (prod) => {
    if (!prod) return null;
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      return prod.images[0];
    }
    if (typeof prod.images === 'string' && prod.images.trim()) {
      return prod.images.trim();
    }
    return null;
  };

  // Find real representative products from the database
  const menProduct = products.find((p) => p.gender === 'men') || null;
  const womenProduct = products.find((p) => p.gender === 'women') || null;
  const unisexProduct = products.find((p) => p.gender === 'unisex') || null;

  // Real Oud product from database
  const oudProduct =
    products.find(
      (p) =>
        p.name?.toLowerCase().includes('oud') ||
        p.slug?.toLowerCase().includes('oud') ||
        p.fragrance_family?.toLowerCase().includes('oud')
    ) ||
    products.find((p) => p.gender === 'unisex') ||
    products[0] ||
    null;

  // Real Bestseller or Featured product from database
  const featuredProduct =
    products.find((p) => p.is_bestseller === 1 || p.is_featured === 1) ||
    products.find((p) => p.id !== oudProduct?.id && p.gender === 'men') ||
    products.find((p) => p.id !== oudProduct?.id) ||
    products[0] ||
    null;

  // Definition of the 3 primary category cards
  const categoryCards = [
    {
      id: 'men',
      categoryTitle: "Men's Perfumes",
      badge: 'Bestselling Fragrances',
      product: menProduct,
      link: '/shop?gender=men',
      fallbackText: 'Bold, masculine extraits driven by rare woods and spice'
    },
    {
      id: 'women',
      categoryTitle: "Women's Perfumes",
      badge: 'Artisanal Florals',
      product: womenProduct,
      link: '/shop?gender=women',
      fallbackText: 'Intoxicating florals, velvety musks and amber elixirs'
    },
    {
      id: 'unisex',
      categoryTitle: 'Unisex Perfumes',
      badge: 'Signature Blends',
      product: unisexProduct,
      link: '/shop?gender=unisex',
      fallbackText: 'Transcendent, genderless compositions of rare woods and amber'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-luxury-cream border-b border-luxury-lightBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-luxury-goldDark text-xs font-semibold tracking-wide-luxury uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Olfactory Realms</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-luxury-black tracking-tight">
            FEATURED COLLECTIONS
          </h2>
          <div className="w-16 h-0.5 bg-luxury-gold mx-auto my-3" />
          <p className="text-luxury-charcoal/80 text-xs sm:text-sm font-light leading-relaxed">
            Each collection is a sensory journey into the botanical soul of the subcontinent, crafted in small batches for lasting distinction.
          </p>
        </div>

        {/* Top 3 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoryCards.map((col) => {
            const prod = col.product;
            const imgUrl = getProductImage(prod);

            return (
              <Link
                key={col.id}
                to={col.link}
                className="group relative bg-white border border-luxury-lightBorder hover:border-luxury-gold transition-all duration-500 overflow-hidden shadow-subtle hover:shadow-luxury flex flex-col justify-between"
              >
                {/* Text Content */}
                <div className="p-6 sm:p-8 pb-4 flex-1 flex flex-col justify-between z-10">
                  <div>
                    <span className="text-[10px] font-semibold tracking-luxury uppercase text-luxury-goldDark block mb-1">
                      {col.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-luxury-black group-hover:text-luxury-goldDark transition-colors">
                      {col.categoryTitle}
                    </h3>

                    {/* Real Perfume Name from Database */}
                    {prod ? (
                      <div className="mt-2.5 space-y-1">
                        <p className="text-xs font-serif font-semibold text-luxury-charcoal group-hover:text-luxury-black transition-colors">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-luxury-charcoal/70 font-light leading-relaxed">
                          {prod.size ? `${prod.size} • ` : ''}
                          <span className="font-semibold text-luxury-black">₹{prod.price?.toLocaleString('en-IN')}</span>
                          {prod.mrp > prod.price && (
                            <span className="text-luxury-charcoal/50 line-through ml-1.5 text-[10px]">
                              ₹{prod.mrp?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-luxury-charcoal/70 mt-2 font-light leading-relaxed">
                        {col.fallbackText}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-luxury uppercase text-luxury-black group-hover:text-luxury-goldDark transition-colors">
                    Explore Collection <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Real Perfume Flacon Image from Database */}
                <div className="relative aspect-[4/3] bg-[#F8F6F2] flex items-center justify-center p-6 border-t border-luxury-lightBorder overflow-hidden">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={prod?.name || col.categoryTitle}
                      className="max-h-48 sm:max-h-52 w-auto object-contain filter drop-shadow-md transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-44 flex items-center justify-center text-luxury-charcoal/40 text-xs font-serif">
                      IDITZ Artisanal Flacon
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom 2 Featured Banners (Oud Collection & Bestsellers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
          
          {/* Oud Collection Banner */}
          {oudProduct && (
            <Link
              to={`/product/${oudProduct.slug}`}
              className="group relative bg-luxury-black text-luxury-ivory p-6 sm:p-8 border border-luxury-gold/30 hover:border-luxury-gold transition-all duration-500 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
            >
              <div className="space-y-2 text-center sm:text-left z-10 flex-1 min-w-0">
                <span className="text-[10px] font-semibold tracking-wide-luxury uppercase text-luxury-gold">
                  RARE RESERVES
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-luxury-goldLight transition-colors">
                  The Oud Collection
                </h3>
                <p className="text-sm font-serif font-medium text-luxury-goldLight truncate">
                  {oudProduct.name}
                </p>
                <p className="text-xs text-luxury-ivory/75 font-light leading-relaxed">
                  Wild Assam agarwood aged 12+ years in copper vessels. ₹{oudProduct.price?.toLocaleString('en-IN')}
                </p>
                <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-luxury uppercase text-luxury-gold group-hover:text-white transition-colors">
                  View Realm <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="w-32 sm:w-36 h-36 sm:h-44 flex-shrink-0 flex items-center justify-center bg-luxury-noir/80 border border-luxury-gold/20 p-3 shadow-inner">
                {getProductImage(oudProduct) ? (
                  <img
                    src={getProductImage(oudProduct)}
                    alt={oudProduct.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-luxury-gold text-xs font-serif">IDITZ Oud</div>
                )}
              </div>
            </Link>
          )}

          {/* Bestsellers / Featured Collection Banner */}
          {featuredProduct && (
            <Link
              to={`/product/${featuredProduct.slug}`}
              className="group relative bg-luxury-black text-luxury-ivory p-6 sm:p-8 border border-luxury-gold/30 hover:border-luxury-gold transition-all duration-500 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
            >
              <div className="space-y-2 text-center sm:text-left z-10 flex-1 min-w-0">
                <span className="text-[10px] font-semibold tracking-wide-luxury uppercase text-luxury-gold">
                  ROYAL MASTERPIECES
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-luxury-goldLight transition-colors">
                  Bestseller Collection
                </h3>
                <p className="text-sm font-serif font-medium text-luxury-goldLight truncate">
                  {featuredProduct.name}
                </p>
                <p className="text-xs text-luxury-ivory/75 font-light leading-relaxed">
                  Crowned signature extrait, blended for 12+ hours distinction. ₹{featuredProduct.price?.toLocaleString('en-IN')}
                </p>
                <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-luxury uppercase text-luxury-gold group-hover:text-white transition-colors">
                  Explore Bestseller <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="w-32 sm:w-36 h-36 sm:h-44 flex-shrink-0 flex items-center justify-center bg-luxury-noir/80 border border-luxury-gold/20 p-3 shadow-inner">
                {getProductImage(featuredProduct) ? (
                  <img
                    src={getProductImage(featuredProduct)}
                    alt={featuredProduct.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-luxury-gold text-xs font-serif">IDITZ Extrait</div>
                )}
              </div>
            </Link>
          )}

        </div>

      </div>
    </section>
  );
};
