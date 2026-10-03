import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Calendar,
  CheckCircle2,
  Plus,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Eye,
  Trash2,
  Bell,
  TrendingDown,
  Edit3,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const SellerDashboard: React.FC = () => {
  const {
    listings,
    bookings,
    updateListingInventory,
    updateListingPrice,
    deleteListing,
    returnRentalItem,
    setActiveModal,
    setSelectedListing,
    priceAlerts,
  } = useMarketplace();

  const [editingPriceListingId, setEditingPriceListingId] = useState<string | null>(null);
  const [newRateValue, setNewRateValue] = useState<number>(0);

  // Metrics
  const activeRentals = bookings.filter((b) => b.status === 'confirmed' || b.status === 'active_rental');
  const totalRevenue = bookings.reduce((sum, b) => sum + b.basePrice, 0) + 4800; // baseline mock
  const totalDepositsInEscrow = bookings
    .filter((b) => b.escrowStatus === 'held_in_escrow')
    .reduce((sum, b) => sum + b.securityDeposit, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Hub Title */}
      <div className="bg-[#0B192C] text-white rounded-2xl p-6 border border-[#1E3E62] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-sky-300 border border-blue-400/30">
              Open Marketplace · Self-Publish Across 18 Verticals
            </span>
            <span className="text-xs text-slate-400">Live Peer-to-Peer Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Provider Operations & Inventory Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Anyone can register their services and gear. BlueCode does not sell company-owned inventory. You keep 80% net payout on every customer booking, while BlueCode's 20% platform fee provides 24/7 Concierge Customer Care bridging.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('create_listing')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register New Service / Listing</span>
        </button>
      </div>

      {/* Platform Open Marketplace & 20% Fee Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">
              Transparent 80% / 20% Marketplace Revenue Split
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              As an open marketplace, BlueCode welcomes independent specialists, rental shops, and freelancers. The 20% platform facilitation fee on each customer order covers 24/7 live Concierge Customer Care (bridging contact with customers), escrow protection, fraud prevention, and customer dispute resolution.
            </p>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 flex-shrink-0 font-mono">
          <span className="text-[10px] text-slate-500 uppercase font-sans">Your Net Payout</span>
          <span className="font-extrabold text-blue-900 text-sm">80% of Booking Total</span>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">+18% this month</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Deposits in Escrow</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 font-mono">
            ${totalDepositsInEscrow.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Fully protected until return</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Active Rentals / Orders</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {activeRentals.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Gear currently out with clients</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Catalog Items</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {listings.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 18 marketplace verticals</p>
        </div>
      </div>

      {/* Real-time Inventory Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Real-Time Inventory Control Center
            </h2>
            <p className="text-xs text-slate-500">
              Live updates propagate instantly to customer search results and prevent double-booking
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
            Live Synchronization Active
          </span>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Item / Service</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Rate</th>
                <th className="py-3 px-3 text-center">Available Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((item) => {
                const isRental = item.listingType === 'rental';
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {item.inventory.sku || item.id} · {item.inventory.locationCity}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-slate-600">
                      <span>{item.subcategory}</span>
                    </td>

                    {/* Rate & Price Drop Controls */}
                    <td className="py-3 px-3">
                      {editingPriceListingId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={5}
                            value={newRateValue}
                            onChange={(e) => setNewRateValue(Number(e.target.value))}
                            className="w-16 p-1 bg-white border border-blue-500 rounded text-slate-900 font-mono text-xs"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateListingPrice(item.id, newRateValue);
                              setEditingPriceListingId(null);
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPriceListingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              ${item.price}
                            </span>
                            <span className="text-slate-500 text-xs">{item.priceUnit}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPriceListingId(item.id);
                                setNewRateValue(item.price);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                              title="Edit rate"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Quick Discount Action that triggers price drop alerts */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateListingPrice(item.id, Math.max(10, Math.round(item.price * 0.85)))
                              }
                              className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 transition-colors flex items-center gap-0.5 cursor-pointer font-sans"
                              title="Lower price by 15% and notify all customers tracking this listing"
                            >
                              <TrendingDown className="w-3 h-3 text-blue-600" />
                              <span>Discount -15% & Notify</span>
                            </button>
                          </div>

                          {/* Active Alert Badge */}
                          {priceAlerts.some((a) => a.listingId === item.id) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 font-sans">
                              <Bell className="w-2.5 h-2.5" />
                              <span>
                                {priceAlerts.filter((a) => a.listingId === item.id).length} Price Alert Active
                              </span>
                            </span>
                          )}

                          {item.securityDeposit && (
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                              +${item.securityDeposit} dep.
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Live Stock Stepper */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateListingInventory(
                              item.id,
                              Math.max(0, item.inventory.availableStock - 1)
                            )
                          }
                          className="w-6 h-6 rounded bg-white text-slate-800 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer shadow-xs"
                          title="Decrement available inventory"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold w-12 text-center text-slate-900 text-xs">
                          {item.inventory.availableStock} / {item.inventory.totalStock}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateListingInventory(
                              item.id,
                              Math.min(item.inventory.totalStock, item.inventory.availableStock + 1)
                            )
                          }
                          className="w-6 h-6 rounded bg-white text-slate-800 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer shadow-xs"
                          title="Increment available inventory"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.inventory.availableStock > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.inventory.availableStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{item.inventory.availableStock > 0 ? 'Active & Ready' : 'Depleted'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedListing(item);
                            setActiveModal('detail');
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View listing detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteListing(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Orders & Return Verification Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Active Rentals & Escrow Check-Ins
            </h2>
            <p className="text-xs text-slate-500">
              When gear is returned safely, click "Release Escrow Deposit" to refund the customer.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Escrow Managed
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No active orders at this moment.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={booking.listingImage}
                    alt={booking.listingTitle}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{booking.id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium">Customer: {booking.buyerName}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                      {booking.listingTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Period: {booking.startDate} to {booking.endDate} ({booking.durationDays || 1} days) · {booking.buyerPhone}
                    </p>
                  </div>
                </div>

                {/* Financials & Return Action */}
                <div className="flex items-center gap-4 self-start md:self-auto font-mono">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-sans uppercase">Deposit Held</span>
                    <span className="font-bold text-emerald-700 text-xs">
                      ${booking.securityDeposit} in Escrow
                    </span>
                  </div>

                  {booking.status === 'completed' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Returned & Closed
                    </span>
                  ) : (
                    <button
                      onClick={() => returnRentalItem(booking.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Check-In & Refund Deposit</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
