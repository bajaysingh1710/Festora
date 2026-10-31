import React, { useState } from 'react';
import { Palette, Copy, Building, Home, CheckCircle2 } from 'lucide-react';
import { ThemeConcept } from '../../../types';

interface ThemeSelectorCardsProps {
  themes: ThemeConcept[];
  activeThemeId: string;
  onApplyTheme: (themeId: string) => void;
  onCopyColorToast: (msg: string) => void;
}

export const ThemeSelectorCards: React.FC<ThemeSelectorCardsProps> = ({
  themes,
  activeThemeId,
  onApplyTheme,
  onCopyColorToast,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(activeThemeId);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const currentTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const isApplied = activeThemeId === currentTheme.id;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    onCopyColorToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  return (
    <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE5E1]">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#49372D] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#C96F4A]" />
            <span>Theme & Color Identity Framework</span>
          </h2>
          <p className="text-xs text-[#6E5548] mt-0.5">
            Select a tailored palette to ground lighting, floral arrangements, print stationery, and staging.
          </p>
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedThemeId(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedThemeId === t.id
                  ? 'bg-[#49372D] text-white shadow-sm'
                  : 'bg-[#FAF0EB] text-[#49372D] hover:bg-[#F5D1BD]'
              }`}
            >
              {t.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Theme Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-[#49372D]">{currentTheme.title}</h3>
            {isApplied && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Event Theme</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#6E5548] mt-1 max-w-2xl">{currentTheme.description}</p>
        </div>

        <div>
          {!isApplied && (
            <button
              onClick={() => onApplyTheme(currentTheme.id)}
              className="px-5 py-2.5 rounded-xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] transition-all whitespace-nowrap"
            >
              Apply Theme to Celebration
            </button>
          )}
        </div>
      </div>

      {/* Color Palette Matrix with One-Click Hex Copy */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6E5548] flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#C96F4A]" />
            <span>Curated Celebration Color Palette</span>
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

      {/* Venue-Specific Execution Briefs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#EAE5E1]">
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
    </div>
  );
};

