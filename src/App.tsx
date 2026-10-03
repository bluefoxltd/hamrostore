import React from 'react';
import {
  MarketplaceProvider,
  useMarketplace,
} from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { RentalBookingModal } from './components/RentalBookingModal';
import { CreateListingModal } from './components/CreateListingModal';
import { CustomerBookingsModal } from './components/CustomerBookingsModal';
import { VerticalsMegaMenu } from './components/VerticalsMegaMenu';
import { ReviewModal } from './components/ReviewModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { ProviderProfileModal } from './components/ProviderProfileModal';
import { CreatorCampaignHub } from './components/CreatorCampaignHub';
import { SellerDashboard } from './components/SellerDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { CustomerCareModal } from './components/CustomerCareModal';
import { CATEGORY_VERTICALS } from './data/categories';
import { CategoryIcon } from './components/CategoryIcon';
import {
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { ListingType } from './types';

const MarketplaceContent: React.FC = () => {
  const {
    mode,
    listings,
    filter,
    setFilter,
    selectVertical,
    selectSubcategory,
    resetFilters,
    toast,
    setActiveModal,
  } = useMarketplace();

  const currentVertical = CATEGORY_VERTICALS.find((v) => v.id === filter.verticalId);

  // Filter listings based on active filter state
  const filteredListings = listings.filter((item) => {
    // Vertical filter
    if (filter.verticalId !== 'all' && item.verticalId !== filter.verticalId) {
      return false;
    }

    // Subcategory filter
    if (filter.subcategory && item.subcategory.toLowerCase() !== filter.subcategory.toLowerCase()) {
      return false;
    }

    // Listing type filter
    if (filter.listingType !== 'all' && item.listingType !== filter.listingType) {
      return false;
    }

    // Search query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSub = item.subcategory.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchSeller = item.seller.name.toLowerCase().includes(q);
      const matchCity = item.inventory.locationCity.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub && !matchTags && !matchSeller && !matchCity) {
        return false;
      }
    }

    // Near me / Location query
    if (filter.nearMeOnly) {
      const city = item.inventory.locationCity.toLowerCase();
      if (!city.includes('austin')) {
        return false;
      }
    } else if (filter.locationQuery.trim()) {
      const lq = filter.locationQuery.toLowerCase();
      if (!item.inventory.locationCity.toLowerCase().includes(lq)) {
        return false;
      }
    }

    // Verified only
    if (filter.verifiedOnly && !item.seller.verified) {
      return false;
    }

    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (filter.sortBy === 'price-low') return a.price - b.price;
    if (filter.sortBy === 'price-high') return b.price - a.price;
    if (filter.sortBy === 'rating') return b.seller.rating - a.seller.rating;
    if (filter.sortBy === 'inventory') return b.inventory.availableStock - a.inventory.availableStock;
    // 'featured'
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl bg-[#0B192C] text-white border border-[#1E3E62] flex items-center gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 text-sky-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-slate-200 leading-snug">{toast.message}</p>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-1">
        {mode === 'seller' ? (
          /* Provider & Seller Hub View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SellerDashboard />
          </div>
        ) : (
          /* Customer Marketplace View */
          <>
            {/* Navy Hero Banner with Intent Bar & 18 Verticals */}
            <HeroBanner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Creator Hub Special Section (Vertical 5) */}
              {(filter.verticalId === 'all' || filter.verticalId === 'influencer-creator') && (
                <CreatorCampaignHub />
              )}

              {/* Active Vertical Header & Subcategories Bar */}
              {currentVertical && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0">
                        <CategoryIcon name={currentVertical.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono uppercase font-bold text-blue-600">
                            Vertical
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-400">
                            {currentVertical.highlightKicker}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          {currentVertical.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => selectVertical('all')}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        ← Back to All Verticals
                      </button>
                      <button
                        onClick={() => setActiveModal('verticals_menu')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 transition-colors cursor-pointer"
                      >
                        All 18 Verticals
                      </button>
                    </div>
                  </div>

                  {/* Subcategories Horizontal Bar */}
                  <div className="pt-3">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                      Filter by Specific Subcategory:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <button
                        onClick={() => selectSubcategory(undefined)}
                        className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          !filter.subcategory
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All in {currentVertical.shortName}
                      </button>
                      {currentVertical.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => selectSubcategory(sub)}
                          className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                            filter.subcategory === sub
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Filter and Control Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 mb-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                {/* Left: Transaction Type Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Type:</span>
                  {[
                    { id: 'all', label: 'All Catalog' },
                    { id: 'rental', label: '📦 P2P Gear Rentals' },
                    { id: 'service', label: '🛠️ On-Demand Services' },
                    { id: 'freelancer', label: '👨‍💼 Vetted Pros' },
                    { id: 'product', label: '🛍️ Products' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setFilter((p) => ({ ...p, listingType: tab.id as any }))
                      }
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        filter.listingType === tab.id
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Right: Location Toggle & Sorting */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Verified Only Checkbox */}
                  <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filter.verifiedOnly}
                      onChange={(e) =>
                        setFilter((p) => ({ ...p, verifiedOnly: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Verified Only</span>
                  </label>

                  <span className="text-slate-300">|</span>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-mono">Sort:</span>
                    <select
                      value={filter.sortBy}
                      onChange={(e) =>
                        setFilter((p) => ({ ...p, sortBy: e.target.value as any }))
                      }
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
                    >
                      <option value="featured">Featured First</option>
                      <option value="inventory">Available Stock (High)</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>

                  {(filter.searchQuery ||
                    filter.subcategory ||
                    filter.nearMeOnly ||
                    filter.verticalId !== 'all' ||
                    filter.listingType !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filter Indicators */}
              {(filter.searchQuery || filter.nearMeOnly || filter.subcategory) && (
                <div className="flex items-center gap-2 mb-4 text-xs text-slate-600">
                  <span className="text-slate-400">Filtering by:</span>
                  {filter.searchQuery && (
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono">
                      Query: "{filter.searchQuery}"
                    </span>
                  )}
                  {filter.nearMeOnly && (
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono">
                      Location: Austin, TX (Near Me)
                    </span>
                  )}
                  {filter.subcategory && (
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono">
                      Subcategory: {filter.subcategory}
                    </span>
                  )}
                </div>
              )}

              {/* Catalog Results Grid */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-slate-500">
                  Showing {sortedListings.length} {sortedListings.length === 1 ? 'Listing' : 'Listings'}
                </span>
                <span className="text-xs text-slate-400">
                  Real-time inventory updated live
                </span>
              </div>

              {sortedListings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No listings match your search
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Try adjusting your filters, location, or search query.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-500 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sortedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals */}
      <ListingDetailModal />
      <RentalBookingModal />
      <CreateListingModal />
      <CustomerBookingsModal />
      <CustomerCareModal />
      <VerticalsMegaMenu />
      <ReviewModal />
      <PriceAlertsModal />
      <ProviderProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
