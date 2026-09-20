import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Boxes, AlertTriangle, Check, Search, Plus, Minus, RefreshCw } from 'lucide-react';

export const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminInventory({
        search: search.trim(),
        lowStockOnly: lowStockOnly ? 'true' : 'false'
      });
      setInventory(res.inventory || []);
      setSummary(res.summary || {});
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleAdjustStock = async (productId, adjustment) => {
    setUpdatingId(productId);
    try {
      const res = await api.updateInventoryStock(productId, { adjustment });
      setInventory(prev =>
        prev.map(item => (item.id === productId ? { ...item, stock_quantity: res.newStock } : item))
      );
    } catch (err) {
      alert('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDirectSetStock = async (productId, currentVal) => {
    const promptVal = window.prompt('Enter exact inventory flacon count:', currentVal);
    if (promptVal === null) return;
    const parsed = parseInt(promptVal, 10);
    if (isNaN(parsed) || parsed < 0) {
      alert('Please enter a valid non-negative number');
      return;
    }

    setUpdatingId(productId);
    try {
      const res = await api.updateInventoryStock(productId, { quantity: parsed });
      setInventory(prev =>
        prev.map(item => (item.id === productId ? { ...item, stock_quantity: res.newStock } : item))
      );
    } catch (err) {
      alert('Failed to set stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
          VAULT INVENTORY & STOCK LEVELS
        </h1>
        <p className="text-xs text-luxury-charcoal/70 mt-1">
          Monitor flacon reserves, trigger replenishment, and prevent overselling across all Indian distribution channels.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-luxury-lightBorder shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase text-luxury-charcoal/70">Total Perfumes</p>
            <h3 className="text-2xl font-serif font-bold text-luxury-black mt-0.5">{summary.totalProducts || 0}</h3>
          </div>
          <Boxes className="w-6 h-6 text-luxury-goldDark" />
        </div>

        <div className="bg-white p-5 border border-luxury-lightBorder shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase text-luxury-charcoal/70">Total Flacons in Vault</p>
            <h3 className="text-2xl font-serif font-bold text-luxury-black mt-0.5">{summary.totalUnitsInStock || 0}</h3>
          </div>
          <Check className="w-6 h-6 text-emerald-700" />
        </div>

        <div className="bg-white p-5 border border-amber-200 shadow-subtle flex items-center justify-between bg-amber-50/40">
          <div>
            <p className="text-[11px] font-semibold uppercase text-amber-800">Low Stock Flacons (&le;10)</p>
            <h3 className="text-2xl font-serif font-bold text-amber-900 mt-0.5">{summary.lowStockCount || 0}</h3>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-700" />
        </div>

        <div className="bg-white p-5 border border-rose-200 shadow-subtle flex items-center justify-between bg-rose-50/40">
          <div>
            <p className="text-[11px] font-semibold uppercase text-rose-800">Depleted / Out of Stock</p>
            <h3 className="text-2xl font-serif font-bold text-rose-900 mt-0.5">{summary.outOfStockCount || 0}</h3>
          </div>
          <AlertTriangle className="w-6 h-6 text-rose-700" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-luxury-lightBorder shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by perfume name or SKU..."
            className="w-full bg-luxury-ivory/50 border border-luxury-lightBorder pl-9 pr-4 py-2 text-xs text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
          />
          <Search className="w-4 h-4 text-luxury-goldDark absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-luxury-black cursor-pointer">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="accent-luxury-gold"
            />
            <span>Show Low Stock Only (&le;10)</span>
          </label>

          <button
            onClick={fetchInventory}
            className="luxury-btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-luxury-lightBorder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxury-ivory text-luxury-charcoal/80 uppercase tracking-wider font-semibold border-b border-luxury-lightBorder">
              <tr>
                <th className="py-3 px-4">Flacon</th>
                <th className="py-3 px-4">Perfume & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status Alert</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-lightBorder">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    Loading inventory records...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-luxury-charcoal/60">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const imgUrl = Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : '/images/perfumes/kashmir-saffron-amber.svg';

                  return (
                    <tr key={item.id} className="hover:bg-luxury-sand/15 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={imgUrl}
                          alt={item.name}
                          className="w-10 h-12 object-contain bg-luxury-ivory p-0.5 border"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-serif font-bold text-luxury-black text-sm">{item.name}</p>
                        <p className="text-[10px] text-luxury-charcoal/70 uppercase font-mono">{item.sku}</p>
                      </td>

                      <td className="py-3 px-4 text-luxury-charcoal">
                        {item.category_name}
                      </td>

                      <td className="py-3 px-4 font-bold text-luxury-black">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDirectSetStock(item.id, item.stock_quantity)}
                          className="font-bold text-sm px-2.5 py-1 bg-luxury-ivory border border-luxury-gold/40 hover:bg-luxury-gold hover:text-white transition-colors"
                          title="Click to set exact quantity"
                        >
                          {item.stock_quantity} units
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        {item.isOutOfStock ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-rose-100 text-rose-800">
                            Depleted
                          </span>
                        ) : item.isLowStock ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-emerald-100 text-emerald-800">
                            Healthy Reserve
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          disabled={item.stock_quantity === 0 || updatingId === item.id}
                          className="px-2 py-1 bg-luxury-cream border hover:bg-gray-200 text-luxury-black font-bold disabled:opacity-30"
                          title="Reduce 1 flacon"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 5)}
                          disabled={updatingId === item.id}
                          className="px-2 py-1 bg-luxury-cream border hover:bg-emerald-100 text-emerald-900 font-bold"
                          title="Restock +5 flacons"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 10)}
                          disabled={updatingId === item.id}
                          className="px-2 py-1 bg-luxury-cream border hover:bg-emerald-100 text-emerald-900 font-bold"
                          title="Restock +10 flacons"
                        >
                          +10
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

    </div>
  );
};
