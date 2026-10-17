---
Report Language: zh-Hant (繁體中文)
HTML docs UI locale: zh-Hant
---

# Design System Extraction Session（設計系統提取工作階段）

## Project（項目）
昨日天氣對比 (Yesterday Weather) — iOS 天氣 Widget + 主應用

**Visual Direction Locked:** 2026-08-27  
**Design System Extraction Start:** 2026-09-02

## Key Principles（關鍵原則）

### Spacing Grid（間距網格）
- 所有 spacing、padding、gap、radius 必須是 4pt 的倍數
- 允許值：4, 8, 12, 16, 20, 24, 28, 32pt；radius: 12/16/20/24/28/full

### Color Palette（色板）
- **Cold:** dusty slate `#5A7A94`（home widget gradient: `#6C8AA4 → #435D76`）
- **Warm:** editorial orange `#E8A44A`
- **Base:** cream/beige `#FAF7F2` (paper), `#F0EBE4` (card), ink `#111`

### Iconography（圖示）
- Monochrome line icons (lucide-style)
- NOT emoji — all emoji replaced with line-art equivalents
- Active state: white on ink; default: ink color

### Navigation（導航）
- Gogo-style floating rounded pill
- Detached from edges, light border, soft shadow
- Active item: black rounded-rect wrapping icon + label

### Typography（排版）
- UI: DM Sans
- Numbers/Labels: IBM Plex Mono

### Brand Mascot（品牌角色）
- 兔子與太陽 (rabbit + sun) illustration
- Surfaces: home widget (color raster) / lock widget (white line-art) / 2×2 widget (ink + orange)
- Weather-state variants: 晴天 / 多雲 / 下雨 / 天冷

---

## Input Sources（輸入來源）

### Primary Source: Figma
- File: https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN
- File key: `wyeoKr5nbQmvV9gMWAOoyN`
- Key screens in section 2:2
- Status: to be extracted

### Secondary Sources
- Provided reference screenshots (travel/Gogo app, weather layouts)
- iOS app project: YesterdayWeather, YesterdayWeatherWidget
- Status: awaiting screenshot capture

### Native App Project
- Platform: iOS (SwiftUI)
- Targets: YesterdayWeather (main app), YesterdayWeatherWidget (home + lock widgets)
- Status: awaiting build/simulator capture

---

## Extraction Workflow Status（提取工作流狀態）

- [x] Input Discovery — source inventory & duplicate review ✓ (2026-09-02)
- [x] Evidence Map — design decisions mapped to source evidence ✓ (2026-09-02)
- [x] Design Foundations — principles, color, typography, spacing, iconography ✓ (2026-09-02)
- [x] Token Architecture — ref/sys/comp token structure ✓ (2026-09-02)
- [x] Component Inventory — reusable UI components ✓ (2026-09-02)
- [x] Component Token Specs — 4 detailed specs created ✓ (2026-09-02)
  - `components/metric-block.md` ✓
  - `components/commute-delta-card.md` ✓
  - `components/delta-atmosphere.md` ✓
  - `components/primary-button.md` ✓
- [x] Token Files — CSS layers + Swift structure ✓ (2026-09-02)
  - `tokens/tokens-ref.css` — raw authored values ✓
  - `tokens/tokens-sys.css` — semantic roles ✓
  - `tokens/tokens-comp.css` — component slots ✓
  - `Shared/YWTokens.swift` — Swift Ref/Sys/Type layers ✓
  - `Shared/DesignTokens.swift` — TempDeltaState + YWTypography now token-sourced ✓
- [ ] View color migration — remaining hardcoded hex → tokens (inventory in TOKEN_ARCHITECTURE.md; needs confirmation)
- [ ] Page Composition Rules — layout, density, page shell
- [ ] Interaction States — state language and transitions
- [ ] Anti-AI Style Rules — constraints preserving brand character
- [ ] HTML Documentation — developer-facing static docs
- [ ] Audit & Checkpoint

---

## Completed in This Session（此工作階段完成）

### Input Discovery
- ✓ Source inventory built: Figma design file (tier 1), SwiftUI code (tier 2), reference screenshots (tier 3)
- ✓ Duplicate source review: Figma vs. app screenshots marked as `keep distinct` (Figma is authoritative)
- ✓ Found token inconsistencies: cold color code (#4A90E2) outdated vs. design (#5A7A94); warm color code (#F5A623) vs. design (#E8A44A)

### Evidence Map
- ✓ All source evidence documented in DESIGN_EVIDENCE_MAP.md
- ✓ Color palette audit completed (5 mismatches identified)
- ✓ Typography scale verified (system fonts current, design specifies DM Sans + IBM Plex Mono)
- ✓ Spacing grid audit started (some radius values 14/18 off-grid, need to snap to 4pt)
- ✓ Icon treatment documented (emoji/SF Symbol replacement required)

### Design Foundations
- ✓ DESIGN_PRINCIPLES.md created with 9 major sections:
  - Visual Personality (editorial, minimal, home-screen-ready)
  - Color Strategy (semantic temperature palette + base palette)
  - Typography (5-level scale, DM Sans specified)
  - Spacing & Layout (4pt grid, 6 standard spacing values)
  - Iconography (monochrome line icons, Lucide-style)
  - Elevation & Depth (minimal shadows, border-based cards)
  - Motion & Transitions (iOS native motion, 0.2–0.3s durations)
  - Brand Mascot (兔子與太陽 illustration system)
  - Anti-AI Style Rules (guardrails against generic UI)

### Token Architecture
- ✓ TOKEN_ARCHITECTURE.md created with:
  - Reference tokens (13 colors, 6 radius, 5 spacing, 5 typography)
  - System tokens (delta states, text colors, surfaces, opacity, icons)
  - Component tokens (MetricBlock, CommuteDeltaCard, DeltaAtmosphere, Primary Button)
  - Token Recalibration table (3 re-authorization decisions, 1 block-pending)
  - Swift enum structure for implementation
  - CSS custom properties export format

### Component Inventory
- ✓ COMPONENT_INVENTORY.md created with:
  - 4 extracted components (MetricBlock, CommuteDeltaCard, DeltaAtmosphere, Primary Button)
  - 3 planned components (Floating Navigation, Weather Forecast Card, Outfit Chip)
  - Mascot illustration (planned)
  - Anatomy, states, tokens, and variants for each component
  - Component similarity review (no duplicates found)
  - Missing states identified (loading, error states for future work)

---

## Key Design Decisions（關鍵設計決定）

| Decision | Status | Reasoning |
|----------|--------|-----------|
| Color palette recalibration | re-authorize | Design refined 2026-08-27; code uses outdated hex values |
| Font family: system → DM Sans + IBM Plex Mono | pending Figma | Design specifies; fonts not yet in project |
| Radius grid alignment | pending implementation | 4pt grid feedback requires audit and snap to nearest value |
| Icon replacement (emoji → lucide line icons) | pending implementation | Design direction specifies; systematic replacement needed |
| Mascot illustration system | needs Figma extraction | Multiple surface treatments (home/lock/2×2), weather state variants |
| Floating nav (planned) | needs Figma + full nav spec | Core for expanded app, Gogo reference provided |

---

## SwiftUI Preview Gallery（原生組件展示庫） — 2026-09-02

Chosen as the native equivalent of a Storybook catalog (Storybook declined below).

**New files:**
- `YesterdayWeather/Views/Components/PrimaryButton.swift` — reusable CTA component
  (`PrimaryButtonStyle` + `PrimaryButton`), token-backed, radius 16, pressed/disabled states
- `YesterdayWeather/Views/Catalog/ComponentCatalogView.swift` — in-app catalog screen:
  foundations swatches + MetricBlock + CommuteDeltaCard (3 states) + PrimaryButton (3 states)
  + DeltaAtmosphere tiles

**`#Preview` galleries added to:**
- `MetricBlock.swift` — MetricBlock row / no-subtitle / CommuteDeltaCard all-states
- `DeltaBackground.swift` — DeltaAtmosphere cooler / neutral / warmer
- `PrimaryButton.swift` — states

**Reachability:** DEBUG-only `NavigationLink` to the catalog added in `SettingsView`
(「開發者 → 組件展示庫」); never ships in release.

**Also migrated:** DashboardView outfit CTA now uses tokens + `radiusMd` (16pt, was 14 off-grid).

**⚠️ Verification pending:** host has Command Line Tools only (no iOS SDK), so these
could not be compiled here. Build in Xcode to confirm; previews use real data models
(`SlotCompare` memberwise init) and only existing `YWTokens` members.

---

## Storybook Decision（Storybook 決定） — 2026-09-02

**Declined.** This is a native iOS SwiftUI app (20 Swift files, no web frontend).
Storybook is a web-only component workbench (React/Vue/Angular/Svelte/Web Components)
with **no SwiftUI renderer** — it cannot render or validate the actual components
(`MetricBlock`, `CommuteDeltaCard`, `DeltaAtmosphere`, PrimaryButton). Adding it would
mean a separate parallel web workspace, not the iOS app. User chose not to proceed.

- **Native equivalent, if wanted later:** SwiftUI `#Preview` galleries per component
  (each state/variant) + an in-app Catalog screen. This validates the real iOS code.
- **Orphaned planner output** (from `ds-to-storybook` First Actions, safe to delete):
  `design-system/STORYBOOK_SOURCE_TRACE.md`, `STORYBOOK_COMPONENT_PLAN.md`,
  `STORYBOOK_COMPONENT_QUEUE.md`.

---

## Open Questions（待解問題）

1. ~~Which Figma variables/styles already exist?~~ **→ TBD after Figma file extraction** (metadata too large to parse; will need interactive Figma or node-level extraction)
2. ~~What SwiftUI components defined?~~ **✓ Identified:** MetricBlock, CommuteDeltaCard, DeltaAtmosphere, Primary Button, TempDeltaState
3. Should we extract lock-screen widget as separate component or variant of home widget? **→ separate component (different illustration treatment)**
4. Native app capture: can Xcode be installed to build for simulator? **→ Blocking; requires xcode-select setup**
5. Should IBM Plex Mono be applied to all numbers or only temps/percentages? **→ Design to clarify**

---

## Package Structure（套件結構）

Audit scripts expect the **project root** as target, with `design-system/` (docs)
and `tokens/` (css) as siblings:

```
yesterday-weather-widget/           ← audit target root
├── design-system/                  ← markdown docs + components/ + assets/
│   ├── DESIGN_PRINCIPLES.md, TOKEN_ARCHITECTURE.md, ...
│   └── components/*.md
└── tokens/                         ← tokens-ref/sys/comp.css + tokens.css
```

Run audits with `.` (project root), e.g. `audit_tokens.mjs . --strict`.

## Audit Result（審計結果） — all passed 2026-09-02

| Audit | Result | Detail |
|-------|--------|--------|
| Tokens | ✅ passed | 60 ref / 63 sys / 42 comp; 0 review candidates; 33 documented decisions |
| Sources | ✅ passed | 6 inventory rows, 6 fingerprints, 0 duplicate groups |
| Components | ✅ passed | 10 inventory rows, 4 specs, 0 similarity issues |

Commands (from project root):
```sh
node /Users/fengyunqi/.claude/skills/design-system-extractor/scripts/audit_tokens.mjs . --strict
node /Users/fengyunqi/.claude/skills/design-system-extractor/scripts/audit_sources.mjs . --strict
node /Users/fengyunqi/.claude/skills/design-system-extractor/scripts/audit_components.mjs . --strict
```

---

## Next Steps（後續步驟）

### Checkpoint Decision Point

You have these options:

1. **Review & Refine** — review the extraction, request changes to principles/tokens/components before proceeding
2. **Generate Component Specs** — create detailed `.md` files for the 4 extracted components using COMPONENT_SPEC_TEMPLATE.md
3. **Create Token Files** — generate `tokens/tokens-ref.css`, `tokens/tokens-sys.css`, and update `Shared/DesignTokens.swift`
4. **HTML Documentation** — generate developer-facing static HTML docs
5. **Integrate with Code** — update YesterdayWeather SwiftUI components to reference tokens instead of hardcoded values
6. **Figma Extraction** — deep dive into Figma file to extract Variables, component definitions, and mascot illustration
7. **Native App Build** — (requires Xcode) build and capture the actual app UI for full state coverage
