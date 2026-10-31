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
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Building,
  Users,
  Wallet,
  UtensilsCrossed,
  Palette,
  Gift,
  Clock,
  ListTodo,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getCopilotResponse } from '../../services/copilotService';
import { CopilotMessage, CopilotProposal, StructuredEventProposal } from '../../types';

export const CopilotModule: React.FC = () => {
  const {
    event,
    guests,
    budgetCategories,
    themes,
    tasks,
    activeTheme,
    copilotMessages,
    setCopilotMessages,
    applyCopilotProposal,
    applyStructuredProposalAsEvent,
    showToast,
  } = useEvent();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message if empty
  useEffect(() => {
    if (copilotMessages.length === 0) {
      setCopilotMessages([
        {
          id: 'welcome-msg',
          sender: 'copilot',
          text: `Hello! I am your **Festora AI Event Copilot**, the intelligence core of your celebration.\n\n` +
            `Tell me what you'd like to plan in natural language — for example:\n` +
            `• *"Plan a 21st birthday party for 150 people with live games & DJ"*\n` +
            `• *"Plan an outdoor college cultural fest for 500 students in Bengaluru"*\n` +
            `• *"How can we save ₹50,000 on our celebration?"*\n` +
            `• *"What if 30 more guests arrive?"*\n\n` +
            `I will ask only relevant follow-up questions, generate a structured **12-Section Event Proposal**, and when you approve it, I will automatically populate your budget, tasks, and decoration workspace!`,
          timestamp: 'Just now',
          suggestedQuestions: [
            'Plan a birthday party for 200 people',
            'Plan an outdoor college cultural fest for 500 students',
            'How can we save ₹50,000 on this celebration?',
            'What if 30 more guests arrive?',
            'Make it more luxurious',
          ],
        },
      ]);
    }
  }, [copilotMessages.length, setCopilotMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages, isTyping]);

  // Voice recognition support via Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser.', 'warning');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your celebration request', 'info');
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCopilotMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await getCopilotResponse(textToSend, {
        event,
        guests,
        budgetCategories,
        themes,
        tasks,
        conversationHistory: [...copilotMessages, userMessage],
      });

      setCopilotMessages((prev) => [...prev, response]);

      if (response.structuredProposal) {
        setExpandedProposalId(response.structuredProposal.id);
      }
    } catch (err) {
      console.error(err);
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'copilot',
          text: 'I ran into a temporary hiccup evaluating that request. Please try asking in another way.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyProposal = (proposal: CopilotProposal) => {
    applyCopilotProposal(proposal);
    setCopilotMessages((prev) =>
      prev.map((m) =>
        m.proposal?.id === proposal.id
          ? { ...m, proposal: { ...proposal, status: 'applied' } }
          : m
      )
    );
  };

  const handleDismissProposal = (proposal: CopilotProposal) => {
    setCopilotMessages((prev) =>
      prev.map((m) =>
        m.proposal?.id === proposal.id
          ? { ...m, proposal: { ...proposal, status: 'rejected' } }
          : m
      )
    );
    showToast('Proposal dismissed', 'info');
  };

  const handleApproveStructuredProposal = (proposal: StructuredEventProposal) => {
    applyStructuredProposalAsEvent(proposal);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5D1BD]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Planning Brain</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            Festora Event Copilot
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Describe your celebration, receive comprehensive 12-section plans, and convert proposals into live workspace data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-white border border-[#EAE5E1] text-xs font-semibold text-[#49372D] flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active: {event.title}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] shadow-card flex flex-col h-[700px] max-h-[80vh] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {copilotMessages.map((msg) => {
            const isCopilot = msg.sender === 'copilot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isCopilot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isCopilot && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C96F4A] to-[#D9A948] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className={`space-y-3 max-w-[88%] sm:max-w-[78%] ${!isCopilot ? 'text-right' : ''}`}>
                  {/* Bubble */}
                  <div
                    className={`inline-block p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed text-left whitespace-pre-wrap ${
                      isCopilot
                        ? 'bg-[#FFF8EF] text-[#49372D] border border-[#F5D1BD]'
                        : 'bg-[#C96F4A] text-white shadow-festive font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] hover:bg-[#F5D1BD]/50 transition-all text-left"
                        >
                          {q} →
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Structured 12-Section Event Proposal Card */}
                  {msg.structuredProposal && (
                    <div className="mt-4 rounded-3xl border border-[#C96F4A] bg-white overflow-hidden shadow-festive text-left">
                      {/* Proposal Header Banner */}
                      <div className="bg-gradient-to-r from-[#FAF0EB] via-[#FFF8EF] to-white p-5 border-b border-[#F5D1BD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C96F4A] text-white">
                              12-Section Master Proposal
                            </span>
                            <span className="text-xs font-semibold text-[#859675]">
                              {msg.structuredProposal.city} · {msg.structuredProposal.guestCount} Guests
                            </span>
                          </div>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#49372D] mt-1">
                            {msg.structuredProposal.title}
                          </h3>
                          <p className="text-xs text-[#6E5548] mt-0.5">
                            Target Budget: <span className="font-bold text-[#C96F4A]">₹{msg.structuredProposal.targetBudget.toLocaleString('en-IN')}</span> (≈ ₹{Math.round(msg.structuredProposal.targetBudget / msg.structuredProposal.guestCount)}/guest)
                          </p>
                        </div>

                        <button
                          onClick={() => handleApproveStructuredProposal(msg.structuredProposal!)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all shrink-0"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Initialize Event</span>
                        </button>
                      </div>

                      {/* Proposal Core Details */}
                      <div className="p-5 space-y-4 text-xs">
                        {/* Section 1 & 2: Overview & Requirements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#C96F4A]" />
                              <span>1. Event Overview & Vision</span>
                            </h4>
                            <p className="text-[#49372D] leading-relaxed">{msg.structuredProposal.overview}</p>
                          </div>

                          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <FileCheck className="w-3.5 h-3.5 text-[#C96F4A]" />
                              <span>2. Key Requirements</span>
                            </h4>
                            <ul className="space-y-1 text-[#49372D]">
                              {msg.structuredProposal.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-[#C96F4A] font-bold">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Section 3 & 4: Venue & Guest Planning */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-[#C96F4A]" />
                              <span>3. Venue Layout Concept</span>
                            </h4>
                            <p className="font-semibold text-[#49372D] capitalize">
                              Recommended: {msg.structuredProposal.venueArrangements.recommendedType.replace('_', ' ')}
                            </p>
                            <p className="text-[#6E5548] mt-1 leading-relaxed">
                              {msg.structuredProposal.venueArrangements.layoutConcept}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#C96F4A]" />
                              <span>4. Attendance & Table Logistics</span>
                            </h4>
                            <p className="text-[#49372D]">
                              Estimated Parties: <span className="font-bold">{msg.structuredProposal.guestPlanning.estimatedParties}</span>
                            </p>
                            <p className="text-[#6E5548] mt-1 leading-relaxed">
                              {msg.structuredProposal.guestPlanning.tableArrangements}
                            </p>
                          </div>
                        </div>

                        {/* Section 5: Budget Breakdown Matrix */}
                        <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                          <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-3 flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5 text-[#D9A948]" />
                            <span>5. Transparent Budget Breakdown (Estimated with Assumptions)</span>
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {msg.structuredProposal.budgetBreakdown.map((b, idx) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-[#FFF8EF] border border-[#F5D1BD]">
                                <p className="text-[10px] text-[#6E5548] uppercase font-bold truncate">{b.categoryName}</p>
                                <p className="text-sm font-bold text-[#49372D] mt-0.5">₹{b.amount.toLocaleString('en-IN')}</p>
                                <p className="text-[10px] text-[#C96F4A]">{b.percentage}% of budget</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 6 & 7: Catering & Decor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <UtensilsCrossed className="w-3.5 h-3.5 text-[#F2C66D]" />
                              <span>6. Catering Recommendations</span>
                            </h4>
                            <p className="font-semibold text-[#49372D]">{msg.structuredProposal.cateringRecommendations.mealType}</p>
                            <ul className="space-y-1 text-[#6E5548] mt-2">
                              {msg.structuredProposal.cateringRecommendations.recommendedMenu.map((m, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span>•</span>
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 text-[11px] text-[#C96F4A] font-semibold">
                              Includes {msg.structuredProposal.cateringRecommendations.plateBuffer} buffer plates
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <Palette className="w-3.5 h-3.5 text-[#A9B89A]" />
                              <span>7. Decoration & Theme Concepts</span>
                            </h4>
                            <p className="font-semibold text-[#49372D]">{msg.structuredProposal.decorConcepts.themeTitle}</p>
                            <div className="flex flex-wrap gap-1.5 my-2">
                              {msg.structuredProposal.decorConcepts.palette.map((color, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-[#EAE5E1] font-medium text-[#49372D]">
                                  {color}
                                </span>
                              ))}
                            </div>
                            <p className="text-[11px] text-[#6E5548]">{msg.structuredProposal.decorConcepts.lightingVibe}</p>
                          </div>
                        </div>

                        {/* Section 8 & 9: Gifts & Entertainment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {msg.structuredProposal.returnGiftRecommendations && (
                            <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                              <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                                <Gift className="w-3.5 h-3.5 text-[#C96F4A]" />
                                <span>8. Return Gift Hampers</span>
                              </h4>
                              <p className="text-[#49372D]">{msg.structuredProposal.returnGiftRecommendations.description}</p>
                              <p className="text-[11px] text-[#6E5548] mt-1">
                                Est. {msg.structuredProposal.returnGiftRecommendations.recommendedQuantity} hampers @ ₹{msg.structuredProposal.returnGiftRecommendations.perUnitEstimate}/unit
                              </p>
                            </div>
                          )}

                          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#D9A948]" />
                              <span>9. Entertainment Planning</span>
                            </h4>
                            <ul className="space-y-1 text-[#49372D]">
                              {msg.structuredProposal.entertainmentRecommendations.map((ent, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span>•</span>
                                  <span>{ent}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Section 10 & 11: Timeline & Important Tasks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#C96F4A]" />
                              <span>10. Execution Timeline</span>
                            </h4>
                            <div className="space-y-2">
                              {msg.structuredProposal.timeline.map((tl, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="font-bold text-[#C96F4A] shrink-0 text-[11px]">{tl.timeframe}:</span>
                                  <span className="text-[#49372D] text-[11px]">{tl.milestone}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
                            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
                              <ListTodo className="w-3.5 h-3.5 text-[#859675]" />
                              <span>11. Milestone Tasks</span>
                            </h4>
                            <div className="space-y-1.5">
                              {msg.structuredProposal.importantTasks.map((t, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#49372D] truncate">{t.title}</span>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-amber-100 text-amber-800">
                                    {t.priority}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Section 12: Risks & Contingencies */}
                        <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200">
                          <h4 className="font-bold uppercase tracking-wider text-red-900 text-[11px] mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                            <span>12. Risks & Contingency Suggestions</span>
                          </h4>
                          <div className="space-y-2">
                            {msg.structuredProposal.risksAndContingencies.map((rc, idx) => (
                              <div key={idx} className="text-[11px]">
                                <span className="font-bold text-red-900">{rc.risk}: </span>
                                <span className="text-red-800">{rc.mitigation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Bar */}
                      <div className="p-4 bg-[#FAF0EB]/60 border-t border-[#F5D1BD] flex items-center justify-between">
                        <span className="text-[11px] text-[#6E5548]">
                          Approving converts this into an isolated database event, budget, tasks & styling.
                        </span>
                        <button
                          onClick={() => handleApproveStructuredProposal(msg.structuredProposal!)}
                          className="px-6 py-2.5 rounded-xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
                        >
                          Approve Plan & Open Workspace →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Standard Action Proposal Card (Diff & Approval) */}
                  {msg.proposal && (
                    <div className="mt-3 rounded-2xl border border-[#C96F4A] bg-white p-4 shadow-sm text-left">
                      <div className="flex items-center justify-between border-b border-[#EAE5E1] pb-2 mb-3">
                        <span className="text-xs font-bold text-[#49372D] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#C96F4A]" />
                          <span>Action Proposal: {msg.proposal.title}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            msg.proposal.status === 'applied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : msg.proposal.status === 'rejected'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {msg.proposal.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#6E5548] mb-3">{msg.proposal.summary}</p>

                      {/* Diffs */}
                      <div className="space-y-1.5 mb-3 bg-[#FFF8EF] p-2.5 rounded-xl text-xs">
                        {msg.proposal.changes.map((ch, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#6E5548]">{ch.label}:</span>
                            <span className="font-bold text-[#49372D]">
                              {ch.from} → <span className="text-[#C96F4A]">{ch.to}</span>
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Consequences */}
                      <div className="space-y-1 mb-4 text-[11px] text-[#6E5548]">
                        {msg.proposal.consequences.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-1">
                            <span className="text-[#C96F4A] font-bold">•</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      {msg.proposal.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE5E1]">
                          <button
                            onClick={() => handleDismissProposal(msg.proposal!)}
                            className="px-3 py-1.5 rounded-lg border border-[#EAE5E1] text-xs font-semibold text-[#6E5548] hover:bg-gray-50"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleApplyProposal(msg.proposal!)}
                            className="px-4 py-1.5 rounded-lg bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F]"
                          >
                            Apply to Event
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-[#A0887A]">{msg.timestamp}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C96F4A] to-[#D9A948] text-white flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 animate-spin text-white" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD] text-xs font-semibold text-[#C96F4A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C96F4A] animate-ping" />
                <span>Copilot is reasoning and synthesizing celebration data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#FAF0EB]/60 border-t border-[#F5D1BD]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-white border-[#EAE5E1] text-[#6E5548] hover:text-[#C96F4A]'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Tell Copilot what to plan, ask questions, or adjust parameters..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-[#EAE5E1] text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30 focus:border-[#C96F4A]"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-[#C96F4A] text-white text-xs sm:text-sm font-bold shadow-festive hover:bg-[#A8522F] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
