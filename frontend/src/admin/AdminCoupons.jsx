import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Tag, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_amount: '',
    min_order_value: 0,
    expiry_date: '',
    usage_limit: 1000,
    is_active: 1
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCoupons();
      setCoupons(res.coupons || []);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_amount: '',
      min_order_value: 0,
      expiry_date: '',
      usage_limit: 1000,
      is_active: 1
    });
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_amount: coupon.discount_amount.toString(),
      min_order_value: coupon.min_order_value || 0,
      expiry_date: coupon.expiry_date || '',
      usage_limit: coupon.usage_limit || 1000,
      is_active: coupon.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        discount_amount: Number(formData.discount_amount),
        min_order_value: Number(formData.min_order_value),
        usage_limit: Number(formData.usage_limit)
      };

      if (editingCoupon) {
        await api.updateCoupon(editingCoupon.id, payload);
      } else {
        await api.createCoupon(payload);
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      alert('Error saving coupon: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
            PROMOTIONAL VOUCHERS & COUPONS
          </h1>
          <p className="text-xs text-luxury-charcoal/70 mt-1">
            Create and enforce discount codes for special marketing campaigns, private patrons, and festive seasons.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="luxury-btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-luxury-lightBorder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxury-ivory text-luxury-charcoal/80 uppercase tracking-wider font-semibold border-b border-luxury-lightBorder">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Type & Amount</th>
                <th className="py-3 px-4">Min. Order Requirement</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Usage Analytics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-lightBorder">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    Loading promotional vouchers...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    No active coupons found. Create your first promotion above.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-luxury-sand/15 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-luxury-black text-sm">
                      <span className="px-2 py-1 bg-luxury-cream border border-luxury-gold/40 text-luxury-goldDark">
                        {c.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-luxury-black">
                      {c.discount_type === 'percentage'
                        ? `${c.discount_amount}% Percentage Off`
                        : `₹${c.discount_amount.toLocaleString('en-IN')} Flat Discount`}
                    </td>

                    <td className="py-3.5 px-4 text-luxury-charcoal">
                      {c.min_order_value > 0 ? `₹${c.min_order_value.toLocaleString('en-IN')}` : 'No minimum'}
                    </td>

                    <td className="py-3.5 px-4 text-luxury-charcoal font-mono">
                      {c.expiry_date || 'No Expiry'}
                    </td>

                    <td className="py-3.5 px-4 text-luxury-charcoal">
                      <span className="font-semibold text-luxury-black">{c.times_used}</span> / {c.usage_limit} uses
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1 text-luxury-charcoal hover:text-luxury-goldDark"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-luxury-charcoal hover:text-luxury-rose"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/70 backdrop-blur-xs">
          <div className="bg-white border border-luxury-lightBorder max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-luxury-lightBorder pb-3">
              <h3 className="font-serif font-bold text-base text-luxury-black">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promotional Voucher'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-luxury-charcoal" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DIWALI20"
                  className="luxury-input uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="luxury-input bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                    placeholder={formData.discount_type === 'percentage' ? '15' : '500'}
                    className="luxury-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.min_order_value}
                    onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                    className="luxury-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="luxury-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-luxury-black mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="luxury-input"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-luxury-black cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.is_active === 1}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    className="accent-luxury-gold"
                  />
                  <span>Active Voucher (Immediately Redeemable)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-luxury-lightBorder flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="luxury-btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="luxury-btn-primary text-xs py-2 px-6"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
