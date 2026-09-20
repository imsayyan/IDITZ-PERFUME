import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowLeft,
  Upload,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PREDEFINED_SIZES = ['30ml', '50ml', '100ml', '120ml', '150ml'];

export const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    gender: 'unisex', // 'men', 'women', 'unisex'
    fragrance_family: 'Woody',
    sizeChoice: '100ml', // '30ml' | '50ml' | '100ml' | '120ml' | '150ml' | 'custom'
    customSize: '',
    price: '',
    mrp: '',
    stock_quantity: 50,
    short_description: '',
    full_description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    images: ['/images/perfumes/kashmir-saffron-amber.svg'],
    imageUrl: '/images/perfumes/kashmir-saffron-amber.svg',
    is_active: 1
  });

  const [manualUrl, setManualUrl] = useState('');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const res = await api.getAdminProductById(id);
          const p = res.product;
          
          const rawSize = p.size || '100ml';
          const isPredefined = PREDEFINED_SIZES.includes(rawSize);

          let prodImages = [];
          if (Array.isArray(p.images) && p.images.length > 0) {
            prodImages = p.images.filter(Boolean);
          } else if (typeof p.images === 'string' && p.images.trim()) {
            try {
              const parsed = JSON.parse(p.images);
              prodImages = Array.isArray(parsed) ? parsed.filter(Boolean) : [p.images.trim()];
            } catch {
              prodImages = [p.images.trim()];
            }
          }
          if (prodImages.length === 0) {
            prodImages = ['/images/perfumes/kashmir-saffron-amber.svg'];
          }

          setFormData({
            name: p.name || '',
            sku: p.sku || '',
            gender: (p.gender || 'unisex').toLowerCase(),
            fragrance_family: p.fragrance_family || 'Woody',
            sizeChoice: isPredefined ? rawSize : 'custom',
            customSize: isPredefined ? '' : rawSize,
            price: p.price !== undefined ? p.price.toString() : '',
            mrp: p.mrp !== undefined ? p.mrp.toString() : '',
            stock_quantity: p.stock_quantity !== undefined ? p.stock_quantity : 0,
            short_description: p.short_description || '',
            full_description: p.full_description || '',
            top_notes: p.top_notes || '',
            heart_notes: p.heart_notes || '',
            base_notes: p.base_notes || '',
            images: prodImages,
            imageUrl: prodImages[0],
            is_active: p.is_active !== undefined ? p.is_active : 1
          });
        } catch (err) {
          console.error('Failed to load product for editing:', err);
          setError('Failed to fetch product details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      let uploadedUrls = [];
      if (files.length === 1) {
        const res = await api.uploadProductImage(files[0]);
        if (res.url) uploadedUrls = [res.url];
        else if (res.urls && res.urls.length > 0) uploadedUrls = res.urls;
      } else {
        const res = await api.uploadProductImages(files);
        if (res.urls && res.urls.length > 0) uploadedUrls = res.urls;
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => {
          const isOnlyDefault = prev.images.length === 1 && prev.images[0] === '/images/perfumes/kashmir-saffron-amber.svg';
          const nextImages = isOnlyDefault ? uploadedUrls : [...prev.images, ...uploadedUrls];
          return {
            ...prev,
            images: nextImages,
            imageUrl: nextImages[0]
          };
        });
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image(s): ' + (err.message || 'Server error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const next = [...prev.images];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return {
        ...prev,
        images: next,
        imageUrl: next[0]
      };
    });
  };

  const handleMoveImage = (index, dir) => {
    setFormData(prev => {
      const target = index + dir;
      if (target < 0 || target >= prev.images.length) return prev;
      const next = [...prev.images];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return {
        ...prev,
        images: next,
        imageUrl: next[0]
      };
    });
  };

  const handleRemoveImageIndex = (index) => {
    setFormData(prev => {
      const next = prev.images.filter((_, i) => i !== index);
      const finalImages = next.length > 0 ? next : ['/images/perfumes/kashmir-saffron-amber.svg'];
      return {
        ...prev,
        images: finalImages,
        imageUrl: finalImages[0]
      };
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    setFormData(prev => {
      const isOnlyDefault = prev.images.length === 1 && prev.images[0] === '/images/perfumes/kashmir-saffron-amber.svg';
      const nextImages = isOnlyDefault ? [url] : [...prev.images, url];
      return {
        ...prev,
        images: nextImages,
        imageUrl: nextImages[0]
      };
    });
    setManualUrl('');
  };

  const finalFlaconSize = formData.sizeChoice === 'custom'
    ? (formData.customSize.trim() || '100ml')
    : formData.sizeChoice;

  const numPrice = Number(formData.price) || 0;
  const numMrp = Number(formData.mrp) || 0;
  const calculatedDiscount = numMrp > numPrice && numPrice > 0
    ? Math.round(((numMrp - numPrice) / numMrp) * 100)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a Perfume Name.');
      return;
    }

    if (!formData.sku.trim()) {
      setError('Please provide an SKU identifier.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid Retail Price in ₹ INR.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        gender: formData.gender,
        fragrance_family: formData.fragrance_family || 'Woody',
        size: finalFlaconSize,
        price: numPrice,
        mrp: numMrp > 0 ? numMrp : numPrice,
        stock_quantity: Math.max(0, Number(formData.stock_quantity) || 0),
        short_description: formData.short_description.trim(),
        full_description: formData.full_description.trim(),
        top_notes: formData.top_notes.trim(),
        heart_notes: formData.heart_notes.trim(),
        images: (formData.images && formData.images.length > 0)
          ? formData.images.filter(Boolean)
          : [formData.imageUrl || '/images/perfumes/kashmir-saffron-amber.svg'],
        is_active: formData.is_active
      };

      if (isEditing) {
        await api.updateProduct(id, payload);
      } else {
        await api.createProduct(payload);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-luxury-charcoal">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-luxury-lightBorder pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 hover:bg-white border border-luxury-lightBorder rounded text-luxury-black transition-colors"
            title="Return to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-luxury-black">
              {isEditing ? `EDIT PERFUME: ${formData.name}` : 'ADD NEW PERFUME'}
            </h1>
            <p className="text-xs text-luxury-charcoal/70 mt-0.5">
              Updates will automatically reflect on the customer website.
            </p>
          </div>
        </div>

        <Link
          to="/admin/products"
          className="text-xs font-semibold text-luxury-charcoal hover:text-luxury-black uppercase tracking-wider hidden sm:inline-block"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-rose-800 text-xs font-semibold flex items-center gap-2 rounded">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Essential Product Identity Card */}
        <div className="bg-white p-5 sm:p-6 border border-luxury-lightBorder shadow-subtle space-y-5">
          <h2 className="font-serif font-bold text-sm sm:text-base text-luxury-black border-b border-luxury-lightBorder pb-2 uppercase tracking-wide">
            Product Information
          </h2>

          {/* Perfume Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
              1. Perfume Name *
            </label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Royal Kashmiri Saffron Extrait"
              className="luxury-input w-full"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
              2. SKU Identifier *
            </label>
            <input
              type="text"
              required
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. NP-KSR-01"
              className="luxury-input w-full uppercase font-mono"
            />
            <p className="text-[11px] text-luxury-charcoal/60 mt-1">
              Unique product code for stock identification.
            </p>
          </div>

          {/* Gender Classification */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-2">
              3. Gender Classification *
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: 'Men', value: 'men' },
                { label: 'Women', value: 'women' },
                { label: 'Unisex', value: 'unisex' }
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: g.value }))}
                  className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border transition-all text-center ${
                    formData.gender === g.value
                      ? 'border-luxury-gold bg-luxury-gold text-luxury-black shadow-subtle'
                      : 'border-luxury-lightBorder bg-luxury-ivory/40 text-luxury-charcoal hover:border-luxury-gold/50'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flacon Size */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-2">
              4. Flacon Size *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PREDEFINED_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, sizeChoice: size }))}
                  className={`py-2.5 px-2 text-xs font-semibold uppercase border transition-all text-center ${
                    formData.sizeChoice === size
                      ? 'border-luxury-gold bg-luxury-gold text-luxury-black'
                      : 'border-luxury-lightBorder bg-luxury-ivory/40 text-luxury-charcoal hover:border-luxury-gold/50'
                  }`}
                >
                  {size}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sizeChoice: 'custom' }))}
                className={`py-2.5 px-2 text-xs font-semibold uppercase border transition-all text-center ${
                  formData.sizeChoice === 'custom'
                    ? 'border-luxury-gold bg-luxury-gold text-luxury-black'
                    : 'border-luxury-lightBorder bg-luxury-ivory/40 text-luxury-charcoal hover:border-luxury-gold/50'
                }`}
              >
                Custom
              </button>
            </div>

            {formData.sizeChoice === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  name="customSize"
                  value={formData.customSize}
                  onChange={handleChange}
                  placeholder="Enter custom size (e.g. 200ml, 10ml Travel Extrait)"
                  className="luxury-input w-full text-xs"
                />
              </div>
            )}
            <p className="text-[11px] text-luxury-charcoal/60 mt-1">
              Active flacon size: <strong className="text-luxury-black">{finalFlaconSize}</strong>
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
                5. Retail Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-bold text-luxury-charcoal">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2999"
                  className="luxury-input w-full pl-7"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
                6. Original MRP (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-bold text-luxury-charcoal">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  placeholder="3999"
                  className="luxury-input w-full pl-7"
                />
              </div>
            </div>
          </div>

          {/* Discount Preview */}
          {calculatedDiscount > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
              <span>🏷️ Applied Customer Discount:</span>
              <span className="font-bold">{calculatedDiscount}% OFF (Saves ₹{(numMrp - numPrice).toLocaleString('en-IN')})</span>
            </div>
          )}

          {/* Inventory Stock Quantity */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
              7. Inventory Stock Quantity *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="luxury-input w-full sm:max-w-xs"
            />
            {Number(formData.stock_quantity) === 0 ? (
              <p className="text-xs text-rose-700 font-semibold mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Stock is 0: Product will display as "OUT OF STOCK" on customer store.
              </p>
            ) : (
              <p className="text-xs text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Product available for purchase ({formData.stock_quantity} units).
              </p>
            )}
          </div>

        </div>

        {/* 2. Fragrance Description & Olfactory Notes Card */}
        <div className="bg-white p-5 sm:p-6 border border-luxury-lightBorder shadow-subtle space-y-5">
          <div className="border-b border-luxury-lightBorder pb-2">
            <h2 className="font-serif font-bold text-sm sm:text-base text-luxury-black uppercase tracking-wide">
              8. Fragrance Description
            </h2>
            <p className="text-xs text-luxury-charcoal/70 mt-0.5">
              Craft the short teaser and full detailed description for the customer storefront.
            </p>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
              Short Description / Teaser
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="e.g. A sensual blend of silver musk, fresh lavender, and smoked agarwood."
              className="luxury-input w-full"
            />
            <p className="text-[11px] text-luxury-charcoal/60 mt-1">
              One-sentence summary displayed on product cards and subtitle.
            </p>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-black mb-1.5">
              Full Description
            </label>
            <textarea
              rows={6}
              name="full_description"
              value={formData.full_description}
              onChange={handleChange}
              placeholder="Enter the complete detailed perfume description, formulation inspiration, projection, and olfactory experience..."
              className="luxury-input w-full leading-relaxed"
            />
            <p className="text-[11px] text-luxury-charcoal/60 mt-1">
              Detailed narrative rendered prominently on the boutique product page.
            </p>
          </div>
        </div>

        {/* 9. Flacon Imagery & Multi-Image Gallery Card */}
        <div className="bg-white p-5 sm:p-6 border border-luxury-lightBorder shadow-subtle space-y-5">
          <div className="border-b border-luxury-lightBorder pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-sm sm:text-base text-luxury-black uppercase tracking-wide flex items-center gap-2">
                <span>9. Flacon Imagery & Multi-Image Gallery</span>
                <span className="text-[10px] bg-luxury-gold/20 text-luxury-goldDark font-sans font-semibold px-2 py-0.5 rounded-full">
                  {formData.images?.length || 0} {formData.images?.length === 1 ? 'Image' : 'Images'}
                </span>
              </h2>
              <p className="text-xs text-luxury-charcoal/70 mt-0.5">
                Upload multiple images for this perfume (front flacon, packaging, angles, notes card). Drag/reorder or choose the primary cover image.
              </p>
            </div>
          </div>

          {/* Upload & Add Controls Bar */}
          <div className="bg-luxury-ivory/50 p-4 border border-luxury-lightBorder space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="luxury-btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Images...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images (Select Multiple)</span>
                  </>
                )}
              </button>

              <span className="text-xs text-luxury-charcoal/60 hidden sm:inline">or</span>

              {/* Add by URL input */}
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualUrl();
                    }
                  }}
                  placeholder="Paste image URL or /uploads/perfume-... path"
                  className="luxury-input text-xs py-2"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  disabled={!manualUrl.trim()}
                  className="luxury-btn-secondary text-xs py-2 px-3 whitespace-nowrap disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 inline" /> Add URL
                </button>
              </div>
            </div>

            {uploadSuccess && (
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 pt-1">
                <CheckCircle className="w-3.5 h-3.5" /> Image(s) uploaded and added to the gallery successfully!
              </p>
            )}

            <p className="text-[11px] text-luxury-charcoal/60">
              Tip: You can select multiple images at once (PNG, JPG, WEBP, SVG up to 10MB each). The 1st image (#1) is the primary cover image shown on boutique cards and collections.
            </p>
          </div>

          {/* Interactive Multi-Image Gallery Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-luxury-black">
              Current Gallery Images ({formData.images?.length || 0})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(formData.images || []).map((imgUrl, index) => {
                const isPrimary = index === 0;
                return (
                  <div
                    key={`${imgUrl}-${index}`}
                    className={`group relative bg-white border rounded p-2 flex flex-col items-center transition-all ${
                      isPrimary
                        ? 'border-luxury-gold ring-2 ring-luxury-gold/40 shadow-md'
                        : 'border-luxury-lightBorder hover:border-luxury-gold/60 shadow-sm'
                    }`}
                  >
                    {/* Primary Badge / Index tag */}
                    <div className="absolute top-2 left-2 z-10">
                      {isPrimary ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-luxury-gold text-luxury-black shadow">
                          <Star className="w-2.5 h-2.5 fill-luxury-black" /> Cover
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-luxury-charcoal/70 text-white rounded">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Image Preview Box */}
                    <div className="w-full h-36 bg-luxury-ivory/30 flex items-center justify-center p-2 rounded overflow-hidden relative">
                      <img
                        src={imgUrl}
                        alt={`Perfume View ${index + 1}`}
                        className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/images/perfumes/kashmir-saffron-amber.svg';
                        }}
                      />
                    </div>

                    {/* Image Controls */}
                    <div className="w-full pt-2 flex flex-col gap-1.5 border-t border-luxury-lightBorder/70 mt-2">
                      {/* Set Primary Button */}
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="w-full text-[10px] uppercase tracking-wider py-1 px-2 border border-luxury-gold/60 text-luxury-goldDark hover:bg-luxury-gold hover:text-luxury-black font-semibold transition-colors flex items-center justify-center gap-1"
                          title="Set as primary cover image"
                        >
                          <Star className="w-2.5 h-2.5" /> Make Cover
                        </button>
                      )}

                      {/* Reorder and Delete Toolbar */}
                      <div className="flex items-center justify-between w-full pt-0.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveImage(index, -1)}
                            className="p-1 text-luxury-charcoal hover:text-luxury-black hover:bg-luxury-sand/50 rounded disabled:opacity-20 transition-colors"
                            title="Move left/earlier"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === formData.images.length - 1}
                            onClick={() => handleMoveImage(index, 1)}
                            className="p-1 text-luxury-charcoal hover:text-luxury-black hover:bg-luxury-sand/50 rounded disabled:opacity-20 transition-colors"
                            title="Move right/later"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveImageIndex(index)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Remove this image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="bg-white p-4 sm:p-5 border border-luxury-lightBorder flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-luxury-black block uppercase tracking-wide">
              Storefront Visibility
            </span>
            <span className="text-[11px] text-luxury-charcoal/70">
              When enabled, product is active and purchasable by customers.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active === 1}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* 9. Save Product Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/products"
            className="w-full sm:w-auto luxury-btn-secondary text-xs py-3 px-6 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full sm:w-auto luxury-btn-primary text-xs py-3.5 px-10 text-center font-bold tracking-wider"
          >
            {saving ? 'Saving to Database...' : (isEditing ? 'UPDATE PRODUCT' : 'SAVE PRODUCT')}
          </button>
        </div>

      </form>

    </div>
  );
};
