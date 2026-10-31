import React from 'react';
import { Layers } from 'lucide-react';
import { CopilotProposal } from '../../../types';

interface ActionDiffCardProps {
  proposal: CopilotProposal;
  onApply: (proposal: CopilotProposal) => void;
  onDismiss: (proposal: CopilotProposal) => void;
}

export const ActionDiffCard: React.FC<ActionDiffCardProps> = ({
  proposal,
  onApply,
  onDismiss,
}) => {
  return (
    <div className="mt-3 p-4 rounded-2xl bg-white border border-[#EAE5E1] shadow-card text-left">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C96F4A]">
          <Layers className="w-3.5 h-3.5" />
          <span>Action Proposal: {proposal.title}</span>
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            proposal.status === 'applied'
              ? 'bg-emerald-100 text-emerald-800'
              : proposal.status === 'rejected'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {proposal.status}
        </span>
      </div>

      <p className="text-xs text-[#6E5548] mb-3">{proposal.summary}</p>

      {/* Diffs */}
      <div className="space-y-1.5 mb-3 bg-[#FFF8EF] p-2.5 rounded-xl text-xs">
        {proposal.changes.map((ch, idx) => (
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
        {proposal.consequences.map((c, idx) => (
          <div key={idx} className="flex items-start gap-1">
            <span className="text-[#C96F4A] font-bold">•</span>
            <span>{c}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {proposal.status === 'pending' && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE5E1]">
          <button
            onClick={() => onDismiss(proposal)}
            className="px-3 py-1.5 rounded-lg border border-[#EAE5E1] text-xs font-semibold text-[#6E5548] hover:bg-gray-50"
          >
            Dismiss
          </button>
          <button
            onClick={() => onApply(proposal)}
            className="px-4 py-1.5 rounded-lg bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F]"
          >
            Apply to Event
          </button>
        </div>
      )}
    </div>
  );
};

