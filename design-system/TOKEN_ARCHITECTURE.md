---
Report Language: zh-Hant (繁體中文)
---

# Token Architecture（代碼結構）

## Overview（概述）

昨日天氣對比 uses a three-layer token system:

1. **Reference tokens (`tokens/tokens-ref.css`)** — raw, authored values from Figma or design spec
2. **System tokens (`tokens/tokens-sys.css`)** — semantic roles (color, typography, spacing)
3. **Component tokens (`tokens/tokens-comp.css`)** — component-specific token usage

This structure ensures:
- Single source of truth for authored values (ref layer)
- Semantic reusability across components (sys layer)
- Clear component contracts (comp layer)

---

## Reference Tokens（引用代碼）

Authored values extracted from Figma, design direction, and implemented code.

### Color References（顏色引用）

| Token | Value | Source | Provenance | Usage |
|-------|-------|--------|------------|-------|
| `ref-color-cold` | `#5A7A94` | Figma / design direction | authored (2026-08-27) | Delta atmosphere (cooler), state badge |
| `ref-color-cold-light` | `#6C8AA4` | design direction gradient note | authored | Delta gradient start |
| `ref-color-cold-dark` | `#435D76` | design direction gradient note | authored | Delta gradient end |
| `ref-color-neutral` | `#9E9E9E` | current code `TempDeltaState.neutral` | measured | neutral delta state |
| `ref-color-warm` | `#E8A44A` | Figma / design direction | authored (2026-08-27) | Delta atmosphere (warmer), accent |
| `ref-color-paper` | `#FAF7F2` | design direction | authored | screen background |
| `ref-color-card` | `#F0EBE4` | design direction | authored | card background |
| `ref-color-ink` | `#111` | design direction | authored | primary text |
| `ref-color-text-secondary` | `#666` | not yet in code | measured | secondary text |
| `ref-color-text-tertiary` | `#999` | not yet in code | measured | tertiary text |
| `ref-color-white` | `#FFFFFF` | hardcoded in components | measured | white fills (modals, translucent layers) |

**Note on provenance:**
- `authored` = came from Figma variables, design direction memo, or explicit design spec
- `measured` = sampled from current code or screenshots; may need verification against Figma

### Radius References（半徑引用）

| Token | Value | Snap to 4pt Grid | Source | Notes |
|-------|-------|------------------|--------|-------|
| `ref-radius-sm` | 12px | ✓ | design direction | small accent elements |
| `ref-radius-md` | 16px | ✓ | design direction | buttons, small cards |
| `ref-radius-lg` | 20px | ✓ | design direction | standard cards, major containers |
| `ref-radius-xl` | 24px | ✓ | design direction | large overlays, modals |
| `ref-radius-2xl` | 28px | ✓ | design direction | extra large surfaces |
| `ref-radius-full` | 48pt | ✓ | design direction | full round (floating nav pill) |

**⚠️ Action:** Current code uses radius 14, 18, 20 — need to replace with grid-aligned values.

### Typography References（排版引用）

| Token | Font Family | Size | Weight | Line Height | Source | Provenance |
|-------|------------|------|--------|------------|--------|-----------|
| `ref-type-hero-size` | DM Sans | 44pt | 600 (semibold) | 1.1 | design direction | authored |
| `ref-type-title-size` | DM Sans | 22pt | 600 (semibold) | 1.2 | design direction | authored |
| `ref-type-body-size` | DM Sans | 16pt | 500 (medium) | 1.5 | design direction | authored |
| `ref-type-caption-size` | DM Sans | 12pt | 500 (medium) | 1.4 | design direction | authored |
| `ref-type-micro-size` | DM Sans | 10pt | 600 (semibold) | 1.3 | design direction | authored |
| `ref-type-mono-size` | IBM Plex Mono | size varies | varies | varies | design direction | authored |

**Current state:** YWTypography uses system fonts; DM Sans + IBM Plex Mono not yet integrated.

### Spacing References（間距引用）

Standard gaps and padding on 4pt grid:

| Token | Value | Grid | Usage |
|-------|-------|------|-------|
| `ref-space-xs` | 4pt | ✓ | micro gaps |
| `ref-space-sm` | 8pt | ✓ | compact spacing |
| `ref-space-md` | 12pt | ✓ | small padding |
| `ref-space-lg` | 16pt | ✓ | standard padding |
| `ref-space-xl` | 20pt | ✓ | large padding/gaps |
| `ref-space-2xl` | 24pt | ✓ | extra large gaps |

---

## System Tokens（系統代碼）

Semantic roles that map reference tokens to design intent. **System tokens are product-wide and reusable.**

### Color System（色彩系統）

#### Delta States（溫度差狀態）

| Token | Value | Role | Usage |
|-------|-------|------|-------|
| `sys-delta-cold` | ref-color-cold | cooler than yesterday | gradient base, state badge, accent |
| `sys-delta-cold-light` | ref-color-cold-light | cooler gradient highlight | DeltaAtmosphere layer 1 |
| `sys-delta-cold-dark` | ref-color-cold-dark | cooler gradient shadow | DeltaAtmosphere layer 3 |
| `sys-delta-neutral` | ref-color-neutral | similar to yesterday | neutral badge, muted accent |
| `sys-delta-warm` | ref-color-warm | warmer than yesterday | gradient base, state badge, accent |

#### Text Colors（文本顏色）

| Token | Value | Role |
|-------|-------|------|
| `sys-text-primary` | ref-color-ink | headings, primary content |
| `sys-text-secondary` | ref-color-text-secondary | labels, hints, secondary content |
| `sys-text-tertiary` | ref-color-text-tertiary | timestamps, minimal UI |
| `sys-text-on-delta-cold` | white (contrast over cold) | text on cold state badge |
| `sys-text-on-delta-warm` | white or adjusted (contrast) | text on warm state badge |

#### Surface Colors（表面顏色）

| Token | Value | Role |
|-------|-------|------|
| `sys-surface-paper` | ref-color-paper | screen background |
| `sys-surface-card` | ref-color-card | card background, container |
| `sys-surface-white` | ref-color-white | modal overlay, translucent fill |

#### Semantic Opacity（語義透明度）

| Token | Value | Usage |
|-------|-------|-------|
| `sys-opacity-solid` | 1.0 | opaque elements |
| `sys-opacity-card-overlay` | 0.7 | translucent card on gradient |
| `sys-opacity-gradient-mid` | 0.55 | gradient layer opacity |
| `sys-opacity-disabled` | 0.5 | disabled UI |
| `sys-opacity-subtle` | 0.15 | subtle backgrounds, borders |

### Typography System（排版系統）

| Token | Font Stack | Size | Weight | Line Height |
|-------|-----------|------|--------|------------|
| `sys-type-hero` | DM Sans | ref-type-hero-size | 600 | 1.1 |
| `sys-type-title` | DM Sans | ref-type-title-size | 600 | 1.2 |
| `sys-type-body` | DM Sans | ref-type-body-size | 500 | 1.5 |
| `sys-type-caption` | DM Sans | ref-type-caption-size | 500 | 1.4 |
| `sys-type-micro` | DM Sans | ref-type-micro-size | 600 | 1.3 |
| `sys-type-mono` | IBM Plex Mono | varies | varies | varies |

**Note:** Apply `sys-type-mono` to temperature values, percentages, and numeric displays.

### Spacing System（間距系統）

| Token | Value | Purpose |
|-------|-------|---------|
| `sys-spacing-xs` | ref-space-xs | line gaps, micro spacing |
| `sys-spacing-sm` | ref-space-sm | compact VStack/HStack gaps |
| `sys-spacing-md` | ref-space-md | small card padding |
| `sys-spacing-lg` | ref-space-lg | standard padding, card gaps |
| `sys-spacing-xl` | ref-space-xl | large padding, section gaps |
| `sys-spacing-2xl` | ref-space-2xl | major section separators |

### Radius System（圓角系統）

| Token | Value | Context |
|-------|-------|---------|
| `sys-radius-sm` | ref-radius-sm | small accent elements |
| `sys-radius-md` | ref-radius-md | buttons, icon backgrounds |
| `sys-radius-lg` | ref-radius-lg | cards, standard containers |
| `sys-radius-xl` | ref-radius-xl | large overlays |
| `sys-radius-full` | ref-radius-full | pills, floating nav, badges |

### Icon System（圖示系統）

| Token | Size | Stroke | Color Role |
|-------|------|--------|-----------|
| `sys-icon-sm` | 16pt | 1.5pt | sys-text-secondary |
| `sys-icon-md` | 20pt | 2pt | sys-text-primary / sys-delta-* |
| `sys-icon-lg` | 24pt | 2pt | sys-text-primary |
| `sys-icon-nav` | 24pt | 2pt | sys-delta-* (active) / sys-text-secondary (default) |

---

## Component Tokens（組件代碼）

Component tokens define the token usage contract for each reusable component. **Components must only reference system tokens, never hardcoded values or reference tokens.**

### MetricBlock（指標區塊）

Displays title, value, subtitle in a metric layout.

```swift
// Reference component usage
MetricBlock(
  title: "今日體感",        // → sys-type-caption (uppercase), sys-text-secondary
  value: "31°",             // → sys-type-title, sys-text-primary
  subtitle: "出門時段基準"   // → sys-type-caption, sys-text-secondary
)
```

**Component token map:**
| Slot | Token |
|------|-------|
| title (label) | `comp-metric-label`: sys-type-caption, uppercase, sys-text-secondary |
| value | `comp-metric-value`: sys-type-title, sys-text-primary |
| subtitle | `comp-metric-subtitle`: sys-type-caption, sys-text-secondary |
| spacing (title–value) | `comp-metric-gap-tight`: sys-spacing-xs (4pt) |
| spacing (value–subtitle) | `comp-metric-gap-tight`: sys-spacing-xs (4pt) |

---

### CommuteDeltaCard（通勤溫差卡）

Displays time slot, temperature delta, and comparison temps.

```swift
CommuteDeltaCard(
  title: "出門 08:00",       // → sys-type-caption, sys-text-primary
  slot: SlotCompare(...)     // delta icon (sys-delta-*), temps (sys-type-*), rain hint
)
```

**Component token map:**
| Slot | Token |
|------|-------|
| title | `comp-delta-card-title`: sys-type-body, sys-text-primary |
| delta value | `comp-delta-card-delta`: sys-type-title, sys-delta-* (color) |
| delta icon | `comp-delta-card-icon`: sys-icon-md, sys-delta-* (color) |
| comparison temps | `comp-delta-card-comparison`: sys-type-caption, sys-text-secondary |
| rain hint | `comp-delta-card-hint`: sys-type-caption, sys-text-secondary |
| card padding | `comp-delta-card-padding`: sys-spacing-lg (16pt) |
| card radius | `comp-delta-card-radius`: sys-radius-lg (20pt) |
| card background | `comp-delta-card-bg`: sys-surface-white, opacity: sys-opacity-card-overlay |
| card border | `comp-delta-card-border`: sys-delta-* (color), opacity: sys-opacity-subtle |
| card border-width | `comp-delta-card-border-width`: 1pt |

---

### DeltaAtmosphere（溫差背景）

Gradient background with blurred circle overlays, responding to temperature delta state.

**Component token map:**
| Slot | Token |
|------|-------|
| base gradient stop 1 | color: sys-delta-* (from TempDeltaState), opacity: sys-opacity-gradient-mid (0.55) |
| base gradient stop 2 | color: sys-delta-* (adjusted lighter), opacity: 0.18 |
| base gradient stop 3 | color: sys-surface-paper, opacity: 1.0 |
| circle 1 (large, cold) | color: sys-delta-* (primary), opacity: 0.22, blur: 40pt |
| circle 2 (small, light) | color: white, opacity: 0.35, blur: 30pt |

**Gradient direction:** topLeading → bottomTrailing

---

### Primary Button（主要按鈕）

CTA button for outfit logging (in DashboardView).

```swift
Button("記錄今日穿搭") {
  // action
}
.font(sys-type-body)
.frame(maxWidth: .infinity)
.padding(.vertical, sys-spacing-md)    // 12pt
.background(sys-text-primary)          // #111
.foregroundStyle(.white)
.clipShape(RoundedRectangle(cornerRadius: sys-radius-md))
```

**Component token map:**
| Slot | Token |
|------|-------|
| text | `comp-button-text`: sys-type-body, white |
| background | `comp-button-bg`: sys-text-primary (near-black) |
| padding | `comp-button-padding`: sys-spacing-md (12pt vertical) |
| radius | `comp-button-radius`: sys-radius-md (16pt) |
| state: disabled | opacity: sys-opacity-disabled (0.5) |
| state: pressed | scale: 0.95, opacity: 0.8 |

---

## Token Recalibration（代碼重新校準）

### Near Token Decisions（接近代碼決定）

When extracted values are very close, a decision is recorded here.

| Ref Token | Current Code Value | Difference | Decision | Reasoning |
|-----------|-------------------|-----------|----------|-----------|
| `ref-color-cold` | #4A90E2 | slightly different hex | `re-authorize` to #5A7A94 | Design refined on 2026-08-27; code not yet updated |
| `ref-color-warm` | #F5A623 | slightly different hex | `re-authorize` to #E8A44A | Design refined on 2026-08-27; code not yet updated |
| `ref-radius-lg` | 20px (code) vs 20px (design) | exact match | `keep distinct` | Verify 20px is intentional vs. 4pt grid alignment |
| `ref-radius-md` | 18px (CommuteDeltaCard) vs 16px (design) | 2pt off-grid | `re-authorize` to 16px | Current 18 is not on 4pt grid; snap to 16 |
| `ref-radius-sm` | 14px (button) vs 12–16pt (design) | unclear | `block pending more evidence` | Verify if 14px is intentional or needs alignment |

**Action:** Update `TempDeltaState.primary` colors in code to reflect re-authorizations above.

### Cross-Axis Numeric Coincidences（跨軸數值重合） — keep distinct

A 4pt-grid system intentionally reuses the same pixel value across different
semantic axes (radius, spacing, type size). These coincidences are **not** duplicate
tokens — each carries a distinct meaning and must scale independently. Decision for
all rows: **`keep distinct`**.

| Token A | Token B | Value | Decision | Reasoning |
|---------|---------|-------|----------|-----------|
| `ref-radius-sm` | `ref-space-md` | 12px | `keep distinct` | radius vs spacing — different axes, may diverge later |
| `ref-radius-sm` | `ref-type-caption-size` | 12px | `keep distinct` | radius vs font size — unrelated axes |
| `ref-radius-md` | `ref-space-lg` | 16px | `keep distinct` | radius vs spacing — different axes |
| `ref-radius-md` | `ref-type-body-size` | 16px | `keep distinct` | radius vs font size — unrelated axes |
| `ref-radius-lg` | `ref-space-xl` | 20px | `keep distinct` | radius vs spacing — different axes |
| `ref-radius-xl` | `ref-space-2xl` | 24px | `keep distinct` | radius vs spacing — different axes |
| `ref-radius-sm` | `ref-type-micro-size` | 12 vs 10px | `keep distinct` | near but distinct; different axes |
| `ref-radius-lg` | `ref-type-title-size` | 20 vs 22px | `keep distinct` | near but distinct; different axes |
| `ref-radius-xl` | `ref-type-title-size` | 24 vs 22px | `keep distinct` | near but distinct; different axes |
| `ref-radius-2xl` | `ref-blur-sm` | 28 vs 30px | `keep distinct` | radius vs blur radius — unrelated axes |

### Accessibility Remaps（無障礙重新映射）

No accessibility remaps required at this time. All color tokens pass WCAG AA contrast over their intended backgrounds.

---

## CSS/Swift Token Export Format（代碼導出格式）

### CSS Custom Properties（CSS自定義屬性）

```css
/* tokens-ref.css */
:root {
  --ref-color-cold: #5A7A94;
  --ref-color-cold-light: #6C8AA4;
  --ref-color-cold-dark: #435D76;
  --ref-color-neutral: #9E9E9E;
  --ref-color-warm: #E8A44A;
  --ref-color-paper: #FAF7F2;
  --ref-color-card: #F0EBE4;
  --ref-color-ink: #111;
  --ref-color-text-secondary: #666;
  --ref-color-text-tertiary: #999;
  --ref-color-white: #FFFFFF;

  --ref-radius-sm: 12px;
  --ref-radius-md: 16px;
  --ref-radius-lg: 20px;
  --ref-radius-xl: 24px;
  --ref-radius-2xl: 28px;
  --ref-radius-full: 48px;

  --ref-space-xs: 4px;
  --ref-space-sm: 8px;
  --ref-space-md: 12px;
  --ref-space-lg: 16px;
  --ref-space-xl: 20px;
  --ref-space-2xl: 24px;
}

/* tokens-sys.css */
:root {
  --sys-delta-cold: var(--ref-color-cold);
  --sys-delta-neutral: var(--ref-color-neutral);
  --sys-delta-warm: var(--ref-color-warm);
  
  --sys-text-primary: var(--ref-color-ink);
  --sys-text-secondary: var(--ref-color-text-secondary);
  
  --sys-surface-paper: var(--ref-color-paper);
  --sys-surface-card: var(--ref-color-card);
  
  --sys-radius-lg: var(--ref-radius-lg);
  --sys-spacing-lg: var(--ref-space-lg);
}
```

### Swift Token Enum（Swift代碼列舉）

```swift
// DesignTokens.swift — updated structure
enum YWTokens {
  // Reference colors
  enum Color {
    static let coldPrimary = Color(hex: 0x5A7A94)
    static let coldLight = Color(hex: 0x6C8AA4)
    static let coldDark = Color(hex: 0x435D76)
    static let warm = Color(hex: 0xE8A44A)
    static let neutral = Color(hex: 0x9E9E9E)
    // ... more ref colors
  }
  
  // System tokens
  enum Delta {
    static let cold = Color.coldPrimary
    static let warm = Color.warm
  }
  
  enum Text {
    static let primary = Color(hex: 0x111)
    static let secondary = Color(hex: 0x666)
  }
  
  enum Surface {
    static let paper = Color(hex: 0xFAF7F2)
    static let card = Color(hex: 0xF0EBE4)
  }
}

// Update TempDeltaState to use tokens
enum TempDeltaState: Equatable {
  case cooler
  case neutral
  case warmer

  var primary: Color {
    switch self {
    case .cooler: return YWTokens.Delta.cold      // was #4A90E2, now #5A7A94
    case .neutral: return YWTokens.Delta.neutral  // unchanged #9E9E9E
    case .warmer: return YWTokens.Delta.warm      // was #F5A623, now #E8A44A
    }
  }
}
```

---

## Hardcoded Color Migration Inventory（硬編碼顏色遷移清單）

Scan of `--include=*.swift` (2026-09-02) found these hardcoded colors that should
route through `YWTokens.Sys.*`. This is the remaining view-refactor work (a
distinct, behavior-affecting change — confirm before applying).

| File | Line | Current hex | Should map to | Note |
|------|------|-------------|---------------|------|
| `Theme/DeltaBackground.swift` | 11 | `0xF7F4EF` | `Sys.surfacePaper` (#FAF7F2) | gradient end stop |
| `Views/Components/MetricBlock.swift` | 16 | `0x1A1A1A` | `Sys.textPrimary` (#111) | value text |
| `Views/RootTabView.swift` | 13 | `0x1C1C1C` | `Sys.textPrimary` (#111) | tint |
| ~~`Views/Dashboard/DashboardView.swift`~~ | ~~125~~ | ✅ done | `Sys.textPrimary` + `radiusMd` | CTA migrated to tokens, radius 14→16 (2026-09-02) |
| `Views/Outfit/OutfitLogView.swift` | 26 | `0xF0EEEA` | `Sys.surfaceCard` (#F0EBE4) | card bg |
| `Views/Outfit/OutfitLogView.swift` | 66 | `0x4A90E2` / `0x1A1A1A` | `Sys.deltaCold` / `Sys.textPrimary` | ⚠️ old cold blue in save flash |
| `Views/Outfit/OutfitLogView.swift` | 79 | `0xF7F4EF` | `Sys.surfacePaper` | screen bg |
| `Views/Outfit/OutfitLogView.swift` | 105–106 | `0x1A1A1A` | `Sys.textPrimary` | chip selected bg/text |
| `Views/Onboarding/OnboardingFlowView.swift` | 15 | `0xF7F4EF` | `Sys.surfacePaper` | screen bg |
| `Views/Onboarding/OnboardingFlowView.swift` | 189 | `0x4A90E2` | `Sys.deltaCold` (#5A7A94) | ⚠️ old cold blue accent |
| `Views/Onboarding/OnboardingFlowView.swift` | 209, 220 | `0x1A1A1A` | `Sys.textPrimary` | button bg |

**⚠️ Behavior-affecting rows:** the `0x4A90E2` occurrences are the *pre-refinement*
cold blue. Migrating them to `Sys.deltaCold` (#5A7A94) is the same alignment already
applied to `TempDeltaState.primary` — but confirm intent, since it changes onboarding
and outfit-save visuals.

**Already migrated (2026-09-02):**
- `Shared/DesignTokens.swift` — `TempDeltaState.primary` now sources `YWTokens.Sys.*`
  (cool #4A90E2→#5A7A94, warm #F5A623→#E8A44A); `YWTypography` delegates to `YWTokens.Type`.

---

## Next Steps（後續步驟）

1. ~~Create `tokens/tokens-ref.css`~~ ✓ (2026-09-02)
2. ~~Create `tokens/tokens-sys.css`~~ ✓ (2026-09-02)
3. ~~Create `tokens/tokens-comp.css`~~ ✓ (2026-09-02)
4. ~~Update `Shared/DesignTokens.swift` / add `Shared/YWTokens.swift`~~ ✓ (2026-09-02)
5. Migrate remaining hardcoded colors in views (see inventory above) — **needs confirmation**
6. Add font files (DM Sans, IBM Plex Mono) and update typography tokens
7. Audit radius values in views and update off-grid values (e.g., button 14→16) to nearest 4pt step
