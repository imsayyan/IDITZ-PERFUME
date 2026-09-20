import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Star, ShoppingBag, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.size || '100ml');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (typeof product.images === 'string' ? product.images : '/images/perfumes/kashmir-saffron-amber.svg');

  const sizes = ['50ml', '100ml', '10ml Extrait'];

  const handleAdd = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-luxury-cream border border-luxury-gold max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 hover:bg-white text-luxury-black rounded-full shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Flacon */}
        <div className="w-full md:w-1/2 bg-luxury-ivory p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-luxury-lightBorder">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-72 md:max-h-96 object-contain filter drop-shadow-lg"
          />
        </div>

        {/* Right Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-luxury-goldDark font-semibold mb-1">
              <span>{product.fragrance_family}</span>
              <span>•</span>
              <span>{product.gender}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-luxury-black">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-amber-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-luxury-charcoal/70">
                {product.rating || 4.9} ({product.reviews_count || 24} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-2xl font-bold text-luxury-black">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-luxury-charcoal/50 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-luxury-rose text-white text-[10px] font-bold tracking-luxury uppercase px-2 py-0.5">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-luxury-charcoal font-light leading-relaxed mb-4">
              {product.short_description}
            </p>

            {/* Olfactory Pyramid Snapshot */}
            <div className="bg-white/80 border border-luxury-lightBorder p-3 space-y-1.5 text-xs mb-4">
              <p>
                <strong className="text-luxury-black font-semibold">Top Notes:</strong>{' '}
                <span className="text-luxury-charcoal/80">{product.top_notes || 'Assam Agarwood, Bergamot'}</span>
              </p>
              <p>
                <strong className="text-luxury-black font-semibold">Heart Notes:</strong>{' '}
                <span className="text-luxury-charcoal/80">{product.heart_notes || 'Rose Damascena, Spices'}</span>
              </p>
              <p>
                <strong className="text-luxury-black font-semibold">Base Notes:</strong>{' '}
                <span className="text-luxury-charcoal/80">{product.base_notes || 'Amber, Mysore Sandalwood'}</span>
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold tracking-luxury uppercase text-luxury-black mb-2">
                Flacon Size: <span className="text-luxury-goldDark font-bold">{selectedSize || product.size || '100ml'}</span>
              </label>
              <div className="flex gap-2">
                {[product.size || '100ml'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border border-luxury-gold bg-luxury-gold/15 text-luxury-black"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Stock Status */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold tracking-luxury uppercase text-luxury-black">Quantity</span>
                <div className="flex items-center border border-luxury-lightBorder bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock_quantity === 0}
                    className="px-3 py-1 text-sm font-semibold hover:bg-luxury-ivory disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-luxury-black">
                    {product.stock_quantity === 0 ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity || 1))}
                    disabled={product.stock_quantity === 0 || quantity >= product.stock_quantity}
                    className="px-3 py-1 text-sm font-semibold hover:bg-luxury-ivory disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                {product.stock_quantity === 0 ? (
                  <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider">Out of Stock</span>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-semibold">{product.stock_quantity} in stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-3 border-t border-luxury-lightBorder">
            <button
              onClick={handleAdd}
              disabled={product.stock_quantity === 0}
              className={`w-full py-3.5 text-xs font-semibold tracking-wide-luxury uppercase transition-all flex items-center justify-center gap-2 ${
                added
                  ? 'bg-emerald-700 text-white'
                  : product.stock_quantity === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : 'bg-luxury-black text-luxury-ivory hover:bg-luxury-gold hover:text-luxury-black'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag
                </>
              ) : product.stock_quantity === 0 ? (
                'CURRENTLY OUT OF STOCK'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                </>
              )}
            </button>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs font-semibold tracking-luxury uppercase text-luxury-goldDark hover:underline"
            >
              View Complete Olfactory Details <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
