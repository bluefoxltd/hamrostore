import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Award,
  FileCheck,
  Send,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Layers,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowRight,
  DollarSign,
  Package,
  Headphones,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SellerProfile } from '../types';

export const ProviderProfileModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedProvider,
    setSelectedProvider,
    listings,
    reviews,
    setSelectedListing,
    showToast,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'portfolio' | 'reviews'>('overview');
  const [inquiryDate, setInquiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [inquiryScope, setInquiryScope] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  if (activeModal !== 'provider_profile' || !selectedProvider) return null;

  // Find all active listings by this provider
  const providerListings = listings.filter((l) => l.seller.id === selectedProvider.id);
  // Find all verified reviews across this provider's listings
  const providerReviews = reviews.filter((r) =>
    providerListings.some((l) => l.id === r.listingId)
  );

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryScope.trim()) return;
    setInquirySent(true);
    showToast(
      `Direct inquiry sent to ${selectedProvider.name}! They typically respond within ${selectedProvider.responseTime}.`,
      'success'
    );
    setTimeout(() => {
      setInquirySent(false);
      setInquiryScope('');
    }, 2500);
  };

  const handleSelectListing = (listing: any) => {
    setSelectedListing(listing);
    setActiveModal('detail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Profile Header Banner */}
        <div className="bg-[#0B192C] text-white p-6 border-b border-[#1E3E62] relative">
          <button
            onClick={() => {
              setActiveModal(null);
              setSelectedProvider(null);
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <img
                  src={selectedProvider.avatar}
                  alt={selectedProvider.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-500/30 border-2 border-white shadow-xl"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B192C]" title="Online now" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-600/30 text-sky-300 border border-blue-400/40">
                    {selectedProvider.badge || 'Verified Pro'}
                  </span>
                  {selectedProvider.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ID & License Verified
                    </span>
                  )}
                  <span className="text-xs text-slate-400">Member since {selectedProvider.memberSince}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {selectedProvider.name}
                </h1>

                {selectedProvider.titleRole && (
                  <p className="text-xs sm:text-sm text-sky-200 font-medium mt-0.5">
                    {selectedProvider.titleRole}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {selectedProvider.location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Avg. Response: {selectedProvider.responseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-2 bg-[#070e1b] p-3 rounded-xl border border-slate-800 text-center font-mono self-start md:self-auto min-w-[280px]">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-sans">Rating</span>
                <span className="text-base font-bold text-white flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedProvider.rating}
                </span>
                <span className="text-[10px] text-slate-400">({selectedProvider.reviewCount})</span>
              </div>
              <div className="border-x border-slate-800 px-2">
                <span className="block text-[10px] text-slate-400 uppercase font-sans">Completed</span>
                <span className="text-base font-bold text-emerald-400">
                  {selectedProvider.totalTransactions || 95}+
                </span>
                <span className="text-[10px] text-slate-400">Jobs & Rentals</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-sans">Response</span>
                <span className="text-base font-bold text-sky-400">
                  {selectedProvider.responseRate}
                </span>
                <span className="text-[10px] text-slate-400">On BlueCode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Overview & Credentials
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Services & Gear ({providerListings.length})
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Portfolio & Work Showcase
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Client Reviews ({providerReviews.length})
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 text-xs">
                {/* About Bio */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider mb-2">
                    Professional Biography
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {selectedProvider.bio ||
                      `${selectedProvider.name} is a vetted professional offering top-tier services and equipment rentals on BlueCode Marketplace. Equipped with comprehensive tools, verified credentials, and full escrow protection.`}
                  </p>
                </div>

                {/* Verified Credentials & Licenses */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                      Verified Licenses & Insurance Credentials
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">License Status</span>
                      <span className="font-bold text-slate-900 text-xs">
                        {selectedProvider.licenseNumber || 'Verified Contractor / Pro #48291'}
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Active & Clean Record in State Registry</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Insurance Protection</span>
                      <span className="font-bold text-slate-900 text-xs">
                        {selectedProvider.insuranceCoverage || '$2,000,000 General Commercial Liability'}
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Verified COI On File with BlueCode</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Experience</span>
                      <span className="font-bold text-slate-900 text-xs">
                        {selectedProvider.yearsExperience || 8}+ Years Professional Practice
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">100% On-Time Completion Rate</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Escrow Performance</span>
                      <span className="font-bold text-slate-900 text-xs">
                        0 Disputed Escrow Transactions
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Premier Trusted Host Status</span>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono mb-2">
                    Service Areas & Dispatch Radius
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProvider.serviceArea || [
                      'Downtown & Metro Area',
                      'North Suburbs (25-mile radius)',
                      'South & Westlake Districts',
                      'Airport Logistics Corridors',
                    ]).map((area, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 text-xs font-medium border border-blue-200"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{area}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills & Tools */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono mb-2">
                    Specialized Tools & Certifications
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProvider.skillsAndTools || [
                      'Diagnostic Inspections',
                      'High-Throughput Equipment',
                      'OSHA 30 Safety Certified',
                      'Same-Day Emergency Dispatch',
                      'Digital Escrow Invoicing',
                    ]).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">
                    Active Catalog & Equipment Available to Book
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {providerListings.length} Active Listings
                  </span>
                </div>

                {providerListings.length === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No active listings from this provider currently.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {providerListings.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectListing(item)}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-blue-700 font-bold uppercase">
                              {item.subcategory}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Stock: {item.inventory.availableStock} available
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-[#0B192C]">
                            ${item.price} {item.priceUnit}
                          </span>
                          <span className="text-blue-600 group-hover:underline text-[11px] font-bold flex items-center gap-1">
                            <span>Book / Reserve</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">
                    Past Verified Work & Case Studies
                  </h3>
                  <span className="text-xs text-slate-500">Documented Projects</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedProvider.portfolio || [
                    {
                      id: 'p-1',
                      title: 'Downtown Commercial High-Rise Execution',
                      category: 'Enterprise Contract',
                      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800',
                      description: 'Complete inspection and turnkey implementation. Completed 2 days ahead of schedule with zero safety incidents.',
                      metrics: '100% Client Satisfaction · $0 Scope Creep',
                    },
                    {
                      id: 'p-2',
                      title: 'Residential Emergency Restoration',
                      category: 'On-Demand Service',
                      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
                      description: 'Emergency response within 28 minutes. Full diagnostics, parts replacement, and city inspection sign-off.',
                      metrics: '28 Min Response · 1-Year Guarantee Stamped',
                    },
                    {
                      id: 'p-3',
                      title: 'High-Fidelity Cinema Gear Deployment',
                      category: 'Equipment Rental',
                      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
                      description: 'Supplied 4K 120p camera kits, wireless transmitters, and audio package for 5-day indie feature filming.',
                      metrics: 'Zero Downtime · Pelican Transit Cases Included',
                    },
                  ]).map((proj) => (
                    <div key={proj.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                      <img src={proj.image} alt={proj.title} className="w-full h-36 object-cover" />
                      <div className="p-3.5 space-y-1.5 text-xs">
                        <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">
                          {proj.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {proj.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {proj.description}
                        </p>
                        {proj.metrics && (
                          <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-emerald-800 font-semibold">
                            ✓ {proj.metrics}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">
                    Verified Customer Feedback
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProvider.rating} / 5.0 Rating</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Quality</span>
                    <strong className="text-slate-900">5.0 ★</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Communication</span>
                    <strong className="text-slate-900">4.9 ★</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Punctuality</span>
                    <strong className="text-slate-900">5.0 ★</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block">Value</span>
                    <strong className="text-slate-900">4.9 ★</strong>
                  </div>
                </div>

                {providerReviews.length === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    No individual reviews attached yet. All verified transactions maintain a 5.0 score.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {providerReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={rev.authorAvatar} alt={rev.authorName} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-bold text-slate-900">{rev.authorName}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                              Verified Escrow Booking
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Direct Contact & Inquiry Form (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm tracking-tight font-mono">
                  Direct Quote & Booking Inquiry
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Message {selectedProvider.name} directly. Funds are held in BlueCode Escrow once terms are agreed upon.
                </p>
              </div>

              {inquirySent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h5 className="font-bold text-xs text-emerald-900">Inquiry Sent Successfully!</h5>
                  <p className="text-[11px] text-emerald-700">
                    {selectedProvider.name} has been notified via priority SMS/email. Expect a response in under {selectedProvider.responseTime}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Project Details / Gear Needs
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Need camera kit for 3-day shoot in downtown, or need 200A panel upgraded on Friday morning..."
                      value={inquiryScope}
                      onChange={(e) => setInquiryScope(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Response Guarantee:</span>
                      <strong className="text-slate-900">{selectedProvider.responseTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Protection:</span>
                      <strong className="text-emerald-700">100% Escrow Held</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to {selectedProvider.name.split(' ')[0]}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Provider Verification Badges Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
              <h5 className="font-bold text-slate-900 uppercase font-mono text-[10px] tracking-wider">
                BlueCode Provider Guarantees
              </h5>
              <div className="space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Government Photo ID & Biometrics Checked</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Trade License & Active Insurance Audited</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>On-Time Arrival / Gear Dispatch Pledge</span>
                </div>
              </div>
            </div>

            {/* BlueCode Concierge Care Connection Box */}
            <div className="bg-gradient-to-br from-blue-900 to-[#0B192C] text-white rounded-xl p-4 text-xs space-y-2 border border-blue-500/30 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/40 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs">
                    BlueCode Concierge Care
                  </h5>
                  <p className="text-[10px] text-sky-200">
                    24/7 live bridge for this provider
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                BlueCode is an open marketplace where providers self-publish. We do not sell our own services. Our concierge team actively bridges communication with {selectedProvider.name.split(' ')[0]}, enforces escrow protection, and steps in if any dispute arises.
              </p>
              <button
                type="button"
                onClick={() => setActiveModal('customer_care')}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white font-bold text-xs border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Connect via Customer Care</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
