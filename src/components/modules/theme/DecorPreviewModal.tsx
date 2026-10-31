import React from 'react';
import { X } from 'lucide-react';
import { DecorConceptItem } from '../../../types';
import { formatCurrency } from '../../../lib/formatters';

interface DecorPreviewModalProps {
  concept: DecorConceptItem | null;
  onClose: () => void;
  onApplyToBudget: (concept: DecorConceptItem) => void;
}

export const DecorPreviewModal: React.FC<DecorPreviewModalProps> = ({
  concept,
  onClose,
  onApplyToBudget,
}) => {
  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-festive border border-[#F5D1BD] max-h-[90vh] flex flex-col">
        <div className="relative h-72 sm:h-96 bg-black">
          <img
            src={concept.imageUrl}
            alt={concept.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
            Zone: {concept.area.replace('_', ' ')}
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#49372D]">{concept.title}</h3>
            <p className="text-xs text-[#6E5548] mt-1">{concept.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EAE5E1] text-xs">
            <div>
              <p className="font-bold text-[#49372D] mb-1">Required Execution Materials:</p>
              <ul className="space-y-1 text-[#6E5548]">
                {concept.materials.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C96F4A]" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#49372D] mb-1">Cost-Saving Advice:</p>
              <p className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                {concept.affordableAlternative}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE5E1] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#6E5548]">Estimated Investment:</span>
              <p className="text-xl font-bold text-[#C96F4A]">
                {formatCurrency(concept.estimatedCost)}
              </p>
            </div>
            <button
              onClick={() => {
                onApplyToBudget(concept);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F]"
            >
              Link to Event Budget →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

