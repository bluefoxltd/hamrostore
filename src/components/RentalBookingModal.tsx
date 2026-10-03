import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  Building,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const RentalBookingModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedListing,
    createBooking,
  } = useMarketplace();

  // Form State
  const [buyerName, setBuyerName] = useState('Alex Morgan');
  const [buyerEmail, setBuyerEmail] = useState('alex.morgan@example.com');
  const [buyerPhone, setBuyerPhone] = useState('+1 (512) 555-0188');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'escrow_wallet' | 'ach'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('382');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (activeModal !== 'booking' || !selectedListing) return null;

  const isRental = selectedListing.listingType === 'rental';
  const durationDays = 3;
  const quantity = 1;
  const basePrice = selectedListing.price * (isRental ? durationDays : 1);
  const securityDeposit = isRental ? (selectedListing.securityDeposit || 0) : 0;
  const serviceFee = Math.round(basePrice * 0.20); // Exactly 20% BlueCode platform fee
  const sellerPayout = Math.round(basePrice * 0.80); // 80% net paid out to the provider
  const insuranceFee = isRental ? 18 : 0;
  const totalAmount = basePrice + securityDeposit + serviceFee + insuranceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    setIsProcessing(true);

    setTimeout(() => {
      createBooking({
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        listingType: selectedListing.listingType,
        listingImage: selectedListing.images[0],
        sellerName: selectedListing.seller.name,
        buyerName,
        buyerEmail,
        buyerPhone,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        durationDays: isRental ? durationDays : undefined,
        quantity,
        basePrice,
        securityDeposit,
        serviceFee,
        sellerPayout,
        insuranceFee,
        totalAmount,
        status: isRental ? 'confirmed' : 'in_progress',
        escrowStatus: 'held_in_escrow',
        paymentMethod:
          paymentMethod === 'card'
            ? `Credit Card (Visa ending ${cardNumber.slice(-4)})`
            : paymentMethod === 'escrow_wallet'
            ? 'BlueCode Escrow Wallet'
            : 'Direct ACH Bank Wire',
        pickupLocation: selectedListing.inventory.locationCity,
        notes,
      });

      setIsProcessing(false);
      setActiveModal('customer_orders');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/30">
              <Lock className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Secure Escrow Checkout
              </h2>
              <p className="text-xs text-slate-300">
                100% Protected · Funds held safely until booking fulfillment
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('detail')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Order Summary Snapshot */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase text-blue-700 font-bold">
                  {selectedListing.listingType}
                </span>
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  {selectedListing.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Provider: {selectedListing.seller.name} · {selectedListing.inventory.locationCity}
                </p>
              </div>
            </div>

            {/* Financial itemization */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-1.5 rounded bg-white border border-slate-200">
                <span className="block text-[9px] uppercase font-sans text-slate-400">Base Price</span>
                <span className="font-bold text-slate-900">${basePrice}</span>
              </div>
              <div className="p-1.5 rounded bg-white border border-slate-200">
                <span className="block text-[9px] uppercase font-sans text-slate-400">Provider Net (80%)</span>
                <span className="font-bold text-slate-800">${sellerPayout}</span>
              </div>
              <div className="p-1.5 rounded bg-blue-50 border border-blue-200">
                <span className="block text-[9px] uppercase font-sans text-blue-700">Platform Fee (20%)</span>
                <span className="font-bold text-blue-900">${serviceFee}</span>
              </div>
              <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200">
                <span className="block text-[9px] uppercase font-sans text-emerald-700">Deposit (Refundable)</span>
                <span className="font-bold text-emerald-900">${securityDeposit}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-900 pt-1">
              <span>Total Held in Escrow:</span>
              <span className="text-base font-mono text-blue-900">${totalAmount}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2">
              1. Customer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2">
              2. Select Payment Method
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-center font-medium transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('escrow_wallet')}
                className={`p-2.5 rounded-xl border text-center font-medium transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                  paymentMethod === 'escrow_wallet'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Escrow Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ach')}
                className={`p-2.5 rounded-xl border text-center font-medium transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                  paymentMethod === 'ach'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Building className="w-4 h-4 text-slate-600" />
                <span>ACH Bank Wire</span>
              </button>
            </div>

            {/* Simulated Card input */}
            {paymentMethod === 'card' && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Expires</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes for Host */}
          <div>
            <label className="block text-slate-600 font-semibold text-xs mb-1">
              Instructions or Pickup Notes for Host (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Schedule pickup at 10 AM, will bring government ID."
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Escrow terms explanation */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>BlueCode Marketplace & Concierge Care Policy</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">
                20% Platform Fee · 80% Provider Payout
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              <strong>Open Marketplace Notice:</strong> BlueCode does not sell its own inventory or services. All offerings are self-published by independent providers across 18 verticals. BlueCode retains a 20% facilitation fee to provide dedicated 24/7 Concierge Customer Care, actively bridge communication with your provider, and guarantee 100% escrow protection. If a provider fails to fulfill or is unresponsive, our team refunds 100% of your funds immediately.
            </p>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1 text-xs">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-slate-600 cursor-pointer">
              I agree to the peer-to-peer rental agreement, insurance terms, and agree that the refundable deposit will be returned upon equipment check-in.
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={!agreeTerms || isProcessing}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              agreeTerms && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-500 active:scale-98'
                : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Securing Escrow & Reserving Stock...'
                : `Pay $${totalAmount} via Escrow`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
