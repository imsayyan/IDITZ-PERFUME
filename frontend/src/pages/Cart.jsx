import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, Truck } from 'lucide-react';

export const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
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
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    await applyCoupon(couponCode.trim());
    setLoadingCoupon(false);
    setCouponCode('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] sm:text-xs font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block mb-1">
            Review Your Flacons
          </span>
          <h1 className="text-3xl font-serif font-bold text-luxury-black tracking-tight">
            SHOPPING BAG
          </h1>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto my-2.5" />
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-luxury-lightBorder p-16 text-center max-w-2xl mx-auto space-y-4 shadow-subtle">
            <div className="w-20 h-20 rounded-full bg-luxury-ivory flex items-center justify-center mx-auto text-luxury-goldDark">
              <ShoppingBag className="w-10 h-10 opacity-70" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-luxury-black">Your shopping bag is empty</h2>
            <p className="text-xs text-luxury-charcoal/80 max-w-sm mx-auto font-light leading-relaxed">
              Explore our mastercrafted extraits inspired by India's timeless botanical heritage.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="luxury-btn-primary text-xs py-3 px-8">
                EXPLORE PERFUMES
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Table */}
            <div className="lg:col-span-8 bg-white border border-luxury-lightBorder shadow-subtle p-6 space-y-6">
              
              {/* Free shipping bar */}
              <div className="p-3 bg-luxury-sand/50 border border-luxury-lightBorder text-xs">
                {isFreeShipping ? (
                  <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Congratulations! Your order qualifies for COMPLIMENTARY Express Shipping.
                  </p>
                ) : (
                  <p className="text-luxury-charcoal">
                    Add <strong className="text-luxury-black font-bold">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for <strong className="text-luxury-goldDark">FREE Express Delivery</strong>.
                  </p>
                )}
              </div>

              <div className="divide-y divide-luxury-lightBorder">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-5 flex flex-col sm:flex-row items-center gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 object-contain bg-luxury-ivory border border-luxury-lightBorder p-2 flex-shrink-0"
                    />

                    <div className="flex-1 text-center sm:text-left">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-base font-serif font-bold text-luxury-black hover:text-luxury-goldDark"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-luxury-goldDark font-semibold uppercase tracking-wider mt-0.5">
                        {item.size} • {item.fragrance_family}
                      </p>
                      <p className="text-xs text-luxury-charcoal/70 mt-1">
                        Price per flacon: ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-luxury-lightBorder bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="px-3 py-1 text-sm font-semibold hover:bg-luxury-ivory"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-luxury-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="px-3 py-1 text-sm font-semibold hover:bg-luxury-ivory"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <p className="text-base font-bold text-luxury-black">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-[11px] text-luxury-rose hover:underline font-medium mt-1 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-luxury-lightBorder">
                <Link to="/shop" className="text-xs font-semibold tracking-luxury uppercase text-luxury-goldDark hover:underline">
                  ← Continue Exploring Fragrances
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-luxury-charcoal/60 hover:text-luxury-rose transition-colors"
                >
                  Empty Bag
                </button>
              </div>

            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 bg-white border border-luxury-lightBorder shadow-subtle p-6 space-y-5">
              <h3 className="font-serif font-bold text-lg text-luxury-black border-b border-luxury-lightBorder pb-3">
                ORDER SUMMARY
              </h3>

              {/* Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                      <Tag className="w-4 h-4" />
                      <span>{appliedCoupon.code} Applied (-₹{discount.toLocaleString('en-IN')})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-luxury-rose hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon Code"
                      className="flex-1 bg-luxury-ivory/50 border border-luxury-lightBorder px-3 py-2 text-xs uppercase text-luxury-black"
                    />
                    <button
                      type="submit"
                      disabled={loadingCoupon}
                      className="luxury-btn-secondary px-4 py-2 text-xs"
                    >
                      {loadingCoupon ? '...' : 'APPLY'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-luxury-rose mt-1.5">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-700 mt-1.5 font-semibold">{couponSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-luxury-lightBorder pt-4">
                <div className="flex justify-between text-luxury-charcoal">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-luxury-black">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-luxury-charcoal">
                  <span>Express Air Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider">FREE</span>
                    ) : (
                      `₹${shippingFee.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-serif font-bold text-luxury-black pt-3 border-t border-luxury-lightBorder">
                  <span>Grand Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-luxury-charcoal/60 text-right">Includes all applicable GST & taxes</p>
              </div>

              {/* Checkout Button */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full luxury-btn-gold py-4 text-xs font-semibold tracking-wide-luxury flex items-center justify-center gap-2"
                >
                  PROCEED TO SECURE CHECKOUT <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Assurances */}
              <div className="pt-4 border-t border-luxury-lightBorder space-y-2 text-[11px] text-luxury-charcoal/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-luxury-goldDark" />
                  <span>256-bit encrypted checkout & Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-luxury-goldDark" />
                  <span>Doorstep delivery via insured express air courier</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
