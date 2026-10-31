import React from 'react';
import { Scale, X } from 'lucide-react';
import { DecorConceptItem } from '../../../types';
import { formatCurrency } from '../../../lib/formatters';

interface DecorCompareModalProps {
  isOpen: boolean;
  decorConcepts: DecorConceptItem[];
  compareIdA: string;
  compareIdB: string;
  onSelectCompareA: (id: string) => void;
  onSelectCompareB: (id: string) => void;
  onClose: () => void;
  onApplyConcept: (concept: DecorConceptItem) => void;
}

export const DecorCompareModal: React.FC<DecorCompareModalProps> = ({
  isOpen,
  decorConcepts,
  compareIdA,
  compareIdB,
  onSelectCompareA,
  onSelectCompareB,
  onClose,
  onApplyConcept,
}) => {
  if (!isOpen) return null;

  const conceptA = decorConcepts.find((c) => c.id === compareIdA) || decorConcepts[0];
  const conceptB = decorConcepts.find((c) => c.id === compareIdB) || decorConcepts[1] || decorConcepts[0];

  if (!conceptA || !conceptB) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-festive border border-[#F5D1BD] max-h-[90vh] flex flex-col">
        <div className="p-5 bg-gradient-to-r from-[#FAF0EB] to-white border-b border-[#F5D1BD] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#49372D] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#C96F4A]" />
              <span>Side-by-Side Design Comparison</span>
            </h3>
            <p className="text-xs text-[#6E5548]">
              Compare aesthetics, material requirements, and budget impacts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6E5548] hover:bg-[#FAF0EB]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concept A */}
          <div className="rounded-2xl border border-[#EAE5E1] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#C96F4A]">Option A</span>
              <select
                value={compareIdA}
                onChange={(e) => onSelectCompareA(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#EAE5E1]"
              >
                {decorConcepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <img
              src={conceptA.imageUrl}
              alt={conceptA.title}
              className="w-full h-48 object-cover rounded-xl"
              loading="lazy"
            />
            <h4 className="font-serif font-bold text-lg text-[#49372D]">{conceptA.title}</h4>
            <p className="text-base font-bold text-[#C96F4A]">{formatCurrency(conceptA.estimatedCost)}</p>
            <ul className="text-xs text-[#6E5548] space-y-1">
              {conceptA.materials.map((m, idx) => (
                <li key={idx}>• {m}</li>
              ))}
            </ul>
            <button
              onClick={() => {
                onApplyConcept(conceptA);
                onClose();
              }}
              className="w-full py-2 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#C96F4A] hover:text-white transition-all"
            >
              Select Option A for Budget
            </button>
          </div>

          {/* Concept B */}
          <div className="rounded-2xl border border-[#EAE5E1] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#D9A948]">Option B</span>
              <select
                value={compareIdB}
                onChange={(e) => onSelectCompareB(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#EAE5E1]"
              >
                {decorConcepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <img
              src={conceptB.imageUrl}
              alt={conceptB.title}
              className="w-full h-48 object-cover rounded-xl"
              loading="lazy"
            />
            <h4 className="font-serif font-bold text-lg text-[#49372D]">{conceptB.title}</h4>
            <p className="text-base font-bold text-[#C96F4A]">{formatCurrency(conceptB.estimatedCost)}</p>
            <ul className="text-xs text-[#6E5548] space-y-1">
              {conceptB.materials.map((m, idx) => (
                <li key={idx}>• {m}</li>
              ))}
            </ul>
            <button
              onClick={() => {
                onApplyConcept(conceptB);
                onClose();
              }}
              className="w-full py-2 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#C96F4A] hover:text-white transition-all"
            >
              Select Option B for Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

