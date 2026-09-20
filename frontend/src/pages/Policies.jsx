import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Policies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'shipping');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const tabs = [
    { id: 'shipping', title: 'Shipping Policy' },
    { id: 'refund', title: 'Refund & Replacement' },
    { id: 'privacy', title: 'Privacy Governance' },
    { id: 'terms', title: 'Terms of Service' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] sm:text-xs font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block mb-1">
            Client Governance
          </span>
          <h1 className="text-3xl font-serif font-bold text-luxury-black tracking-tight">
            POLICIES & ASSURANCES
          </h1>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto my-2.5" />
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-luxury-lightBorder justify-center gap-2 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setSearchParams({ tab: t.id });
              }}
              className={`px-5 py-3 text-xs font-semibold tracking-luxury uppercase border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-luxury-gold text-luxury-black font-bold'
                  : 'border-transparent text-luxury-charcoal hover:text-luxury-black'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white border border-luxury-lightBorder p-8 sm:p-12 shadow-subtle text-xs sm:text-sm text-luxury-charcoal leading-relaxed space-y-6">
          
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-luxury-black">
                Pan-India Express Air Shipping Policy
              </h2>
              <p>
                At <strong>IDITZ PERFUME</strong>, we partner exclusively with premium express air couriers (Blue Dart Apex, Delhivery Express Air) to guarantee swift, temperature-stabilized transit of your precious flacons.
              </p>
              <h3 className="font-serif font-bold text-sm text-luxury-black pt-2">1. Delivery Timelines</h3>
              <p>
                • <strong>Metro Cities:</strong> (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) — Delivered within <strong>2 to 3 business days</strong>.
              </p>
              <p>
                • <strong>Rest of India:</strong> Delivered within <strong>3 to 5 business days</strong> across all 27,000+ serviceable Indian postal PIN codes.
              </p>
              <h3 className="font-serif font-bold text-sm text-luxury-black pt-2">2. Shipping Tariffs</h3>
              <p>
                • <strong>Orders Above ₹999:</strong> 100% Complimentary Express Air Delivery.
              </p>
              <p>
                • <strong>Orders Below ₹999:</strong> Standard handling and air shipping fee of ₹150 across India.
              </p>
              <h3 className="font-serif font-bold text-sm text-luxury-black pt-2">3. Cash on Delivery (COD)</h3>
              <p>
                Cash on Delivery is available across 99% of Indian locations. Couriers accept cash as well as instant UPI QR payment upon delivery.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-luxury-black">
                Refund & Replacement Policy
              </h2>
              <p>
                Due to the intimate, hygienic nature of artisanal Extrait de Parfum formulations, bottles whose security seal or cellophane wrap has been compromised cannot be returned.
              </p>
              <h3 className="font-serif font-bold text-sm text-luxury-black pt-2">1. Damaged in Transit Guarantee</h3>
              <p>
                If your package arrives broken, leaked, or structurally impaired during shipment, contact our WhatsApp Concierge within 48 hours with a photograph of the damage. We will dispatch an <strong>immediate replacement flacon within 24 hours</strong> at zero additional charge to you.
              </p>
              <h3 className="font-serif font-bold text-sm text-luxury-black pt-2">2. Cancellation Policy</h3>
              <p>
                Orders may be cancelled free of charge prior to fulfillment and dispatch notification. Once dispatched with an air tracking AWB number, orders cannot be intercepted.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-luxury-black">
                Privacy & Data Governance
              </h2>
              <p>
                IDITZ PERFUME upholds uncompromising standards regarding customer confidentiality. We never sell, lease, or monetize your contact details, purchase records, or address information to third-party data brokers.
              </p>
              <p>
                Your phone number and email are utilized strictly for order confirmation, delivery notifications, and customer concierge consultations.
              </p>
              <p>
                All payment transactions are processed through 256-bit SSL encrypted gateways complying with RBI tokenization directives and PCI-DSS Level 1 specifications.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-luxury-black">
                Terms of Haute Parfumerie Service
              </h2>
              <p>
                All formulations, trademarks, designs, bottle silhouettes, and literary copy on this domain are the intellectual property of IDITZ PERFUME.
              </p>
              <p>
                Our perfumes are concentrated artisanal extraits intended for external topical scenting only. Avoid direct spraying onto sensitive eyes or broken skin. Keep flacons away from extreme direct heat or intense sunlight to preserve delicate top note resins.
              </p>
              <p>
                All commercial agreements and disputes are governed in accordance with the laws of the Republic of India and subject to the exclusive jurisdiction of the courts of Jaipur / New Delhi.
              </p>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
};
