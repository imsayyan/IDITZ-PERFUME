import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.getDashboardMetrics();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, recentOrders, topSelling } = data || {
    metrics: {},
    recentOrders: [],
    topSelling: []
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(metrics.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      title: 'Total Orders Placed',
      value: metrics.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      title: 'Pending Fulfillment',
      value: metrics.pendingOrders || 0,
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      title: 'Completed Orders',
      value: metrics.completedOrders || 0,
      icon: CheckCircle,
      color: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      title: 'Active Products',
      value: metrics.totalProducts || 0,
      icon: Package,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    {
      title: 'Registered Patrons',
      value: metrics.totalCustomers || 0,
      icon: Users,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    {
      title: 'Low Stock Alerts',
      value: metrics.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-black">
            ATELIER OVERVIEW
          </h1>
          <p className="text-xs text-luxury-charcoal/70 mt-1">
            Real-time analytics, order dispatch velocity, and stock levels across India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="luxury-btn-primary text-xs py-2.5 px-4"
          >
            + Add New Perfume
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-5 bg-white border ${card.border} shadow-subtle flex items-center justify-between`}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-luxury-charcoal/70">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold font-serif text-luxury-black mt-1">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${card.bg} ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Top Selling Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-luxury-lightBorder shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-lightBorder pb-3">
            <h3 className="font-serif font-bold text-base text-luxury-black">
              RECENTLY PLACED ORDERS
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs text-luxury-goldDark hover:underline font-semibold flex items-center gap-1"
            >
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-luxury-ivory text-luxury-charcoal/80 uppercase tracking-wider font-semibold border-b border-luxury-lightBorder">
                <tr>
                  <th className="py-2.5 px-3">Order No.</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-lightBorder">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-luxury-charcoal/60">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-luxury-sand/20 transition-colors">
                      <td className="py-3 px-3 font-semibold text-luxury-black">
                        <Link to="/admin/orders" className="hover:underline text-luxury-goldDark">
                          {ord.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-medium text-luxury-black">
                        {ord.customer_name}
                      </td>
                      <td className="py-3 px-3 font-bold text-luxury-black">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          ord.payment_method === 'COD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ord.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          ord.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.order_status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ord.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4 bg-white border border-luxury-lightBorder shadow-subtle p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-luxury-goldDark" />
            TOP PATRONIZED FLACONS
          </h3>

          <div className="space-y-4">
            {topSelling.length === 0 ? (
              <p className="text-xs text-luxury-charcoal/60 py-4 text-center">No sales data recorded yet.</p>
            ) : (
              topSelling.map((p, idx) => (
                <div key={p.product_id} className="flex items-center gap-3">
                  <span className="text-sm font-serif font-bold text-luxury-goldDark w-4">
                    #{idx + 1}
                  </span>
                  <img
                    src={p.product_image || '/images/perfumes/kashmir-saffron-amber.svg'}
                    alt={p.product_name}
                    className="w-10 h-12 object-contain bg-luxury-ivory border border-luxury-lightBorder p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-serif font-bold text-luxury-black truncate">
                      {p.product_name}
                    </p>
                    <p className="text-[10px] text-luxury-charcoal/70">
                      {p.units_sold} units • ₹{p.revenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
