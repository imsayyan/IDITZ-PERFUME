import React, { useState } from 'react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSettings } from '../context/SettingsContext';
import { Mail, Phone, MessageCircle, CheckCircle, Send, ArrowRight } from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const cleanWhatsappNumber = (num) => {
  if (!num) return '919986324619';
  const clean = String(num).replace(/[^0-9]/g, '');
  if (clean.length === 10) return `91${clean}`;
  return clean;
};

const cleanPhoneNumber = (num) => {
  if (!num) return '+919986324619';
  return String(num).replace(/\s+/g, '');
};

export const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Fragrance Recommendation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const targetWhatsappNumber = cleanWhatsappNumber(settings.whatsapp_number || '9986324619');
  const targetEmail = settings.store_email || 'concierge@iditzperfume.com';
  const targetPhone = settings.store_phone || '9986324619';

  const validateForm = () => {
    if (!form.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!form.message.trim()) {
      setErrorMsg('Please enter your inquiry message.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const buildWhatsappText = (data) => {
    return (
      `*IDITZ PERFUME — Client Concierge Inquiry*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Client Name:* ${data.name.trim()}\n` +
      `*Email:* ${data.email.trim()}\n` +
      `*Phone:* ${data.phone.trim() || 'Not Provided'}\n` +
      `*Subject:* ${data.subject}\n\n` +
      `*Inquiry Message:*\n${data.message.trim()}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Sent via IDITZ PERFUME Concierge Desk_`
    );
  };

  const buildEmailContent = (data) => {
    const subject = `[IDITZ PERFUME Inquiry] ${data.subject} — ${data.name.trim()}`;
    const body = (
      `IDITZ PERFUME — Client Concierge Inquiry\n` +
      `========================================\n` +
      `Client Name: ${data.name.trim()}\n` +
      `Email: ${data.email.trim()}\n` +
      `Phone: ${data.phone.trim() || 'Not Provided'}\n` +
      `Subject: ${data.subject}\n\n` +
      `Inquiry Message:\n${data.message.trim()}\n\n` +
      `========================================\n` +
      `Sent via IDITZ PERFUME Private Concierge Desk`
    );
    return { subject, body };
  };

  const handleSendWhatsApp = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const text = buildWhatsappText(form);
    const waUrl = `https://wa.me/${targetWhatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSubmittedData({ ...form });
    setSubmitted(true);
  };

  const handleSendEmail = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const { subject, body } = buildEmailContent(form);
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setSubmittedData({ ...form });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] sm:text-xs font-semibold tracking-wide-luxury uppercase text-luxury-goldDark block mb-1">
            Private Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-luxury-black tracking-tight">
            CONNECT WITH OUR ATELIER
          </h1>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto my-2.5" />
          <p className="text-xs text-luxury-charcoal/80 font-light leading-relaxed">
            Whether inquiring about bespoke bridal formulations, custom discovery sets, or delivery inquiries, our dedicated fragrance concierge connects directly with you via WhatsApp and Email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Ateliers */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 border border-luxury-lightBorder shadow-subtle space-y-5">
              <h3 className="font-serif font-bold text-base text-luxury-black border-b border-luxury-lightBorder pb-2 tracking-wide">
                DIRECT CONCIERGE CHANNELS
              </h3>

              <div className="space-y-4 text-xs">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-luxury-ivory text-luxury-goldDark border border-luxury-gold/30 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-luxury-black">Direct Telephone</p>
                    <a
                      href={`tel:${cleanPhoneNumber(targetPhone)}`}
                      className="text-luxury-charcoal hover:text-luxury-goldDark font-medium transition-colors block mt-0.5"
                    >
                      {targetPhone}
                    </a>
                    <p className="text-[10px] text-luxury-charcoal/60 mt-0.5">Mon - Sat: 10:00 AM - 8:00 PM IST</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-luxury-ivory text-luxury-goldDark border border-luxury-gold/30 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-luxury-black">Electronic Dispatch</p>
                    <a
                      href={`mailto:${targetEmail}`}
                      className="text-luxury-charcoal hover:text-luxury-goldDark font-medium transition-colors block mt-0.5 break-all"
                    >
                      {targetEmail}
                    </a>
                    <p className="text-[10px] text-luxury-charcoal/60 mt-0.5">Direct concierge mailbox</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#128C7E]/15 text-[#075E54] border border-emerald-300 flex-shrink-0">
                    <WhatsAppIcon className="w-4 h-4 fill-emerald-800" />
                  </div>
                  <div>
                    <p className="font-semibold text-luxury-black">Instant WhatsApp Concierge</p>
                    <p className="text-luxury-charcoal">Real-time scent consultation & order assistance</p>
                    <a
                      href={`https://wa.me/${targetWhatsappNumber}?text=${encodeURIComponent('Greetings IDITZ Concierge, I would like to inquire about IDITZ Perfumes.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Chat Directly on WhatsApp →
                    </a>
                  </div>
                </div>
              </div>

              {/* Concierge Guarantee Badge */}
              <div className="pt-3 border-t border-luxury-lightBorder/70">
                <div className="bg-luxury-cream/70 p-3 border border-luxury-gold/20 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse flex-shrink-0" />
                  <p className="text-[11px] text-luxury-charcoal leading-snug">
                    <strong className="text-luxury-black font-semibold">Priority Concierge Response:</strong> All inquiries sent via WhatsApp or Email receive personalized attention.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7 bg-white p-8 border border-luxury-lightBorder shadow-subtle">
            <div className="flex items-center justify-between border-b border-luxury-lightBorder pb-3 mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-luxury-black">
                  DISPATCH A MISSIVE
                </h3>
                <p className="text-xs text-luxury-charcoal/70 mt-0.5">
                  Direct connection with our private fragrance concierge desk.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-luxury-goldDark font-semibold">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-700" />
                <span>WhatsApp & Email Ready</span>
              </div>
            </div>

            {submitted && submittedData ? (
              <div className="p-6 sm:p-8 bg-luxury-ivory border border-luxury-gold text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-luxury-goldDark block mb-1">
                    Direct Connection Dispatched
                  </span>
                  <h4 className="font-serif font-bold text-xl text-luxury-black">
                    Missive Formulated & Connected
                  </h4>
                </div>

                <p className="text-xs text-luxury-charcoal max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-luxury-black">{submittedData.name}</strong>. Your inquiry regarding <strong className="text-luxury-black">"{submittedData.subject}"</strong> has been prepared for IDITZ PERFUME Private Concierge.
                </p>

                {/* Details summary */}
                <div className="bg-white p-4 border border-luxury-lightBorder max-w-md mx-auto text-left text-xs space-y-2 shadow-sm">
                  <div className="flex justify-between border-b border-luxury-lightBorder/50 pb-1">
                    <span className="text-luxury-charcoal/70">Client:</span>
                    <span className="font-semibold text-luxury-black">{submittedData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-luxury-lightBorder/50 pb-1">
                    <span className="text-luxury-charcoal/70">Email:</span>
                    <span className="font-semibold text-luxury-black">{submittedData.email}</span>
                  </div>
                  {submittedData.phone && (
                    <div className="flex justify-between border-b border-luxury-lightBorder/50 pb-1">
                      <span className="text-luxury-charcoal/70">Phone:</span>
                      <span className="font-semibold text-luxury-black">{submittedData.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-luxury-lightBorder/50 pb-1">
                    <span className="text-luxury-charcoal/70">Subject:</span>
                    <span className="font-semibold text-luxury-goldDark">{submittedData.subject}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-luxury-charcoal/70 block mb-0.5">Message:</span>
                    <p className="text-luxury-charcoal italic bg-luxury-cream/50 p-2.5 border border-luxury-lightBorder/40 rounded text-[11px] whitespace-pre-wrap">
                      {submittedData.message}
                    </p>
                  </div>
                </div>

                {/* Quick re-dispatch actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const text = buildWhatsappText(submittedData);
                      const waUrl = `https://wa.me/${targetWhatsappNumber}?text=${encodeURIComponent(text)}`;
                      window.open(waUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full sm:w-auto bg-[#128C7E] hover:bg-[#075E54] text-white py-2.5 px-4 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                    <span>Open on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      const { subject, body } = buildEmailContent(submittedData);
                      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                    className="w-full sm:w-auto luxury-btn-primary py-2.5 px-4 text-xs flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Open in Email Client</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedData(null);
                      setForm({ name: '', email: '', phone: '', subject: 'Fragrance Recommendation', message: '' });
                    }}
                    className="w-full sm:w-auto luxury-btn-secondary py-2.5 px-4 text-xs"
                  >
                    Send Another Missive
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendWhatsApp} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. Maharani Gayatri"
                      className="luxury-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="your.email@domain.com"
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                      Mobile Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 Mobile number"
                      className="luxury-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="luxury-input bg-white"
                    >
                      <option value="Fragrance Recommendation">Fragrance Recommendation</option>
                      <option value="Bespoke Order / Wedding Gifting">Bespoke Order / Wedding Gifting</option>
                      <option value="Order Tracking / Delivery">Order Tracking / Delivery</option>
                      <option value="Press / Retail Partnership">Press / Retail Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Describe your olfactory preferences, occasion or order details..."
                    className="luxury-input"
                  />
                </div>

                {/* Direct Connect Buttons */}
                <div className="pt-3 space-y-2.5">
                  <p className="text-[11px] text-luxury-charcoal/70 uppercase tracking-wider font-semibold">
                    Choose your preferred concierge channel:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Send on WhatsApp Button */}
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="bg-[#128C7E] hover:bg-[#075E54] text-white py-3.5 px-4 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg border border-emerald-600/40 rounded-none cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                      <span>DISPATCH ON WHATSAPP</span>
                    </button>

                    {/* Send via Email Button */}
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      className="luxury-btn-primary py-3.5 px-4 text-xs flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-luxury-gold" />
                      <span>DISPATCH VIA EMAIL</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-luxury-charcoal/60 text-center pt-1">
                    Clicking either channel pre-fills your inquiry directly to our concierge team at <strong className="text-luxury-black">{targetPhone}</strong> and <strong className="text-luxury-black">{targetEmail}</strong>.
                  </p>
                </div>
              </form>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

