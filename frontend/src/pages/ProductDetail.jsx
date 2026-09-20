import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { QuickViewModal } from '../components/QuickViewModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import {
  Star,
  ShoppingBag,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('pyramid');
  const [added, setAdded] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductBySlug(slug);
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        setSelectedSize(data.product?.size || '100ml');
        setSelectedImage(0);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-luxury-cream">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 w-full animate-pulse space-y-8">
          <div className="h-6 bg-luxury-sand/50 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-[500px] bg-luxury-sand/40" />
            <div className="space-y-4">
              <div className="h-10 bg-luxury-sand/50 w-3/4" />
              <div className="h-6 bg-luxury-sand/40 w-1/3" />
              <div className="h-32 bg-luxury-sand/30" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-luxury-cream">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="text-2xl font-serif font-bold text-luxury-black">Fragrance Not Found</h2>
          <p className="text-sm text-luxury-charcoal mt-2 mb-6">The flacon you seek may have been retired to our private archives.</p>
          <Link to="/shop" className="luxury-btn-primary text-xs">
            RETURN TO ARCHIVES
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['/images/perfumes/kashmir-saffron-amber.svg'];

  const sizes = ['50ml Extrait', '100ml Flacon', '10ml Travel Extrait'];
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    navigate('/checkout');
  };

  // Frequently bought together bundle calculation
  const companionProduct = related.length > 0 ? related[0] : null;
  const bundleSavings = companionProduct ? 500 : 0;
  const bundleTotalPrice = companionProduct ? product.price + companionProduct.price - bundleSavings : product.price;

  const handleAddBundle = () => {
    addToCart(product, 1, selectedSize);
    if (companionProduct) {
      addToCart(companionProduct, 1, companionProduct.size || '100ml');
    }
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        
        {/* Breadcrumb Navigation */}
        <div className="bg-luxury-ivory/60 border-b border-luxury-lightBorder py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-luxury-charcoal flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-luxury-black">Home</Link>
            <ChevronRight className="w-3 h-3 text-luxury-charcoal/40" />
            <Link to="/shop" className="hover:text-luxury-black">Archives</Link>
            <ChevronRight className="w-3 h-3 text-luxury-charcoal/40" />
            <Link to={`/shop?fragrance_family=${product.fragrance_family}`} className="hover:text-luxury-black">
              {product.fragrance_family}
            </Link>
            <ChevronRight className="w-3 h-3 text-luxury-charcoal/40" />
            <span className="text-luxury-black font-semibold truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Product Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Gallery & Flacon Visual */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative bg-white border border-luxury-lightBorder p-8 aspect-square flex items-center justify-center overflow-hidden shadow-subtle group">
                
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-luxury-black rounded-full shadow-sm z-10"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorited ? 'fill-luxury-rose text-luxury-rose' : 'text-luxury-charcoal'}`}
                  />
                </button>

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-luxury-black text-luxury-gold text-[10px] font-bold tracking-luxury uppercase px-2.5 py-1 border border-luxury-gold/40">
                    EXTRAIT DE PARFUM
                  </span>
                </div>

                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 bg-white border p-2 ${
                        selectedImage === idx ? 'border-luxury-gold ring-1 ring-luxury-gold' : 'border-luxury-lightBorder'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Olfactory Details & Purchase Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Family & Gender Badges */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-luxury-goldDark font-semibold">
                  <span>{product.fragrance_family} Collection</span>
                  <span>•</span>
                  <span>{product.gender}</span>
                  <span>•</span>
                  <span className="text-luxury-charcoal/60">SKU: {product.sku}</span>
                </div>

                {/* Product Title */}
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-black tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-luxury-black">
                    {product.rating || 4.9}
                  </span>
                  <span className="text-xs text-luxury-charcoal/60">
                    ({product.reviews_count || 38} Connoisseur Reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-bold text-luxury-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-base text-luxury-charcoal/50 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-luxury-rose text-white text-[10.5px] font-bold tracking-luxury uppercase px-2 py-0.5">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-xs text-luxury-charcoal font-light leading-relaxed">
                  {product.full_description || product.short_description}
                </p>

                {/* Size Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold tracking-wide-luxury uppercase text-luxury-black mb-2">
                    Flacon Size: <span className="text-luxury-goldDark font-bold">{selectedSize || product.size || '100ml'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {[product.size || '100ml'].filter(Boolean).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className="px-4 py-2 text-xs font-semibold tracking-wider uppercase border border-luxury-gold bg-luxury-gold/15 text-luxury-black transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Stock Status */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-luxury uppercase text-luxury-black">Quantity</span>
                    <div className="flex items-center border border-luxury-lightBorder bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={product.stock_quantity === 0}
                        className="px-3 py-1 text-sm font-semibold hover:bg-luxury-ivory disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-luxury-black">
                        {product.stock_quantity === 0 ? 0 : quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity || 1))}
                        disabled={product.stock_quantity === 0 || quantity >= product.stock_quantity}
                        className="px-3 py-1 text-sm font-semibold hover:bg-luxury-ivory disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    {product.stock_quantity > 0 ? (
                      <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-ping" />
                        In Stock ({product.stock_quantity} available)
                      </span>
                    ) : (
                      <span className="text-xs text-rose-700 font-bold uppercase tracking-wider px-2.5 py-1 bg-rose-50 border border-rose-200 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart & Buy Now Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-4 text-xs font-semibold tracking-wide-luxury uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : product.stock_quantity === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                        : 'bg-luxury-black text-luxury-ivory hover:bg-luxury-gold hover:text-luxury-black'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Shopping Bag
                      </>
                    ) : product.stock_quantity === 0 ? (
                      'CURRENTLY OUT OF STOCK'
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-4 text-xs font-semibold tracking-wide-luxury uppercase flex items-center justify-center gap-2 ${
                      product.stock_quantity === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                        : 'luxury-btn-gold'
                    }`}
                  >
                    {product.stock_quantity === 0
                      ? 'PRODUCT TEMPORARILY SOLD OUT'
                      : 'BUY NOW WITH CASH ON DELIVERY / UPI'}
                  </button>
                </div>

                {/* Assurance Highlights */}
                <div className="pt-4 border-t border-luxury-lightBorder grid grid-cols-2 gap-3 text-xs text-luxury-charcoal">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-luxury-goldDark" />
                    <span>Free Shipping on Orders &gt; ₹999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-luxury-goldDark" />
                    <span>Cash on Delivery (COD) Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-luxury-goldDark" />
                    <span>14+ Hours Proven Longevity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-luxury-goldDark" />
                    <span>100% Authentic Indian Botanical</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Deep Olfactory Tabs Section */}
          <div className="mt-16 bg-white border border-luxury-lightBorder shadow-subtle">
            
            {/* Tab Nav Buttons */}
            <div className="flex border-b border-luxury-lightBorder overflow-x-auto">
              {[
                { id: 'pyramid', label: 'Olfactory Pyramid' },
                { id: 'longevity', label: 'Longevity & Sillage' },
                { id: 'craft', label: 'Botanical Extraction' },
                { id: 'shipping', label: 'Shipping & Delivery' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-xs font-semibold tracking-luxury uppercase border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-luxury-gold text-luxury-black bg-luxury-ivory/50 font-bold'
                      : 'border-transparent text-luxury-charcoal hover:text-luxury-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-8">
              {activeTab === 'pyramid' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-luxury-ivory/50 p-6 border border-luxury-lightBorder">
                    <span className="text-[10px] font-semibold tracking-luxury uppercase text-luxury-goldDark block mb-1">
                      First 30 Minutes
                    </span>
                    <h4 className="text-base font-serif font-bold text-luxury-black mb-2">
                      Top Notes
                    </h4>
                    <p className="text-xs text-luxury-charcoal leading-relaxed">
                      {product.top_notes || 'Assam Bergamot, Idukki Cardamom, Fresh Petrichor'}
                    </p>
                  </div>

                  <div className="bg-luxury-ivory/50 p-6 border border-luxury-lightBorder">
                    <span className="text-[10px] font-semibold tracking-luxury uppercase text-luxury-goldDark block mb-1">
                      2 to 6 Hours
                    </span>
                    <h4 className="text-base font-serif font-bold text-luxury-black mb-2">
                      Heart Notes
                    </h4>
                    <p className="text-xs text-luxury-charcoal leading-relaxed">
                      {product.heart_notes || 'Kannauj Hydro-Distilled Rose, Moroccan Leather, Frankincense'}
                    </p>
                  </div>

                  <div className="bg-luxury-ivory/50 p-6 border border-luxury-lightBorder">
                    <span className="text-[10px] font-semibold tracking-luxury uppercase text-luxury-goldDark block mb-1">
                      6 to 14+ Hours
                    </span>
                    <h4 className="text-base font-serif font-bold text-luxury-black mb-2">
                      Base Notes
                    </h4>
                    <p className="text-xs text-luxury-charcoal leading-relaxed">
                      {product.base_notes || 'Mysore Sandalwood, Bourbon Vanilla, Ambergris'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'longevity' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-luxury-black mb-1">
                      <span>Longevity on Skin</span>
                      <span>14+ Hours (Extrait)</span>
                    </div>
                    <div className="w-full bg-luxury-sand h-2 rounded-full overflow-hidden">
                      <div className="bg-luxury-gold h-full w-[95%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-luxury-black mb-1">
                      <span>Sillage & Projection</span>
                      <span>Enchanting 6-Foot Radius</span>
                    </div>
                    <div className="w-full bg-luxury-sand h-2 rounded-full overflow-hidden">
                      <div className="bg-luxury-gold h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-luxury-charcoal/80 space-y-2">
                    <p>
                      <strong>Recommended Occasions:</strong> {product.occasion || 'Evening Soirées, Weddings, Black Tie Receptions'}
                    </p>
                    <p>
                      <strong>Application Ritual:</strong> Spray on pulse points — inner wrists, base of the neck, and collarbone. Do not rub wrists together, as this breaks down delicate volatile top notes.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'craft' && (
                <div className="prose max-w-none text-xs text-luxury-charcoal leading-relaxed space-y-4">
                  <p>
                    Every batch of <strong>{product.name}</strong> is created through traditional Indian hydro-distillation in wood-fired copper stills. Our master perfumers macerate the raw botanical extracts for a minimum of 90 days in temperature-controlled Jaipur vaults to achieve optimal roundness and harmony.
                  </p>
                  <p>
                    Formulated strictly without phthalates, parabens, or animal testing. Vegan friendly and bottled in high-density recyclable crystal flacons.
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="text-xs text-luxury-charcoal space-y-3 max-w-2xl leading-relaxed">
                  <p>
                    • <strong>Complimentary Express Air Courier</strong> on all orders above ₹999 across India.
                  </p>
                  <p>
                    • <strong>Estimated Delivery:</strong> Metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Kolkata, Chennai) in 2-3 business days. Rest of India in 3-5 business days.
                  </p>
                  <p>
                    • <strong>Cash on Delivery (COD):</strong> Available across 27,000+ Indian pincodes. Pay cash or UPI upon package inspection at your door.
                  </p>
                  <p>
                    • <strong>Damaged in Transit Guarantee:</strong> If your flacon arrives compromised in any manner, we dispatch an immediate replacement within 24 hours with zero hassle.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Frequently Bought Together Bundle */}
          {companionProduct && (
            <div className="mt-14 bg-luxury-ivory/60 border border-luxury-gold/40 p-6 sm:p-8 shadow-subtle">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide-luxury text-luxury-goldDark font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Frequently Bought Together</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-luxury-black mb-6">
                Curate Your Dual Scent Wardrobe
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Current Product */}
                  <div className="flex items-center gap-3 bg-white p-3 border border-luxury-lightBorder">
                    <img src={images[0]} alt={product.name} className="w-14 h-16 object-contain" />
                    <div>
                      <p className="text-xs font-serif font-bold text-luxury-black line-clamp-1">{product.name}</p>
                      <p className="text-xs text-luxury-goldDark font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <span className="text-luxury-gold text-lg font-bold">+</span>

                  {/* Companion Product */}
                  <div className="flex items-center gap-3 bg-white p-3 border border-luxury-lightBorder">
                    <img
                      src={Array.isArray(companionProduct.images) ? companionProduct.images[0] : companionProduct.images}
                      alt={companionProduct.name}
                      className="w-14 h-16 object-contain"
                    />
                    <div>
                      <p className="text-xs font-serif font-bold text-luxury-black line-clamp-1">{companionProduct.name}</p>
                      <p className="text-xs text-luxury-goldDark font-semibold">₹{companionProduct.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Bundle Price & Add Button */}
                <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                  <div>
                    <span className="text-xs text-luxury-charcoal/70 line-through mr-2">
                      ₹{(product.price + companionProduct.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xl font-bold text-luxury-black">
                      ₹{bundleTotalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      Bundle Savings: ₹{bundleSavings} OFF
                    </span>
                  </div>

                  <button
                    onClick={handleAddBundle}
                    className="luxury-btn-primary text-xs py-3 px-6 flex items-center gap-2"
                  >
                    {bundleAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Bundle Added to Bag
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add Both to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Related Fragrances */}
          {related.length > 0 && (
            <div className="mt-20">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-[11px] font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block mb-1">
                  Complimentary Compositions
                </span>
                <h3 className="text-2xl font-serif font-bold text-luxury-black">
                  YOU MAY ALSO APPRECIATE
                </h3>
                <div className="w-12 h-0.5 bg-luxury-gold mx-auto my-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

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
