import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Search, Eye, Filter, CheckCircle, Package, Truck, Banknote, CreditCard, X, MapPin } from 'lucide-react';

export const AdminOrders = () => {
  const { settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const brandName = settings?.brand_name || 'IDITZ PERFUME';

  // Dynamic Browser/Document Title Update
  useEffect(() => {
    if (pendingCount > 0) {
      document.title = `Orders (${pendingCount} Pending) | ${brandName}`;
    } else {
      document.title = `Orders | ${brandName}`;
    }
  }, [pendingCount, brandName]);

  // Restore default title on unmount
  useEffect(() => {
    return () => {
      document.title = `${brandName} | More Than A Fragrance`;
    };
  }, [brandName]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const res = await api.getAdminOrders(params);
      const fetchedOrders = res.orders || [];
      setOrders(fetchedOrders);
      if (res.pending_count !== undefined) {
        setPendingCount(res.pending_count);
      } else {
        const count = fetchedOrders.filter(o => (o.order_status || '').toLowerCase() === 'pending').length;
        setPendingCount(count);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder || targetOrder.order_status === newStatus) return;

    // Immediate optimistic update for zero-delay title update
    const wasPending = (targetOrder.order_status || '').toLowerCase() === 'pending';
    const isNowPending = (newStatus || '').toLowerCase() === 'pending';
    if (wasPending && !isNowPending) {
      setPendingCount(prev => Math.max(0, prev - 1));
    } else if (!wasPending && isNowPending) {
      setPendingCount(prev => prev + 1);
    }

    // Optimistically update orders list & modal
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, order_status: newStatus } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
    }

    setStatusUpdating(true);
    try {
      const res = await api.updateOrderStatus(orderId, { order_status: newStatus });
      setOrders(prev => prev.map(o => (o.id === orderId ? res.order : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.order);
      }
      if (res.pending_count !== undefined) {
        setPendingCount(res.pending_count);
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
      fetchOrders();
    } finally {
      setStatusUpdating(false);
    }
  };

  const orderStatuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
          CLIENT ORDERS & DISPATCH LOG
        </h1>
        <p className="text-xs text-luxury-charcoal/70 mt-1">
          Monitor incoming customer orders, update tracking statuses, and manage fulfillment.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-luxury-lightBorder shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order No., customer, phone..."
            className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder pl-9 pr-4 py-2 text-xs text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
          />
          <Search className="w-4 h-4 text-luxury-goldDark absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-luxury-ivory/50 border border-luxury-lightBorder px-3 py-2 text-xs text-luxury-black font-medium focus:outline-none focus:border-luxury-gold"
          >
            <option value="all">All Order Statuses</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={fetchOrders}
            className="luxury-btn-secondary py-2 px-3 text-xs"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-luxury-lightBorder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxury-ivory text-luxury-charcoal/80 uppercase tracking-wider font-semibold border-b border-luxury-lightBorder">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer & Phone</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-lightBorder">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-luxury-charcoal/60">
                    Loading orders registry...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-luxury-charcoal/60">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-luxury-sand/15 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-luxury-goldDark">
                      {ord.order_number}
                    </td>

                    <td className="py-3.5 px-4 text-luxury-charcoal font-mono">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-luxury-black">{ord.customer_name}</p>
                      <p className="text-[11px] text-luxury-charcoal/70">{ord.customer_phone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-luxury-black">
                        {(ord.items || []).reduce((a, b) => a + b.quantity, 0)} units
                      </span>
                      <p className="text-[10px] text-luxury-charcoal/70 truncate max-w-[150px]">
                        {(ord.items || []).map(i => i.product_name).join(', ')}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-luxury-black text-sm">
                      ₹{ord.total_amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        ord.payment_method === 'COD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.payment_method}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        disabled={statusUpdating}
                        className={`text-xs font-semibold py-1 px-2 border rounded focus:outline-none ${
                          ord.order_status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.order_status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-blue-50 text-blue-800 border-blue-300'
                        }`}
                      >
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-luxury-charcoal hover:text-luxury-goldDark inline-flex items-center gap-1 font-semibold"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/70 backdrop-blur-xs">
          <div className="bg-white border border-luxury-lightBorder max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-luxury-lightBorder flex items-center justify-between bg-luxury-ivory">
              <div>
                <h3 className="font-serif font-bold text-base text-luxury-black">
                  ORDER: {selectedOrder.order_number}
                </h3>
                <p className="text-[11px] text-luxury-charcoal/70">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-luxury-charcoal hover:text-luxury-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Customer and Shipping Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-luxury-cream/50 p-4 border border-luxury-lightBorder">
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Customer Information
                  </h4>
                  <p className="font-bold text-luxury-black">{selectedOrder.customer_name}</p>
                  <p className="text-luxury-charcoal">{selectedOrder.customer_email}</p>
                  <p className="text-luxury-charcoal font-semibold">{selectedOrder.customer_phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-luxury-black mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-luxury-goldDark" /> Delivery Address
                  </h4>
                  <p className="text-luxury-charcoal">
                    {selectedOrder.apartment ? `${selectedOrder.apartment}, ` : ''}{selectedOrder.shipping_address}
                  </p>
                  <p className="text-luxury-charcoal">
                    {selectedOrder.city}, {selectedOrder.state} — <strong>{selectedOrder.pincode}</strong>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold uppercase tracking-wide-luxury text-luxury-black mb-2">
                  Flacons Ordered
                </h4>
                <div className="divide-y divide-luxury-lightBorder border border-luxury-lightBorder">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product_image || '/images/perfumes/kashmir-saffron-amber.svg'}
                          alt={item.product_name}
                          className="w-10 h-12 object-contain bg-luxury-ivory p-0.5 border"
                        />
                        <div>
                          <p className="font-serif font-bold text-luxury-black">{item.product_name}</p>
                          <p className="text-[10px] text-luxury-charcoal/70 uppercase">
                            SKU: {item.product_sku} • Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-luxury-black">
                        ₹{item.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 bg-luxury-ivory/40 p-4 border border-luxury-lightBorder text-right">
                <p>Subtotal: <strong className="text-luxury-black font-semibold">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</strong></p>
                {selectedOrder.discount > 0 && (
                  <p className="text-emerald-700">Coupon Discount: <strong>-₹{selectedOrder.discount.toLocaleString('en-IN')}</strong></p>
                )}
                <p>Express Shipping: <strong className="text-luxury-black">{selectedOrder.shipping_fee === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee}`}</strong></p>
                <p className="text-sm font-serif font-bold text-luxury-black pt-1 border-t border-luxury-lightBorder">
                  Total Amount: ₹{selectedOrder.total_amount.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="pt-2 border-t border-luxury-lightBorder">
                <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-2">
                  Update Pipeline Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {orderStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                      disabled={statusUpdating}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                        selectedOrder.order_status === s
                          ? 'bg-luxury-gold text-luxury-black font-bold'
                          : 'bg-luxury-cream border border-luxury-lightBorder text-luxury-charcoal hover:bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-luxury-lightBorder bg-luxury-ivory flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="luxury-btn-secondary text-xs py-2 px-5"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
