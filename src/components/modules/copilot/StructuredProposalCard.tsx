import React from 'react';
import {
  Sparkles,
  FileCheck,
  Building,
  Users,
  Wallet,
  UtensilsCrossed,
  Palette,
  Gift,
  Clock,
  ListTodo,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { StructuredEventProposal } from '../../../types';
import { formatCurrency } from '../../../lib/formatters';

interface StructuredProposalCardProps {
  proposal: StructuredEventProposal;
  onApprove: (proposal: StructuredEventProposal) => void;
}

export const StructuredProposalCard: React.FC<StructuredProposalCardProps> = ({
  proposal,
  onApprove,
}) => {
  return (
    <div className="mt-4 rounded-3xl border border-[#C96F4A] bg-white overflow-hidden shadow-festive text-left">
      {/* Proposal Header Banner */}
      <div className="bg-gradient-to-r from-[#FAF0EB] via-[#FFF8EF] to-white p-5 border-b border-[#F5D1BD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C96F4A] text-white">
              12-Section Master Proposal
            </span>
            <span className="text-xs font-semibold text-[#859675]">
              {proposal.city} · {proposal.guestCount} Guests
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#49372D] mt-1">
            {proposal.title}
          </h3>
          <p className="text-xs text-[#6E5548] mt-0.5">
            Target Budget:{' '}
            <span className="font-bold text-[#C96F4A]">
              {formatCurrency(proposal.targetBudget)}
            </span>{' '}
            (≈ {formatCurrency(Math.round(proposal.targetBudget / Math.max(1, proposal.guestCount)))}/guest)
          </p>
        </div>

        <button
          onClick={() => onApprove(proposal)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all shrink-0"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Approve &amp; Initialize Event</span>
        </button>
      </div>

      {/* Proposal Core Details */}
      <div className="p-5 space-y-4 text-xs">
        {/* Section 1 & 2: Overview & Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>1. Event Overview &amp; Vision</span>
            </h4>
            <p className="text-[#49372D] leading-relaxed">{proposal.overview}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>2. Key Requirements</span>
            </h4>
            <ul className="space-y-1 text-[#49372D]">
              {proposal.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C96F4A] font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3 & 4: Venue & Attendance Planning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF0EB]/60 border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>3. Venue Layout &amp; Arrangements</span>
            </h4>
            <p className="font-semibold text-[#49372D] capitalize">
              Recommended: {proposal.venueArrangements.recommendedType.replace('_', ' ')}
            </p>
            <p className="text-[#6E5548] mt-1">{proposal.venueArrangements.layoutConcept}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF0EB]/60 border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>4. Guest Attendance Planning</span>
            </h4>
            <div className="flex items-center justify-between text-xs font-semibold text-[#49372D] mb-1">
              <span>Target: {proposal.guestPlanning.targetCount} guests</span>
              <span>Parties: ~{proposal.guestPlanning.estimatedParties}</span>
            </div>
            <p className="text-[#6E5548]">{proposal.guestPlanning.tableArrangements}</p>
          </div>
        </div>

        {/* Section 5: Transparent Budget Breakdown */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
          <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-3 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#C96F4A]" />
            <span>5. Transparent Budget Breakdown</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
            {proposal.budgetBreakdown.map((b, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-[#FFF8EF] border border-[#F5D1BD]">
                <p className="font-bold text-[11px] text-[#49372D] truncate">{b.categoryName}</p>
                <p className="font-mono font-bold text-xs text-[#C96F4A] mt-0.5">
                  {formatCurrency(b.amount, { compact: true })}
                </p>
                <p className="text-[10px] text-[#6E5548]">{b.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6 & 7: Catering & Themes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>6. Catering Recommendations</span>
            </h4>
            <p className="font-semibold text-[#49372D] mb-1">{proposal.cateringRecommendations.mealType}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {proposal.cateringRecommendations.recommendedMenu.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-[#F5D1BD] text-[11px] text-[#6E5548]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>7. Theme &amp; Styling Concepts</span>
            </h4>
            <p className="font-semibold text-[#49372D]">{proposal.decorConcepts.themeTitle}</p>
            <p className="text-[#6E5548] mt-1">{proposal.decorConcepts.keyElements.join(' · ')}</p>
          </div>
        </div>

        {/* Section 8 & 9: Return Gifts & Entertainment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF0EB]/60 border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>8. Return Gift Recommendations</span>
            </h4>
            {proposal.returnGiftRecommendations ? (
              <>
                <p className="font-semibold text-[#49372D]">
                  {proposal.returnGiftRecommendations.description}
                </p>
                <p className="text-[#6E5548] mt-1">
                  Estimated: {formatCurrency(proposal.returnGiftRecommendations.perUnitEstimate)}/party ·{' '}
                  {proposal.returnGiftRecommendations.recommendedQuantity} packages
                </p>
              </>
            ) : (
              <p className="text-[#6E5548] italic">Custom keepsakes tailored to attendees.</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF0EB]/60 border border-[#F5D1BD]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>9. Entertainment Program</span>
            </h4>
            <ul className="space-y-1 text-[#49372D]">
              {proposal.entertainmentRecommendations.map((ent, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C96F4A] font-bold">•</span>
                  <span>{ent}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 10 & 11: Timeline & Important Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>10. Execution Timeline</span>
            </h4>
            <div className="space-y-1 text-[11px]">
              {proposal.timeline.slice(0, 4).map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-[#C96F4A] font-bold">{t.timeframe}</span>
                  <span className="text-[#49372D] truncate">{t.milestone}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E1]">
            <h4 className="font-bold uppercase tracking-wider text-[#6E5548] text-[11px] mb-2 flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>11. Milestone Tasks</span>
            </h4>
            <div className="space-y-1 text-[11px]">
              {proposal.importantTasks.slice(0, 4).map((task, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[#49372D] truncate">{task.title}</span>
                  <span className="uppercase text-[9px] font-bold text-[#C96F4A] px-1.5 py-0.2 bg-[#FAF0EB] rounded">
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 12: Risks & Contingency Mitigations */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <h4 className="font-bold uppercase tracking-wider text-amber-900 text-[11px] mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>12. Risks &amp; Contingency Mitigations</span>
          </h4>
          <div className="space-y-1.5 text-[11px] text-amber-950">
            {proposal.risksAndContingencies.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">⚠️</span>
                <span>
                  <strong>{risk.risk}:</strong> {risk.mitigation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
