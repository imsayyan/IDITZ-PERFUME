import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Boxes,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = () => {
  const { adminUser, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col lg:flex-row text-luxury-black font-sans antialiased">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-luxury-black text-white p-4 flex items-center justify-between border-b border-luxury-gold/30">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
            {mobileOpen ? <X className="w-6 h-6 text-luxury-gold" /> : <Menu className="w-6 h-6 text-luxury-gold" />}
          </button>
          <img
            src="/iditz-logo.jpg"
            alt="IDITZ"
            className="w-7 h-7 rounded-full object-cover border border-luxury-gold/50"
          />
          <span className="font-serif font-bold text-sm tracking-wide text-white">
            {settings.brand_name || 'IDITZ PERFUME'} ADMIN
          </span>
        </div>
        <Link to="/" className="text-xs text-luxury-gold hover:underline flex items-center gap-1">
          <Store className="w-3.5 h-3.5" /> Boutique
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-luxury-black text-luxury-ivory flex flex-col justify-between border-r border-luxury-gold/25 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-luxury-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/iditz-logo.jpg"
                alt="IDITZ"
                className="w-10 h-10 rounded-full object-cover border border-luxury-gold/50 shadow-sm"
              />
              <div>
                <h2 className="font-display font-extrabold tracking-wider text-base text-white leading-tight">
                  {settings.brand_name || 'IDITZ PERFUME'}
                </h2>
                <span className="text-[9px] tracking-widest text-luxury-gold uppercase block font-semibold mt-0.5">
                  ADMINISTRATION SUITE
                </span>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-luxury-ivory/60">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wide uppercase transition-colors rounded-sm ${
                    isActive
                      ? 'bg-luxury-gold text-luxury-black font-bold shadow-sm'
                      : 'text-luxury-ivory/80 hover:bg-luxury-noir/80 hover:text-luxury-goldLight'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-luxury-black' : 'text-luxury-gold'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Actions */}
        <div className="p-4 border-t border-luxury-gold/20 space-y-3 bg-luxury-noir">
          <div className="px-2">
            <p className="text-xs font-serif font-bold text-white truncate">{adminUser?.name || 'Master Admin'}</p>
            <p className="text-[10px] text-luxury-gold truncate">{adminUser?.email || 'admin@iditzperfume.com'}</p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-luxury-gold/15">
            <Link
              to="/"
              target="_blank"
              className="flex-1 py-2 text-[11px] font-semibold text-center border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-colors flex items-center justify-center gap-1"
            >
              <Store className="w-3.5 h-3.5" /> View Store
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 border border-luxury-rose/40 text-luxury-rose hover:bg-luxury-rose hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
