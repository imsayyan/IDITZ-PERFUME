import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, ShoppingBag, Heart, Menu, X, User, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const Navbar = () => {
  const { settings } = useSettings();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Scroll listener for sticky glass header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Live search debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await api.getProducts({ search: searchQuery.trim(), limit: 5 });
        setSearchResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'SHOP', path: '/shop' },
    { label: 'MEN', path: '/shop?gender=men' },
    { label: 'WOMEN', path: '/shop?gender=women' },
    { label: 'UNISEX', path: '/shop?gender=unisex' },
    { label: 'OUD COLLECTION', path: '/shop?category=oud' },
    { label: 'HERITAGE', path: '/about' },
    { label: 'ATELIERS', path: '/contact' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-luxury-cream/95 backdrop-blur-md shadow-subtle border-b border-luxury-gold/20 py-2.5 sm:py-3'
            : 'bg-luxury-cream border-b border-luxury-lightBorder py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* LEFT CORNER: Mobile Menu Trigger + IDITZ PERFUME Logo & Brand Name */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-luxury-black hover:text-luxury-goldDark transition-colors lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                <img
                  src="/iditz-logo.jpg"
                  alt="IDITZ PERFUME"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border border-luxury-gold/50 shadow-sm transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
                />
                <div className="flex flex-col text-left">
                  <span className="font-serif font-bold tracking-[0.16em] sm:tracking-[0.22em] text-xs sm:text-base xl:text-lg text-luxury-black transition-colors duration-200 group-hover:text-luxury-goldDark leading-none whitespace-nowrap">
                    IDITZ PERFUME
                  </span>
                  <span className="text-[6.5px] sm:text-[7.5px] xl:text-[8px] tracking-[0.24em] sm:tracking-[0.28em] text-luxury-goldDark uppercase font-semibold mt-0.5 sm:mt-1 leading-none whitespace-nowrap">
                    MORE THAN A FRAGRANCE
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[11px] xl:text-[12px] font-semibold tracking-luxury uppercase">
              {navLinks.map((item) => {
                const isActive = location.pathname + location.search === item.path || (item.path === '/shop' && location.pathname === '/shop' && !location.search);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-luxury-goldDark font-bold border-b border-luxury-goldDark pb-0.5'
                        : 'text-luxury-black hover:text-luxury-goldDark'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT CORNER: Action Icons (Search, Wishlist, Account, Bag) */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4.5">
              
              {/* Search Trigger */}
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-1.5 text-luxury-black hover:text-luxury-goldDark transition-colors"
                aria-label="Search fragrances"
                title="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/shop?wishlist=true"
                className="relative p-1.5 text-luxury-black hover:text-luxury-goldDark transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account / Admin Portal */}
              <Link
                to="/admin"
                className="hidden sm:inline-flex p-1.5 text-luxury-black hover:text-luxury-goldDark transition-colors"
                title="Account / Admin Portal"
                aria-label="Account"
              >
                <User className="w-4.5 h-4.5" />
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                onClick={openCart}
                className="relative p-1.5 sm:px-3 sm:py-2 bg-luxury-black text-luxury-ivory hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 flex items-center gap-1.5 border border-luxury-gold/40 shadow-xs"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline-block text-[11px] font-semibold tracking-luxury uppercase">
                  Bag ({itemCount})
                </span>
                <span className="md:hidden text-[10px] font-bold px-0.5">{itemCount}</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Live Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-luxury-black/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fade-in">
          <div className="bg-luxury-cream border border-luxury-gold max-w-2xl w-full shadow-2xl p-6 relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-luxury-charcoal hover:text-luxury-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative mt-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search perfumes, notes (e.g. Saffron, Assam Oud, Rose, Sandalwood)..."
                className="w-full bg-white border border-luxury-gold/50 pl-11 pr-4 py-3.5 text-sm text-luxury-black placeholder:text-luxury-charcoal/50 focus:outline-none focus:border-luxury-gold"
              />
              <Search className="absolute left-3.5 top-4 w-4.5 h-4.5 text-luxury-goldDark" />
            </form>

            {/* Quick Live Results */}
            {searching && (
              <p className="text-xs text-luxury-goldDark text-center py-6">Searching royal archives...</p>
            )}

            {!searching && searchResults.length > 0 && (
              <div className="mt-4 divide-y divide-luxury-lightBorder max-h-80 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 py-3 hover:bg-luxury-sand/50 px-2 transition-colors group"
                  >
                    <img
                      src={Array.isArray(item.images) ? item.images[0] : item.images}
                      alt={item.name}
                      className="w-12 h-14 object-cover bg-luxury-ivory border border-luxury-lightBorder"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs tracking-wide uppercase text-luxury-goldDark font-semibold">
                        {item.fragrance_family} • {item.gender}
                      </p>
                      <h4 className="text-sm font-serif font-bold text-luxury-black group-hover:text-luxury-goldDark truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-luxury-charcoal/70 truncate">{item.top_notes}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-luxury-black">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </Link>
                ))}
                <div className="pt-3 text-center">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-semibold tracking-luxury uppercase text-luxury-goldDark hover:underline inline-flex items-center gap-1"
                  >
                    View all results for "{searchQuery}" <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {!searching && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-luxury-charcoal">No fragrances found matching "{searchQuery}".</p>
                <p className="text-xs text-luxury-charcoal/60 mt-1">Try searching by botanical note: "Saffron", "Oud", "Cardamom", or "Rose".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-luxury-cream h-full shadow-2xl flex flex-col justify-between border-r border-luxury-gold/30 z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-luxury-lightBorder flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/iditz-logo.jpg"
                    alt="IDITZ PERFUME"
                    className="h-9 w-9 rounded-full object-cover border border-luxury-gold/50 shadow-sm"
                  />
                  <div>
                    <span className="font-serif font-bold tracking-widest text-base text-luxury-black block leading-tight">
                      IDITZ PERFUME
                    </span>
                    <span className="text-[7.5px] tracking-[0.2em] text-luxury-goldDark uppercase font-semibold">
                      MORE THAN A FRAGRANCE
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-luxury-charcoal hover:text-luxury-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="p-4 border-b border-luxury-lightBorder bg-luxury-ivory/50">
                <form
                  onSubmit={(e) => {
                    handleSearchSubmit(e);
                    setMobileMenuOpen(false);
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fragrances..."
                    className="w-full bg-white border border-luxury-gold/40 text-xs py-2.5 pl-9 pr-3 text-luxury-black placeholder:text-luxury-charcoal/50"
                  />
                  <Search className="w-4 h-4 text-luxury-goldDark absolute left-3 top-3" />
                </form>
              </div>

              {/* Navigation Links */}
              <nav className="p-5 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="block text-sm font-semibold tracking-luxury uppercase text-luxury-black hover:text-luxury-gold py-1.5 transition-colors border-b border-luxury-lightBorder/50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-5 border-t border-luxury-lightBorder bg-luxury-sand/30 space-y-3">
              <div className="text-xs text-luxury-charcoal">
                <p className="font-semibold text-luxury-black">Direct Concierge:</p>
                <p>{settings.store_phone}</p>
                <p>{settings.store_email}</p>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="w-full luxury-btn-secondary text-[10px] py-2 flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
