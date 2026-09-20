import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-luxury-ivory/80 border-b border-luxury-lightBorder relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-1.5 text-luxury-goldDark text-xs font-semibold tracking-wide-luxury uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Private Olfactory Circle</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-black tracking-tight">
          JOIN THE FRAGRANCE CIRCLE
        </h2>
        <div className="w-16 h-0.5 bg-luxury-gold mx-auto my-3" />

        <p className="text-luxury-charcoal/80 text-sm font-light max-w-lg mx-auto mb-8 leading-relaxed">
          Be privy to limited seasonal harvest extraits, private batch releases, master perfumer notes, and complimentary invitation-only discovery samples.
        </p>

        {subscribed ? (
          <div className="p-6 bg-white border border-luxury-gold max-w-md mx-auto shadow-subtle flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-serif font-bold text-luxury-black">Welcome to the Inner Circle</p>
              <p className="text-xs text-luxury-charcoal/80">Use private code <strong className="text-luxury-goldDark">IDITZ10</strong> for 10% off your initial order.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email..."
                  className="w-full bg-white border border-luxury-gold/40 px-4 py-3.5 text-xs text-luxury-black placeholder:text-luxury-charcoal/50 focus:outline-none focus:border-luxury-gold shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="luxury-btn-primary whitespace-nowrap py-3.5 px-6 text-xs"
              >
                REQUEST INVITATION
              </button>
            </div>
            {error && <p className="text-xs text-luxury-rose mt-2">{error}</p>}
            <p className="text-[11px] text-luxury-charcoal/60 mt-3 font-light">
              We respect your privacy. Unsubscribe at any time with a single click.
            </p>
          </form>
        )}

      </div>
    </section>
  );
};
