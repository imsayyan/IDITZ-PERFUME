import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { ShieldCheck, Banknote, CreditCard, Lock, CheckCircle, ArrowLeft, Truck } from 'lucide-react';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discount, shippingFee, finalTotal, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    apartment: '',
    area: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    payment_method: 'COD',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [gatewaySession, setGatewaySession] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-luxury-cream">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-serif font-bold text-luxury-black">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-luxury-charcoal mt-2 mb-6">Add fragrances to your bag before proceeding to checkout.</p>
          <Link to="/shop" className="luxury-btn-primary text-xs">
            EXPLORE THE COLLECTION
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.customer_name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    const phoneClean = formData.customer_phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setError('Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    if (!formData.shipping_address.trim() || !formData.city.trim()) {
      setError('Please provide your complete shipping street address and city.');
      return;
    }

    const pinClean = formData.pincode.replace(/[^0-9]/g, '');
    if (pinClean.length !== 6) {
      setError('Please provide a valid 6-digit Indian PIN code.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        ...formData,
        customer_phone: phoneClean,
        pincode: pinClean,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          size: item.size
        }))
      };

      const res = await api.createOrder(orderPayload);

      // Cash on Delivery (COD) - complete immediately
      if (formData.payment_method === 'COD') {
        clearCart();
        navigate(`/order-confirmation/${res.order.id}`, { state: { order: res.order } });
        return;
      }

      // Online Payment - Open Secure Gateway (Do NOT clear cart yet)
      setPendingOrder(res.order);
      setGatewaySession(res.gatewaySession);
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message || 'Failed to place your order. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (verifiedOrder) => {
    setIsPaymentModalOpen(false);
    clearCart();
    navigate(`/order-confirmation/${verifiedOrder.id}`, { state: { order: verifiedOrder } });
  };

  const handlePaymentFailure = (errorMessage) => {
    setIsPaymentModalOpen(false);
    setError(errorMessage || 'Payment was not authorized. Your cart items are preserved.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-luxury-lightBorder">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-luxury-charcoal hover:text-luxury-black font-semibold">
            <ArrowLeft className="w-4 h-4" /> Return to Bag
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-luxury-goldDark uppercase tracking-luxury">
            <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Indian Checkout
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact Details */}
            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2">
                1. CONNOISSEUR CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="luxury-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    required
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="for invoice & dispatch updates"
                    className="luxury-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                  Indian Mobile Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-luxury-lightBorder bg-luxury-ivory text-xs font-semibold text-luxury-charcoal">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    maxLength={10}
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile (for delivery SMS)"
                    className="luxury-input flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2">
                2. SHIPPING DESTINATION
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                  Flat / House / Villa / Building *
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="e.g. Villa 14, Royal Palms"
                  className="luxury-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                  Street Address & Locality *
                </label>
                <input
                  type="text"
                  name="shipping_address"
                  required
                  value={formData.shipping_address}
                  onChange={handleChange}
                  placeholder="Street name, road, sector"
                  className="luxury-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="luxury-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    State / UT *
                  </label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="luxury-input bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    className="luxury-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                  Delivery Landmark or Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Leave with security / Ring brass bell"
                  className="luxury-input"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2">
                3. PAYMENT PREFERENCE
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 border transition-all flex items-start gap-4 cursor-pointer ${
                    formData.payment_method === 'COD'
                      ? 'border-luxury-gold bg-luxury-gold/10 ring-1 ring-luxury-gold'
                      : 'border-luxury-lightBorder bg-white hover:border-luxury-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={formData.payment_method === 'COD'}
                    onChange={handleChange}
                    className="mt-1 accent-luxury-gold"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="text-sm font-serif font-bold text-luxury-black">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Available Pan-India
                      </span>
                    </div>
                    <p className="text-xs text-luxury-charcoal/80 mt-1 font-light">
                      Pay conveniently with Cash or via UPI QR scan to the courier upon doorstep delivery.
                    </p>
                  </div>
                </label>

                {/* Online Payment */}
                <label
                  className={`p-4 border transition-all flex items-start gap-4 cursor-pointer ${
                    formData.payment_method === 'ONLINE'
                      ? 'border-luxury-gold bg-luxury-gold/10 ring-1 ring-luxury-gold'
                      : 'border-luxury-lightBorder bg-white hover:border-luxury-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="ONLINE"
                    checked={formData.payment_method === 'ONLINE'}
                    onChange={handleChange}
                    className="mt-1 accent-luxury-gold"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-luxury-goldDark" />
                      <span className="text-sm font-serif font-bold text-luxury-black">
                        Instant Online Payment (UPI / Cards / Netbanking)
                      </span>
                    </div>
                    <p className="text-xs text-luxury-charcoal/80 mt-1 font-light">
                      Google Pay, PhonePe, Paytm, All Credit & Debit Cards (Visa, MasterCard, RuPay, Amex).
                    </p>
                  </div>
                </label>
              </div>

            </div>

          </div>

          {/* Right Summary: Items & Totals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-5 sticky top-28">
              
              <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-3 flex items-center justify-between">
                <span>ORDER SUMMARY</span>
                <span className="text-xs font-sans text-luxury-charcoal/70">
                  {cartItems.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-luxury-lightBorder max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-contain bg-luxury-ivory border border-luxury-lightBorder p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif font-bold text-luxury-black truncate">{item.name}</p>
                      <p className="text-[10px] text-luxury-goldDark font-semibold uppercase">{item.size} • Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-luxury-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs border-t border-luxury-lightBorder pt-4">
                <div className="flex justify-between text-luxury-charcoal">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-luxury-black">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
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
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-luxury-charcoal/60 text-right">All taxes & GST included</p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full luxury-btn-gold py-4 text-xs font-semibold tracking-wide-luxury flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'AUTHORIZING ORDER...'
                  ) : (
                    formData.payment_method === 'COD' ? 'PLACE ORDER (CASH ON DELIVERY)' : 'CONFIRM & PAY ONLINE'
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-luxury-lightBorder space-y-2 text-[11px] text-luxury-charcoal/80 text-center">
                <p className="flex items-center justify-center gap-1.5 text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Tamper-evident luxury packaging guaranteed
                </p>
                <p className="text-[10px] text-luxury-charcoal/60">
                  By clicking Place Order, you confirm acceptance of IDITZ PERFUME bespoke delivery policy.
                </p>
              </div>

            </div>
          </div>

        </form>

      </main>

      {/* Secure Payment Gateway Checkout Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        order={pendingOrder}
        gatewaySession={gatewaySession}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <Footer />
    </div>
  );
};
