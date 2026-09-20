import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Check } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    finalTotal,
    freeShippingRemaining,
    freeThreshold,
    isFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    couponSuccess
  } = useCart();

  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setCouponLoading(true);
    await applyCoupon(inputCode.trim());
    setCouponLoading(false);
    setInputCode('');
  };

  const handleProceedCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-luxury-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-luxury-cream h-full shadow-2xl flex flex-col justify-between border-l border-luxury-gold/30 z-10">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-luxury-lightBorder flex items-center justify-between bg-luxury-ivory">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-luxury-goldDark" />
            <h2 className="text-base font-serif font-bold text-luxury-black tracking-wide">
              YOUR FRAGRANCE BAG ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-luxury-charcoal hover:text-luxury-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-luxury-sand/60 px-5 py-3 border-b border-luxury-lightBorder text-xs">
          {isFreeShipping ? (
            <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              You qualify for COMPLIMENTARY Express Shipping!
            </p>
          ) : (
            <div>
              <p className="text-luxury-charcoal">
                Add <strong className="text-luxury-black">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for <strong className="text-luxury-goldDark">FREE Express Delivery</strong>.
              </p>
              <div className="w-full bg-white h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-luxury-gold h-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-luxury-lightBorder">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-luxury-ivory border border-luxury-gold/30 flex items-center justify-center mx-auto text-luxury-goldDark">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="text-base font-serif text-luxury-black">Your shopping bag is empty.</p>
              <p className="text-xs text-luxury-charcoal/70 max-w-xs mx-auto">
                Explore our artisanal perfumes hand-distilled in the heritage ateliers of India.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="luxury-btn-primary text-xs py-2.5 px-6"
              >
                DISCOVER FRAGRANCES
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="py-4 flex gap-4">
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-contain bg-luxury-ivory border border-luxury-lightBorder p-1 flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-serif font-bold text-luxury-black hover:text-luxury-goldDark truncate block pr-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-luxury-charcoal/40 hover:text-luxury-rose transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-luxury-goldDark font-semibold uppercase tracking-wider">
                      {item.size} • {item.fragrance_family}
                    </p>
                  </div>

                  {/* Quantity Stepper & Line Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-luxury-lightBorder bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs hover:bg-luxury-ivory text-luxury-charcoal font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-luxury-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs hover:bg-luxury-ivory text-luxury-charcoal font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-bold text-luxury-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Controls */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-luxury-lightBorder bg-luxury-ivory/60 space-y-4">
            
            {/* Coupon Application Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: {appliedCoupon.code} (-₹{discount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-luxury-rose hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. IDITZ10)"
                    className="flex-1 bg-white border border-luxury-lightBorder px-3 py-2 text-xs uppercase text-luxury-black focus:outline-none focus:border-luxury-gold"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="luxury-btn-secondary px-4 py-2 text-xs whitespace-nowrap"
                  >
                    {couponLoading ? 'Checking...' : 'APPLY'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-luxury-rose mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-700 mt-1 font-semibold">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs border-t border-luxury-lightBorder/80 pt-3">
              <div className="flex justify-between text-luxury-charcoal">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-luxury-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Special Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-luxury-charcoal">
                <span>Express Shipping</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider">FREE</span>
                  ) : (
                    `₹${shippingFee.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-luxury-black pt-2 border-t border-luxury-lightBorder">
                <span>Final Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-luxury-charcoal/60 text-right">Inclusive of all taxes & GST</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedCheckout}
                className="w-full luxury-btn-gold py-3.5 text-xs font-semibold tracking-wide-luxury flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={closeCart}
                className="w-full py-2 text-xs font-semibold tracking-luxury uppercase text-luxury-charcoal hover:text-luxury-black text-center"
              >
                CONTINUE SHOPPING
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
