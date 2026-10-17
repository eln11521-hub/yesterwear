---
Report Language: zh-Hant (繁體中文)
---

# Component Inventory（組件清單）

## Overview（概述）

昨日天氣對比 has a focused set of reusable components for displaying weather data and outfit recommendations. Most components are already implemented in SwiftUI; this inventory documents them for formalization as design-system components.

---

## Component Status Matrix（組件狀態矩陣）

| Component | Status | Spec | Priority | Evidence | Notes |
|-----------|--------|------|----------|----------|-------|
| **MetricBlock** | extracted | ✓ metric-block.md | high | DashboardView.comparison() | Displays title/value/subtitle metric |
| **CommuteDeltaCard** | extracted | ✓ commute-delta-card.md | high | DashboardView.commute() | Shows delta, temps, rain hint |
| **DeltaAtmosphere** | extracted | ✓ delta-atmosphere.md | high | DashboardView | Gradient background with circles |
| **Primary Button** | extracted | ✓ primary-button.md | medium | DashboardView.outfitSection | Reusable `PrimaryButton`/`PrimaryButtonStyle` component built 2026-09-02; in Catalog gallery |
| **Floating Navigation** | planned | high | reference screenshots, design direction | Gogo-style floating nav pill |
| **Weather Forecast Card** | planned | medium | reference screenshots | Daily forecast with temps + icon |
| **Outfit Chip** | planned | medium | reference screenshots | Tag-style outfit item |
| **Empty State** | planned | low | DashboardView (ContentUnavailableView) | Standard error/no-data state |
| **Loading Indicator** | planned | low | DashboardView (ProgressView) | Standard loading spinner |
| **Mascot Illustration** | planned | high | mascot-bunny.md, Figma | 兔子與太陽 bunny + sun (state variants) |

---

## Extracted Components（已提取的組件）

### 1. MetricBlock

**Purpose:** Display a metric as title/value/subtitle triplet (e.g., "今日體感 / 31° / 出門時段基準")

**Evidence Source:** DashboardView, lines 85–90 (comparison function)

**Anatomy:**
- **title** (label): uppercase, small, secondary color
- **value** (metric): large, prominent, primary color  
- **subtitle** (supporting): small, secondary color

**States:** (display-only component, no interactive states)

**Tokens Required:**
- `sys-type-caption` (title)
- `sys-type-title` (value)
- `sys-type-caption` (subtitle)
- `sys-text-primary`, `sys-text-secondary`
- `sys-spacing-xs` (gaps between text)

**Variants:** None (single use case)

**Accessibility:** Text hierarchy clear through size/weight; no color-only meaning

**Implementation notes:**
- Vertical layout (VStack)
- Frame max-width to fill container
- Leading alignment for left-edge alignment in cards

**Status:** ✓ Extracted — ready for component spec

---

### 2. CommuteDeltaCard

**Purpose:** Display a commute time slot (e.g., "出門 08:00") with temperature delta, comparison temps, and rain hint.

**Evidence Source:** DashboardView, lines 27–63 (CommuteDeltaCard struct)

**Anatomy:**
- **header:** title (slot label like "出門 08:00") + rain hint (optional)
- **body:** delta icon + delta value + comparison temps (right-aligned)

**States:** 
- default (no rain)
- rainy (rain hint shown)
- loading (placeholder temps)

**Tokens Required:**
- `sys-type-body` (title)
- `sys-type-caption` (comparison temps, rain hint)
- `sys-type-title` (delta value)
- `sys-delta-*` (color for icon + border)
- `sys-icon-md` (delta icon)
- `sys-text-primary`, `sys-text-secondary`
- `sys-surface-white` + opacity (card bg)
- `sys-radius-lg` (card radius)
- `sys-spacing-lg` (card padding)
- `sys-spacing-sm` (internal gaps)

**Variants:**
- cooler delta (blue icon, border)
- neutral delta (gray icon, border)
- warmer delta (orange icon, border)

**Accessibility:** Icon + text delta value clearly readable; no icon-only meaning

**Implementation notes:**
- Card uses white background with opacity for legibility over gradient
- Border color from TempDeltaState.primary with opacity
- Baseline alignment for temps

**Status:** ✓ Extracted — ready for component spec

---

### 3. DeltaAtmosphere

**Purpose:** Animated gradient background responding to temperature delta state.

**Evidence Source:** DashboardView, line 14; DeltaAtmosphere.swift (entire file)

**Anatomy:**
- **base gradient:** 3-stop linear gradient (topLeading → bottomTrailing)
- **blurred circle 1:** large, primary-color circle (opacity 0.22, blur 40)
- **blurred circle 2:** small, white circle (opacity 0.35, blur 30)

**States:** 
- cooler (blue tones)
- neutral (gray tones)
- warmer (orange tones)

**Tokens Required:**
- `sys-delta-cold`, `sys-delta-cold-light`, `sys-delta-cold-dark` (cooler gradient)
- `sys-delta-warm` (warmer gradient)
- `sys-delta-neutral` (neutral gradient)
- `sys-surface-paper` (gradient end)
- Opacity tokens: 0.55, 0.22, 0.18, 0.35

**Variants:** One per delta state (cooler/neutral/warmer)

**Accessibility:** Purely decorative background; does not convey critical information independently

**Implementation notes:**
- Uses GeometryReader for responsive circle sizing
- Circles are blurred for soft, gradient-like effect
- Offset circles for visual balance
- allowsHitTesting(false) to keep interactive elements accessible

**Status:** ✓ Extracted — ready for component spec

---

### 4. Primary Button

**Purpose:** Main call-to-action button for recording outfit data.

**Evidence Source:** DashboardView, lines 118–128 (outfit link button)

**Anatomy:**
- **text label:** centered, bold
- **background:** solid dark color
- **corners:** rounded rectangle

**States:**
- default (dark background, white text)
- pressed (slightly darker, scaled 0.95)
- disabled (opacity reduced)

**Tokens Required:**
- `sys-type-body` (label)
- `sys-text-primary` (background)
- white foreground (text)
- `sys-radius-md` (corner radius)
- `sys-spacing-md` (vertical padding)
- opacity tokens (disabled)

**Variants:** None (single style, but two label states: "記錄今日穿搭" vs "更新今日穿搭")

**Accessibility:** Text label clear; sufficient contrast over dark background; hit target 44pt minimum height (12pt padding + font)

**Implementation notes:**
- maxWidth .infinity for full-width button in container
- Horizontal padding is implicit (fill container)
- NavigationLink wrapper for navigation (could be separated into button + action handler)

**Status:** ✓ Extracted — ready for component spec

---

## Planned Components（計畫中的組件）

### 5. Floating Navigation Bar

**Purpose:** Gogo-style detached navigation pill at bottom of screen with 3–4 tabs.

**Evidence Source:** reference screenshot (Gogo trip planning), design direction "Gogo-style floating rounded pill"

**Anatomy:**
- **container:** rounded pill shape, light background, soft border
- **tab items:** icon + optional label
- **active indicator:** white-filled rounded rect wrapping active icon+label
- **inactive tabs:** ink color icons

**States:**
- default (icon, medium padding)
- active (white bg, white/ink icon pair)

**Tokens Required:**
- `sys-type-caption` (label, if shown)
- `sys-icon-nav` (icon size/stroke)
- `sys-text-primary`, white foreground
- `sys-surface-white` (active background)
- `sys-radius-full` (container pill shape)

**Variants:** show/hide labels; 3-tab vs 4-tab layouts

**Accessibility:** Tabs semantic; active state clear through both color and visual indicator; sufficient padding

**Implementation notes:**
- Floating position (detached from bottom safe area)
- Light border to separate from background
- Soft shadow for elevation

**Priority:** HIGH — core navigation pattern

**Status:** planned — pending Figma extraction + full nav structure mapping

---

### 6. Weather Forecast Card

**Purpose:** Display a daily forecast (weather condition, high/low temps, rain %).

**Evidence Source:** reference screenshot (weather forecast), design direction

**Anatomy:**
- **date label** (weekday)
- **weather icon** (line icon)
- **high/low temps**
- **rain percentage** (optional)

**Tokens Required:**
- `sys-type-caption` (date label)
- `sys-type-title` (temps)
- `sys-icon-md` (weather icon)
- `sys-text-primary`, `sys-text-secondary`
- `sys-radius-lg` (card radius, if card-style)

**Variants:** sunny/cloudy/rainy conditions; rain % shown/hidden

**Status:** planned — needs full design spec from Figma

---

### 7. Outfit Chip

**Purpose:** Tag-style item for outfit suggestions or logged outfits.

**Evidence Source:** reference screenshot, outfit log view

**Anatomy:**
- **label text** (item name, e.g., "短袖上衣" / "背心")
- **background**: filled or outlined

**States:**
- suggested (filled, emphasize)
- logged (muted, de-emphasize)
- selected (highlight)

**Tokens Required:**
- `sys-type-caption` (label)
- `sys-radius-full` (pill radius)
- various color combinations for suggested/logged states

**Status:** planned — needs capture from outfit log screen

---

## Component Similarity Review（組件相似性檢查）

No duplicates or near-duplicates found during inventory. Each extracted component has a distinct purpose and anatomy.

---

## Missing States & Interactions（缺失的狀態與交互）

### MetricBlock
- ✓ default state captured
- ⚠️ loading state (placeholder shimmer) — not yet needed?
- ⚠️ error state — not applicable for display-only component

### CommuteDeltaCard
- ✓ default state (no rain) captured
- ✓ rainy state (rain hint shown) captured
- ⚠️ loading/skeleton state — not yet implemented

### DeltaAtmosphere
- ✓ cooler state captured
- ✓ neutral state captured
- ✓ warmer state captured
- ⚠️ animation on state change — needs implementation spec

### Primary Button
- ✓ default state captured
- ✓ disabled state referenced
- ⚠️ loading state (spinner) — not implemented
- ⚠️ focus/accessibility state — standard SwiftUI default

### Floating Navigation
- ⚠️ all states need capture after build

---

## Component Priority & Roadmap（優先級與路線圖）

**Phase 1 (Complete):**
- MetricBlock ✓
- CommuteDeltaCard ✓
- DeltaAtmosphere ✓
- Primary Button ✓

**Phase 2 (This session):**
- Create component specs for Phase 1 components
- Extract Figma definitions for Phase 2 components
- Add component token definitions

**Phase 3 (Future):**
- Floating Navigation Bar (core for multi-screen app)
- Weather Forecast Card (dashboard enhancement)
- Outfit Chip (outfit logger completion)

---

## Component Spec Template Location（組件規格模板位置）

See `COMPONENT_SPEC_TEMPLATE.md` for the template structure. Each component will get a `components/<component-name>.md` file:

- `components/metric-block.md`
- `components/commute-delta-card.md`
- `components/delta-atmosphere.md`
- `components/primary-button.md`
- `components/floating-navigation.md` (planned)
- `components/weather-forecast-card.md` (planned)
- `components/outfit-chip.md` (planned)

---

## Implementation Checklist（實作檢查清單）

- [ ] Create component specs for 4 extracted components
- [ ] Update TOKEN_ARCHITECTURE.md with component token contracts
- [ ] Refactor components to use token enums instead of hardcoded values
- [ ] Test component rendering in isolation (Storybook or SwiftUI Previews)
- [ ] Add component usage documentation
- [ ] Create Figma component library to match SwiftUI components
- [ ] Plan Phase 2 component specs (Floating Nav, Forecast Card, Outfit Chip)
