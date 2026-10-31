# Festora — Big moments. Beautifully planned.

> **Homepage Headline:** *Your celebration, beautifully planned.*  
> An AI-powered, connected event planning and management platform that unifies guest management, budgeting, styling, operations, and scenario simulation into a single synchronized workspace.

Built using the **Make-Life-Vibe** hackathon execution methodology (battle-tested at PromptWars Bengaluru 2026: 96.84% score + Pitching Arena Winner).

---

## 🌟 Supported Event Types (Multi-Event Architecture)
Festora is **NOT** a wedding-specific application. It provides first-class support for:
- 🎂 **Birthdays** (Milestone parties, kids carnivals, sweet sixteens)
- 💍 **Weddings & Engagements** (Sangeet, ceremonies, grand banquets)
- 🎓 **College Fests** (Cultural meets, tech symposia, concerts & battle of the bands)
- 💼 **Corporate Summits** (Conferences, executive high-teas, product launches)
- 🥂 **Anniversaries & Milestones** (Silver/golden jubilees, vow renewals)
- 🏡 **Family & Community Functions** (Festivals, reunions, housewarmings)
- ✨ **Custom Celebrations** (Tailored from scratch with AI)

---

## 🏛️ The Connected Modules & Architecture

### 🤖 AI Event Copilot — The Brain of Festora
- **Genuine LLM Integration**: Powered by Google Gemini 2.0 Flash (`@google/genai`) with an autonomous built-in heuristic fallback engine that works out-of-the-box.
- **Dynamic Natural-Language Interviewing**: Understands prompts like *"Plan a birthday party for 200 people with live games & DJ in Bengaluru"*, asks only missing follow-up questions, and adapts to event types.
- **12-Section Structured Master Proposals**:
  1. Event Overview & Vision
  2. Requirements & Deliverables
  3. Venue Layout Arrangements
  4. Guest Attendance Planning
  5. Transparent Budget Breakdown (with stated assumptions)
  6. Food & Catering Menus
  7. Theme & Styling Concepts
  8. Return Gift Recommendations
  9. Entertainment Coordination
  10. Execution Timeline
  11. Milestone Tasks
  12. Risks & Contingency Mitigations
- **One-Click Workspace Instantiation**: Clicking *"Approve & Initialize Event"* atomically commits the plan into an independent database event, initializes budget lines, creates tasks, and sets up styling.
- **Contextual Modifications & Structured Action Cards**: Supports open-ended changes (*"Make it more luxurious"*, *"Can we save ₹50,000?"*, *"What if 30 more guests arrive?"*, *"Change venue to outdoor"*) with review-and-approval diffs.
- **Voice Recognition**: Interactive voice speech recognition via the browser's Web Speech API.

### 🎨 Module C — AI Decoration Designer (Actual Image Generation)
- **Photorealistic AI Concept Generation**: High-resolution visual designs powered by the Pollinations AI / Flux pipeline across **all 8 required celebration zones**:
  1. *Entrance & Welcome Area*
  2. *Main Stage & Focal Setting*
  3. *Guest Seating Arrangement*
  4. *Dining & Buffet Station*
  5. *Table Decorations & Centerpieces*
  6. *Lighting & Ceiling Canopy*
  7. *Outdoor Lawns & Patio*
  8. *Complete 360° Venue Concept*
- **Venue Photograph Reference Upload**: Upload actual venue photos; the AI grounds concepts in physical venue constraints.
- **Material Breakdown & Cost Estimates**: Itemizes decor components, unit costs, and actionable affordable alternatives.
- **One-Click Budget Connection**: Link any visual concept directly to the event's decor budget.

### 💰 Module B — Smart Budget Planner
- **Event-Type Specific Categories**: Default allocations adapt dynamically (e.g. College Fest has Sound Rigging & Artists; Birthday has Cake & Magician/Emcee; Corporate has AV & Delegate Kits).
- **Unified Deterministic Calculation**: Shares identical mathematical formulas with the AI Copilot and What-If Engine (`budgetCalculator.ts`).
- **Guest-Scaled vs. Fixed Pricing**: Automatically scales per-plate catering and party favors when headcount moves.

### 💌 Module A — Smart Invitations & GuestPass
- **Unique Guest Identifiers**: Alphanumeric codes (e.g. `FEST-BD-101`) assigned to every party.
- **Scannable QR GuestPass**: Digital and printable pass cards encoding party sizes and dietary preferences.
- **Organizer Check-In Terminal**: Dedicated reception scanner that validates passes and **strictly prevents duplicate pass reuse**.
- **CSV / Excel Import & Export**: Import guest lists from CSV and export attendance data.

### ⚡ Signature Differentiator: Event What-If Engine
- Interactive simulation sandbox to stress-test guest headcount changes, venue shifts, and decor budget cuts without modifying live data until explicitly applied.

---

## 🛠️ Security & Code Quality Hardening
- **Prompt Injection Defense**: Sanitizes control characters, ChatML tags, markdown escapes, and override strings in `sanitize.ts`.
- **Data Isolation**: Isolated per-event storage keys (`festora_event_${id}`, `festora_guests_${id}`, `festora_budget_${id}`).
- **Input Validation**: Strict type bounds, guest count validation, and prototype pollution defenses.
- **WCAG Accessibility**: Semantic HTML, skip links, ARIA labels, responsive navigation drawer for mobile screens.
- **Optimized Bundling**: Clean Rollup chunk splitting for React, GenAI, and UI libraries with 0 oversized chunk warnings.

---

## 🧪 Testing & Verification
Run Vitest to verify all 24 unit, integration, and end-to-end tests:
```bash
npm test
```
Build for production:
```bash
npm run build
```
