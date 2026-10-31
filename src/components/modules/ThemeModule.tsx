import React, { useState } from 'react';
import {
  Sparkles,
  Scale,
  RefreshCw,
  Image as ImageIcon,
  Heart,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { DecorConceptItem } from '../../types';
import { DECOR_AREAS } from '../../services/imageGenService';
import { VenuePhotoUploader } from './theme/VenuePhotoUploader';
import { DecorConceptCard } from './theme/DecorConceptCard';
import { DecorCompareModal } from './theme/DecorCompareModal';
import { DecorPreviewModal } from './theme/DecorPreviewModal';
import { ThemeSelectorCards } from './theme/ThemeSelectorCards';

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

  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [customPromptModification, setCustomPromptModification] = useState('');
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [previewConcept, setPreviewConcept] = useState<DecorConceptItem | null>(null);

  // Comparison State
  const [isComparing, setIsComparing] = useState(false);
  const [compareIdA, setCompareIdA] = useState<string>('');
  const [compareIdB, setCompareIdB] = useState<string>('');

  const handleTriggerImageGeneration = () => {
    setIsGeneratingImages(true);
    setTimeout(() => {
      generateDecorConceptsForEvent(customPromptModification);
      setIsGeneratingImages(false);
      setCustomPromptModification('');
    }, 700);
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
            Visual Venue &amp; Decoration Designer
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Photorealistic AI-generated visual decor concepts across 8 distinct zones, linked directly to your budget.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {decorConcepts.length >= 2 && (
            <button
              onClick={() => {
                setCompareIdA(decorConcepts[0].id);
                setCompareIdB(decorConcepts[1].id);
                setIsComparing(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#EAE5E1] text-[#49372D] font-bold text-xs hover:bg-[#FAF0EB] shadow-sm transition-all"
            >
              <Scale className="w-4 h-4 text-[#C96F4A]" />
              <span>Compare Designs</span>
            </button>
          )}

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
      <VenuePhotoUploader
        venuePhotos={venuePhotos}
        venueName={event.venue.name}
        onAddPhoto={addVenuePhoto}
        onDeletePhoto={deleteVenuePhoto}
        onErrorToast={(msg) => showToast(msg, 'warning')}
      />

      {/* SECTION 2: AI Visual Decoration Concepts Gallery */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#49372D] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C96F4A]" />
              <span>Generated Decoration Concepts</span>
            </h2>
            <p className="text-xs text-[#6E5548]">
              Photorealistic AI visualizations for Entrance, Main Stage, Seating, Dining, Tables, Lighting, Outdoor &amp; Complete Venue.
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
              Click below to generate high-resolution AI visual designs across all 8 celebration areas tailored to &quot;{activeTheme.title}&quot;.
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
              <DecorConceptCard
                key={concept.id}
                concept={concept}
                onPreview={setPreviewConcept}
                onToggleFavorite={toggleDecorFavorite}
                onApplyToBudget={applyDecorCostToBudget}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Theme & Color Identity Framework */}
      <ThemeSelectorCards
        themes={themes}
        activeThemeId={event.activeThemeId}
        onApplyTheme={(id) => {
          setActiveTheme(id);
          showToast('Theme applied to celebration!');
        }}
        onCopyColorToast={showToast}
      />

      {/* MODAL: Concept Inspection & High-Res View */}
      <DecorPreviewModal
        concept={previewConcept}
        onClose={() => setPreviewConcept(null)}
        onApplyToBudget={applyDecorCostToBudget}
      />

      {/* MODAL: Design Comparison View */}
      <DecorCompareModal
        isOpen={isComparing}
        decorConcepts={decorConcepts}
        compareIdA={compareIdA}
        compareIdB={compareIdB}
        onSelectCompareA={setCompareIdA}
        onSelectCompareB={setCompareIdB}
        onClose={() => setIsComparing(false)}
        onApplyConcept={applyDecorCostToBudget}
      />
    </div>
  );
};
