import React, { useState } from 'react';
import {
  X,
  CalendarCheck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Headphones,
  AlertOctagon,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const CustomerBookingsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    bookings,
    cancelBooking,
    returnRentalItem,
    showToast,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'all' | 'rentals' | 'services'>('all');

  if (activeModal !== 'customer_orders') return null;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'rentals') return b.listingType === 'rental';
    if (activeTab === 'services') return b.listingType !== 'rental';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/30">
              <CalendarCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                My Bookings & Active Gear Rentals
              </h2>
              <p className="text-xs text-slate-300">
                Escrow protected transactions, return check-ins, and digital receipts
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

        {/* Tab Filter */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'rentals'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            P2P Gear Rentals ({bookings.filter((b) => b.listingType === 'rental').length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Services & Trades ({bookings.filter((b) => b.listingType !== 'rental').length})
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No orders found in this category yet.
            </div>
          ) : (
            filteredBookings.map((order) => {
              const isRental = order.listingType === 'rental';
              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={order.listingImage}
                      alt={order.listingTitle}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-900">
                          {order.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            order.status === 'disputed'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                              : order.status === 'completed'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {order.status === 'disputed'
                            ? `⚠️ In Dispute (${order.disputeDetails?.caseId || 'Escrow Frozen'})`
                            : order.status === 'completed'
                            ? 'Completed & Deposit Returned'
                            : 'Active Booking'}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400">Booked: {order.bookingDate}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm">
                        {order.listingTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-slate-500 text-[11px]">
                        <span>Host: {order.sellerName}</span>
                        {order.pickupLocation && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {order.pickupLocation}
                            </span>
                          </>
                        )}
                        {order.durationDays && (
                          <>
                            <span>·</span>
                            <span>{order.durationDays} days duration</span>
                          </>
                        )}
                      </div>

                      {/* Escrow badge & Fee Info */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2 py-1 rounded text-[11px] font-medium border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {order.escrowStatus === 'held_in_escrow'
                              ? `Escrow Active: $${order.securityDeposit} deposit held safely until return`
                              : 'Escrow Released: Deposit refunded to card'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          Platform Fee (20%): ${order.serviceFee || Math.round(order.basePrice * 0.2)} · Provider Payout: ${order.sellerPayout || Math.round(order.basePrice * 0.8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financials & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 self-stretch md:self-auto border-t md:border-t-0 pt-3 md:pt-0 font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-sans">Total Paid</span>
                      <div className="text-lg font-extrabold text-slate-900">
                        ${order.totalAmount}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        via {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-sans">
                      {order.status === 'disputed' ? (
                        <button
                          onClick={() => setActiveModal('customer_care')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer animate-pulse"
                          title="View active dispute case and escrow freeze details"
                        >
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                          <span>View Dispute Case</span>
                        </button>
                      ) : (
                        <>
                          {/* 24/7 Concierge Bridging CTA */}
                          <button
                            onClick={() => setActiveModal('customer_care')}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Connect with BlueCode Concierge to bridge with this provider"
                          >
                            <Headphones className="w-3.5 h-3.5 text-blue-600" />
                            <span>Concierge Care</span>
                          </button>

                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => setActiveModal('customer_care')}
                              className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Contest service delivery and escalate to Dispute"
                            >
                              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                              <span>Dispute</span>
                            </button>
                          )}
                        </>
                      )}

                      {isRental && order.status !== 'completed' && order.status !== 'disputed' && (
                        <button
                          onClick={() => returnRentalItem(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Gear Check-In</span>
                        </button>
                      )}

                      {order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'disputed' && (
                        <button
                          onClick={() => cancelBooking(order.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
