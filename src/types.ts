export type VerticalId =
  | 'tech-dev'
  | 'design-creative'
  | 'video-media'
  | 'marketing-ads'
  | 'influencer-creator'
  | 'home-property'
  | 'automobile'
  | 'products-shopping'
  | 'professionals-freelancers'
  | 'education'
  | 'business-services'
  | 'construction-property'
  | 'transport-logistics'
  | 'events-entertainment'
  | 'beauty-personal'
  | 'pets-animals'
  | 'agriculture-local'
  | 'rentals';

export type ListingType = 'rental' | 'service' | 'product' | 'freelancer' | 'creator_campaign';

export interface CategoryVertical {
  id: VerticalId;
  name: string;
  shortName: string;
  icon: string; // Lucide icon identifier
  description: string;
  highlightKicker: string;
  subcategories: string[];
  accentColor: string;
  featuredPill?: string;
  defaultListingType: ListingType;
}

export interface InventoryInfo {
  totalStock: number;
  availableStock: number;
  sku?: string;
  locationCity: string;
  instantBooking: boolean;
  minimumRentalDays?: number;
  allowPickup: boolean;
  allowDelivery: boolean;
  deliveryFee?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  metrics?: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseRate: string;
  responseTime: string;
  location: string;
  badge?: string;
  memberSince: string;
  bio?: string;
  totalTransactions?: number;
  titleRole?: string;
  licenseNumber?: string;
  insuranceCoverage?: string;
  yearsExperience?: number;
  certifications?: string[];
  skillsAndTools?: string[];
  serviceArea?: string[];
  portfolio?: PortfolioItem[];
  directEmail?: string;
  directPhone?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  verticalId: VerticalId;
  subcategory: string;
  listingType: ListingType;
  price: number;
  priceUnit: '/day' | '/hr' | 'fixed' | '/item' | '/project';
  securityDeposit?: number; // Refundable deposit for peer-to-peer rentals
  inventory: InventoryInfo;
  seller: SellerProfile;
  images: string[];
  tags: string[];
  specs?: Record<string, string>;
  included?: string[];
  rules?: string[];
  createdAt: string;
  featured?: boolean;
}

export interface CreatorProposal {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'UGC';
  followers: string;
  pitch: string;
  bidAmount: number;
  sampleLinks: string[];
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: string;
}

export interface CreatorCampaign {
  id: string;
  title: string;
  businessName: string;
  businessAvatar: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'UGC' | 'Multi-platform';
  budget: number;
  creatorCountNeeded: number;
  approvedCount: number;
  deadline: string;
  description: string;
  deliverables: string[];
  requirements: {
    minFollowers?: string;
    niche?: string;
    location?: string;
  };
  proposals: CreatorProposal[];
  status: 'open' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface BookingOrder {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: ListingType;
  listingImage: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  quantity: number;
  basePrice: number;
  securityDeposit: number;
  serviceFee: number; // 20% BlueCode platform facilitation fee
  sellerPayout?: number; // 80% net payout to the provider
  insuranceFee?: number;
  totalAmount: number;
  status: 'active_rental' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  escrowStatus: 'held_in_escrow' | 'released' | 'refunded';
  paymentMethod: string;
  bookingDate: string;
  pickupLocation?: string;
  notes?: string;
  conciergeAssigned?: string;
}

export interface SupportMessage {
  id: string;
  orderId?: string;
  providerName?: string;
  sender: 'customer' | 'support_concierge' | 'provider';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Review {
  id: string;
  listingId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBooking: boolean;
  itemReturnedInGoodCondition?: boolean;
}

export interface PriceDropAlert {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  targetPrice: number;
  initialPrice: number;
  currentPrice: number;
  priceUnit: string;
  createdAt: string;
  triggered: boolean;
  userEmail: string;
}

export interface NotificationItem {
  id: string;
  type: 'price_drop' | 'order_update' | 'inventory_low' | 'system';
  title: string;
  message: string;
  listingId?: string;
  oldPrice?: number;
  newPrice?: number;
  priceUnit?: string;
  timestamp: string;
  read: boolean;
}

export type ViewFilter = {
  verticalId: VerticalId | 'all';
  subcategory?: string;
  searchQuery: string;
  locationQuery: string;
  nearMeOnly: boolean;
  listingType: 'all' | ListingType;
  priceMax?: number;
  minRating?: number;
  verifiedOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'inventory';
};
