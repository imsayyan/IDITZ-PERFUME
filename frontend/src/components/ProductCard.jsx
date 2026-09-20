import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, Eye, Star, Check, AlertCircle } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (typeof product.images === 'string' && product.images ? product.images : '/images/perfumes/kashmir-saffron-amber.svg');

  const isOutOfStock = product.stock_quantity === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, product.size || '100ml');
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="group relative bg-white border border-luxury-lightBorder hover:border-luxury-gold transition-all duration-300 flex flex-col justify-between shadow-subtle hover:shadow-luxury">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] bg-luxury-ivory/50 overflow-hidden flex items-center justify-center p-6">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-900 text-white text-[9px] font-bold tracking-luxury uppercase px-2 py-0.5 border border-rose-700 shadow-xs">
              Out of Stock
            </span>
          ) : (
            <>
              {product.is_bestseller === 1 && (
                <span className="bg-luxury-black text-luxury-gold text-[9px] font-bold tracking-luxury uppercase px-2 py-0.5 border border-luxury-gold/40">
                  Bestseller
                </span>
              )}
              {product.is_new_arrival === 1 && (
                <span className="bg-luxury-gold text-luxury-black text-[9px] font-bold tracking-luxury uppercase px-2 py-0.5">
                  New Arrival
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-luxury-rose text-white text-[9px] font-bold tracking-luxury uppercase px-2 py-0.5">
                  {product.discount}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-luxury-black rounded-full shadow-sm z-10 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-luxury-rose text-luxury-rose' : 'text-luxury-charcoal hover:text-luxury-rose'
            }`}
          />
        </button>

        {/* Product Image Link */}
        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className={`h-full object-contain filter drop-shadow-md transition-transform duration-700 group-hover:scale-105 ${
              isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''
            }`}
            onError={(e) => {
              e.currentTarget.src = '/images/perfumes/kashmir-saffron-amber.svg';
            }}
          />
        </Link>

        {/* Hover Quick View Overlay Action */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleQuickView}
            className="w-full py-2 bg-white/95 text-luxury-black text-[10.5px] font-semibold tracking-luxury uppercase border border-luxury-gold/50 hover:bg-luxury-gold hover:text-luxury-black transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

      </div>

      {/* Product Information Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between border-t border-luxury-lightBorder">
        <div>
          {/* Gender & Flacon Size */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-luxury text-luxury-goldDark font-semibold mb-1.5">
            <span className="capitalize">{product.gender || 'Unisex'}</span>
            <span className="text-luxury-charcoal/80 font-mono text-[10px]">{product.size || '100ml'}</span>
          </div>

          {/* Perfume Name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base font-serif font-bold text-luxury-black group-hover:text-luxury-goldDark transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Stock Availability Indicator */}
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-700 font-bold uppercase tracking-wider text-[10px]">
                • Out of Stock
              </span>
            ) : product.stock_quantity <= 5 ? (
              <span className="text-amber-700 font-semibold text-[10px]">
                • Only {product.stock_quantity} left in stock
              </span>
            ) : (
              <span className="text-emerald-700 font-medium text-[10px]">
                • In Stock ({product.stock_quantity} available)
              </span>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-[10px] text-luxury-charcoal/70 font-semibold">
                {product.rating || 4.9}
              </span>
            </div>
          </div>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="pt-3 mt-3 border-t border-luxury-lightBorder/60 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-luxury-black">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-luxury-charcoal/50 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-[10px] text-emerald-700 font-bold block">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 transition-all duration-300 flex items-center justify-center ${
              added
                ? 'bg-emerald-700 text-white'
                : isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                : 'bg-luxury-black text-luxury-ivory hover:bg-luxury-gold hover:text-luxury-black hover:shadow-subtle'
            }`}
            title={isOutOfStock ? 'Currently Out of Stock' : 'Add to Bag'}
          >
            {added ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
