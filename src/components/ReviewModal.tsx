import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const ReviewModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedListing, addReview } = useMarketplace();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('Jordan Vance');
  const [comment, setComment] = useState('');
  const [itemReturnedGood, setItemReturnedGood] = useState(true);

  if (activeModal !== 'review_modal' || !selectedListing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      listingId: selectedListing.id,
      authorName,
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating,
      comment,
      verifiedBooking: true,
      itemReturnedInGoodCondition: itemReturnedGood,
    });

    setActiveModal('detail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62]">
          <h2 className="text-base font-bold text-white tracking-tight">
            Write a Verified Review
          </h2>
          <button
            onClick={() => setActiveModal('detail')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-mono">Reviewing</span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {selectedListing.title}
            </h3>
            <p className="text-slate-500 text-[11px]">Provider: {selectedListing.seller.name}</p>
          </div>

          {/* Star selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Overall Experience Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-mono font-bold text-slate-700 text-sm">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Your Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Feedback & Experience Details
            </label>
            <textarea
              rows={4}
              required
              placeholder="How was the communication, gear condition, pickup punctuality, and overall value?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          {selectedListing.listingType === 'rental' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="goodCondition"
                checked={itemReturnedGood}
                onChange={(e) => setItemReturnedGood(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <label htmlFor="goodCondition" className="text-slate-600 cursor-pointer">
                Confirm gear was inspected & returned in clean working order
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal('detail')}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
