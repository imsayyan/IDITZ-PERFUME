import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { CartDrawer } from '../components/CartDrawer';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import { Filter, X, SlidersHorizontal, Search, RotateCcw, Sparkles } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useWishlist();

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [fragranceFamily, setFragranceFamily] = useState(searchParams.get('fragrance_family') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [wishlistOnly, setWishlistOnly] = useState(searchParams.get('wishlist') === 'true');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync state with URL changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setGender(searchParams.get('gender') || 'all');
    setCategory(searchParams.get('category') || 'all');
    setFragranceFamily(searchParams.get('fragrance_family') || 'all');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setInStock(searchParams.get('inStock') === 'true');
    setSortBy(searchParams.get('sortBy') || 'newest');
    setWishlistOnly(searchParams.get('wishlist') === 'true');
  }, [searchParams]);

  // Fetch products
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (gender && gender !== 'all') params.gender = gender;
      if (category && category !== 'all') params.category = category;
      if (fragranceFamily && fragranceFamily !== 'all') params.fragrance_family = fragranceFamily;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (inStock) params.inStock = 'true';
      if (sortBy) params.sortBy = sortBy;
      if (searchParams.get('is_bestseller')) params.is_bestseller = '1';
      if (searchParams.get('is_new_arrival')) params.is_new_arrival = '1';

      const data = await api.getProducts(params);
      let list = data.products || [];

      // Filter by wishlist if enabled
      if (wishlistOnly) {
        list = list.filter(p => wishlist.some(w => w.id === p.id));
      }

      setProducts(list);
    } catch (err) {
      console.error('Error fetching shop products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [search, gender, category, fragranceFamily, minPrice, maxPrice, inStock, sortBy, wishlistOnly]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearch('');
    setGender('all');
    setCategory('all');
    setFragranceFamily('all');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setSortBy('newest');
    setWishlistOnly(false);
  };

  const fragranceFamilies = [
    'All', 'Oud', 'Woody', 'Floral', 'Fresh', 'Citrus', 'Amber', 'Musk', 'Vanilla', 'Spicy'
  ];

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: "Men's Perfumes", value: 'men' },
    { label: "Women's Perfumes", value: 'women' },
    { label: 'Unisex Perfumes', value: 'unisex' },
    { label: 'Oud Collection', value: 'oud' },
    { label: 'Attar Oils', value: 'attar' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        
        {/* Shop Header Banner */}
        <section className="bg-luxury-noir text-luxury-ivory py-12 px-4 sm:px-6 lg:px-8 border-b border-luxury-gold/30 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-2 relative z-10">
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide-luxury uppercase text-luxury-gold">
              {wishlistOnly ? 'Personal Sanctuary' : 'The Fragrance Archives'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
              {wishlistOnly ? 'SAVED TREASURES' : 'THE COMPLETE COLLECTION'}
            </h1>
            <div className="w-12 h-0.5 bg-luxury-gold mx-auto my-2" />
            <p className="text-xs sm:text-sm text-luxury-ivory/70 font-light max-w-xl mx-auto">
              {wishlistOnly
                ? 'Your personal curation of desired extraits and artisanal perfume flacons.'
                : 'Explore small-batch Extrait de Parfum distilled from Kannauj to Assam, formulated to linger for 12+ hours.'}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Top Control Bar: Search, Sort, Mobile Filter Trigger */}
          <div className="bg-white p-4 border border-luxury-lightBorder flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-subtle">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange('search', e.target.value);
                }}
                placeholder="Search notes, names..."
                className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder pl-9 pr-4 py-2 text-xs text-luxury-black placeholder:text-luxury-charcoal/50 focus:outline-none focus:border-luxury-gold"
              />
              <Search className="w-4 h-4 text-luxury-goldDark absolute left-3 top-2.5" />
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden luxury-btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Fragrances
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-luxury-charcoal/70 uppercase tracking-wider hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    handleFilterChange('sortBy', e.target.value);
                  }}
                  className="bg-luxury-ivory/50 border border-luxury-lightBorder px-3 py-2 text-xs text-luxury-black font-medium focus:outline-none focus:border-luxury-gold"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Filter Pills */}
          {(gender !== 'all' || fragranceFamily !== 'all' || category !== 'all' || inStock || search || minPrice || maxPrice || wishlistOnly) && (
            <div className="flex items-center gap-2 flex-wrap mb-6 text-xs">
              <span className="text-luxury-charcoal/70 font-semibold uppercase tracking-wider text-[11px]">
                Active Filters:
              </span>

              {gender !== 'all' && (
                <span className="gold-badge flex items-center gap-1">
                  Gender: {gender}
                  <button onClick={() => handleFilterChange('gender', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {fragranceFamily !== 'all' && (
                <span className="gold-badge flex items-center gap-1">
                  Family: {fragranceFamily}
                  <button onClick={() => handleFilterChange('fragrance_family', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {category !== 'all' && (
                <span className="gold-badge flex items-center gap-1">
                  Category: {category}
                  <button onClick={() => handleFilterChange('category', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {inStock && (
                <span className="gold-badge flex items-center gap-1">
                  In Stock Only
                  <button onClick={() => handleFilterChange('inStock', 'false')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {wishlistOnly && (
                <span className="gold-badge flex items-center gap-1">
                  Saved Wishlist
                  <button onClick={() => handleFilterChange('wishlist', 'false')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {search && (
                <span className="gold-badge flex items-center gap-1">
                  "{search}"
                  <button onClick={() => handleFilterChange('search', '')}><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-luxury-rose hover:underline font-semibold ml-2 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            </div>
          )}

          {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block space-y-6 bg-white p-6 border border-luxury-lightBorder self-start shadow-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-luxury-lightBorder">
                <h3 className="font-serif font-bold text-base text-luxury-black tracking-wide">
                  REFINE ARCHIVE
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-luxury-goldDark hover:underline font-semibold uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-black mb-3">
                  Gender Collection
                </h4>
                <div className="space-y-2 text-xs">
                  {['all', 'men', 'women', 'unisex'].map((g) => (
                    <label key={g} className="flex items-center gap-2.5 cursor-pointer text-luxury-charcoal hover:text-luxury-black">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g}
                        onChange={() => {
                          setGender(g);
                          handleFilterChange('gender', g);
                        }}
                        className="accent-luxury-gold"
                      />
                      <span className="capitalize">{g === 'all' ? 'All Genders' : g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fragrance Family */}
              <div className="pt-4 border-t border-luxury-lightBorder">
                <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-black mb-3">
                  Fragrance Family
                </h4>
                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  {fragranceFamilies.map((fam) => {
                    const famVal = fam.toLowerCase();
                    const isSelected = fragranceFamily.toLowerCase() === famVal;
                    return (
                      <button
                        key={fam}
                        onClick={() => {
                          const val = famVal === 'all' ? 'all' : fam;
                          setFragranceFamily(val);
                          handleFilterChange('fragrance_family', val);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-luxury-gold/15 text-luxury-black font-semibold border-l-2 border-luxury-gold'
                            : 'text-luxury-charcoal hover:bg-luxury-ivory'
                        }`}
                      >
                        <span>{fam}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-luxury-lightBorder">
                <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-black mb-3">
                  Price Range (₹)
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      handleFilterChange('minPrice', e.target.value);
                    }}
                    placeholder="Min"
                    className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder px-2.5 py-1.5 text-luxury-black"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      handleFilterChange('maxPrice', e.target.value);
                    }}
                    placeholder="Max"
                    className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder px-2.5 py-1.5 text-luxury-black"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-luxury-lightBorder">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-luxury-black font-medium">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => {
                      setInStock(e.target.checked);
                      handleFilterChange('inStock', e.target.checked ? 'true' : 'false');
                    }}
                    className="accent-luxury-gold"
                  />
                  <span>In Stock Flacons Only</span>
                </label>
              </div>

              {/* Wishlist Filter */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-luxury-black font-medium">
                  <input
                    type="checkbox"
                    checked={wishlistOnly}
                    onChange={(e) => {
                      setWishlistOnly(e.target.checked);
                      handleFilterChange('wishlist', e.target.checked ? 'true' : 'false');
                    }}
                    className="accent-luxury-rose"
                  />
                  <span>Saved Wishlist ({wishlist.length})</span>
                </label>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4 text-xs text-luxury-charcoal">
                <span>Showing <strong className="text-luxury-black font-bold">{products.length}</strong> mastercrafted fragrances</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-96 bg-white border border-luxury-lightBorder animate-pulse p-6" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white border border-luxury-lightBorder p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-luxury-ivory flex items-center justify-center mx-auto text-luxury-goldDark">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-luxury-black">No Fragrances Found</h3>
                  <p className="text-xs text-luxury-charcoal max-w-sm mx-auto font-light leading-relaxed">
                    No formulations match your specific filter criteria. Try loosening your price threshold or selecting an alternate olfactory family.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="luxury-btn-primary text-xs py-2.5 px-6"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Mobile Filters Slide Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-luxury-cream h-full shadow-2xl flex flex-col justify-between border-r border-luxury-gold/30 z-10 p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-luxury-lightBorder mb-4">
                <h3 className="font-serif font-bold text-lg text-luxury-black">Filter Fragrances</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-luxury-charcoal" />
                </button>
              </div>

              {/* Gender */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-black mb-2">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'men', 'women', 'unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGender(g);
                        handleFilterChange('gender', g);
                      }}
                      className={`px-3 py-1.5 text-xs capitalize border ${
                        gender === g ? 'bg-luxury-black text-white border-luxury-black' : 'bg-white border-luxury-lightBorder'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Family */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold tracking-wide-luxury uppercase text-luxury-black mb-2">Family</h4>
                <div className="flex flex-wrap gap-2">
                  {fragranceFamilies.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        const val = f === 'All' ? 'all' : f;
                        setFragranceFamily(val);
                        handleFilterChange('fragrance_family', val);
                      }}
                      className={`px-2.5 py-1 text-xs border ${
                        fragranceFamily.toLowerCase() === f.toLowerCase()
                          ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
                          : 'bg-white border-luxury-lightBorder'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => {
                      setInStock(e.target.checked);
                      handleFilterChange('inStock', e.target.checked ? 'true' : 'false');
                    }}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-luxury-lightBorder space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full luxury-btn-primary text-xs py-3"
              >
                APPLY & VIEW ({products.length})
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-xs text-luxury-charcoal hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <CartDrawer />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
