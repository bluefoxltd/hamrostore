import React from 'react';
import { Star, ShieldCheck, MapPin, Package, Check, Zap, Bell, TrendingDown } from 'lucide-react';
import { Listing } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORY_VERTICALS } from '../data/categories';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const {
    setSelectedListing,
    setActiveModal,
    hasPriceAlert,
    setPriceAlert,
    removePriceAlert,
    getPriceAlert,
    openProviderProfile,
  } = useMarketplace();

  const vertical = CATEGORY_VERTICALS.find((v) => v.id === listing.verticalId);

  const isRental = listing.listingType === 'rental';
  const hasInventory = listing.inventory && listing.inventory.totalStock > 0;
  const inStock = listing.inventory.availableStock > 0;
  const alertActive = hasPriceAlert(listing.id);
  const alert = getPriceAlert(listing.id);

  const handleOpenDetail = () => {
    setSelectedListing(listing);
    setActiveModal('detail');
  };

  const handleOpenSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    openProviderProfile(listing.seller);
  };

  const handleToggleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alertActive && alert) {
      removePriceAlert(alert.id);
    } else {
      // Set alert 10% below current price
      const target = Math.max(5, Math.round(listing.price * 0.9));
      setPriceAlert(listing.id, target);
    }
  };

  return (
    <article
      onClick={handleOpenDetail}
      className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Top overlay indicator: Real-time stock or instant booking */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {isRental ? (
              <div className="bg-[#0B192C]/90 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    inStock ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
                <span>
                  {inStock
                    ? `${listing.inventory.availableStock} of ${listing.inventory.totalStock} Available`
                    : 'Out of Stock'}
                </span>
              </div>
            ) : (
              <div className="bg-[#0B192C]/90 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                <span>Instant Service</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Quick Price Drop Alert Button */}
              <button
                type="button"
                onClick={handleToggleAlert}
                className={`p-1.5 rounded-lg shadow-sm transition-all cursor-pointer ${
                  alertActive
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300'
                    : 'bg-[#0B192C]/80 hover:bg-[#0B192C] text-slate-300 hover:text-white'
                }`}
                title={
                  alertActive
                    ? `Price drop alert active (Target: $${alert?.targetPrice}${listing.priceUnit}). Click to remove.`
                    : `Set Price Drop Alert for ${listing.title}`
                }
              >
                <Bell className={`w-3.5 h-3.5 ${alertActive ? 'fill-slate-900' : ''}`} />
              </button>

              {listing.seller.verified && (
                <div className="bg-white/95 text-blue-900 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Metadata line: Category · Subcategory · Location (NO PILLS) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 truncate">
            <span className="font-semibold text-blue-800">
              {vertical?.shortName || 'Marketplace'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{listing.subcategory}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {listing.inventory.locationCity}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
            {listing.title}
          </h3>

          {/* Key specs highlight */}
          {listing.specs && (
            <div className="space-y-0.5 mb-3 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
              {Object.entries(listing.specs).slice(0, 2).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Seller row */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <div
              onClick={handleOpenSeller}
              className="flex items-center gap-2 min-w-0 cursor-pointer group/seller hover:text-blue-600 transition-colors"
              title="Click to view full verified provider profile"
            >
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-5 h-5 rounded-full object-cover flex-shrink-0 group-hover/seller:ring-1 group-hover/seller:ring-blue-500"
              />
              <span className="text-slate-700 group-hover/seller:text-blue-700 truncate text-[11px] font-medium underline-offset-2 hover:underline">
                {listing.seller.name}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 text-xs">{listing.seller.rating}</span>
              <span className="text-slate-400 text-[10px]">({listing.seller.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & CTA */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-[#0B192C] font-mono">
              ${listing.price}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {listing.priceUnit}
            </span>
          </div>

          {listing.securityDeposit && (
            <p className="text-[10px] text-slate-400">
              +${listing.securityDeposit} refundable deposit
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDetail();
          }}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          {isRental ? 'Rent Gear' : 'Book Service'}
        </button>
      </div>
    </article>
  );
};
