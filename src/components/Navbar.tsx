import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Layers,
  Package,
  PlusCircle,
  CalendarCheck,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
  Bell,
  TrendingDown,
  Headphones,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORY_VERTICALS } from '../data/categories';
import { VerticalId } from '../types';

export const Navbar: React.FC = () => {
  const {
    mode,
    setMode,
    filter,
    setFilter,
    selectVertical,
    toggleNearMe,
    setActiveModal,
    bookings,
    notifications,
    priceAlerts,
  } = useMarketplace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const activeRentalsCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'active_rental'
  ).length;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C] text-white border-b border-[#1E3E62] shadow-md">
      {/* Top micro banner */}
      <div className="bg-[#070e1b] px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              100% Escrow Protected Peer-to-Peer Transactions
            </span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-sky-300">
              Open Marketplace (Providers Self-Publish · 20% Fee · 80% Payout)
            </span>
            <span className="hidden lg:inline text-slate-500">·</span>
            <span className="hidden lg:inline text-slate-300">
              24/7 BlueCode Care Bridging Every Order
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setActiveModal('customer_care')}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
            >
              <Headphones className="w-3 h-3 text-sky-400" />
              <span>24/7 Concierge Care</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => toggleNearMe()}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                filter.nearMeOnly
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>{filter.nearMeOnly ? 'Near Me: Austin, TX (Active)' : 'Detect Location'}</span>
            </button>
            <span className="text-slate-600">|</span>
            {/* Quick role toggle */}
            <button
              onClick={() => setMode(mode === 'customer' ? 'seller' : 'customer')}
              className="flex items-center gap-1 text-slate-200 hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3 h-3 text-blue-400" />
              <span>Switch to {mode === 'customer' ? 'Seller & Provider Hub' : 'Customer Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 md:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => {
                selectVertical('all');
                setFilter((p) => ({ ...p, searchQuery: '', subcategory: undefined }));
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center shadow-inner font-mono font-black text-xl text-white tracking-tighter">
                B<span className="text-sky-200">/</span>C
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg md:text-xl tracking-tight text-white font-mono">
                    BlueCode
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/60">
                    Marketplace
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                  One Marketplace. Everything You Need.
                </span>
              </div>
            </button>
          </div>

          {/* Center search & vertical selector */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center bg-white text-slate-900 rounded-lg border border-slate-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border-r border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>
                  {filter.verticalId === 'all'
                    ? 'All 18 Verticals'
                    : CATEGORY_VERTICALS.find((v) => v.id === filter.verticalId)?.shortName || 'Verticals'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-64 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <button
                      onClick={() => {
                        selectVertical('all');
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 font-medium hover:bg-slate-100 text-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <span>All 18 Verticals</span>
                      {filter.verticalId === 'all' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    {CATEGORY_VERTICALS.map((vertical) => (
                      <button
                        key={vertical.id}
                        onClick={() => {
                          selectVertical(vertical.id);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 cursor-pointer ${
                          filter.verticalId === vertical.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{vertical.name}</span>
                        {filter.verticalId === vertical.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Search gear rentals, plumbers near me, TikTok creators, developers..."
                value={filter.searchQuery}
                onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              {filter.searchQuery && (
                <button
                  onClick={() => setFilter((p) => ({ ...p, searchQuery: '' }))}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Verticals Directory Modal Opener */}
            <button
              onClick={() => setActiveModal('verticals_menu')}
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#1E3E62] transition-colors cursor-pointer"
              title="Explore all 18 marketplace verticals"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>18 Verticals</span>
            </button>

            {/* Creator Hub Shortcut */}
            <button
              onClick={() => {
                selectVertical('influencer-creator');
              }}
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter.verticalId === 'influencer-creator'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-200 hover:text-white hover:bg-[#1E3E62]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Creator Hub</span>
            </button>

            {/* Peer to peer rentals shortcut */}
            <button
              onClick={() => {
                selectVertical('rentals');
              }}
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter.verticalId === 'rentals'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-200 hover:text-white hover:bg-[#1E3E62]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-sky-400" />
              <span>P2P Rentals</span>
            </button>

            {/* Price Drop Alerts & Notifications */}
            <button
              onClick={() => setActiveModal('price_alerts')}
              className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-[#1E3E62] transition-colors cursor-pointer"
              title="Price Drop Alerts & Notifications"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadNotificationsCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-bold text-[10px] flex items-center justify-center ring-2 ring-[#0B192C] animate-pulse">
                  {unreadNotificationsCount}
                </span>
              ) : priceAlerts.length > 0 ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 ring-1 ring-[#0B192C]" />
              ) : null}
            </button>

            {/* 24/7 Customer Care Concierge */}
            <button
              onClick={() => setActiveModal('customer_care')}
              className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-[#1E3E62] transition-colors cursor-pointer"
              title="BlueCode 24/7 Concierge Care (Connect with Providers)"
            >
              <Headphones className="w-5 h-5 text-sky-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B192C]" />
            </button>

            {/* My Bookings / Orders */}
            <button
              onClick={() => setActiveModal('customer_orders')}
              className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-[#1E3E62] transition-colors cursor-pointer"
              title="My Orders & Active Rentals"
            >
              <CalendarCheck className="w-5 h-5 text-slate-300" />
              {activeRentalsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-[#0B192C]">
                  {activeRentalsCount}
                </span>
              )}
            </button>

            {/* Primary Action Button (Mode-dependent) */}
            {mode === 'customer' ? (
              <button
                onClick={() => setActiveModal('create_listing')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">List Gear or Service</span>
                <span className="sm:hidden">List</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveModal('create_listing')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Inventory / Service</span>
              </button>
            )}

            {/* Mode Switcher Pill */}
            <div className="hidden xl:flex items-center bg-[#1E3E62] p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setMode('customer')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'customer'
                    ? 'bg-white text-[#0B192C] font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setMode('seller')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'seller'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Provider Hub
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <div className="flex items-center bg-white text-slate-900 rounded-lg px-3 py-1.5 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search 18 verticals, gear, plumbers..."
              value={filter.searchQuery}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter((p) => ({ ...p, searchQuery: '' }))}
                className="p-0.5 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070e1b] border-t border-[#1E3E62] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between p-2 rounded bg-[#0B192C]">
            <span className="text-xs text-slate-300">Active View:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMode('customer');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded ${
                  mode === 'customer' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  setMode('seller');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded ${
                  mode === 'seller' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Seller Hub
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <button
              onClick={() => {
                setActiveModal('verticals_menu');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded bg-[#0B192C] text-left text-slate-200"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>All 18 Verticals</span>
            </button>
            <button
              onClick={() => {
                selectVertical('rentals');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded bg-[#0B192C] text-left text-slate-200"
            >
              <Package className="w-4 h-4 text-sky-400" />
              <span>P2P Rentals</span>
            </button>
            <button
              onClick={() => {
                selectVertical('influencer-creator');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded bg-[#0B192C] text-left text-slate-200"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Creator Hub</span>
            </button>
            <button
              onClick={() => {
                setActiveModal('customer_orders');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded bg-[#0B192C] text-left text-slate-200"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>My Orders ({activeRentalsCount})</span>
            </button>
            <button
              onClick={() => {
                setActiveModal('customer_care');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded bg-blue-900/60 border border-blue-500/40 text-left text-sky-200 col-span-2"
            >
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>24/7 BlueCode Care & Provider Concierge</span>
            </button>
            <button
              onClick={() => {
                setActiveModal('price_alerts');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded bg-[#0B192C] text-left text-slate-200 col-span-2"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Price Drop Alerts ({priceAlerts.length}) {unreadNotificationsCount > 0 && `· ${unreadNotificationsCount} New!`}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
