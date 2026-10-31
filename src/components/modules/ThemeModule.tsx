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
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Sliders,
  Send,
  Trash2,
  Bookmark,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ThemeConcept, DecorAreaId, DecorConceptItem } from '../../types';
import { DECOR_AREAS } from '../../services/imageGenService';

export const ThemeModule: React.FC = () => {
  const {
    event,
    themes,
    activeTheme,
    setActiveTheme,
    decorConcepts,
    venuePhotos,
    generateDecorConceptsForEvent,
    addVenuePhoto,
    deleteVenuePhoto,
    toggleDecorFavorite,
    applyDecorCostToBudget,
    showToast,
  } = useEvent();

  const [selectedThemeId, setSelectedThemeId] = useState<string>(event.activeThemeId);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [customPromptModification, setCustomPromptModification] = useState('');
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [previewConcept, setPreviewConcept] = useState<DecorConceptItem | null>(null);

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

  const handleTriggerImageGeneration = () => {
    setIsGeneratingImages(true);
    setTimeout(() => {
      generateDecorConceptsForEvent(customPromptModification);
      setIsGeneratingImages(false);
      setCustomPromptModification('');
    }, 700);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addVenuePhoto(file.name, reader.result, `User uploaded photo of ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredConcepts = decorConcepts.filter((c) => {
    if (selectedAreaFilter === 'all') return true;
    if (selectedAreaFilter === 'favorites') return c.isFavorite;
    return c.area === selectedAreaFilter;
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5D1BD]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Decoration Designer</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            Visual Venue & Decoration Designer
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Photorealistic AI-generated concepts across 8 venue zones, material estimations, and venue photograph references.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTriggerImageGeneration}
            disabled={isGeneratingImages}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] active:scale-95 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingImages ? 'animate-spin' : ''}`} />
            <span>{decorConcepts.length === 0 ? 'Generate 8 Visual Concepts' : 'Regenerate All Concepts'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Venue Photograph Upload Reference */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE5E1]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#49372D] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#C96F4A]" />
              <span>Venue Photograph Reference (Optional)</span>
            </h2>
            <p className="text-xs text-[#6E5548] mt-0.5">
              Upload photos of your real venue. Our AI grounds concepts in your actual architectural dimensions and materials.
            </p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#F5D1BD]/50 transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload Venue Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {venuePhotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {venuePhotos.map((photo) => (
              <div key={photo.id} className="relative rounded-2xl overflow-hidden border border-[#F5D1BD] group">
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => deleteVenuePhoto(photo.id)}
                    className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2 bg-white text-[11px] font-medium text-[#49372D] truncate">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 mt-2 text-xs text-[#6E5548] italic">
            No venue photos uploaded yet. You can still generate concepts grounded in "{event.venue.name}".
          </div>
        )}
      </div>

      {/* SECTION 2: AI Visual Decoration Concepts Gallery (The 8 Required Sections) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#49372D] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C96F4A]" />
              <span>Generated Decoration Concepts</span>
            </h2>
            <p className="text-xs text-[#6E5548]">
              Photorealistic AI visualizations for Entrance, Main Stage, Seating, Dining, Tables, Lighting, Outdoor & Complete Venue.
            </p>
          </div>

          {/* Area Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setSelectedAreaFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedAreaFilter === 'all'
                  ? 'bg-[#C96F4A] text-white'
                  : 'bg-white border border-[#EAE5E1] text-[#49372D]'
              }`}
            >
              All Zones ({decorConcepts.length})
            </button>
            <button
              onClick={() => setSelectedAreaFilter('favorites')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedAreaFilter === 'favorites'
                  ? 'bg-[#C96F4A] text-white'
                  : 'bg-white border border-[#EAE5E1] text-[#49372D]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Favorites</span>
            </button>
            {DECOR_AREAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAreaFilter(a.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedAreaFilter === a.id
                    ? 'bg-[#C96F4A] text-white'
                    : 'bg-white border border-[#EAE5E1] text-[#49372D]'
                }`}
              >
                {a.label.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Modification Bar */}
        <div className="rounded-2xl bg-[#FAF0EB]/60 border border-[#F5D1BD] p-3 flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            value={customPromptModification}
            onChange={(e) => setCustomPromptModification(e.target.value)}
            placeholder='e.g. "Make the entrance more luxurious but reduce decoration cost", "Add more marigolds"'
            className="flex-1 px-4 py-2 rounded-xl border border-[#EAE5E1] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
          />
          <button
            onClick={handleTriggerImageGeneration}
            disabled={isGeneratingImages || !customPromptModification.trim()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#C96F4A] text-white text-xs font-bold hover:bg-[#A8522F] disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Custom Design Direction</span>
          </button>
        </div>

        {/* Concepts Grid */}
        {decorConcepts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#EAE5E1] p-10 text-center shadow-card">
            <Sparkles className="w-12 h-12 text-[#C96F4A] mx-auto mb-3 animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-[#49372D]">Visual Design Studio Ready</h3>
            <p className="text-xs text-[#6E5548] max-w-md mx-auto mt-1 mb-5">
              Click below to generate high-resolution AI visual designs across all 8 celebration areas tailored to "{activeTheme.title}".
            </p>
            <button
              onClick={handleTriggerImageGeneration}
              disabled={isGeneratingImages}
              className="px-6 py-3 rounded-2xl bg-[#C96F4A] text-white font-bold text-sm shadow-festive hover:bg-[#A8522F]"
            >
              Generate 8 Visual Concepts Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredConcepts.map((concept) => (
              <div
                key={concept.id}
                className="rounded-3xl bg-white border border-[#EAE5E1] overflow-hidden shadow-card hover:shadow-festive transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden group">
                    <img
                      src={concept.imageUrl}
                      alt={concept.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                      {concept.area.replace('_', ' ')}
                    </div>
                    <button
                      onClick={() => toggleDecorFavorite(concept.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm transition-all"
                      title="Favorite concept"
                    >
                      <Heart
                        className={`w-4 h-4 ${concept.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#49372D] leading-snug">
                      {concept.title}
                    </h3>
                    <p className="text-xs text-[#6E5548] line-clamp-2">
                      {concept.description}
                    </p>

                    {/* Cost & Materials */}
                    <div className="pt-2 border-t border-[#EAE5E1] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6E5548]">Estimated Cost:</span>
                        <span className="font-bold text-[#C96F4A]">₹{concept.estimatedCost.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[11px] text-[#859675] font-medium mt-1 truncate">
                        Materials: {concept.materials.slice(0, 2).join(', ')}
                      </p>
                    </div>

                    {/* Affordable Alternative Lever */}
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-snug">
                      <span className="font-bold">Cost-Saving Tip: </span>
                      <span>{concept.affordableAlternative}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  {concept.selectedForBudget ? (
                    <span className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Budget</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => applyDecorCostToBudget(concept)}
                      className="w-full py-2 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#C96F4A] hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Link to Event Budget</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Curated Theme Palette & Styling Matrix */}
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

          <div className="shrink-0">
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
    </div>
  );
};
