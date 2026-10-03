import React, { useState } from 'react';
import {
  X,
  Headphones,
  ShieldCheck,
  Send,
  PhoneCall,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Building,
  UserCheck,
  AlertOctagon,
  ShieldAlert,
  FileText,
  Lock,
  Scale,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SupportMessage } from '../types';

export const CustomerCareModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    bookings,
    escalateOrderToDispute,
    showToast,
  } = useMarketplace();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    return bookings.length > 0 ? bookings[0].id : 'general';
  });

  // Dispute escalation form states
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Service delivery never performed / Provider no-show');
  const [disputeResolution, setDisputeResolution] = useState<'full_refund' | 'replacement' | 'mediation'>('full_refund');
  const [disputeEvidence, setDisputeEvidence] = useState('');
  const [disputeAgreed, setDisputeAgreed] = useState(false);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-1',
      sender: 'support_concierge',
      senderName: 'Sarah K. (BlueCode Concierge Care)',
      text: 'Hello! I am your dedicated BlueCode platform care agent. Remember, BlueCode is an open marketplace where independent specialists self-publish. We do not sell our own inventory — instead, our team provides 24/7 concierge bridging to connect you with your provider, coordinate deliveries, or enforce escrow protection.',
      timestamp: '10:02 AM',
    },
    {
      id: 'msg-2',
      sender: 'support_concierge',
      senderName: 'Sarah K. (BlueCode Concierge Care)',
      text: 'How can our customer care team assist your connection with your provider today? If service delivery is contested, you can also escalate this order to an official Dispute to freeze all escrow payouts.',
      timestamp: '10:03 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (activeModal !== 'customer_care') return null;

  const currentOrder = bookings.find((b) => b.id === selectedOrderId);
  const isOrderDisputed = currentOrder?.status === 'disputed';

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: 'You (Customer)',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Simulated Concierge response
    setTimeout(() => {
      let replyText = '';
      const lower = text.toLowerCase();

      if (lower.includes('dispute') || lower.includes('contest') || lower.includes('case')) {
        replyText = `Under BlueCode's 100% Escrow Guarantee, all disputed orders have their funds immediately frozen in our secure vault. Payout to ${currentOrder ? currentOrder.sellerName : 'the provider'} is halted. Our Senior Trust & Safety team investigates evidence and will issue a refund if delivery is contested.`;
      } else if (lower.includes('unresponsive') || lower.includes('not answering') || lower.includes('late')) {
        replyText = `We are stepping in immediately! As part of BlueCode's 20% platform concierge guarantee, we have pinged ${currentOrder ? currentOrder.sellerName : 'the provider'} via direct priority phone dispatch. If they do not acknowledge within 15 minutes, you can escalate to Dispute and your 100% escrow balance ($${currentOrder ? currentOrder.totalAmount : 0}) will be refunded.`;
      } else if (lower.includes('refund') || lower.includes('cancel')) {
        replyText = `Your payment of $${currentOrder ? currentOrder.totalAmount : 0} is currently held in BlueCode Escrow and has NOT been transferred to ${currentOrder ? currentOrder.sellerName : 'the provider'}. We can process an immediate 100% refund of your booking and deposit upon your confirmation.`;
      } else if (lower.includes('connect') || lower.includes('call') || lower.includes('phone')) {
        replyText = `Connecting you directly now! We have opened a 3-way verified channel with ${currentOrder ? currentOrder.sellerName : 'your provider'}. Our support agent will stay on the line to ensure all equipment and service milestones are met.`;
      } else if (lower.includes('fee') || lower.includes('20%') || lower.includes('commission')) {
        replyText = `BlueCode takes a 20% platform facilitation fee on every customer order. This fee covers our 24/7 live Concierge Customer Care, 100% Escrow payment protection, provider vetting, and dispute insurance. 80% is paid out to the independent provider.`;
      } else {
        replyText = `Thank you for reaching out to BlueCode Concierge Care! I am reviewing your order details with ${currentOrder ? currentOrder.sellerName : 'the provider'} right now. We guarantee complete satisfaction and will ensure your booking proceeds smoothly.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'support_concierge',
          senderName: isOrderDisputed
            ? 'David V. (Senior Escalations & Trust Officer)'
            : 'Sarah K. (BlueCode Concierge Care)',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (actionText: string) => {
    handleSendMessage(actionText);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder || !disputeAgreed) return;

    setIsSubmittingDispute(true);

    setTimeout(() => {
      // Call Context method
      escalateOrderToDispute(
        currentOrder.id,
        disputeReason,
        disputeResolution,
        disputeEvidence
      );

      // Add customer dispute statement to chat
      const disputeCaseId = `DSP-${Math.floor(10000 + Math.random() * 90000)}`;
      const disputeMessage: SupportMessage = {
        id: `msg-dsp-${Date.now()}`,
        sender: 'customer',
        senderName: 'You (Official Dispute Statement)',
        text: `⚠️ OFFICIAL DISPUTE FILED for Order #${currentOrder.id} (${currentOrder.listingTitle}).\nReason: "${disputeReason}"\nResolution Sought: ${
          disputeResolution === 'full_refund'
            ? '100% Instant Escrow Refund'
            : disputeResolution === 'replacement'
            ? 'Emergency Replacement Provider'
            : 'Platform Mediation'
        }\nClient Statement & Evidence: "${disputeEvidence || 'Service delivery contested by customer.'}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Add Senior Escalations response
      const escalationAgentReply: SupportMessage = {
        id: `msg-dsp-reply-${Date.now() + 1}`,
        sender: 'support_concierge',
        senderName: 'David V. (Senior Escalations & Trust Officer)',
        text: `DISPUTE CASE OPENED [Case #${disputeCaseId}]: Order #${currentOrder.id} escrow disbursement of $${currentOrder.totalAmount} has been FROZEN immediately. Provider payout to ${currentOrder.sellerName} is blocked. Our Platform Trust & Safety team has alerted the provider and requested geolocated proof of delivery within 4 hours. Under BlueCode's 100% Escrow Guarantee, your funds are completely protected. I will personally manage this case until resolution.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, disputeMessage, escalationAgentReply]);
      setIsSubmittingDispute(false);
      setShowDisputeForm(false);
      setDisputeEvidence('');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#1E3E62] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 flex items-center justify-center border border-blue-500/30 text-sky-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  BlueCode 24/7 Customer Care & Provider Concierge
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300">
                Open marketplace facilitation · 24/7 bridging, dispute resolution & 100% escrow protection
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

        {/* Platform Clarification Banner */}
        <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span>
              <strong>Platform Notice:</strong> BlueCode is open for all providers to self-publish. BlueCode website owners do not sell their own services.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded whitespace-nowrap self-start sm:self-auto">
            20% Platform Fee · 80% Provider Payout
          </span>
        </div>

        {/* Order Selector Bar with Dispute Trigger */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 max-w-lg">
            <span className="text-slate-500 font-semibold whitespace-nowrap">Order:</span>
            <select
              value={selectedOrderId}
              onChange={(e) => {
                setSelectedOrderId(e.target.value);
                setShowDisputeForm(false);
              }}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 truncate"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  Order #{b.id} · {b.listingTitle} (Provider: {b.sellerName}) {b.status === 'disputed' ? '— ⚠️ IN DISPUTE' : ''}
                </option>
              ))}
              <option value="general">General Support / Pre-Booking Inquiries</option>
            </select>
          </div>

          {currentOrder && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Escrow: ${currentOrder.totalAmount}
              </span>

              {isOrderDisputed ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-300 animate-pulse">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Case #{currentOrder.disputeDetails?.caseId} in Dispute</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDisputeForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  title="Contest service delivery and freeze escrow funds"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Escalate to Dispute</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dispute Escalation Form Modal/Drawer (Overlay) */}
        {showDisputeForm && currentOrder && (
          <div className="p-5 bg-rose-50/90 border-b border-rose-200 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-rose-950">
                    Escalate Order #{currentOrder.id} to Dispute Status
                  </h3>
                  <p className="text-[11px] text-rose-800">
                    Contest service delivery with {currentOrder.sellerName} · Freeze escrow and alert platform senior support
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDisputeForm(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-3.5 text-xs bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Reason Selection */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Primary Reason for Contesting Service:
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium text-xs focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Service delivery never performed / Provider no-show">
                      Service delivery never performed / Provider no-show
                    </option>
                    <option value="Equipment arrived damaged, inoperable, or missing components">
                      Equipment arrived damaged, inoperable, or missing components
                    </option>
                    <option value="Severe delay (>3 hrs) resulting in shoot/project cancellation">
                      Severe delay (&gt;3 hrs) resulting in shoot/project cancellation
                    </option>
                    <option value="Provider uncontactable after taking booking confirmation">
                      Provider uncontactable after taking booking confirmation
                    </option>
                    <option value="Service delivered substantially contradicts listing specifications">
                      Service delivered substantially contradicts listing specifications
                    </option>
                    <option value="Unauthorized off-platform payment demand or extortion">
                      Unauthorized off-platform payment demand or extortion
                    </option>
                  </select>
                </div>

                {/* Desired Resolution */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Requested Resolution:
                  </label>
                  <select
                    value={disputeResolution}
                    onChange={(e) => setDisputeResolution(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium text-xs focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="full_refund">
                      100% Instant Escrow Refund (${currentOrder.totalAmount})
                    </option>
                    <option value="replacement">
                      Emergency Replacement Provider / Gear Dispatch
                    </option>
                    <option value="mediation">
                      Formal BlueCode Mediation & Arbitration
                    </option>
                  </select>
                </div>
              </div>

              {/* Evidence / Description */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Incident Evidence & Timeline Details:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail what went wrong, time of scheduled arrival vs no-show, attempts to call the provider, or links to photos/videos of damaged gear..."
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Escrow Lock Terms */}
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-3.5 h-3.5 text-rose-700" />
                  <span>Immediate Escrow Freeze Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Upon submission, 100% of order funds (${currentOrder.totalAmount}) are locked. BlueCode will pause provider payout, notify {currentOrder.sellerName}, and require verified proof of service delivery within 4 hours. You are fully protected under our 100% Escrow Guarantee.
                </p>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={disputeAgreed}
                  onChange={(e) => setDisputeAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px] leading-tight">
                  I confirm that service delivery is contested, and I request the BlueCode Platform Support Team to take immediate arbitration action.
                </span>
              </label>

              {/* Submit / Cancel Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDisputeForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!disputeAgreed || isSubmittingDispute}
                  className={`px-4 py-2 rounded-lg font-bold text-xs text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    disputeAgreed && !isSubmittingDispute
                      ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{isSubmittingDispute ? 'Freezing Escrow & Notifying Support...' : 'Freeze Escrow & File Official Dispute'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Dispute Information Card (If currently in dispute) */}
        {isOrderDisputed && currentOrder && (
          <div className="px-6 py-3 bg-gradient-to-r from-rose-900 to-amber-950 text-white text-xs border-b border-rose-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-rose-500 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                  Case #{currentOrder.disputeDetails?.caseId || 'DSP-84920'}
                </span>
                <span className="font-bold text-rose-200">
                  ⚠️ Status: In Dispute (Escrow Frozen: ${currentOrder.totalAmount})
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                <strong>Reason:</strong> {currentOrder.disputeDetails?.reason || 'Service delivery contested by customer.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>Investigator: {currentOrder.disputeDetails?.assignedAgent || 'David V. (Trust & Safety)'}</span>
                <span>·</span>
                <span>Filed: {currentOrder.disputeDetails?.disputedAt || 'Today'}</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">100% Escrow Protected</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  `[DISPUTE STATUS INQUIRY] Case #${currentOrder.disputeDetails?.caseId || 'DSP-84920'}: Please provide the latest update on evidence verification with ${currentOrder.sellerName}.`
                )
              }
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Request Dispute Update</span>
            </button>
          </div>
        )}

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            const isConcierge = msg.sender === 'support_concierge';
            const isDisputeNotice = msg.text.includes('OFFICIAL DISPUTE FILED') || msg.text.includes('DISPUTE CASE OPENED');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[88%] ${
                  isMe ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-1">
                  {isDisputeNotice && <AlertOctagon className="w-3 h-3 text-rose-600" />}
                  <span>{msg.senderName} · {msg.timestamp}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isDisputeNotice
                      ? isMe
                        ? 'bg-rose-700 text-white rounded-tr-none border border-rose-600'
                        : 'bg-rose-50 text-rose-950 border border-rose-300 rounded-tl-none font-medium'
                      : isMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isConcierge
                      ? 'bg-white text-slate-800 border border-blue-200 rounded-tl-none ring-1 ring-blue-100'
                      : 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>BlueCode Platform Investigator is reviewing case files...</span>
            </div>
          )}
        </div>

        {/* Quick Action Assistance Chips */}
        <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-mono self-center mr-1">Quick Actions:</span>

          {currentOrder && !isOrderDisputed && (
            <button
              type="button"
              onClick={() => setShowDisputeForm(true)}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <AlertOctagon className="w-3 h-3 text-rose-600" />
              <span>Escalate to Dispute</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              handleQuickAction(
                `Can BlueCode Customer Care contact ${currentOrder ? currentOrder.sellerName : 'the provider'} to confirm pickup schedule?`
              )
            }
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-blue-600" />
            <span>Connect with Provider</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickAction(
                `The provider hub has not responded to my message. Please escalate and bridge connection immediately.`
              )
            }
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Provider Unresponsive - Escalate</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickAction(
                `Please explain how the 20% platform fee and escrow protection work on my order.`
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-slate-500" />
            <span>Explain 20% Fee & Escrow</span>
          </button>
        </div>

        {/* Chat input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              isOrderDisputed
                ? "Type message or additional case evidence to Senior Investigator..."
                : "Type your message to BlueCode Concierge Support..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
