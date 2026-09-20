import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, Search, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterGender !== 'all') params.gender = filterGender;
      const res = await api.getAdminProducts(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterGender]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleActive = async (product) => {
    try {
      const updatedStatus = product.is_active ? 0 : 1;
      await api.updateProduct(product.id, { is_active: updatedStatus });
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, is_active: updatedStatus } : p))
      );
    } catch (err) {
      alert('Failed to update product status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
            PERFUME CATALOG & INVENTORY
          </h1>
          <p className="text-xs text-luxury-charcoal/70 mt-1">
            Manage your boutique catalog. Any change here automatically updates the customer website.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="luxury-btn-primary text-xs py-3 px-5 flex items-center gap-1.5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Perfume
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-luxury-lightBorder shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by perfume name or SKU..."
            className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder pl-9 pr-4 py-2.5 text-xs text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
          />
          <Search className="w-4 h-4 text-luxury-goldDark absolute left-3 top-3" />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-luxury-ivory/50 border border-luxury-lightBorder px-3 py-2.5 text-xs text-luxury-black font-medium focus:outline-none focus:border-luxury-gold flex-1 sm:flex-initial"
          >
            <option value="all">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
          <button
            onClick={fetchProducts}
            className="luxury-btn-secondary py-2.5 px-4 text-xs font-semibold"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block bg-white border border-luxury-lightBorder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxury-ivory text-luxury-charcoal/80 uppercase tracking-wider font-semibold border-b border-luxury-lightBorder">
              <tr>
                <th className="py-3 px-4">Flacon</th>
                <th className="py-3 px-4">Perfume Name & SKU</th>
                <th className="py-3 px-4">Gender & Size</th>
                <th className="py-3 px-4">Price (₹ INR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-lightBorder">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    Loading perfume catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const imgUrl = Array.isArray(prod.images) && prod.images.length > 0
                    ? prod.images[0]
                    : (typeof prod.images === 'string' && prod.images ? prod.images : '/images/perfumes/kashmir-saffron-amber.svg');

                  return (
                    <tr key={prod.id} className="hover:bg-luxury-sand/15 transition-colors">
                      {/* Image */}
                      <td className="py-3 px-4">
                        <img
                          src={imgUrl}
                          alt={prod.name}
                          className="w-12 h-14 object-contain bg-luxury-ivory border border-luxury-lightBorder p-1"
                          onError={(e) => { e.currentTarget.src = '/images/perfumes/kashmir-saffron-amber.svg'; }}
                        />
                      </td>

                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <p className="font-serif font-bold text-luxury-black text-sm">{prod.name}</p>
                        <p className="text-[10px] text-luxury-charcoal/70 uppercase font-mono">SKU: {prod.sku}</p>
                      </td>

                      {/* Gender & Size */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-luxury-black capitalize">{prod.gender || 'Unisex'}</span>
                        <span className="block text-[10px] text-luxury-goldDark font-semibold uppercase">{prod.size || '100ml'}</span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-luxury-black">₹{prod.price.toLocaleString('en-IN')}</span>
                        {prod.mrp && prod.mrp > prod.price && (
                          <span className="block text-[10px] text-luxury-charcoal/50 line-through">
                            MRP ₹{prod.mrp.toLocaleString('en-IN')}
                            {prod.discount > 0 && ` (${prod.discount}% off)`}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          prod.stock_quantity === 0
                            ? 'bg-rose-100 text-rose-800'
                            : prod.stock_quantity <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {prod.stock_quantity === 0 ? 'Out of Stock' : `${prod.stock_quantity} in stock`}
                        </span>
                      </td>

                      {/* Active Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(prod)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                            prod.is_active ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                          }`}
                          title="Click to toggle store visibility"
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/admin/products/${prod.id}/edit`}
                          className="p-1.5 text-luxury-charcoal hover:text-luxury-goldDark inline-block"
                          title="Edit Perfume"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(prod.id)}
                          className="p-1.5 text-luxury-charcoal hover:text-luxury-rose inline-block"
                          title="Delete Perfume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Visible on mobile/small screens) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white p-8 border border-luxury-lightBorder text-center text-xs text-luxury-charcoal">
            Loading perfume catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 border border-luxury-lightBorder text-center text-xs text-luxury-charcoal">
            No products found matching criteria.
          </div>
        ) : (
          products.map((prod) => {
            const imgUrl = Array.isArray(prod.images) && prod.images.length > 0
              ? prod.images[0]
              : (typeof prod.images === 'string' && prod.images ? prod.images : '/images/perfumes/kashmir-saffron-amber.svg');

            return (
              <div key={prod.id} className="bg-white p-4 border border-luxury-lightBorder shadow-subtle space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imgUrl}
                    alt={prod.name}
                    className="w-16 h-20 object-contain bg-luxury-ivory border border-luxury-lightBorder p-1 flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = '/images/perfumes/kashmir-saffron-amber.svg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-sm text-luxury-black truncate">{prod.name}</h3>
                    <p className="text-[10px] text-luxury-charcoal/70 uppercase font-mono">SKU: {prod.sku}</p>
                    <p className="text-xs text-luxury-goldDark font-semibold capitalize mt-0.5">
                      {prod.gender} • {prod.size || '100ml'}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-luxury-black">₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.mrp && prod.mrp > prod.price && (
                        <span className="text-[10px] text-luxury-charcoal/50 line-through">
                          ₹{prod.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-luxury-lightBorder text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.stock_quantity === 0
                      ? 'bg-rose-100 text-rose-800'
                      : prod.stock_quantity <= 10
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {prod.stock_quantity === 0 ? 'Out of Stock' : `${prod.stock_quantity} in stock`}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                        prod.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prod.is_active ? 'Active' : 'Hidden'}
                    </button>

                    <Link
                      to={`/admin/products/${prod.id}/edit`}
                      className="p-1.5 text-luxury-black hover:text-luxury-goldDark"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(prod.id)}
                      className="p-1.5 text-luxury-charcoal hover:text-luxury-rose"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-luxury-lightBorder p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-luxury-black">Delete Perfume?</h3>
            <p className="text-xs text-luxury-charcoal">
              Are you sure you want to permanently remove this fragrance from your catalog? This will also remove it from the customer website.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="luxury-btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-luxury-rose text-white text-xs font-semibold px-4 py-2 hover:bg-red-800 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
