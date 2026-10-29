# Festora — Big moments. Beautifully planned.

> **Homepage Headline:** *Your celebration, beautifully planned.*  
> An AI-powered, connected event planning platform that unifies guest management, budgeting, styling, operations, and scenario simulation into a single synchronized workspace.

Built using the **Make-Life-Vibe** hackathon execution methodology (battle-tested at PromptWars Bengaluru 2026: 96.84% score + Pitching Arena Winner).

---

## 🌟 The Core Vision: Connected Event Architecture

In traditional event planning, guest lists, budgets, decoration briefs, and day-of operations live in disconnected spreadsheets. Changing a guest count from 150 to 200 requires manual recalculation across catering, invitation printing, seating charts, and return gift orders.

**Festora connects every module through a unified event state:**
- **Adjust guest count**: Catering buffet, grazing counters, dessert stations, digital passes, table centerpieces, and return gift estimates scale dynamically in real time.
- **Switch venue from Function Hall to Home Courtyard**: Hall rental fees (₹175,000) drop to ₹0, decoration briefs adjust to courtyard greenery, and valet shuttle requirements activate automatically.
- **Select a Theme**: Color palettes, decoration briefs, dress codes, and cost-saving tips update across the entire celebration platform.

---

## 🏛️ The 5 Connected Modules

### 💌 Module A — Smart Invitations & GuestPass
- **Guest Management**: Searchable, filterable directory with categories (Family, Close Friends, VIP, Colleagues, Community) and RSVP tracking (Attending, Pending, Declined).
- **Unique Guest Identifiers**: Alphanumeric codes (e.g. `FEST-AK-101`) assigned to every party.
- **Scannable QR GuestPass**: High-resolution digital and printable pass cards featuring a live-rendered QR code encoding party size, meal preference, and table assignments.
- **Organizer Check-In Terminal**: Dedicated reception scanner that validates guest passes, displays admission credentials with celebratory confetti, and **strictly detects duplicate check-in attempts** with timestamps and operator details to prevent pass reuse.

### 💰 Module B — Smart Budget Planner
- **7 Comprehensive Expense Categories**:
  1. *Venue & Infrastructure* (Hall rental, power backup, acoustic sound rigging)
  2. *Food & Catering* (Royal buffet dinner, grazing tables, live dessert counters)
  3. *Decoration & Ambience* (Stage backdrops, fairy light canopies, centerpieces)
  4. *Photography & Cinema* (Candid photo team, 4K cinematic highlight reel)
  5. *Clothing & Styling* (Designer attire, bridal & family makeup squad)
  6. *Invitations & GuestPass* (Digital portal, brass keepsake favors)
  7. *Transport & Logistics* (VIP shuttles, permits, contingency fund)
- **Guest-Scaled vs. Fixed Pricing**: Automatically scales per-plate catering and party favors when guest count moves.
- **Home vs. Function Hall Comparative Modeling**: Compare ancestral home celebrations against commercial banquet halls with a single toggle.
- **Transparent Assumptions**: Transparently labels calculation basis (e.g. `Scaled for 150 guests @ ₹1,200/plate`) and warns when categories exceed target allocations.

### 🎨 Module C — AI Theme & Venue Decoration Designer
- **Curated Theme Concepts**: Event-type aware concepts including:
  - *Sunset Terracotta & Royal Ochre* (Earthen luxury, antique brass, marigolds)
  - *Sage & Mogra Botanical Chic* (Organic romance, fragrant jasmine, sheer ivory)
  - *Midnight Stardust & Warm Amber* (High-energy evening glam, dynamic lighting)
  - *Bohemian Peach & Pampas Grass* (Artisanal warmth, dried palms, rattan loungers)
- **Color Palette Chips**: Clickable hex chips with automatic clipboard copying.
- **Venue-Specific Briefs**: Tailored decoration execution guidelines for both Function Halls and Home Courtyards.
- **Cost-Optimization Levers**: Actionable tips to achieve premium styling while saving 25-35% on floral and staging markups.
- **One-Click Event Application**: "Set as Active Event Theme" syncs the palette and dress code across all modules.

### 📋 Module D — Event Admin & Live Operations
- **Headcount Reconciliation**: Live meters comparing target guests, confirmed RSVPs, and 70% projected conversion of pending invitations.
- **Catering Buffer Tracking**: Real-time plate capacity monitoring ($\text{Target} + \text{Buffer}$) against confirmed headcounts to prevent food shortages.
- **Return Gift Hamper Reconciliation**: Monitors prepared gift hampers against projected attending parties.
- **Deterministic Operational Alerts**: Real-time alerts generated directly from application state (budget overruns, catering plate deficits, gift shortages, pending RSVP follow-ups, overdue milestone tasks).
- **Interactive Task Checklist**: Categorized task manager with priority tags (Critical, High, Medium, Low), deadlines, assignees, and completion toggles.

### 🤖 Module E — AI Event Copilot
- **Context-Grounded Planning Assistant**: Grounded directly in live event parameters (guest counts, budget breakdowns, catering buffers, active themes).
- **Conversational Queries**: Answers questions like:
  - *"How can we save ₹50,000 on this celebration?"*
  - *"Is our catering plate buffer sufficient for RSVP trends?"*
  - *"Compare home courtyard vs banquet hall costs"*
  - *"Summarize event health & pending tasks"*
- **Strict Safety Rule: Explicit Review & Approval Flow**: A suggestion is never a silent edit. When Copilot proposes changes, it renders a structured proposal card displaying:
  - Proposed diff (`field`, `from`, `to`)
  - Expected consequences and logistics impact
  - **"Apply to Event"** or **"Dismiss"** actions.

---

## ⚡ Signature Differentiator: Event What-If Engine

The **What-If Engine** is Festora's signature sandbox that allows hosts to stress-test scenarios without modifying their live plan until explicitly approved:
- **One-Click Scenarios**:
  - `Add 50 More Guests (+50)`
  - `Trim to Intimate Circle (-30)`
  - `Switch to Home Courtyard`
  - `Decor Value Optimization (-25% Decor)`
  - `Tighten Overall Budget by 15%`
- **Interactive Simulation Controls**: Custom sliders for guest count deltas, venue models, and decor modifiers.
- **Side-by-Side Comparison Matrix**: Compares Headcount, Total Cost, Catering Expense, Venue Rental, Remaining Budget, and Deficit.
- **Trade-Off Analysis**: Highlights Opportunities (positives), Trade-Off Realities, and Bottleneck Warnings (e.g. *"Home courtyard capacity recommended up to 85 guests; 200 guests planned requires supplemental valet and restrooms"*).
- **Atomic Application**: "Apply Scenario to Celebration" synchronizes target headcounts, venue models, and budget estimates in a single step with celebratory feedback.

---

## 🎟️ Guest Invitation Preview Portal

Festora includes a guest-facing public landing portal:
- Couple's celebration story and royal invitation plaque
- Celebration day schedule (Run of show from 6:30 PM to 10:30 PM)
- Google Maps directions link and venue details
- Dress code and color palette inspiration
- **Live Guest RSVP Form**: Arriving guests can search their name or pass code, Joyfully Accept or Regretfully Decline, specify party counts, and choose meal preferences.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite 6 (sub-second HMR & optimized production bundling)
- **Styling**: Tailwind CSS with custom celebration palette tokens:
  - Cream: `#FFF8EF`
  - Terracotta: `#C96F4A`
  - Golden Yellow: `#F2C66D`
  - Sage Green: `#A9B89A`
  - Soft Peach: `#F5D1BD`
  - Deep Warm Brown: `#49372D`
- **Typography**: Playfair Display (editorial serif) & Plus Jakarta Sans (clean UI sans)
- **Icons**: Lucide React
- **QR Engine**: QRCode (vector data URL generation)
- **Delight**: Canvas-Confetti (celebratory check-ins and scenario applications)
- **Persistence**: Local-first repository layer with localStorage persistence and full seed data reset
- **Testing**: Vitest automated test suite

---

## 🚀 Running Festora Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```
Executes all 15 unit tests covering budget calculation, what-if simulations, guest pass check-in validation, and operational alert triggers.

### 4. Build Production Bundle
```bash
npm run build
```
Generates an optimized production bundle in `/dist` with zero TypeScript errors.

---

## 🧪 Verification & Acceptance Test Results

| Requirement | Test Coverage / Verification | Status |
|---|---|---|
| **Build & Compilation** | `tsc && vite build` (zero TS/bundler errors) | **PASSED** |
| **Automated Unit Tests** | 15/15 Vitest tests passing across 4 test suites | **PASSED** |
| **Local Dev Server** | HTTP 200 on `http://localhost:3000/` | **PASSED** |
| **Cross-Module Sync** | Guest count changes recalculate catering and gifts | **PASSED** |
| **Duplicate Check-In** | Detects duplicate pass scan and blocks entry with alert | **PASSED** |
| **What-If Isolation** | Simulating scenarios does not mutate live plan until applied | **PASSED** |
| **Copilot Safety** | All proposed changes require explicit review & approval | **PASSED** |
| **Persistence** | Data persists in localStorage; Reset Demo button restores seed | **PASSED** |
| **Accessibility** | Skip links, semantic elements, visible focus states, ARIA | **PASSED** |

---

## 📄 License
MIT License. Built for celebration planners, hosts, and couples everywhere.
