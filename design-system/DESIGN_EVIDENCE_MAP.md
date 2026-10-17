---
Report Language: zh-Hant (繁體中文)
---

# Design Evidence Map（設計證據地圖）

## Source Inventory（來源清單）

| Source ID | Type | Path / URL / Node | Source fingerprint | Tier | Status | Evidence |
|-----------|------|-------------------|--------------------|------|--------|----------|
| S1 | Design file (Figma) | https://figma.com/design/wyeoKr5nbQmvV9gMWAOoyN (page 0:1) | figma:wyeoKr5nbQmvV9gMWAOoyN#page:0-1 | 1 (prod Figma) | pending extraction | Color palette, icon styles, component frames (section 2:2) |
| S2 | Implemented tokens (code) | Shared/DesignTokens.swift | code:Shared/DesignTokens.swift | 2 (prod code) | extracted | TempDeltaState, YWTypography, hex colors |
| S3 | Reference UI (screenshot) | provided inline (session) — packing list | screenshot:gogo-packing-list | 3 (screenshot) | used | Gogo floating nav style, white card styling, icon treatment |
| S4 | Reference UI (screenshot) | provided inline (session) — weather app | screenshot:weather-home | 3 (screenshot) | used | Home widget layout, temp display, outfit suggestions |
| S5 | Reference UI (screenshot) | provided inline (session) — weather forecast | screenshot:weather-forecast | 3 (screenshot) | used | Daily forecast layout, forecast cards, delta display |
| S6 | Reference UI (screenshot) | provided inline (session) — trip planning | screenshot:trip-planning | 3 (screenshot) | used | Modal/sheet behavior, button styles, spacing |

---

## Source Duplicate Review（來源重複檢查）

### Figma vs. Reference Screenshots
- **Finding:** reference screenshots show implemented UI from the app; Figma contains the design specification
- **Decision:** `keep distinct` — Figma is authoritative design source (tier 1); app screenshots are verification/refinement evidence
- **Note:** Some token values in implemented code diverge from design direction (see Token Inconsistencies below)

---

## Extracted Evidence（已提取的證據）

### Color Palette

| Color Role | Figma Intended | Current Code | Status | Evidence |
|------------|----------------|--------------|--------|----------|
| **Cold state** | `#5A7A94` (dusty slate) | `#4A90E2` (bright blue) | ⚠️ Mismatch | Design memory notes refinement to dusty slate; code still has original |
| **Cold gradient** | `#6C8AA4 → #435D76` | not coded as token | pending | DeltaAtmosphere uses state.primary for gradient opacity |
| **Warm state** | `#E8A44A` (editorial orange) | `#F5A623` | ⚠️ Mismatch | Design refined to #E8A44A; code has #F5A623 |
| **Neutral state** | need to verify | `#9E9E9E` | pending | Figma source needed |
| **Paper** | `#FAF7F2` (cream) | not yet found in code | pending | Referenced in design direction |
| **Card** | `#F0EBE4` (beige) | used in components as `.opacity(0.7)` | partial | Components use white with opacity instead of token |
| **Ink** | `#111` (near-black) | `0x1A1A1A` | close match | Used for text; minor hex difference |

**Token Inconsistencies Detail:**
- `TempDeltaState.primary` colors are outdated relative to design direction (2026-08-27 refinement)
- Components use hardcoded hex (`Color(hex: 0xF0EBE4)`) instead of named color tokens
- Gradient overlays use opacity multipliers on state.primary instead of pre-computed gradient stops

---

### Typography

| Slot | Figma Role | Current Code | Font | Size | Weight | Status |
|------|------------|--------------|------|------|--------|--------|
| Hero | hero (big temp) | `YWTypography.hero` | system rounded | 44 | semibold | ✓ implemented |
| Title | section heads, values | `YWTypography.title` | system rounded | 22 | semibold | ✓ implemented |
| Body | default content | `YWTypography.body` | system rounded | 16 | medium | ✓ implemented |
| Caption | labels, secondary | `YWTypography.caption` | system rounded | 12 | medium | ✓ implemented |
| Micro | smallest labels | `YWTypography.micro` | system rounded | 10 | semibold | ✓ implemented |

**Note:** Design direction specifies DM Sans (UI) + IBM Plex Mono (numbers). Current implementation uses system fonts (rounded design). This is a **known deviation pending design-to-code alignment** — no evidence from Figma yet that system fonts are intentional.

---

### Spacing & Radius

| Component | Padding | Radius | Grid Aligned | Evidence |
|-----------|---------|--------|--------------|----------|
| Metric block | 16px | 20px | ⚠️ 20 not on 4pt | `.padding(16)` ✓, `.cornerRadius(20)` — should verify |
| Commute card | 16px | 18px | ⚠️ 18 not on 4pt | `.padding(16)` ✓, `.cornerRadius(18)` — should adjust to 20 |
| Outfit section | 16px | 20px | ⚠️ 20 not on 4pt | `.padding(16)` ✓, `.cornerRadius(20)` — verify |
| Primary button | 12px vert | 14px | ⚠️ 14 not on 4pt | `.clipShape(RoundedRectangle(cornerRadius: 14))` — should be 16 |
| Dashboard scroll | 20px | n/a | ✓ | `.padding(20)` |
| VStack gaps | 8, 10, 12, 20, 28 | n/a | ✓/✓/✓/✓/✓ | Various gaps are on 4pt grid |

**Action:** Radius values need audit against 4pt grid; see [[spacing-4pt-grid]] feedback rule.

---

### Icons

| Context | Current | Intended | Evidence |
|---------|---------|----------|----------|
| Delta state indicator | SF Symbol (arrow.down, equal, arrow.up) | monochrome line icon (lucide-style) | DashboardView uses state.symbol; design direction specifies emoji replacement |
| Weather condition | text emoji (`☔`) | monochrome line icon | CommuteDeltaCard hardcodes emoji; should use icon component |
| Navigation | not yet reviewed | lucide-style + floating pill nav | Gogo reference shows line-icon nav pattern |

**Action:** Replace emoji and SF Symbols with lucide line icons per design direction.

---

## Component Usage Patterns（組件使用模式）

### MetricBlock
**Observed in:** DashboardView.comparison() — displays title, value, subtitle in a metric layout  
**Anatomy:** title (uppercase, secondary), value (hero/title), subtitle (caption, secondary)  
**Tokens used:** YWTypography (title, caption, micro), Color.secondary  
**Status:** ✓ Extracted as component; needs token audit

### CommuteDeltaCard
**Observed in:** DashboardView.commute() — displays time slot, temp delta, comparison temps  
**Anatomy:** title + hour label (header), delta + symbol + temps (body)  
**Tokens used:** YWTypography, TempDeltaState.primary/symbol, hardcoded card background  
**Status:** ✓ Extracted as component; hardcoded colors need token mapping

### DeltaAtmosphere
**Observed in:** DashboardView — gradient background with blurred circle overlays  
**Anatomy:** base gradient (3 color stops with opacities) + 2 blurred circle layers  
**Tokens used:** TempDeltaState.primary (for gradient), hardcoded opacities  
**Status:** ✓ Extracted; gradient stops should be token-driven

---

## Late-Arriving Evidence: Design Direction Memory（晚期到達證據）

**Source:** User memory files (design-direction.md, spacing-4pt-grid.md, mascot-bunny.md)  
**Evidence Tier:** 1 (authoritative design decision, dated 2026-08-27)  
**Conflicts Found:**
- Cold color in code (#4A90E2) vs. design (#5A7A94) — **code is outdated**
- Warm color in code (#F5A623) vs. design (#E8A44A) — **code is outdated**
- Radius values 14, 18, 20 in code vs. 4pt grid requirement — **needs alignment pass**
- Font: code uses system rounded vs. design specifies DM Sans + IBM Plex Mono — **needs clarification**

**Decision:** These are known refinements from prior design iteration. Token Recalibration pass will address them in TOKEN_ARCHITECTURE.md.

---

## Confidence Scoring（信心分數）

| Element | Confidence | Reasoning |
|---------|-----------|-----------|
| Core layout & structure | High | Implemented + reference screenshots confirm |
| TempDeltaState logic | High | Code + design direction align on delta thresholds |
| Typography scale | High | Implemented; fonts need clarification |
| Color values | Medium | Code is outdated vs. design direction; Figma source needed for final values |
| Icon treatment | Low | Partial implementation (mixed emoji/SF Symbol); design direction clear but Figma source needed |
| Spacing grid | Medium | Some values on grid; radius audit pending |
| Component variant states | Medium | Core states present; missing states (loading, error, empty) need capture |

---

## Next Steps（後續步驟）

1. **Figma extraction pass:** extract Variables, Color Styles, Typography, Components from `wyeoKr5nbQmvV9gMWAOoyN`
2. **Token Recalibration:** resolve color/radius mismatches documented above
3. **Native UI Capture:** build iOS app to capture full screen states and variants (requires Xcode setup)
4. **Component audit:** verify component variant coverage (loading, error, empty states)
5. **Mascot illustration:** extract bunny illustration treatments (home/lock/2×2 widget, weather states)
