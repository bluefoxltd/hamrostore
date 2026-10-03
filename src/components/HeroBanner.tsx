import React from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  Package,
  Sparkles,
  Wrench,
  Camera,
  Users,
  ArrowRight,
  Bell,
  TrendingDown,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORY_VERTICALS } from '../data/categories';
import { VerticalId } from '../types';
import { CategoryIcon } from './CategoryIcon';

export const HeroBanner: React.FC = () => {
  const { filter, setFilter, selectVertical, toggleNearMe, setActiveModal, priceAlerts } = useMarketplace();

  const handleQuickIntent = (
    verticalId: VerticalId,
    query: string,
    subcategory?: string,
    nearMe: boolean = false
  ) => {
    selectVertical(verticalId);
    setFilter((prev) => ({
      ...prev,
      searchQuery: query,
      subcategory: subcategory,
      nearMeOnly: nearMe,
      locationQuery: nearMe ? 'Austin, TX' : prev.locationQuery,
    }));
  };

  return (
    <section className="bg-gradient-to-b from-[#0B192C] via-[#0D2038] to-[#122A48] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#1E3E62] relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main headline and value proposition */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>BlueCode Platform · 18 Verticals · Real-Time Inventory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            One Marketplace.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200">
              Everything You Need.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Rent high-end cinema gear & tools with live inventory tracking, book trusted local tradesmen, hire vetted professionals, or run influencer campaigns.
          </p>
        </div>

        {/* Hero Search Box */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-xl p-2 flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
            {/* Search input */}
            <div className="flex-1 flex items-center w-full px-3 py-2 text-slate-900">
              <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="What service, gear rental, or professional do you need?"
                value={filter.searchQuery}
                onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full text-sm sm:text-base placeholder:text-slate-400 text-slate-900 focus:outline-none bg-transparent"
              />
            </div>

            {/* Near Me / City button */}
            <div className="flex items-center gap-2 w-full sm:w-auto px-2">
              <button
                type="button"
                onClick={toggleNearMe}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter.nearMeOnly
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Filter items and providers near your current location"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{filter.nearMeOnly ? 'Near Me (Austin)' : 'Near Me'}</span>
              </button>

              <button
                type="button"
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Intent Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-300">
            <span className="text-slate-400">Popular right now:</span>
            <button
              onClick={() => handleQuickIntent('home-property', 'plumber', 'Plumbing', true)}
              className="hover:text-white underline decoration-slate-500 underline-offset-4 cursor-pointer"
            >
              "Need a plumber near me"
            </button>
            <span className="text-slate-500">·</span>
            <button
              onClick={() => handleQuickIntent('rentals', 'Sony FX3', 'Cameras')}
              className="hover:text-white underline decoration-slate-500 underline-offset-4 cursor-pointer"
            >
              Sony FX3 Cinema Kit
            </button>
            <span className="text-slate-500">·</span>
            <button
              onClick={() => handleQuickIntent('influencer-creator', 'TikTok', 'TikTok creators')}
              className="hover:text-white underline decoration-slate-500 underline-offset-4 cursor-pointer"
            >
              TikTok Creator Campaigns
            </button>
            <span className="text-slate-500">·</span>
            <button
              onClick={() => handleQuickIntent('professionals-freelancers', 'CPA', 'Accountants')}
              className="hover:text-white underline decoration-slate-500 underline-offset-4 cursor-pointer"
            >
              Fractional CFO
            </button>
            <span className="text-slate-500">·</span>
            <button
              onClick={() => handleQuickIntent('automobile', 'detailing', 'Detailing')}
              className="hover:text-white underline decoration-slate-500 underline-offset-4 cursor-pointer"
            >
              Mobile Detailing
            </button>
            <span className="text-slate-500">·</span>
            <button
              onClick={() => setActiveModal('price_alerts')}
              className="text-amber-300 hover:text-amber-200 font-semibold inline-flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/30"
            >
              <Bell className="w-3 h-3" />
              <span>Price Drop Tracker ({priceAlerts.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 pb-6 border-t border-[#1E3E62]/80">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0B192C]/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-md bg-blue-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Live Inventory</p>
              <p className="text-[11px] text-slate-400">Real-time P2P gear availability</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0B192C]/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Escrow Protection</p>
              <p className="text-[11px] text-slate-400">Funds & deposits held securely</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0B192C]/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Creator Bids Hub</p>
              <p className="text-[11px] text-slate-400">Briefs & verified TikTok/IG pitches</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0B192C]/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">18 Verticals</p>
              <p className="text-[11px] text-slate-400">Organized structure, zero clutter</p>
            </div>
          </div>
        </div>

        {/* Horizontal Category Switcher Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Browse Marketplace Verticals
            </span>
            <button
              onClick={() => setActiveModal('verticals_menu')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All 18 with Subcategories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => selectVertical('all')}
              className={`px-3 py-2 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                filter.verticalId === 'all'
                  ? 'bg-white text-[#0B192C] font-bold shadow-md'
                  : 'bg-[#1E3E62]/80 text-slate-200 hover:bg-[#1E3E62] hover:text-white'
              }`}
            >
              <span>All 18 Verticals</span>
            </button>

            {CATEGORY_VERTICALS.map((v) => {
              const isActive = filter.verticalId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => selectVertical(v.id)}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md ring-2 ring-sky-300/30'
                      : 'bg-[#1E3E62]/80 text-slate-200 hover:bg-[#1E3E62] hover:text-white'
                  }`}
                >
                  <CategoryIcon name={v.icon} className="w-3.5 h-3.5" />
                  <span>{v.shortName}</span>
                  {v.featuredPill && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
