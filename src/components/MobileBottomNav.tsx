import React from 'react';
import {
  Compass,
  Layers,
  PlusCircle,
  Sparkles,
  CalendarCheck,
  UserCheck,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const MobileBottomNav: React.FC = () => {
  const {
    filter,
    selectVertical,
    setActiveModal,
    mode,
    setMode,
    bookings,
  } = useMarketplace();

  const activeRentalsCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'active_rental'
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B192C] border-t border-[#1E3E62] px-2 py-2 flex items-center justify-around shadow-lg">
      {/* Explore */}
      <button
        onClick={() => {
          selectVertical('all');
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
          filter.verticalId === 'all' ? 'text-sky-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Explore</span>
      </button>

      {/* 18 Verticals */}
      <button
        onClick={() => setActiveModal('verticals_menu')}
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <Layers className="w-5 h-5" />
        <span>18 Verticals</span>
      </button>

      {/* Post / List (Prominent) */}
      <button
        onClick={() => setActiveModal('create_listing')}
        className="flex flex-col items-center -mt-4 cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-[#0B192C] active:scale-95 transition-transform">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-slate-200 mt-0.5">List</span>
      </button>

      {/* Creator Hub */}
      <button
        onClick={() => selectVertical('influencer-creator')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
          filter.verticalId === 'influencer-creator' ? 'text-amber-300 font-bold' : 'text-slate-400'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span>Creators</span>
      </button>

      {/* Orders or Seller Switcher */}
      <button
        onClick={() => setActiveModal('customer_orders')}
        className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <CalendarCheck className="w-5 h-5" />
        <span>Orders</span>
        {activeRentalsCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
            {activeRentalsCount}
          </span>
        )}
      </button>
    </nav>
  );
};
