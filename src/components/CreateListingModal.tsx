import React, { useState } from 'react';
import { X, Plus, Package, DollarSign, MapPin, ShieldCheck, Check } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORY_VERTICALS } from '../data/categories';
import { VerticalId, ListingType } from '../types';

export const CreateListingModal: React.FC = () => {
  const { activeModal, setActiveModal, addListing } = useMarketplace();

  const [verticalId, setVerticalId] = useState<VerticalId>('rentals');
  const [subcategory, setSubcategory] = useState('Cameras');
  const [listingType, setListingType] = useState<ListingType>('rental');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(85);
  const [priceUnit, setPriceUnit] = useState<'/day' | '/hr' | 'fixed' | '/item' | '/project'>('/day');
  const [securityDeposit, setSecurityDeposit] = useState(250);
  const [totalStock, setTotalStock] = useState(2);
  const [locationCity, setLocationCity] = useState('Austin, TX');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800');
  const [sku, setSku] = useState('RENT-GEAR-01');
  const [sellerName, setSellerName] = useState('BlueCode Verified Host');
  const [specsText, setSpecsText] = useState('Condition: Excellent\nIncludes: Hard Case, Charger');

  if (activeModal !== 'create_listing') return null;

  const currentVertical = CATEGORY_VERTICALS.find((v) => v.id === verticalId);

  const handleVerticalChange = (vId: VerticalId) => {
    setVerticalId(vId);
    const v = CATEGORY_VERTICALS.find((cat) => cat.id === vId);
    if (v) {
      setSubcategory(v.subcategories[0] || 'General');
      setListingType(v.defaultListingType);
      if (v.defaultListingType === 'rental') {
        setPriceUnit('/day');
      } else if (v.defaultListingType === 'service') {
        setPriceUnit('/hr');
      } else if (v.defaultListingType === 'product') {
        setPriceUnit('/item');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse specs
    const specsMap: Record<string, string> = {};
    specsText.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        specsMap[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    addListing({
      title,
      description,
      verticalId,
      subcategory,
      listingType,
      price: Number(price),
      priceUnit,
      securityDeposit: listingType === 'rental' ? Number(securityDeposit) : undefined,
      inventory: {
        totalStock: Number(totalStock),
        availableStock: Number(totalStock),
        sku: sku || undefined,
        locationCity,
        instantBooking: true,
        allowPickup: true,
        allowDelivery: true,
        deliveryFee: 25,
      },
      seller: {
        id: `usr-${Date.now()}`,
        name: sellerName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
        rating: 5.0,
        reviewCount: 1,
        responseRate: '100%',
        responseTime: '15 mins',
        location: locationCity,
        badge: 'Verified Provider',
        memberSince: '2026',
      },
      images: [imageUrl],
      tags: [subcategory, locationCity],
      specs: specsMap,
      included: ['Standard Package', 'Verification Inspection'],
      rules: ['Clean condition upon return', 'Government ID verification'],
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/30">
              <Plus className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                List Service or Equipment on BlueCode
              </h2>
              <p className="text-xs text-slate-300">
                Publish across 18 marketplace verticals with real-time stock management
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Open Marketplace Policy Notice */}
        <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span>
              <strong>Open Self-Publishing:</strong> BlueCode does not sell its own products or services. Anyone can register.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded whitespace-nowrap self-start sm:self-auto">
            You keep 80% · 20% BlueCode Concierge Fee
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Vertical and Subcategory selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Marketplace Vertical
              </label>
              <select
                value={verticalId}
                onChange={(e) => handleVerticalChange(e.target.value as VerticalId)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                {CATEGORY_VERTICALS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                {currentVertical?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Listing Type Toggle */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Transaction Model
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'rental', label: 'P2P Gear Rental' },
                { type: 'service', label: 'On-Demand Service' },
                { type: 'freelancer', label: 'Professional Profile' },
                { type: 'product', label: 'Physical Product' },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setListingType(opt.type as ListingType)}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    listingType === opt.type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Listing Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony A7 IV Camera Package, Emergency Plumber 24/7, UI/UX Redesign..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Comprehensive Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe condition, specifications, qualifications, pickup instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Pricing & Real-Time Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Rate / Price ($ USD)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
                />
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value as any)}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  <option value="/day">/day</option>
                  <option value="/hr">/hr</option>
                  <option value="fixed">fixed</option>
                  <option value="/item">/item</option>
                  <option value="/project">/project</option>
                </select>
              </div>
            </div>

            {listingType === 'rental' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Refundable Security Deposit ($)
                </label>
                <input
                  type="number"
                  min={0}
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Inventory Stock Units
              </label>
              <input
                type="number"
                min={1}
                value={totalStock}
                onChange={(e) => setTotalStock(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Location & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                City & State (Location Hub)
              </label>
              <input
                type="text"
                required
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Inventory SKU or Asset ID
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Primary Photo URL
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
            />
          </div>

          {/* Specs */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Specifications / Scope (Format: Key: Value, one per line)
            </label>
            <textarea
              rows={2}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>Publish to BlueCode Marketplace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
