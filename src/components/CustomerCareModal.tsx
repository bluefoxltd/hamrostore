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
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SupportMessage } from '../types';

export const CustomerCareModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    bookings,
    showToast,
  } = useMarketplace();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    return bookings.length > 0 ? bookings[0].id : 'general';
  });

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
      text: 'How can our customer care team assist your connection with your provider today?',
      timestamp: '10:03 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (activeModal !== 'customer_care') return null;

  const currentOrder = bookings.find((b) => b.id === selectedOrderId);

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

      if (lower.includes('unresponsive') || lower.includes('not answering') || lower.includes('late')) {
        replyText = `We are stepping in immediately! As part of BlueCode's 20% platform concierge guarantee, we have pinged ${currentOrder ? currentOrder.sellerName : 'the provider'} via direct priority phone dispatch. If they do not acknowledge within 15 minutes, your 100% escrow balance and security deposit will be instantly returned. You are completely safe with us.`;
      } else if (lower.includes('refund') || lower.includes('cancel')) {
        replyText = `Your payment is currently held in BlueCode Escrow and has NOT been transferred to the provider. We can process an immediate 100% refund of your booking and deposit upon your confirmation.`;
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
          senderName: 'Sarah K. (BlueCode Concierge Care)',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
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
                Open marketplace facilitation · We connect you with any provider hub with 100% escrow protection
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

        {/* Order Selector */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-semibold whitespace-nowrap">Order / Provider Hub:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 max-w-md truncate"
          >
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                Order #{b.id} · {b.listingTitle} (Provider: {b.sellerName})
              </option>
            ))}
            <option value="general">General Support / Pre-Booking Inquiries</option>
          </select>

          {currentOrder && (
            <span className="hidden sm:inline text-[11px] text-emerald-700 font-mono font-bold">
              Escrow Active: ${currentOrder.totalAmount}
            </span>
          )}
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            const isConcierge = msg.sender === 'support_concierge';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                  isMe ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono mb-1">
                  {msg.senderName} · {msg.timestamp}
                </span>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isConcierge
                      ? 'bg-white text-slate-800 border border-blue-200 rounded-tl-none ring-1 ring-blue-100'
                      : 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>BlueCode Concierge Agent is typing response...</span>
            </div>
          )}
        </div>

        {/* Quick Action Assistance Chips */}
        <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-mono self-center mr-1">Quick Care Actions:</span>
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
            placeholder="Type your message to BlueCode Concierge Support..."
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
