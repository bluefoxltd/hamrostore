import React, { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { CATEGORY_VERTICALS } from '../data/categories';
import { useMarketplace } from '../context/MarketplaceContext';
import { CategoryIcon } from './CategoryIcon';

export const VerticalsMegaMenu: React.FC = () => {
  const { activeModal, setActiveModal, selectVertical, selectSubcategory } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');

  if (activeModal !== 'verticals_menu') return null;

  const filteredVerticals = CATEGORY_VERTICALS.filter((v) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchName = v.name.toLowerCase().includes(term);
    const matchSub = v.subcategories.some((s) => s.toLowerCase().includes(term));
    const matchDesc = v.description.toLowerCase().includes(term);
    return matchName || matchSub || matchDesc;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40">
              <span className="font-mono text-sm font-bold text-sky-400">18</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                All 18 Marketplace Verticals
              </h2>
              <p className="text-xs text-slate-300">
                Organized into dedicated verticals for peer-to-peer rentals, local services, and vetted pros
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

        {/* Search bar inside directory */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input
            type="text"
            placeholder="Type to filter categories (e.g. 'plumbing', 'cameras', 'tiktok', 'electrical', 'towing')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Verticals Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVerticals.map((vertical, idx) => (
            <div
              key={vertical.id}
              className="rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all p-4 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <CategoryIcon name={vertical.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-blue-600 uppercase tracking-wider block">
                        Vertical #{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {vertical.name}
                      </h3>
                    </div>
                  </div>
                  {vertical.featuredPill && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {vertical.featuredPill}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {vertical.description}
                </p>

                {/* Subcategories list */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Popular Services & Gear:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {vertical.subcategories.slice(0, 6).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          selectVertical(vertical.id);
                          selectSubcategory(sub);
                          setActiveModal(null);
                        }}
                        className="text-[11px] text-slate-600 hover:text-blue-600 hover:underline transition-colors py-0.5 cursor-pointer text-left"
                      >
                        {sub}
                        <span className="text-slate-300 ml-1.5">·</span>
                      </button>
                    ))}
                    {vertical.subcategories.length > 6 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{vertical.subcategories.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action bottom button */}
              <button
                onClick={() => {
                  selectVertical(vertical.id);
                  selectSubcategory(undefined);
                  setActiveModal(null);
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold flex items-center justify-between transition-colors border border-slate-100 cursor-pointer"
              >
                <span>Browse {vertical.shortName}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredVerticals.length} of {CATEGORY_VERTICALS.length} marketplace verticals</span>
          <button
            onClick={() => {
              selectVertical('all');
              setActiveModal(null);
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            View All in Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
