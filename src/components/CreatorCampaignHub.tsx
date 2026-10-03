import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Check,
  X,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CreatorCampaign, CreatorProposal } from '../types';

export const CreatorCampaignHub: React.FC = () => {
  const {
    campaigns,
    addCampaign,
    submitCreatorProposal,
    updateProposalStatus,
  } = useMarketplace();

  const [isPostingBrief, setIsPostingBrief] = useState(false);
  const [pitchingCampaignId, setPitchingCampaignId] = useState<string | null>(null);

  // New Brief Form State
  const [newTitle, setNewTitle] = useState('Need 3 TikTok creators to promote my SaaS product');
  const [newBusiness, setNewBusiness] = useState('Veloce Cloud Solutions');
  const [newPlatform, setNewPlatform] = useState<'TikTok' | 'Instagram' | 'YouTube' | 'UGC'>('TikTok');
  const [newBudget, setNewBudget] = useState(3000);
  const [newCreatorsNeeded, setNewCreatorsNeeded] = useState(3);
  const [newDeadline, setNewDeadline] = useState('2026-11-15');
  const [newDescription, setNewDescription] = useState(
    'Looking for creators in tech, productivity, or business niches to create a 30s demonstration showing how our tool saves 10 hours a week on client reporting.'
  );
  const [newDeliverables, setNewDeliverables] = useState(
    '1x TikTok video with ad-code\n1x Instagram Reel cross-post\nRaw 4K b-roll clips'
  );
  const [newFollowersReq, setNewFollowersReq] = useState('20,000+ followers');

  // Proposal Submission State
  const [creatorName, setCreatorName] = useState('Jordan Lee');
  const [creatorHandle, setCreatorHandle] = useState('@jordancreates');
  const [creatorPlatform, setCreatorPlatform] = useState<'TikTok' | 'Instagram' | 'YouTube' | 'UGC'>('TikTok');
  const [creatorFollowers, setCreatorFollowers] = useState('68,000');
  const [pitchText, setPitchText] = useState(
    'Hi! I create viral software review videos that average 45K views. I can deliver a fast-paced hook with high retention within 3 days.'
  );
  const [bidAmount, setBidAmount] = useState(900);
  const [portfolioLink, setPortfolioLink] = useState('tiktok.com/@jordancreates');

  const handleCreateBrief = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      title: newTitle,
      businessName: newBusiness,
      businessAvatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      platform: newPlatform,
      budget: Number(newBudget),
      creatorCountNeeded: Number(newCreatorsNeeded),
      deadline: newDeadline,
      description: newDescription,
      deliverables: newDeliverables.split('\n').filter(Boolean),
      requirements: {
        minFollowers: newFollowersReq,
        niche: 'Tech / Productivity / Business',
      },
      status: 'open',
    });
    setIsPostingBrief(false);
  };

  const handleSendProposal = (e: React.FormEvent, campaignId: string) => {
    e.preventDefault();
    submitCreatorProposal(campaignId, {
      creatorId: `usr-${Date.now()}`,
      creatorName,
      creatorHandle,
      creatorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      platform: creatorPlatform,
      followers: creatorFollowers,
      pitch: pitchText,
      bidAmount: Number(bidAmount),
      sampleLinks: [portfolioLink],
    });
    setPitchingCampaignId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Vertical 5 · Influencer & Creator Marketplace
            </span>
            <span className="text-xs text-slate-400">Escrow Managed Campaigns</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Creator Campaign Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Post briefs, receive tailored creator pitches, and manage payouts in BlueCode Escrow.
          </p>
        </div>

        <button
          onClick={() => setIsPostingBrief(!isPostingBrief)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isPostingBrief ? 'Close Brief Form' : 'Post a Creator Brief'}</span>
        </button>
      </div>

      {/* Posting a new brief form */}
      {isPostingBrief && (
        <form
          onSubmit={handleCreateBrief}
          className="my-5 p-5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-950 font-mono">
              Create New Creator Campaign Brief
            </h3>
            <span className="text-xs text-purple-700">e.g. "I need 3 TikTok creators to promote my product"</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Campaign Title / Pitch</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Brand Name</label>
              <input
                type="text"
                required
                value={newBusiness}
                onChange={(e) => setNewBusiness(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform Focus</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="TikTok">TikTok Creators</option>
                <option value="Instagram">Instagram Reels</option>
                <option value="YouTube">YouTube Creators</option>
                <option value="UGC">UGC Content Creators</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Budget ($ USD)</label>
              <input
                type="number"
                required
                value={newBudget}
                onChange={(e) => setNewBudget(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Creators Needed</label>
              <input
                type="number"
                min={1}
                required
                value={newCreatorsNeeded}
                onChange={(e) => setNewCreatorsNeeded(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
              <textarea
                rows={3}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deliverables (one per line)</label>
              <textarea
                rows={3}
                required
                value={newDeliverables}
                onChange={(e) => setNewDeliverables(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPostingBrief(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              Publish Creator Brief
            </button>
          </div>
        </form>
      )}

      {/* Campaigns Listing */}
      <div className="space-y-6 pt-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all p-4 sm:p-5 shadow-xs"
          >
            {/* Brief Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={camp.businessAvatar}
                  alt={camp.businessName}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">
                      {camp.platform}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {camp.businessName}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">Deadline: {camp.deadline}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                    {camp.title}
                  </h3>
                </div>
              </div>

              {/* Budget & Slots tracker */}
              <div className="flex items-center gap-4 text-xs font-mono self-start md:self-auto">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-sans uppercase">Budget</span>
                  <span className="text-base font-bold text-slate-900">${camp.budget}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-sans uppercase">Slots Filled</span>
                  <span className="text-base font-bold text-purple-700">
                    {camp.approvedCount} / {camp.creatorCountNeeded}
                  </span>
                </div>
              </div>
            </div>

            {/* Brief Body */}
            <div className="py-3 text-xs text-slate-600 space-y-2">
              <p className="leading-relaxed">{camp.description}</p>

              {/* Deliverables */}
              <div className="flex flex-wrap gap-2 pt-1">
                {camp.deliverables.map((deliv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>{deliv}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar for Creators to pitch */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {camp.proposals.length} creator {camp.proposals.length === 1 ? 'pitch' : 'pitches'} submitted
              </span>

              <button
                onClick={() =>
                  setPitchingCampaignId(pitchingCampaignId === camp.id ? null : camp.id)
                }
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <span>{pitchingCampaignId === camp.id ? 'Cancel Pitch' : 'Submit Creator Pitch'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pitch submission form inline */}
            {pitchingCampaignId === camp.id && (
              <form
                onSubmit={(e) => handleSendProposal(e, camp.id)}
                className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 font-mono">
                    Submit Your Creator Proposal & Rate
                  </h4>
                  <span className="text-slate-400">Direct to {camp.businessName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Social Handle</label>
                    <input
                      type="text"
                      required
                      value={creatorHandle}
                      onChange={(e) => setCreatorHandle(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Followers / Audience</label>
                    <input
                      type="text"
                      required
                      value={creatorFollowers}
                      onChange={(e) => setCreatorFollowers(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Your Bid Amount ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Sample Link / Portfolio</label>
                    <input
                      type="text"
                      required
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pitch & Concept Idea</label>
                  <textarea
                    rows={2}
                    required
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Offer to Brand</span>
                  </button>
                </div>
              </form>
            )}

            {/* Submitted Creator Proposals List */}
            {camp.proposals.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Submitted Creator Offers ({camp.proposals.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {camp.proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                        prop.status === 'accepted'
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : prop.status === 'declined'
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={prop.creatorAvatar}
                              alt={prop.creatorName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900">{prop.creatorName}</span>
                                <span className="text-slate-400 text-[11px]">{prop.creatorHandle}</span>
                              </div>
                              <span className="text-[10px] text-purple-700 font-medium">
                                {prop.followers} · {prop.platform}
                              </span>
                            </div>
                          </div>

                          <div className="text-right font-mono">
                            <span className="font-bold text-slate-900 text-xs">${prop.bidAmount}</span>
                            <span className="block text-[10px] text-slate-400">Offer</span>
                          </div>
                        </div>

                        <p className="text-slate-600 text-[11px] line-clamp-3 mb-2">
                          "{prop.pitch}"
                        </p>
                      </div>

                      {/* Brand decision buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        {prop.status === 'accepted' ? (
                          <div className="flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                            <Check className="w-3.5 h-3.5" />
                            <span>Accepted · Campaign Contract Active</span>
                          </div>
                        ) : prop.status === 'declined' ? (
                          <span className="text-slate-400 text-[11px]">Offer Declined</span>
                        ) : (
                          <div className="flex items-center gap-2 w-full justify-end">
                            <button
                              onClick={() => updateProposalStatus(camp.id, prop.id, 'declined')}
                              className="px-2 py-1 rounded text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => updateProposalStatus(camp.id, prop.id, 'accepted')}
                              className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Select Creator</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
