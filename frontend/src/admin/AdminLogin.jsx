import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Lock, Mail, ShieldCheck, ArrowRight, Store } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { settings } = useSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@nooreparfums.com');
    setPassword('NooreAdmin@2026');
  };

  return (
    <div className="min-h-screen bg-luxury-noir flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-luxury-ivory relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <img
          src="/iditz-logo.jpg"
          alt="IDITZ PERFUME"
          className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-luxury-gold shadow-xl mb-3"
        />
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-luxury-gold block">
          {settings.brand_name || 'IDITZ PERFUME'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          ADMINISTRATOR PORTAL
        </h2>
        <p className="text-xs text-luxury-ivory/60 font-light">
          Authorized personnel only. Accessing private inventory & order logs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-luxury-black/90 p-8 border border-luxury-gold/40 shadow-2xl backdrop-blur-md space-y-6">
          
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nooreparfums.com"
                  className="w-full bg-luxury-charcoal/80 border border-luxury-gold/30 px-3 py-2.5 pl-9 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-luxury-gold"
                />
                <Mail className="w-4 h-4 text-luxury-gold absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-gold mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-luxury-charcoal/80 border border-luxury-gold/30 px-3 py-2.5 pl-9 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-luxury-gold"
                />
                <Lock className="w-4 h-4 text-luxury-gold absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-btn-gold py-3 text-xs font-bold tracking-wide-luxury flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHORIZE LOGIN'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-4 border-t border-luxury-gold/20 bg-luxury-charcoal/30 p-3 text-center space-y-2">
            <p className="text-[11px] text-luxury-ivory/70">
              Demo Credentials: <br />
              <code className="text-luxury-gold text-xs">admin@nooreparfums.com</code> / <code className="text-luxury-gold text-xs">NooreAdmin@2026</code>
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-luxury-gold hover:underline uppercase tracking-wider"
            >
              Auto-fill Credentials
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-luxury-ivory/60 hover:text-white inline-flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Return to Customer Boutique
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
