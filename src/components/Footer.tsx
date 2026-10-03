import React from 'react';
import { ShieldCheck, Lock, Package, ArrowRight } from 'lucide-react';
import { CATEGORY_VERTICALS } from '../data/categories';
import { useMarketplace } from '../context/MarketplaceContext';
import { VerticalId } from '../types';

export const Footer: React.FC = () => {
  const { selectVertical, setActiveModal } = useMarketplace();

  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-[#1E3E62] pt-14 pb-20 md:pb-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Brand & Guarantee Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#1E3E62]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-mono font-bold text-white text-lg">
                B/C
              </div>
              <span className="font-bold text-xl text-white font-mono tracking-tight">
                BlueCode Marketplace
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              One Marketplace. Everything You Need. BlueCode is an open platform where verified providers self-publish services and gear across 18 verticals. Website company does not sell services directly; we provide 24/7 Concierge Customer Care bridging and 100% Escrow Protection for a 20% platform fee, with 80% paid directly to providers.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                100% Escrow Protection
              </span>
              <span>·</span>
              <button
                onClick={() => setActiveModal('customer_care')}
                className="text-sky-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2"
              >
                24/7 Concierge Care
              </button>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <h4 className="font-mono uppercase font-bold text-white tracking-wider mb-3">
                Platform Core
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => selectVertical('rentals')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    P2P Equipment Rentals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectVertical('home-property')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Local Home Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectVertical('influencer-creator')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Influencer Campaign Hub
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectVertical('automobile')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Automobile & Drivers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('verticals_menu')}
                    className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-sky-400"
                  >
                    View All 18 Verticals →
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono uppercase font-bold text-white tracking-wider mb-3">
                For Sellers & Hosts
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveModal('create_listing')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    List Rental Inventory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('create_listing')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Provide a Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => selectVertical('influencer-creator')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Submit Creator Pitches
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Live Inventory API</span>
                </li>
                <li>
                  <span className="text-slate-400">Escrow Security Rules</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono uppercase font-bold text-white tracking-wider mb-3">
                Trust & Safety
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <span className="text-slate-300 font-medium">Refundable Deposit Escrow</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Photo ID Verification</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Real-Time Gear Check-In</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Verified Booking Reviews</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 18 Verticals Compact Directory */}
        <div>
          <h4 className="font-mono uppercase text-xs font-bold text-slate-400 tracking-wider mb-3">
            All 18 Marketplace Verticals:
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            {CATEGORY_VERTICALS.map((v, i) => (
              <button
                key={v.id}
                onClick={() => selectVertical(v.id)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="font-mono text-[10px] text-blue-400">{i + 1}.</span>
                <span>{v.name}</span>
                {i < CATEGORY_VERTICALS.length - 1 && (
                  <span className="text-slate-700 ml-2">/</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#1E3E62] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} BlueCode Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Navy & White Color Scheme</span>
            <span>·</span>
            <span>Real-Time Inventory Engine</span>
            <span>·</span>
            <span>Peer-to-Peer Escrow Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
