import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, Printer, ArrowRight, ShieldCheck, MapPin, Banknote, CreditCard } from 'lucide-react';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // Fire celebratory gold luxury confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#D4AF37', '#0F0E0E', '#EAE4DB']
      });
    } catch (e) {
      // ignore
    }

    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await api.getOrderById(id);
          setOrder(res.order);
        } catch (err) {
          console.error('Failed to fetch order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-luxury-cream">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-luxury-cream">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="text-2xl font-serif font-bold text-luxury-black">Order Record Not Found</h2>
          <p className="text-xs text-luxury-charcoal mt-2 mb-6">We could not locate this order id in our royal registries.</p>
          <Link to="/" className="luxury-btn-primary text-xs">
            RETURN TO BOUTIQUE
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        
        {/* Celebration Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-subtle border border-emerald-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block">
            Thank you for patronizing IDITZ PERFUME
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-black tracking-tight">
            ORDER PLACED SUCCESSFULLY
          </h1>
          <p className="text-xs text-luxury-charcoal/80 max-w-md mx-auto">
            Your flacons are now being carefully inspected, packed in double-walled velvet protection, and prepared for dispatch.
          </p>

          <div className="pt-2">
            <span className="inline-block bg-luxury-ivory border border-luxury-gold/50 px-4 py-1.5 text-xs font-bold text-luxury-black tracking-wider">
              ORDER REFERENCE: {order.order_number}
            </span>
          </div>
        </div>

        {/* Detailed Confirmation Card */}
        <div className="bg-white border border-luxury-lightBorder shadow-luxury p-6 sm:p-10 space-y-8 print:border-none print:shadow-none">
          
          {/* Status & Method Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-luxury-lightBorder">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-luxury-goldDark" />
              <div>
                <p className="text-xs font-semibold text-luxury-black">Current Status</p>
                <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{order.order_status || 'Pending'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {order.payment_method === 'COD' ? (
                <Banknote className="w-5 h-5 text-emerald-700" />
              ) : (
                <CreditCard className="w-5 h-5 text-luxury-goldDark" />
              )}
              <div>
                <p className="text-xs font-semibold text-luxury-black">Payment Method</p>
                <p className="text-xs font-bold text-luxury-black uppercase tracking-wider">
                  {order.payment_method === 'COD' ? 'Cash on Delivery (Pay at Doorstep)' : 'Paid Online (Verified)'}
                </p>
                {order.payment_method === 'ONLINE' && order.gateway_payment_id && (
                  <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                    PG Ref: {order.gateway_payment_id}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-luxury-goldDark" />
              <div>
                <p className="text-xs font-semibold text-luxury-black">Estimated Air Delivery</p>
                <p className="text-xs text-luxury-charcoal font-medium">Within 2 to 4 Business Days</p>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide-luxury text-luxury-black mb-4">
              ARTISANAL FLACONS ORDERED
            </h3>

            <div className="divide-y divide-luxury-lightBorder">
              {(order.items || []).map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product_image || '/images/perfumes/kashmir-saffron-amber.svg'}
                      alt={item.product_name}
                      className="w-14 h-16 object-contain bg-luxury-ivory border border-luxury-lightBorder p-1 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-luxury-black">{item.product_name}</h4>
                      <p className="text-[11px] text-luxury-charcoal/70 uppercase">
                        Size: {item.size || '100ml'} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-luxury-black">
                    ₹{item.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses & Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-luxury-lightBorder">
            
            {/* Delivery Destination */}
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-luxury-black flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-luxury-goldDark" /> Delivery Address
              </h4>
              <p className="font-bold text-luxury-black">{order.customer_name}</p>
              <p className="text-luxury-charcoal">
                {order.apartment ? `${order.apartment}, ` : ''}{order.shipping_address}
              </p>
              <p className="text-luxury-charcoal">
                {order.city}, {order.state} — <strong className="text-luxury-black font-semibold">{order.pincode}</strong>
              </p>
              <p className="text-luxury-charcoal pt-1">
                Contact: <strong className="text-luxury-black">{order.customer_phone}</strong>
              </p>
              <p className="text-luxury-charcoal">
                Email: {order.customer_email}
              </p>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs bg-luxury-ivory/50 p-5 border border-luxury-lightBorder">
              <div className="flex justify-between text-luxury-charcoal">
                <span>Subtotal</span>
                <span className="font-semibold text-luxury-black">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({order.coupon_code})</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-luxury-charcoal">
                <span>Express Air Shipping</span>
                <span className="font-semibold">
                  {order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee.toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-luxury-black pt-3 border-t border-luxury-lightBorder">
                <span>Grand Total</span>
                <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-luxury-charcoal/60 text-right">
                {order.payment_method === 'COD' ? 'To be collected on delivery in cash or UPI' : 'Fully paid online'}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-luxury-lightBorder flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto luxury-btn-secondary text-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Order Receipt
            </button>

            <Link
              to="/shop"
              className="w-full sm:w-auto luxury-btn-primary text-xs flex items-center justify-center gap-2"
            >
              Continue Exploring Collection <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
