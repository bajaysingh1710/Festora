import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  Info,
  Layers,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getCopilotResponse } from '../../services/copilotService';
import { CopilotMessage, CopilotProposal } from '../../types';

export const CopilotModule: React.FC = () => {
  const {
    event,
    guests,
    budgetCategories,
    themes,
    tasks,
    activeTheme,
    applyCopilotProposal,
    showToast,
  } = useEvent();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'copilot',
      text: `Hello! I am your **Festora Event Copilot**, fully synchronized with **"${event.title}"**.\n\nI can analyze your budget across all 7 categories, evaluate catering capacity against confirmed RSVPs, compare venue alternatives, or simulate cost-saving levers.\n\n*Important Safety Rule: Any change I propose will always be presented as an explicit proposal card for your review and one-click approval.*`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'How can we save ₹50,000 on this celebration?',
    'Is our catering plate buffer sufficient for RSVP trends?',
    'Compare home courtyard vs banquet hall costs',
    'Summarize current event health & critical tasks',
    'Suggest theme recommendations for our venue',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await getCopilotResponse(textToSend, {
        event,
        guests,
        budgetCategories,
        themes,
        tasks,
      });

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'copilot',
          text: 'I ran into a temporary hiccup evaluating that request. Please try asking in a different way.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyProposal = (proposal: CopilotProposal) => {
    applyCopilotProposal(proposal);

    // Update proposal status in message thread
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.proposal?.id === proposal.id) {
          return {
            ...msg,
            proposal: { ...msg.proposal, status: 'applied' },
          };
        }
        return msg;
      })
    );
  };

  const handleRejectProposal = (proposal: CopilotProposal) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.proposal?.id === proposal.id) {
          return {
            ...msg,
            proposal: { ...msg.proposal, status: 'rejected' },
          };
        }
        return msg;
      })
    );
    showToast(`Dismissed proposal "${proposal.title}"`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF9ED] text-[#D9A948] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Module E</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            AI Event Copilot
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Context-grounded assistant with explicit review-and-apply approvals. Never overwrites event data blindly.
          </p>
        </div>

        {/* Live Context Grounding Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Grounded in {event.targetGuestCount} guests · ₹{Math.round(event.targetBudget / 1000)}k budget</span>
        </div>
      </div>

      {/* Main Copilot Chat Interface */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] shadow-card overflow-hidden flex flex-col h-[650px]">
        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 scrollbar-thin">
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C96F4A] to-[#D9A948] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#C96F4A] text-white rounded-br-none shadow-sm'
                        : 'bg-[#FAF0EB]/60 text-[#49372D] border border-[#F5D1BD]/80 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {message.text}
                    </div>

                    <div
                      className={`text-[10px] mt-2 font-mono ${
                        isUser ? 'text-white/80 text-right' : 'text-[#6E5548]'
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>

                  {/* Structured Change Proposal Card (Explicit Approval Flow) */}
                  {message.proposal && (
                    <div className="rounded-2xl bg-white border-2 border-[#C96F4A]/40 p-5 shadow-festive space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EAE5E1]">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center text-xs font-bold">
                            ✨
                          </span>
                          <span className="font-serif font-bold text-base text-[#49372D]">
                            {message.proposal.title}
                          </span>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            message.proposal.status === 'applied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : message.proposal.status === 'rejected'
                              ? 'bg-stone-100 text-stone-600'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {message.proposal.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#6E5548]">
                        {message.proposal.summary}
                      </p>

                      {/* Before / After Diff Table */}
                      <div className="rounded-xl bg-[#FAF0EB]/40 border border-[#F5D1BD] p-3 space-y-1.5 text-xs">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-[#6E5548] block">
                          Proposed Changes:
                        </span>
                        {message.proposal.changes.map((ch, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2">
                            <span className="font-medium text-[#49372D]">{ch.label}:</span>
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="line-through text-stone-400">{ch.from}</span>
                              <ArrowRight className="w-3 h-3 text-[#C96F4A]" />
                              <span className="font-bold text-[#C96F4A]">{ch.to}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Consequences & Impact */}
                      <div className="text-xs text-[#6E5548] space-y-1">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-[#6E5548] block">
                          Expected Consequences:
                        </span>
                        {message.proposal.consequences.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#C96F4A] font-bold">•</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons (Apply / Reject) */}
                      {message.proposal.status === 'pending' ? (
                        <div className="pt-2 flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleRejectProposal(message.proposal!)}
                            className="px-3.5 py-1.5 rounded-xl border border-[#EAE5E1] text-[#6E5548] text-xs font-semibold hover:bg-stone-50"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleApplyProposal(message.proposal!)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Apply to Event</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 text-right">
                          <span className="text-xs font-medium text-[#6E5548]">
                            {message.proposal.status === 'applied'
                              ? '✓ Applied to live event state'
                              : '✕ Proposal was rejected'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-[#49372D] text-white flex items-center justify-center shrink-0 shadow-sm mt-1 text-xs font-bold">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-[#6E5548] animate-pulse">
              <Bot className="w-5 h-5 text-[#C96F4A]" />
              <span>Analyzing live event parameters & calculating trade-offs...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-[#FAF0EB]/50 border-t border-[#EAE5E1] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[#6E5548] font-semibold shrink-0">Try asking:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-3 py-1 rounded-full bg-white border border-[#F5D1BD] text-[#49372D] hover:border-[#C96F4A] hover:bg-white text-xs font-medium transition-all shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="p-4 bg-white border-t border-[#EAE5E1] flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Copilot about budgets, catering buffers, themes, or trade-offs..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-[#EAE5E1] text-sm text-[#49372D] placeholder:text-[#6E5548]/60 focus:outline-none focus:border-[#C96F4A] focus:ring-1 focus:ring-[#C96F4A]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-5 py-2.5 rounded-2xl bg-[#C96F4A] text-white font-semibold text-sm shadow-festive hover:bg-[#A8522F] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
