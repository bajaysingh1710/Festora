import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Mic,
  MicOff,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getCopilotResponse } from '../../services/copilotService';
import { CopilotMessage, CopilotProposal, StructuredEventProposal } from '../../types';
import { StructuredProposalCard } from './copilot/StructuredProposalCard';
import { ActionDiffCard } from './copilot/ActionDiffCard';

export const CopilotModule: React.FC = () => {
  const {
    event,
    guests,
    budgetCategories,
    themes,
    tasks,
    copilotMessages,
    setCopilotMessages,
    applyCopilotProposal,
    applyStructuredProposalAsEvent,
    showToast,
  } = useEvent();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
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
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

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

      recognition.onresult = (e: { results: Array<Array<{ transcript: string }>> }) => {
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
      const response = await getCopilotResponse(textToSend.trim(), {
        event,
        guests,
        budgetCategories,
        themes,
        tasks,
        conversationHistory: [...copilotMessages, userMessage],
      });

      setCopilotMessages((prev) => [...prev, response]);
    } catch {
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'copilot',
          text: 'I encountered an unexpected issue connecting to the planning intelligence engine. Please try rephrasing your request.',
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
      prev.map((msg) =>
        msg.proposal?.id === proposal.id
          ? { ...msg, proposal: { ...msg.proposal, status: 'applied' } }
          : msg
      )
    );
  };

  const handleDismissProposal = (proposal: CopilotProposal) => {
    setCopilotMessages((prev) =>
      prev.map((msg) =>
        msg.proposal?.id === proposal.id
          ? { ...msg, proposal: { ...msg.proposal, status: 'rejected' } }
          : msg
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
                    <StructuredProposalCard
                      proposal={msg.structuredProposal}
                      onApprove={handleApproveStructuredProposal}
                    />
                  )}

                  {/* Contextual Action Modification Card */}
                  {msg.proposal && (
                    <ActionDiffCard
                      proposal={msg.proposal}
                      onApply={handleApplyProposal}
                      onDismiss={handleDismissProposal}
                    />
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
        <div className="p-4 bg-white border-t border-[#EAE5E1]">
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
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-[#FAF0EB] text-[#C96F4A] border-[#F5D1BD] hover:bg-[#F5D1BD]'
              }`}
              title={isListening ? 'Stop listening' : 'Speak to Copilot (Voice Recognition)'}
              aria-label="Toggle voice input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: 'Plan a wedding for 250 in Goa', 'Reduce decor cost', 'What if 40 more guests arrive?'..."
              disabled={isTyping}
              className="flex-1 px-4 py-3 rounded-2xl border border-[#EAE5E1] text-xs sm:text-sm text-[#49372D] focus:outline-none focus:border-[#C96F4A] focus:ring-1 focus:ring-[#C96F4A] disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-5 py-3 rounded-2xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
