import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const IntroAnimation = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check if we should display the intro
  useEffect(() => {
    // Never show on admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const hasSeenIntro = sessionStorage.getItem('iditz_perfume_intro_seen');
    const urlParams = new URLSearchParams(window.location.search);
    const forceIntro = urlParams.get('intro') === 'true' || urlParams.get('intro') === '1';

    if (!hasSeenIntro || forceIntro) {
      setIsVisible(true);
      sessionStorage.setItem('iditz_perfume_intro_seen', 'true');
    }

    // Global listener to replay intro whenever requested
    const handleReplay = () => {
      setProgress(0);
      setIsExiting(false);
      setIsVisible(true);
    };

    window.addEventListener('play-iditz-intro', handleReplay);
    return () => window.removeEventListener('play-iditz-intro', handleReplay);
  }, [location.pathname]);

  // Handle progressive animation timing
  useEffect(() => {
    if (!isVisible || isExiting) return;

    // Prevent body scrolling while intro is active
    document.body.style.overflow = 'hidden';

    // Progress bar ticker over 2.4s
    const startTime = Date.now();
    const duration = 2400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleExit();
      }
    }, 30);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [isVisible, isExiting]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      document.body.style.overflow = '';
    }, 750);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome to IDITZ PERFUME"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#090807] select-none transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Velvet & Gold Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,rgba(20,18,15,0.85)_50%,rgba(9,8,7,1)_100%)] pointer-events-none" />

      {/* Subtle Sacred Geometry Gold Rings in Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#D4AF37]/30 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] rounded-full border border-[#C5A880]/20 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
      </div>

      {/* Floating Gold Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#D4AF37] opacity-60 animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${15 + ((i * 17) % 70)}%`,
              left: `${10 + ((i * 23) % 80)}%`,
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
              animationDelay: `${(i * 0.25).toFixed(2)}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          />
        ))}
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleExit}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A880]/75 hover:text-[#F4EFEA] hover:border-[#D4AF37] border border-[#C5A880]/30 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300 backdrop-blur-sm bg-black/30 hover:bg-[#D4AF37]/10"
      >
        Skip <span className="opacity-60 ml-0.5">→</span>
      </button>

      {/* Central Brand Composition */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        
        {/* Royal Flacon Medallion Seal */}
        <div className="relative mb-6 sm:mb-8 group">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-[#9A7B54] via-[#D4AF37] to-[#DFCAAE] opacity-50 blur-md animate-pulse" />
          
          {/* Ornate Gold Bordered Medallion */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-[#DFCAAE] via-[#C5A880] to-[#7B5B33] shadow-[0_0_40px_rgba(212,175,55,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-black p-0.5 border border-[#F4EFEA]/30 flex items-center justify-center">
              <img
                src="/iditz-logo.jpg"
                alt="IDITZ PERFUME Seal"
                className="w-full h-full object-cover rounded-full transform transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Mini Gold Diamond Accents */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#D4AF37] text-[10px] sm:text-xs">◆</span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[#D4AF37] text-[10px] sm:text-xs">◆</span>
        </div>

        {/* Brand Name with Animated Golden Shimmer */}
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.22em] sm:tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-[#DFCAAE] via-[#FFF3D6] to-[#C5A880] drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)] transition-all duration-700 leading-tight">
          IDITZ PERFUME
        </h1>

        {/* Elegant Gold Filigree Divider */}
        <div className="flex items-center justify-center gap-3 my-3 sm:my-4 w-48 sm:w-64">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-[#D4AF37]" />
          <span className="text-[#D4AF37] text-[9px] sm:text-[11px] font-serif">✦</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/80 to-[#D4AF37]" />
        </div>

        {/* Brand Tagline */}
        <p className="font-serif italic text-xs sm:text-sm md:text-base tracking-[0.22em] text-[#E5D7C3] uppercase font-light drop-shadow-sm">
          More Than A Fragrance
        </p>

        {/* Sub-Tagline / Haute Parfumerie Accent */}
        <span className="text-[8px] sm:text-[9.5px] tracking-[0.32em] text-[#C5A880]/80 uppercase mt-2 font-sans font-medium">
          Artisanal Indian Haute Parfumerie • Extrait De Parfum
        </span>

        {/* Sleek Golden Progress Meter */}
        <div className="w-40 sm:w-56 mt-8 sm:mt-10 flex flex-col items-center gap-2">
          <div className="w-full h-[2px] bg-[#2A241C] rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#9A7B54] via-[#F4EFEA] to-[#D4AF37] transition-all duration-75 ease-out rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[9px] tracking-[0.25em] text-[#9A7B54] font-mono uppercase">
            Entering Boutique
          </span>
        </div>

      </div>
    </div>
  );
};
