import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedCollections } from '../components/FeaturedCollections';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { TrustBadges } from '../components/TrustBadges';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { api } from '../services/api';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [bestRes, allRes] = await Promise.all([
          api.getProducts({ is_bestseller: '1', limit: 4 }),
          api.getProducts({ sortBy: 'newest', limit: 8 })
        ]);

        const bestList = bestRes.products && bestRes.products.length > 0
          ? bestRes.products
          : (allRes.products || []).slice(0, 4);

        setBestsellers(bestList);
        setNewArrivals(allRes.products || []);
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Bestsellers Section */}
        <section className="py-20 bg-white border-b border-luxury-lightBorder">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 text-luxury-goldDark text-xs font-semibold tracking-wide-luxury uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Crowned Creations</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black tracking-tight">
                  THE ROYAL BESTSELLERS
                </h2>
              </div>
              <Link
                to="/shop?is_bestseller=1"
                className="text-xs font-semibold tracking-luxury uppercase text-luxury-black hover:text-luxury-goldDark flex items-center gap-1.5 group"
              >
                View All Bestsellers <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-96 bg-luxury-ivory/50 animate-pulse border border-luxury-lightBorder" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellers.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-20 bg-luxury-cream border-b border-luxury-lightBorder">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 text-luxury-goldDark text-xs font-semibold tracking-wide-luxury uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fresh Harvest Distillates</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black tracking-tight">
                  NEW ARRIVALS
                </h2>
              </div>
              <Link
                to="/shop?is_new_arrival=1"
                className="text-xs font-semibold tracking-luxury uppercase text-luxury-black hover:text-luxury-goldDark flex items-center gap-1.5 group"
              >
                Explore New Flacons <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-96 bg-luxury-ivory/50 animate-pulse border border-luxury-lightBorder" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us & Trust Badges */}
        <TrustBadges />
      </main>

      <Footer />

      {/* Cart Slide Drawer */}
      <CartDrawer />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
