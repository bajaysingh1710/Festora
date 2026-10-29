import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Building,
  Home,
  Check,
  CheckCircle2,
  Copy,
  Lightbulb,
  DollarSign,
  Layers,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ThemeConcept } from '../../types';

export const ThemeModule: React.FC = () => {
  const { event, themes, activeTheme, setActiveTheme, showToast } = useEvent();
  const [selectedThemeId, setSelectedThemeId] = useState<string>(event.activeThemeId);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const currentTheme = themes.find((t) => t.id === selectedThemeId) || activeTheme;
  const isApplied = event.activeThemeId === currentTheme.id;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  const handleApplyTheme = (themeId: string) => {
    setActiveTheme(themeId);
    setSelectedThemeId(themeId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2F6F0] text-[#859675] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Module C</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            AI Theme & Venue Decoration Designer
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Event-type aware visual concepts, curated palettes, and venue-specific decoration briefs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isApplied ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-sm shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Theme Applied to Event</span>
            </span>
          ) : (
            <button
              onClick={() => handleApplyTheme(currentTheme.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C96F4A] text-white font-semibold text-sm shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply "{currentTheme.title}" to Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Theme Cards Discovery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          const isActiveOnEvent = event.activeThemeId === theme.id;

          return (
            <div
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#C96F4A] shadow-festive ring-2 ring-[#C96F4A]/20'
                  : 'bg-white border-[#EAE5E1] hover:border-[#F5D1BD] shadow-card'
              }`}
            >
              <div>
                {/* Palette Color Swatches Preview */}
                <div className="flex items-center gap-1.5 mb-3.5">
                  {Object.values(theme.palette)
                    .slice(0, 5)
                    .map((color, idx) => {
                      if (typeof color !== 'string') return null;
                      return (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={theme.palette.names[idx] || color}
                        />
                      );
                    })}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#49372D] leading-snug">
                    {theme.title}
                  </h3>
                  {isActiveOnEvent && (
                    <span className="shrink-0 p-1 rounded-full bg-emerald-100 text-emerald-800" title="Active on event">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6E5548] mt-1.5 line-clamp-2">{theme.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs">
                <span className="capitalize font-semibold text-[#C96F4A]">{theme.costTier} Tier</span>
                <span className="text-[#6E5548]">{isSelected ? 'Viewing Brief ↓' : 'Inspect →'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Deep-Dive Concept Card */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#EAE5E1]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#49372D]">
                {currentTheme.title}
              </h2>
              {isApplied && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                  Active Celebration Styling
                </span>
              )}
            </div>
            <p className="text-base text-[#C96F4A] font-medium mt-1 font-serif italic">
              "{currentTheme.tagline}"
            </p>
            <p className="text-sm text-[#6E5548] mt-2 max-w-3xl leading-relaxed">
              {currentTheme.description}
            </p>

            {/* Vibe Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {currentTheme.vibeKeywords.map((vibe, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD]"
                >
                  #{vibe}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {!isApplied && (
              <button
                onClick={() => handleApplyTheme(currentTheme.id)}
                className="px-5 py-2.5 rounded-xl bg-[#C96F4A] text-white font-semibold text-sm shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
              >
                Set as Active Event Theme
              </button>
            )}
          </div>
        </div>

        {/* Color Palette Matrix with One-Click Hex Copy */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6E5548] flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#C96F4A]" />
              <span>Harmonious Celebration Color Palette</span>
            </h3>
            <span className="text-[11px] text-[#6E5548]">Click any chip to copy hex</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Primary Accent', color: currentTheme.palette.primary, name: currentTheme.palette.names[0] },
              { label: 'Secondary Tone', color: currentTheme.palette.secondary, name: currentTheme.palette.names[1] },
              { label: 'Highlight Glow', color: currentTheme.palette.accent, name: currentTheme.palette.names[2] },
              { label: 'Background Silk', color: currentTheme.palette.background, name: currentTheme.palette.names[3] },
              { label: 'Typography Umber', color: currentTheme.palette.text, name: currentTheme.palette.names[4] },
            ].map((chip, idx) => (
              <div
                key={idx}
                onClick={() => handleCopyColor(chip.color)}
                className="cursor-pointer group p-3 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD] hover:border-[#C96F4A] transition-all flex flex-col justify-between"
              >
                <div
                  className="w-full h-14 rounded-xl border border-black/10 shadow-sm relative flex items-center justify-center transition-transform group-hover:scale-102"
                  style={{ backgroundColor: chip.color }}
                >
                  {copiedHex === chip.color ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/80 text-white shadow">
                      Copied!
                    </span>
                  ) : (
                    <Copy className="w-4 h-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                  )}
                </div>
                <div className="mt-2.5">
                  <p className="text-[11px] text-[#6E5548] uppercase tracking-wider font-semibold">
                    {chip.label}
                  </p>
                  <p className="text-xs font-bold text-[#49372D] truncate mt-0.5">{chip.name}</p>
                  <p className="text-[11px] font-mono text-[#C96F4A] mt-0.5">{chip.color}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue-Specific Decoration Briefs: Function Hall vs Home Courtyard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#EAE5E1]">
          {/* Function Hall Brief */}
          <div className="rounded-2xl bg-[#FAF0EB]/50 border border-[#F5D1BD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-5 h-5 text-[#C96F4A]" />
              <h4 className="font-serif font-bold text-base text-[#49372D]">
                Function Hall & Ballroom Brief
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#6E5548] leading-relaxed">
              {currentTheme.venueBriefs.function_hall}
            </p>
          </div>

          {/* Home Courtyard Brief */}
          <div className="rounded-2xl bg-[#F2F6F0]/60 border border-[#A9B89A]/50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-[#859675]" />
              <h4 className="font-serif font-bold text-base text-[#49372D]">
                Home Courtyard & Terrace Brief
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#6E5548] leading-relaxed">
              {currentTheme.venueBriefs.home_courtyard}
            </p>
          </div>
        </div>

        {/* Core Decor Elements & Budget-Saving Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#EAE5E1]">
          {/* Key Decor Elements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C96F4A]" />
              <span>Recommended Decor Elements</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#49372D]">
              {currentTheme.decorElements.map((elem, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C96F4A] mt-2 shrink-0" />
                  <span>{elem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget-Saving Tips */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              <span>Cost-Optimization Levers (Keep the Vibe, Save Money)</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
              {currentTheme.costSavingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold shrink-0">₹</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
