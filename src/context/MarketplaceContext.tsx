import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  CreatorCampaign,
  BookingOrder,
  Review,
  VerticalId,
  ListingType,
  ViewFilter,
  CreatorProposal,
  PriceDropAlert,
  NotificationItem,
  SellerProfile,
} from '../types';
import { INITIAL_LISTINGS, INITIAL_CREATOR_CAMPAIGNS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from '../data/mockData';

export type UserRoleMode = 'customer' | 'seller';

interface MarketplaceContextType {
  mode: UserRoleMode;
  setMode: (mode: UserRoleMode) => void;
  listings: Listing[];
  campaigns: CreatorCampaign[];
  bookings: BookingOrder[];
  reviews: Review[];
  priceAlerts: PriceDropAlert[];
  notifications: NotificationItem[];
  filter: ViewFilter;
  setFilter: React.Dispatch<React.SetStateAction<ViewFilter>>;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  selectedProvider: SellerProfile | null;
  setSelectedProvider: (provider: SellerProfile | null) => void;
  openProviderProfile: (provider: SellerProfile) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Actions
  addListing: (newListing: Omit<Listing, 'id' | 'createdAt'>) => void;
  updateListingInventory: (listingId: string, availableStock: number, totalStock?: number) => void;
  updateListingPrice: (listingId: string, newPrice: number) => void;
  deleteListing: (listingId: string) => void;
  
  // Price Alerts & Notifications
  setPriceAlert: (listingId: string, targetPrice: number, userEmail?: string) => void;
  removePriceAlert: (alertId: string) => void;
  hasPriceAlert: (listingId: string) => boolean;
  getPriceAlert: (listingId: string) => PriceDropAlert | undefined;
  simulatePriceDrop: (listingId: string, dropAmount?: number) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (notificationId: string) => void;
  
  createBooking: (bookingData: Omit<BookingOrder, 'id' | 'bookingDate'>) => BookingOrder;
  cancelBooking: (bookingId: string) => void;
  returnRentalItem: (bookingId: string) => void;
  
  addCampaign: (campaign: Omit<CreatorCampaign, 'id' | 'createdAt' | 'proposals' | 'approvedCount'>) => void;
  submitCreatorProposal: (campaignId: string, proposal: Omit<CreatorProposal, 'id' | 'submittedAt' | 'status'>) => void;
  updateProposalStatus: (campaignId: string, proposalId: string, status: 'accepted' | 'declined') => void;
  
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  
  // Filters convenience
  selectVertical: (id: VerticalId | 'all') => void;
  selectSubcategory: (sub: string | undefined) => void;
  resetFilters: () => void;
  toggleNearMe: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEY_LISTINGS = 'bluecode_listings_v1';
const STORAGE_KEY_CAMPAIGNS = 'bluecode_campaigns_v1';
const STORAGE_KEY_BOOKINGS = 'bluecode_bookings_v1';
const STORAGE_KEY_REVIEWS = 'bluecode_reviews_v1';
const STORAGE_KEY_MODE = 'bluecode_user_mode_v1';
const STORAGE_KEY_ALERTS = 'bluecode_price_alerts_v1';
const STORAGE_KEY_NOTIFICATIONS = 'bluecode_notifications_v1';

const INITIAL_PRICE_ALERTS: PriceDropAlert[] = [
  {
    id: 'alert-sony-fx3',
    listingId: 'rent-sony-fx3',
    listingTitle: 'Sony FX3 Cinema Camera Kit + 24-70mm GM II',
    listingImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    targetPrice: 85,
    initialPrice: 95,
    currentPrice: 95,
    priceUnit: '/day',
    createdAt: '2026-10-01',
    triggered: false,
    userEmail: 'user@bluecode.market',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    type: 'system',
    title: 'Price Drop Alerts Active',
    message: 'You have an active alert on the Sony FX3 Cinema Rig. You will be notified instantly when the host discounts the rental.',
    listingId: 'rent-sony-fx3',
    timestamp: '2 hours ago',
    read: false,
  },
];

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<UserRoleMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_MODE) as UserRoleMode) || 'customer';
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LISTINGS);
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [campaigns, setCampaigns] = useState<CreatorCampaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CREATOR_CAMPAIGNS;
  });

  const [bookings, setBookings] = useState<BookingOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceDropAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_PRICE_ALERTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<SellerProfile | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const openProviderProfile = (provider: SellerProfile) => {
    setSelectedProvider(provider);
    setActiveModal('provider_profile');
  };

  const [filter, setFilter] = useState<ViewFilter>({
    verticalId: 'all',
    searchQuery: '',
    locationQuery: '',
    nearMeOnly: false,
    listingType: 'all',
    verifiedOnly: false,
    sortBy: 'featured',
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const setMode = (newMode: UserRoleMode) => {
    setModeState(newMode);
    showToast(
      newMode === 'seller'
        ? 'Switched to Provider & Seller Hub'
        : 'Switched to Customer Marketplace',
      'info'
    );
  };

  const addListing = (newListingData: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: `list-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setListings((prev) => [newListing, ...prev]);
    showToast(`"${newListing.title}" is now published on BlueCode!`, 'success');
  };

  const updateListingInventory = (listingId: string, availableStock: number, totalStock?: number) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          return {
            ...item,
            inventory: {
              ...item.inventory,
              availableStock,
              totalStock: totalStock !== undefined ? totalStock : item.inventory.totalStock,
            },
          };
        }
        return item;
      })
    );
    showToast('Inventory updated in real time.', 'info');
  };

  const updateListingPrice = (listingId: string, newPrice: number) => {
    let targetListing: Listing | undefined;
    let oldPrice = 0;

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          targetListing = item;
          oldPrice = item.price;
          return {
            ...item,
            price: newPrice,
          };
        }
        return item;
      })
    );

    if (!targetListing) return;

    // Check if price dropped
    if (newPrice < oldPrice) {
      const savings = oldPrice - newPrice;
      const savingsPercent = Math.round((savings / oldPrice) * 100);

      // Check active alerts for this listing
      const matchingAlerts = priceAlerts.filter((a) => a.listingId === listingId);

      if (matchingAlerts.length > 0) {
        // Trigger notification
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'price_drop',
          title: `Price Drop Alert: Save $${savings}${targetListing.priceUnit}!`,
          message: `The host lowered the rate on "${targetListing.title}" from $${oldPrice} to $${newPrice}${targetListing.priceUnit} (${savingsPercent}% discount). Rent now while inventory lasts!`,
          listingId: targetListing.id,
          oldPrice,
          newPrice,
          priceUnit: targetListing.priceUnit,
          timestamp: 'Just now',
          read: false,
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // Update alerts as triggered
        setPriceAlerts((prev) =>
          prev.map((a) =>
            a.listingId === listingId
              ? { ...a, currentPrice: newPrice, triggered: true }
              : a
          )
        );

        showToast(
          `🔔 PRICE DROP ALERT: "${targetListing.title}" dropped to $${newPrice}${targetListing.priceUnit} (Save $${savings})!`,
          'success'
        );
      } else {
        showToast(
          `Price updated for "${targetListing.title}" to $${newPrice}${targetListing.priceUnit}.`,
          'info'
        );
      }
    } else {
      showToast(
        `Price updated for "${targetListing.title}" to $${newPrice}${targetListing.priceUnit}.`,
        'info'
      );
    }
  };

  const setPriceAlert = (listingId: string, targetPrice: number, userEmail: string = 'user@bluecode.market') => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const existing = priceAlerts.find((a) => a.listingId === listingId);
    if (existing) {
      setPriceAlerts((prev) =>
        prev.map((a) =>
          a.listingId === listingId
            ? { ...a, targetPrice, currentPrice: listing.price, userEmail, triggered: false }
            : a
        )
      );
      showToast(
        `Price drop alert updated: You'll be notified when rate drops to or below $${targetPrice}${listing.priceUnit}.`,
        'success'
      );
      return;
    }

    const newAlert: PriceDropAlert = {
      id: `alert-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      targetPrice,
      initialPrice: listing.price,
      currentPrice: listing.price,
      priceUnit: listing.priceUnit,
      createdAt: new Date().toISOString().split('T')[0],
      triggered: false,
      userEmail,
    };

    setPriceAlerts((prev) => [newAlert, ...prev]);
    showToast(
      `🔔 Price drop alert active! We will notify you when "${listing.title}" drops below $${targetPrice}${listing.priceUnit}.`,
      'success'
    );
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Price drop alert removed.', 'info');
  };

  const hasPriceAlert = (listingId: string) => {
    return priceAlerts.some((a) => a.listingId === listingId);
  };

  const getPriceAlert = (listingId: string) => {
    return priceAlerts.find((a) => a.listingId === listingId);
  };

  const simulatePriceDrop = (listingId: string, dropAmount?: number) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    const amount = dropAmount || Math.max(10, Math.round(listing.price * 0.15));
    const newPrice = Math.max(10, listing.price - amount);
    updateListingPrice(listingId, newPrice);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const clearNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const deleteListing = (listingId: string) => {
    setListings((prev) => prev.filter((item) => item.id !== listingId));
    showToast('Listing removed.', 'info');
  };

  const createBooking = (bookingData: Omit<BookingOrder, 'id' | 'bookingDate'>): BookingOrder => {
    const newBooking: BookingOrder = {
      ...bookingData,
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingDate: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Decrement available inventory for rentals and products
    if (bookingData.listingType === 'rental' || bookingData.listingType === 'product') {
      setListings((prev) =>
        prev.map((item) => {
          if (item.id === bookingData.listingId) {
            const nextStock = Math.max(0, item.inventory.availableStock - bookingData.quantity);
            return {
              ...item,
              inventory: {
                ...item.inventory,
                availableStock: nextStock,
              },
            };
          }
          return item;
        })
      );
    }

    showToast(
      `Booking Confirmed! Order #${newBooking.id} secured with Escrow Protection.`,
      'success'
    );
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled', escrowStatus: 'refunded' } : b))
    );

    // Restore inventory if rental/product
    if (target.listingType === 'rental' || target.listingType === 'product') {
      setListings((prev) =>
        prev.map((item) => {
          if (item.id === target.listingId) {
            return {
              ...item,
              inventory: {
                ...item.inventory,
                availableStock: Math.min(item.inventory.totalStock, item.inventory.availableStock + target.quantity),
              },
            };
          }
          return item;
        })
      );
    }

    showToast(`Order #${bookingId} cancelled. Security deposit & fees refunded.`, 'info');
  };

  const returnRentalItem = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'completed', escrowStatus: 'released' } : b))
    );

    // Restore stock
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === target.listingId) {
          return {
            ...item,
            inventory: {
              ...item.inventory,
              availableStock: Math.min(item.inventory.totalStock, item.inventory.availableStock + target.quantity),
            },
          };
        }
        return item;
      })
    );

    showToast(
      `Gear returned in verified condition! Escrow security deposit of $${target.securityDeposit} refunded to customer.`,
      'success'
    );
  };

  const addCampaign = (
    newCampaignData: Omit<CreatorCampaign, 'id' | 'createdAt' | 'proposals' | 'approvedCount'>
  ) => {
    const campaign: CreatorCampaign = {
      ...newCampaignData,
      id: `camp-${Date.now()}`,
      approvedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      proposals: [],
    };
    setCampaigns((prev) => [campaign, ...prev]);
    showToast(`Creator Brief "${campaign.title}" is live! Creators can now submit pitches.`, 'success');
  };

  const submitCreatorProposal = (
    campaignId: string,
    proposalData: Omit<CreatorProposal, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newProposal: CreatorProposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setCampaigns((prev) =>
      prev.map((camp) => {
        if (camp.id === campaignId) {
          return {
            ...camp,
            proposals: [newProposal, ...camp.proposals],
          };
        }
        return camp;
      })
    );
    showToast('Your creator proposal and pitch have been submitted to the brand!', 'success');
  };

  const updateProposalStatus = (campaignId: string, proposalId: string, status: 'accepted' | 'declined') => {
    setCampaigns((prev) =>
      prev.map((camp) => {
        if (camp.id === campaignId) {
          const updatedProposals = camp.proposals.map((p) =>
            p.id === proposalId ? { ...p, status } : p
          );
          const approved = updatedProposals.filter((p) => p.status === 'accepted').length;
          return {
            ...camp,
            approvedCount: approved,
            proposals: updatedProposals,
          };
        }
        return camp;
      })
    );
    showToast(
      status === 'accepted' ? 'Creator offer accepted! Campaign contract generated.' : 'Proposal marked as declined.',
      status === 'accepted' ? 'success' : 'info'
    );
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate listing rating
    const matchingReviews = [...reviews.filter((r) => r.listingId === reviewData.listingId), newReview];
    const avg = matchingReviews.reduce((sum, r) => sum + r.rating, 0) / matchingReviews.length;

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === reviewData.listingId) {
          return {
            ...item,
            seller: {
              ...item.seller,
              rating: Number(avg.toFixed(2)),
              reviewCount: item.seller.reviewCount + 1,
            },
          };
        }
        return item;
      })
    );

    showToast('Thank you! Your verified review has been published.', 'success');
  };

  const selectVertical = (verticalId: VerticalId | 'all') => {
    setFilter((prev) => ({
      ...prev,
      verticalId,
      subcategory: undefined,
    }));
  };

  const selectSubcategory = (subcategory: string | undefined) => {
    setFilter((prev) => ({
      ...prev,
      subcategory,
    }));
  };

  const toggleNearMe = () => {
    setFilter((prev) => ({
      ...prev,
      nearMeOnly: !prev.nearMeOnly,
      locationQuery: !prev.nearMeOnly ? 'Austin, TX' : '',
    }));
    if (!filter.nearMeOnly) {
      showToast('Showing available providers & inventory near Austin, TX (within 25 miles)', 'info');
    }
  };

  const resetFilters = () => {
    setFilter({
      verticalId: 'all',
      searchQuery: '',
      locationQuery: '',
      nearMeOnly: false,
      listingType: 'all',
      verifiedOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <MarketplaceContext.Provider
      value={{
        mode,
        setMode,
        listings,
        campaigns,
        bookings,
        reviews,
        priceAlerts,
        notifications,
        filter,
        setFilter,
        selectedListing,
        setSelectedListing,
        selectedProvider,
        setSelectedProvider,
        openProviderProfile,
        activeModal,
        setActiveModal,
        toast,
        showToast,
        addListing,
        updateListingInventory,
        updateListingPrice,
        deleteListing,
        setPriceAlert,
        removePriceAlert,
        hasPriceAlert,
        getPriceAlert,
        simulatePriceDrop,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        createBooking,
        cancelBooking,
        returnRentalItem,
        addCampaign,
        submitCreatorProposal,
        updateProposalStatus,
        addReview,
        selectVertical,
        selectSubcategory,
        resetFilters,
        toggleNearMe,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
