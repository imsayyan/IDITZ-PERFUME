import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Users, Eye, X, IndianRupee, ShoppingBag, MapPin } from 'lucide-react';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustHistory, setSelectedCustHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCustomers({ search: search.trim() });
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewOrders = async (customerId) => {
    setHistoryLoading(true);
    try {
      const res = await api.getCustomerOrders(customerId);
      setSelectedCustHistory(res);
    } catch (err) {
      alert('Failed to load customer order history');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
          PATRON DIRECTORY & PROFILES
        </h1>
        <p className="text-xs text-luxury-charcoal/70 mt-1">
          Registered patrons, lifetime value, acquisition recency, and order histories.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-luxury-lightBorder shadow-subtle flex items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email, phone..."
            className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder pl-9 pr-4 py-2 text-xs text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
          />
          <Search className="w-4 h-4 text-luxury-goldDark absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-luxury-lightBorder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxury-ivory text-luxury-charcoal/80 uppercase tracking-wider font-semibold border-b border-luxury-lightBorder">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Order History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-lightBorder">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    Loading customer records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-luxury-sand/15 transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-luxury-black text-sm">
                      {cust.full_name}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="text-luxury-black font-medium">{cust.email}</p>
                      <p className="text-[11px] text-luxury-charcoal/70">{cust.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-luxury-charcoal">
                      {cust.city ? `${cust.city}, ${cust.state}` : 'India'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-luxury-black px-2 py-0.5 bg-luxury-cream border rounded">
                        {cust.total_orders} orders
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-800 text-sm">
                      ₹{cust.total_spent.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-luxury-charcoal/70 font-mono">
                      {cust.last_order_date
                        ? new Date(cust.last_order_date).toLocaleDateString('en-IN')
                        : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewOrders(cust.id)}
                        className="luxury-btn-secondary py-1 px-3 text-[11px] inline-flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> View Orders
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/70 backdrop-blur-xs">
          <div className="bg-white border border-luxury-lightBorder max-w-2xl w-full shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-luxury-lightBorder flex items-center justify-between bg-luxury-ivory">
              <div>
                <h3 className="font-serif font-bold text-base text-luxury-black">
                  ORDER HISTORY: {selectedCustHistory.customer?.full_name}
                </h3>
                <p className="text-xs text-luxury-charcoal/70">
                  {selectedCustHistory.customer?.email} • {selectedCustHistory.customer?.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustHistory(null)}
                className="p-1 text-luxury-charcoal hover:text-luxury-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {selectedCustHistory.orders?.length === 0 ? (
                <p className="text-center text-luxury-charcoal/60 py-6">No historical orders on record.</p>
              ) : (
                selectedCustHistory.orders?.map((ord) => (
                  <div key={ord.id} className="p-4 border border-luxury-lightBorder bg-luxury-cream/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-luxury-goldDark text-sm">{ord.order_number}</span>
                      <span className="px-2 py-0.5 font-bold uppercase rounded text-[10px] bg-blue-100 text-blue-800">
                        {ord.order_status}
                      </span>
                    </div>
                    <div className="flex justify-between text-luxury-charcoal">
                      <span>Date: {new Date(ord.created_at).toLocaleDateString('en-IN')}</span>
                      <span>Payment: <strong>{ord.payment_method}</strong></span>
                      <span className="font-bold text-luxury-black">₹{ord.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-luxury-charcoal/80 pt-1 border-t border-luxury-lightBorder">
                      Flacons: {(ord.items || []).map(i => `${i.product_name} (${i.quantity})`).join(', ')}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-luxury-lightBorder bg-luxury-ivory flex justify-end">
              <button
                onClick={() => setSelectedCustHistory(null)}
                className="luxury-btn-secondary text-xs py-1.5 px-4"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
