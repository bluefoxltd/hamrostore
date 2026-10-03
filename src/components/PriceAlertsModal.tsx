import React, { useState } from 'react';
import {
  X,
  Bell,
  TrendingDown,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const PriceAlertsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    priceAlerts,
    removePriceAlert,
    simulatePriceDrop,
    setSelectedListing,
    listings,
    notifications,
    markAllNotificationsRead,
    clearNotification,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'alerts' | 'notifications'>('alerts');

  if (activeModal !== 'price_alerts') return null;

  const priceDropNotifications = notifications.filter((n) => n.type === 'price_drop');

  const handleOpenListing = (listingId: string) => {
    const item = listings.find((l) => l.id === listingId);
    if (item) {
      setSelectedListing(item);
      setActiveModal('detail');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/30 text-sky-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Price Drop Alerts & Notifications
              </h2>
              <p className="text-xs text-slate-300">
                Track rate decreases on gear rentals & services and get notified instantly
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

        {/* Tab switcher */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Active Alerts ({priceAlerts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications ({notifications.length})</span>
            </button>
          </div>

          {activeTab === 'notifications' && notifications.length > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'alerts' ? (
            priceAlerts.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No price alerts set yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the bell icon on any gear rental or service listing to set a target price. We will alert you the moment the seller lowers the price!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs text-blue-950 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>
                      <strong>Interactive Demo:</strong> Click "Simulate Seller Price Drop" below to test an instant price decrease and notification!
                    </span>
                  </span>
                </div>

                {priceAlerts.map((alert) => {
                  const currentListing = listings.find((l) => l.id === alert.listingId);
                  const currentPrice = currentListing ? currentListing.price : alert.currentPrice;
                  const hasDropped = currentPrice < alert.initialPrice;
                  const reachedTarget = currentPrice <= alert.targetPrice;

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        reachedTarget
                          ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                          : hasDropped
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={alert.listingImage}
                          alt={alert.listingTitle}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {reachedTarget ? (
                              <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                                Target Hit! Rate Dropped
                              </span>
                            ) : hasDropped ? (
                              <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                                Discount Active
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-600 font-medium text-[10px] px-2 py-0.5 rounded">
                                Tracking Price
                              </span>
                            )}
                            <span className="text-slate-400 text-[11px]">
                              Set {alert.createdAt}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm">
                            {alert.listingTitle}
                          </h4>

                          <div className="flex items-center gap-3 mt-1.5 text-slate-600 font-mono text-[11px]">
                            <span>
                              Original: <del className="text-slate-400">${alert.initialPrice}{alert.priceUnit}</del>
                            </span>
                            <span>·</span>
                            <span>
                              Target: <strong className="text-blue-700">${alert.targetPrice}{alert.priceUnit}</strong>
                            </span>
                            <span>·</span>
                            <span>
                              Current: <strong className={`font-bold ${hasDropped ? 'text-emerald-700 text-xs' : 'text-slate-900'}`}>
                                ${currentPrice}{alert.priceUnit}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start md:self-auto font-sans">
                        {/* Demo Simulator button */}
                        <button
                          type="button"
                          onClick={() => simulatePriceDrop(alert.listingId, 15)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          title="Simulate seller dropping price by $15 to test alert notification"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          <span>Simulate Price Drop (-$15)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenListing(alert.listingId)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span>Rent / Book</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removePriceAlert(alert.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Notifications history */
            notifications.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                No notifications at this time.
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      !notif.read
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notif.type === 'price_drop'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {notif.type === 'price_drop' ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>

                        {notif.listingId && (
                          <button
                            onClick={() => handleOpenListing(notif.listingId!)}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>View discounted listing</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => clearNotification(notif.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Active alert notifications are saved across your sessions.</span>
          <button
            onClick={() => setActiveModal(null)}
            className="font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
