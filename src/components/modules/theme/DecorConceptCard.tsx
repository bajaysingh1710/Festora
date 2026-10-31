import React from 'react';
import { Eye, Heart, PlusCircle } from 'lucide-react';
import { DecorConceptItem } from '../../../types';
import { formatCurrency } from '../../../lib/formatters';

interface DecorConceptCardProps {
  concept: DecorConceptItem;
  onPreview: (concept: DecorConceptItem) => void;
  onToggleFavorite: (id: string) => void;
  onApplyToBudget: (concept: DecorConceptItem) => void;
}

export const DecorConceptCard: React.FC<DecorConceptCardProps> = ({
  concept,
  onPreview,
  onToggleFavorite,
  onApplyToBudget,
}) => {
  return (
    <div className="rounded-3xl bg-white border border-[#EAE5E1] overflow-hidden shadow-card hover:shadow-festive transition-all flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-48 bg-gray-100 overflow-hidden group">
          <img
            src={concept.imageUrl}
            alt={concept.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback placeholder if offline/blocked
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
            {concept.area.replace('_', ' ')}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <button
              onClick={() => onPreview(concept)}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm transition-all"
              title="Inspect full design & materials"
              aria-label="Inspect full design"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(concept.id)}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm transition-all"
              title="Favorite concept"
              aria-label="Favorite concept"
            >
              <Heart
                className={`w-4 h-4 ${concept.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
              />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-serif font-bold text-base text-[#49372D] leading-snug">
            {concept.title}
          </h3>
          <p className="text-xs text-[#6E5548] line-clamp-2">{concept.description}</p>

          <div className="pt-2 border-t border-[#EAE5E1] flex items-center justify-between text-xs">
            <span className="text-[#6E5548]">Est. Decor Cost:</span>
            <span className="font-mono font-bold text-[#C96F4A] text-sm">
              {formatCurrency(concept.estimatedCost)}
            </span>
          </div>

          <div className="text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl">
            <span className="font-semibold block">Affordable Alternative:</span>
            <span className="line-clamp-2">{concept.affordableAlternative}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => onApplyToBudget(concept)}
          className="w-full py-2 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#F5D1BD]/60 flex items-center justify-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Connect to Event Budget</span>
        </button>
      </div>
    </div>
  );
};

