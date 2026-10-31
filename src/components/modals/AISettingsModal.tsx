import React, { useState } from 'react';
import {
  X,
  Bot,
  Key,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const AISettingsModal: React.FC = () => {
  const {
    aiSettings,
    updateAISettings,
    isAISettingsOpen,
    setIsAISettingsOpen,
  } = useEvent();

  const [apiKey, setApiKey] = useState(aiSettings.apiKey || '');
  const [model, setModel] = useState(aiSettings.model || 'gemini-2.0-flash');

  if (!isAISettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAISettings({
      apiKey: apiKey.trim(),
      model,
    });
    setIsAISettingsOpen(false);
  };

  const isConfigured = apiKey.trim().length > 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-festive border border-[#F5D1BD] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FAF0EB] to-white border-b border-[#F5D1BD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C96F4A] text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-[#FFF8EF]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#49372D]">AI Copilot Engine Settings</h2>
              <p className="text-xs text-[#6E5548]">Configure Google Gemini model credentials</p>
            </div>
          </div>
          <button
            onClick={() => setIsAISettingsOpen(false)}
            className="p-2 rounded-full text-[#6E5548] hover:bg-[#FAF0EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              isConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 shrink-0 ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`} />
            <div>
              <p className="font-bold">
                {isConfigured ? 'Gemini 2.0 Flash Connected' : 'Autonomous Local Engine Active'}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                {isConfigured
                  ? 'Copilot calls are routed directly to Google GenAI with multimodal reasoning.'
                  : 'Festora works 100% out-of-the-box using its built-in heuristic event planner. Supplying your personal Gemini API key upgrades Copilot to Google\'s live foundation model.'}
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-[#C96F4A]" />
                <span>Google Gemini API Key</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#C96F4A] hover:underline flex items-center gap-0.5"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE5E1] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30 focus:border-[#C96F4A]"
            />
            <p className="text-[11px] text-[#6E5548] mt-1">
              Keys are stored strictly on your local device. Never sent to any third party.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5">
              Gemini Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended — Fastest & Best Reasoning)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#EAE5E1] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAISettingsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#EAE5E1] text-xs font-semibold text-[#6E5548] hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F]"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

