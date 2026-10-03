import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageSquare,
  Lock,
  ArrowRight,
  Info,
  Bell,
  TrendingDown,
  Zap,
  Award,
  FileCheck,
  ChevronRight,
  Layers,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORY_VERTICALS } from '../data/categories';

export const ListingDetailModal: React.FC = () => {
  const {
    selectedListing,
    setSelectedListing,
    activeModal,
    setActiveModal,
    reviews,
    hasPriceAlert,
    getPriceAlert,
    setPriceAlert,
    removePriceAlert,
    simulatePriceDrop,
    openProviderProfile,
  } = useMarketplace();

  // Active detail tab
  const [detailTab, setDetailTab] = useState<'specs' | 'credentials' | 'process' | 'reviews'>('specs');

  // Booking config state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rentalStartDate, setRentalStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [rentalEndDate, setRentalEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [quantity, setQuantity] = useState(1);
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');

  // Price Drop Alert local form state
  const [customTargetPrice, setCustomTargetPrice] = useState<number>(() => {
    return selectedListing ? Math.max(5, Math.round(selectedListing.price * 0.85)) : 80;
  });
  const [alertEmail, setAlertEmail] = useState('user@bluecode.market');
  const [isSettingAlert, setIsSettingAlert] = useState(false);

  if (activeModal !== 'detail' || !selectedListing) return null;

  const vertical = CATEGORY_VERTICALS.find((v) => v.id === selectedListing.verticalId);
  const isRental = selectedListing.listingType === 'rental';
  const isProduct = selectedListing.listingType === 'product';
  const isService = selectedListing.listingType === 'service' || selectedListing.listingType === 'freelancer';

  const alertActive = hasPriceAlert(selectedListing.id);
  const existingAlert = getPriceAlert(selectedListing.id);

  // Calculate rental duration in days
  const start = new Date(rentalStartDate);
  const end = new Date(rentalEndDate);
  const diffTime = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const rentalDays = isNaN(diffTime) ? 1 : Math.max(1, diffTime);

  // Financial calculations
  const unitPrice = selectedListing.price;
  const baseTotal = isRental
    ? unitPrice * rentalDays * quantity
    : isProduct
    ? unitPrice * quantity
    : unitPrice * (selectedListing.priceUnit === '/hr' ? 2 : 1);

  const securityDeposit = isRental ? (selectedListing.securityDeposit || 0) * quantity : 0;
  const platformFee = Math.round(baseTotal * 0.20); // 20% BlueCode marketplace platform fee
  const providerPayout = Math.round(baseTotal * 0.80); // 80% net paid out to independent provider
  const deliveryFee = fulfillmentType === 'delivery' ? (selectedListing.inventory.deliveryFee || 25) : 0;
  const grandTotal = baseTotal + securityDeposit + platformFee + deliveryFee;

  const listingReviews = reviews.filter((r) => r.listingId === selectedListing.id);
  const inStock = selectedListing.inventory.availableStock >= quantity;

  const handleProceedToBooking = () => {
    setActiveModal('booking');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62] flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-blue-400">{vertical?.name}</span>
            <span>·</span>
            <span>{selectedListing.subcategory}</span>
            {selectedListing.inventory.sku && (
              <>
                <span>·</span>
                <span className="font-mono text-slate-400">SKU: {selectedListing.inventory.sku}</span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setActiveModal(null);
              setSelectedListing(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Media & Listing Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image & Thumbnails */}
            <div className="space-y-2">
              <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                <img
                  src={selectedListing.images[selectedImageIndex] || selectedListing.images[0]}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />

                {/* Live Real-time Stock Pill on image */}
                {isRental && (
                  <div className="absolute top-3 left-3 bg-[#0B192C]/90 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded-md shadow-md flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedListing.inventory.availableStock > 0 ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                    <span>
                      Real-Time Inventory: {selectedListing.inventory.availableStock} of{' '}
                      {selectedListing.inventory.totalStock} Available
                    </span>
                  </div>
                )}
              </div>

              {selectedListing.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {selectedListing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === i ? 'border-blue-600 scale-105' : 'border-slate-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Overview */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedListing.inventory.locationCity}</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">100% Escrow Protected</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                {selectedListing.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedListing.description}
              </p>
            </div>

            {/* Detailed Content Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setDetailTab('specs')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  detailTab === 'specs'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Specs & Inclusions
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('credentials')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  detailTab === 'credentials'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Credentials & Safety
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('process')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  detailTab === 'process'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Escrow Process
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('reviews')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  detailTab === 'reviews'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Reviews ({listingReviews.length})
              </button>
            </div>

            {/* TAB 1: Specs & Scope */}
            {detailTab === 'specs' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Specifications Grid */}
                {selectedListing.specs && Object.keys(selectedListing.specs).length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-3">
                      Technical Specifications & Equipment Condition
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {Object.entries(selectedListing.specs).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between p-2 rounded bg-white border border-slate-100">
                          <span className="text-slate-500">{key}</span>
                          <span className="font-semibold text-slate-800 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Included in package / service */}
                {selectedListing.included && selectedListing.included.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2.5">
                      Included with this booking
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {selectedListing.included.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules & Requirements */}
                {selectedListing.rules && selectedListing.rules.length > 0 && (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Host & Equipment Guidelines</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                      {selectedListing.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Credentials & Safety */}
            {detailTab === 'credentials' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-xs font-mono uppercase">
                        Provider Verified Credentials
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => openProviderProfile(selectedListing.seller)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Trade License</span>
                      <strong className="text-slate-900">{selectedListing.seller.licenseNumber || 'Master License #48291'}</strong>
                      <p className="text-[10px] text-emerald-700 mt-0.5">Verified active in state database</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Liability Coverage</span>
                      <strong className="text-slate-900">{selectedListing.seller.insuranceCoverage || '$2,000,000 Policy Active'}</strong>
                      <p className="text-[10px] text-emerald-700 mt-0.5">Direct Certificate of Insurance audited</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Identity Verification</span>
                      <strong className="text-slate-900">Biometric & Government ID</strong>
                      <p className="text-[10px] text-emerald-700 mt-0.5">100% Identity Authenticated</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Dispatch Hub</span>
                      <strong className="text-slate-900">{selectedListing.inventory.locationCity}</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">Local pickup or 25-mi delivery available</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
                  <h5 className="font-bold text-blue-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>BlueCode Escrow Guarantee Included</span>
                  </h5>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    All bookings and gear rentals through BlueCode are backed by our escrow contract. Your payment is held safely until you receive the gear in stated working order or until the trade service milestone is certified complete.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Escrow Process */}
            {detailTab === 'process' && (
              <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                <h4 className="font-bold text-slate-900 font-mono uppercase text-xs">
                  How This Booking & Rental Works
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold text-[11px] flex items-center justify-center">
                        1
                      </span>
                      <strong className="text-slate-900">Instant Reserve & Escrow Lock</strong>
                    </div>
                    <p className="text-slate-600 text-[11px] pl-7">
                      Select your dates. Inventory is locked instantly to prevent double-booking. Payment is held in secure escrow.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold text-[11px] flex items-center justify-center">
                        2
                      </span>
                      <strong className="text-slate-900">Handover & Inspection</strong>
                    </div>
                    <p className="text-slate-600 text-[11px] pl-7">
                      Meet host or receive courier delivery. Quick digital checklist confirms pristine equipment condition.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold text-[11px] flex items-center justify-center">
                        3
                      </span>
                      <strong className="text-slate-900">Use with Full Insurance</strong>
                    </div>
                    <p className="text-slate-600 text-[11px] pl-7">
                      Complete your shoot or project with 24/7 host support and platform liability coverage.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[11px] flex items-center justify-center">
                        4
                      </span>
                      <strong className="text-slate-900">Check-In & Deposit Refund</strong>
                    </div>
                    <p className="text-slate-600 text-[11px] pl-7">
                      Drop off gear. Host confirms return and your security deposit auto-refunds to your card within 2 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Reviews */}
            {detailTab === 'reviews' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Verified Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900 ml-1">
                          {selectedListing.seller.rating}
                        </span>
                      </div>
                      <span>·</span>
                      <span>{listingReviews.length > 0 ? listingReviews.length : selectedListing.seller.reviewCount} verified transactions</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal('review_modal')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    + Write a Review
                  </button>
                </div>

                {listingReviews.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    Be the first to review this {isRental ? 'gear rental' : 'service'} after booking!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listingReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.authorAvatar}
                              alt={rev.authorName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="font-bold text-slate-800">{rev.authorName}</span>
                            {rev.verifiedBooking && (
                              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                Verified Rent / Booking
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Inventory Booking Panel, Host Card (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Booking & Inventory Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              {/* Price display */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] font-mono">
                    ${selectedListing.price}
                  </span>
                  <span className="text-sm font-semibold text-slate-600 ml-1">
                    {selectedListing.priceUnit}
                  </span>
                </div>

                {isRental && (
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-emerald-800 font-semibold block">
                      ${selectedListing.securityDeposit} Security Deposit
                    </span>
                    <span className="text-[10px] text-slate-400">100% Refundable</span>
                  </div>
                )}
              </div>

              {/* Real-Time Inventory Status Banner */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-700 font-sans font-medium">Real-Time Stock:</span>
                </div>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    selectedListing.inventory.availableStock > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedListing.inventory.availableStock} Units Available
                </span>
              </div>

              {/* Form Controls depending on type */}
              {isRental && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        value={rentalStartDate}
                        onChange={(e) => setRentalStartDate(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Return Date
                      </label>
                      <input
                        type="date"
                        value={rentalEndDate}
                        onChange={(e) => setRentalEndDate(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Quantity & Days calculated */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-600 font-medium">Rental Duration:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  {selectedListing.inventory.totalStock > 1 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Units Needed:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center hover:bg-slate-300"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) =>
                              Math.min(selectedListing.inventory.availableStock, q + 1)
                            )
                          }
                          className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center hover:bg-slate-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fulfillment mode */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-slate-600 font-semibold text-xs mb-1.5">
                      Handover Method
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('pickup')}
                        className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                          fulfillmentType === 'pickup'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Self-Pickup (Free)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('delivery')}
                        className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                          fulfillmentType === 'delivery'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Courier (+${selectedListing.inventory.deliveryFee || 25})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Service booking controls */}
              {isService && (
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={rentalStartDate}
                      onChange={(e) => setRentalStartDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Appointment Time Window
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option>08:00 AM - 10:00 AM (Morning)</option>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>01:00 PM - 03:00 PM (Afternoon)</option>
                      <option>04:00 PM - 06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Transparent Cost Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>
                    {isRental
                      ? `$${unitPrice} x ${rentalDays} days x ${quantity} unit`
                      : 'Base service / item rate'}
                  </span>
                  <span className="font-mono text-slate-900 font-semibold">${baseTotal}</span>
                </div>

                {isRental && (
                  <div className="flex justify-between text-emerald-800">
                    <span className="flex items-center gap-1">
                      Refundable Security Deposit
                      <Info className="w-3 h-3 text-slate-400" />
                    </span>
                    <span className="font-mono font-semibold">${securityDeposit}</span>
                  </div>
                )}

                {fulfillmentType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Direct Courier Dispatch</span>
                    <span className="font-mono font-semibold">${deliveryFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Provider Payout (80% net)</span>
                  <span className="font-mono">${providerPayout}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    BlueCode Platform Fee (20%)
                    <span title="Includes 24/7 Concierge Customer Care & Escrow Bridging">
                      <Info className="w-3 h-3 text-slate-400" />
                    </span>
                  </span>
                  <span className="font-mono font-semibold">${platformFee}</span>
                </div>

                <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline text-sm font-bold text-slate-900">
                  <span>Total Due Today</span>
                  <span className="text-xl font-mono text-[#0B192C]">${grandTotal}</span>
                </div>

                {isRental && (
                  <p className="text-[10px] text-slate-500 pt-1">
                    * ${securityDeposit} deposit is automatically released back to your payment card upon equipment return check-in.
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={!inStock}
                onClick={handleProceedToBooking}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  inStock
                    ? 'bg-blue-600 hover:bg-blue-500 active:scale-98'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {inStock
                    ? isRental
                      ? 'Reserve & Lock Inventory'
                      : 'Book with Escrow Protection'
                    : 'Currently Out of Stock'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Price Drop Alert Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      alertActive ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Price Drop Alert
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {alertActive ? 'Active · Tracking rate decreases' : 'Get notified if host lowers price'}
                    </span>
                  </div>
                </div>

                {alertActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Tracking
                  </span>
                )}
              </div>

              {alertActive && existingAlert ? (
                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Target Notification Price:</span>
                    <span className="font-bold font-mono text-amber-900">
                      ${existingAlert.targetPrice}{selectedListing.priceUnit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    You will receive an in-app & email alert to <strong>{existingAlert.userEmail}</strong> the moment the host drops the rate below ${existingAlert.targetPrice}.
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => simulatePriceDrop(selectedListing.id, 15)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      title="Simulates host lowering price by $15 to immediately test notification"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Test Price Drop (-$15)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removePriceAlert(existingAlert.id)}
                      className="py-1.5 px-3 rounded-lg border border-slate-300 text-slate-600 hover:text-rose-600 font-medium text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Notify me when rate drops to:</span>
                    <span className="font-bold font-mono text-blue-700">
                      ${customTargetPrice}{selectedListing.priceUnit}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomTargetPrice(Math.max(5, Math.round(selectedListing.price * 0.9)))
                      }
                      className={`p-1.5 rounded-lg border text-center font-mono text-[11px] font-medium cursor-pointer ${
                        customTargetPrice === Math.max(5, Math.round(selectedListing.price * 0.9))
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      -10% (${Math.round(selectedListing.price * 0.9)})
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomTargetPrice(Math.max(5, Math.round(selectedListing.price * 0.8)))
                      }
                      className={`p-1.5 rounded-lg border text-center font-mono text-[11px] font-medium cursor-pointer ${
                        customTargetPrice === Math.max(5, Math.round(selectedListing.price * 0.8))
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      -20% (${Math.round(selectedListing.price * 0.8)})
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomTargetPrice(Math.max(5, Math.round(selectedListing.price * 0.7)))
                      }
                      className={`p-1.5 rounded-lg border text-center font-mono text-[11px] font-medium cursor-pointer ${
                        customTargetPrice === Math.max(5, Math.round(selectedListing.price * 0.7))
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      -30% (${Math.round(selectedListing.price * 0.7)})
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setPriceAlert(selectedListing.id, customTargetPrice, alertEmail)}
                    className="w-full py-2 px-3 rounded-lg bg-[#0B192C] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Set Price Drop Alert</span>
                  </button>
                </div>
              )}
            </div>

            {/* Seller / Host Trust Profile Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedListing.seller.avatar}
                  alt={selectedListing.seller.name}
                  onClick={() => openProviderProfile(selectedListing.seller)}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 cursor-pointer hover:opacity-90 transition-opacity"
                  title="Click to view full provider profile"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openProviderProfile(selectedListing.seller)}
                      className="font-bold text-sm text-slate-900 truncate hover:text-blue-600 transition-colors text-left cursor-pointer"
                    >
                      {selectedListing.seller.name}
                    </button>
                    {selectedListing.seller.verified && (
                      <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Member since {selectedListing.seller.memberSince} · {selectedListing.seller.badge}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono">
                <div className="p-1.5 rounded bg-slate-50">
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Rating</span>
                  <span className="font-bold text-slate-900">{selectedListing.seller.rating} ★</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50">
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Response</span>
                  <span className="font-bold text-slate-900">{selectedListing.seller.responseRate}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50">
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Deals</span>
                  <span className="font-bold text-slate-900">{selectedListing.seller.totalTransactions || 85}+</span>
                </div>
              </div>

              {selectedListing.seller.bio && (
                <p className="text-[11px] text-slate-600 italic">
                  "{selectedListing.seller.bio}"
                </p>
              )}

              {/* View Full Profile CTA */}
              <button
                type="button"
                onClick={() => openProviderProfile(selectedListing.seller)}
                className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Provider Profile & Credentials</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* BlueCode 24/7 Customer Care Bridging Notice */}
            <div className="bg-gradient-to-br from-blue-900 via-[#0B192C] to-slate-900 rounded-xl p-4 text-white text-xs space-y-2 border border-blue-500/30 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/40 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">
                    BlueCode Customer Care Guarantee
                  </h4>
                  <p className="text-[10px] text-sky-200">
                    24/7 Concierge bridging every booking & provider
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                BlueCode is an open marketplace where verified providers self-publish. We do not sell our own inventory. Our support team bridges communication with <span className="text-white font-semibold">{selectedListing.seller.name}</span>, tracks fulfillment, and guarantees 100% escrow protection whether services are completed or disputed.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal('customer_care')}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white font-bold text-xs border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Connect via Customer Care Concierge</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
