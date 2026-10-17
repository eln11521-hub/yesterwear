---
Report Language: zh-Hant (繁體中文)
---

# Design Principles（設計原則）

## Visual Personality（視覺人格）

**精緻、首頁值得、最小化編輯**

昨日天氣對比 的視覺語言是精緻的（refined）且編輯性的（editorial），適合作為 iPhone 首頁小工具展示。設計在保持簡潔的同時，通過品牌角色、細緻的排版和色彩來傳達溫度對比的情感。

**Evidence:** Design direction memory (2026-08-27), app screenshots show editorial spacing and minimal chrome

---

## Color Strategy（色彩策略）

### Semantic Temperature Palette（語義溫度色板）

The design uses color to communicate **temperature delta state** — whether today is cooler, neutral, or warmer than yesterday.

| State | Color | Usage | Emotional Signal | Tokens |
|-------|-------|-------|-----------------|--------|
| **Cooler (↓3° or more)** | `#5A7A94` dusty slate | DeltaAtmosphere gradient base, state badges, accent elements | calm, fresh, "bring a layer" | `sys-delta-cold`, `sys-delta-cold-gradient-light` |
| **Neutral (-2.9° to +2.9°)** | `#9E9E9E` neutral gray | state badges when delta is small | balanced, stable | `sys-delta-neutral` |
| **Warmer (↑3° or more)** | `#E8A44A` editorial orange | DeltaAtmosphere overlay, accent elements, warmth signal | warm, energetic, "lighter clothes" | `sys-delta-warm` |

**Why this strategy:** The delta is the app's signature signal—what it does better than a regular weather app. Color makes the state scannable at a glance on the home screen.

**Evidence:** Design direction (2026-08-27), DeltaAtmosphere gradient in DashboardView, TempDeltaState enum

**Implementation rule:** 
- Assign `TempDeltaState.primary` to return the appropriate semantic color (`sys-delta-*` token)
- Use semantic colors in gradients, backgrounds, accent elements, and state badges
- Do not hardcode hex values in components; always reference tokens

---

### Base Palette（基礎色板）

Support palette for surfaces, text, and neutral elements.

| Role | Color | Usage |
|------|-------|-------|
| **Paper background** | `#FAF7F2` warm cream | page/screen background, spacer fills |
| **Card background** | `#F0EBE4` beige | component card surface, slightly warmer than paper |
| **Text: primary** | `#111` near-black ink | headings, primary body text |
| **Text: secondary** | `#666` medium gray | secondary labels, hints, supporting text |
| **Text: tertiary** | `#999` light gray | timestamps, minimal UI text |
| **White surface** | `#FFFFFF` | modal overlays, translucent card backgrounds (with opacity) |

**Evidence:** Design direction, DashboardView component backgrounds (white.opacity(0.7)), hardcoded colors in MetricBlock and CommuteDeltaCard

**Implementation rule:**
- Card and surface components should reference `sys-surface-card` token (maps to `#F0EBE4`)
- Translucent cards use white background with opacity (0.7–0.8 range) for readability over delta gradient
- Text colors reference semantic tokens (`sys-text-primary`, `sys-text-secondary`) not hardcoded hex
- Never use pure white (`#FFFFFF`) as a fill color; use paper or card base tokens

---

## Typography（排版）

### Type Scale（字體量表）

昨日天氣對比 uses a clear hierarchy optimized for scanning weather deltas and outfit recommendations quickly.

| Level | Name | Font Size | Weight | Line Height | Use Case | Token |
|-------|------|-----------|--------|-------------|----------|-------|
| Hero | `YWTypography.hero` | 44pt | semibold | 1.1 | Large temperature display (today's temp) | `sys-type-hero` |
| Title | `YWTypography.title` | 22pt | semibold | 1.2 | Section headings, metric values | `sys-type-title` |
| Body | `YWTypography.body` | 16pt | medium | 1.5 | primary content, outfit text, suggestions | `sys-type-body` |
| Caption | `YWTypography.caption` | 12pt | medium | 1.4 | secondary info, labels, time slots | `sys-type-caption` |
| Micro | `YWTypography.micro` | 10pt | semibold | 1.3 | tags, smallest labels, tracking text | `sys-type-micro` |

**Evidence:** Implemented in `Shared/DesignTokens.swift`, used throughout DashboardView, MetricBlock, CommuteDeltaCard

**Font family:** Design specifies DM Sans (UI) + IBM Plex Mono (numbers/labels)  
**⚠️ Current implementation:** Uses system fonts (rounded design) — requires font file addition to match design spec

**Implementation rule:**
- Reference `YWTypography` scale (or CSS `sys-type-*` tokens) instead of hardcoding sizes
- Never use arbitrary font sizes; snap to scale levels
- Number displays (temperatures, percentages, deltas) should use IBM Plex Mono when deployed; currently uses system
- Letter spacing tracking is controlled per-component based on context (e.g. `.tracking(1.2)` on micro labels)

---

### Text Composition Patterns（文本組合模式）

Common recurring text arrangements that appear across screens.

#### Metric Display (title + value + subtitle)
- **Anatomy:** uppercase title (12px, semibold, secondary color) / big value (22–44px, semibold) / small subtitle (12px, secondary, optional)
- **Spacing:** 4pt gap between title and value, 2pt between value and subtitle
- **Usage:** MetricBlock in comparison cards, outfit stats, forecast details
- **Token dependencies:** `sys-type-caption` (title), `sys-type-title` (value), `sys-type-caption` (subtitle)

**Evidence:** MetricBlock component, DashboardView.comparison() showing "今日體感 / 39° / 出門時段基準"

#### Delta Summary (label + delta + comparison temps)
- **Anatomy:** hour/slot label (left) / temp delta with icon (center, prominent) / "today · yesterday" temps (right, small)
- **Spacing:** 8pt between label and delta, 8pt between delta and comparison
- **Usage:** CommuteDeltaCard for commute times
- **Token dependencies:** `sys-type-caption`, `sys-type-title`, `sys-delta-*` colors

**Evidence:** CommuteDeltaCard, "出門 08:00" / "+3.2°" / "今 31° · 昨 28°"

#### Section header
- **Anatomy:** label (12px, medium, secondary) above content
- **Spacing:** 10pt above, 16pt below (into card)
- **Token dependencies:** `sys-type-caption`, color secondary

**Evidence:** "昨日穿搭", "穿搭建議", "今日對比" labels throughout DashboardView

---

## Spacing & Layout Density（間距與佈局密度）

### Grid System（網格系統）

**4pt grid baseline** — all spacing, padding, gaps, and border radius must be multiples of 4pt.

| Value | Pixels | Use | Examples |
|-------|--------|-----|----------|
| 4pt | 4 | micro gaps between text lines | line height adjustments |
| 8pt | 8 | compact element spacing | VStack gap in metric blocks |
| 12pt | 12 | small padding, gaps | card internal gutters |
| 16pt | 16 | standard padding | card padding, list gaps |
| 20pt | 20 | large padding, section gaps | dashboard scroll padding, major section gaps |
| 24pt | 24 | extra large gap | (rare) between major sections |

**Radius:** 12, 16, 20, 24, 28, full (48+)

**Evidence:** Feedback rule [[spacing-4pt-grid]], current code uses 16, 20 padding but some radius values (14, 18) are off-grid

**Implementation rule:**
- Every spacing declaration must be a multiple of 4
- Radius values for interactive elements: 16 (buttons), 20 (cards), 24 (large overlays)
- Do not hardcode arbitrary spacing; create named tokens for recurring gaps (see TOKEN_ARCHITECTURE.md)
- When translating designs to code, snap non-grid values to the nearest 4pt step per design judgment

---

## Iconography（圖示）

### Icon System（圖示系統）

昨日天氣對比 uses **monochrome line icons** in the style of Lucide (or similar line icon sets), not emoji.

| Icon Role | Current | Intended | Style | Token |
|-----------|---------|----------|-------|-------|
| Delta state (cooler/neutral/warmer) | SF Symbol (arrow.down, equal, arrow.up) | custom or Lucide line icon | stroke 1.5–2pt | `icon-delta-down`, `icon-delta-level`, `icon-delta-up` |
| Rain hint | emoji `☔` | umbrella line icon | stroke 2pt | `icon-weather-rain` |
| Weather conditions (sunny/cloudy/rainy/cold) | TBD | line icon set | stroke 2pt, 20–24pt | `icon-weather-*` |
| Navigation (Trips/Map/Profile) | TBD | Gogo-style floating nav | stroke 2pt, filled active state | nav icon tokens |
| UI actions (settings, refresh, close) | TBD | Lucide subset | stroke 2pt | action icon tokens |

**Why line icons?** Editorial aesthetic + minimalist design language + consistent stroke weight with iconography, better legibility on home widgets

**Evidence:** Design direction states "monochrome line icons (lucide-style), NOT emoji"; current app uses mixed emoji/SF Symbol approach that needs replacement

**Implementation rule:**
- Replace all emoji with dedicated line icon components or vector assets
- Define icon tokens with size (default 20pt, 24pt for nav) and stroke weight (1.5–2pt)
- Icons in buttons/nav should use semantic color tokens (not hardcoded hex)
- Icon stroke weight should remain consistent (2pt) across the system
- Active/selected icons in nav can be filled or use white-on-ink treatment (see [[design-direction]])

---

## Elevation & Depth（高度與深度）

### Shadow & Layering（陰影與分層）

**Minimal approach:** Subtle shadows distinguish layers without heavy depth.

| Layer | Shadow | Usage |
|-------|--------|-------|
| **Base** | none | paper background |
| **Card (resting)** | soft 2–4pt blur, low opacity | metric cards, commute cards |
| **Card (floated)** | soft 6–8pt blur, medium opacity | modals, overlays |
| **Floating nav** | soft 4pt blur, medium opacity | navigation bar (Gogo style) |

**Evidence:** DashboardView cards use `.overlay(RoundedRectangle(...).strokeBorder(...))` pattern with border color opacity; no explicit shadow code yet

**Implementation rule:**
- Cards typically use border + light background opacity, not shadow (editorial aesthetic)
- Floating elements (nav, modals) use subtle soft shadow
- Define shadow tokens as `sys-shadow-sm`, `sys-shadow-md`, `sys-shadow-lg`
- Avoid drop shadows on static content; prefer border or alpha gradient

---

## Motion & Transitions（動畫與過渡）

### State Transitions（狀態過渡）

| Trigger | Duration | Easing | Target |
|---------|----------|--------|--------|
| Page push/pop | 0.3s | ease-out-cubic | slide + fade |
| Delta state change | 0.2s | ease-out | background color, icon opacity |
| Card expansion | 0.25s | ease-out-cubic | height, shadow |
| Button tap | 0.08s | ease-out | opacity, scale (0.95) |
| Pull-to-refresh | natural spring | iOS default | scroll view bounce |

**Evidence:** DashboardView uses `.refreshable` modifier (iOS native pull-to-refresh); no custom motion currently implemented

**Implementation rule:**
- Prefer iOS native motion (spring animations for interactive elements)
- Color transitions: 0.2–0.3s duration for delta state changes
- Interactive feedback: 0.08s for tap response (scale + opacity)
- Navigation: use NavigationStack default transitions
- Do not add motion where static state is appropriate (logo, static illustrations)

---

## Brand Mascot（品牌角色）

昨日天氣對比 features a **兔子與太陽 (rabbit + sun)** illustration as a brand moment on the home widget.

### Per-Surface Treatments（每個表面的處理）

- **Home widget (medium, full color):** colorful raster bunny illustration (3 rabbits + sun)
- **Lock screen widget (white-on-translucent):** white line-art bunny + sun (SVG stroke #fff)
- **2×2 home widget (light):** ink line bunny (stroke #111) with sun in brand accent orange (#E8A44A)

### Weather-State Variants（天氣狀態變體）

- **晴天 (sunny):** ears up, sun, smile
- **多雲 (cloudy):** ears up, cloud
- **下雨 (rainy):** ears down, cloud, raindrops
- **天冷 (cold):** ears down, snowflake, scarf, squint eyes, shiver marks

**Evidence:** mascot-bunny.md memory file, Figma key screens section

**Implementation rule:**
- Mascot is a brand asset, not interactive
- Size and placement: lock widget shows mascot at lower area; home widgets use it as a visual anchor
- Color consistency: match illustration colors to semantic delta state when appropriate (e.g., blue tones for cooler)
- Animation: if mascot expression changes with weather state, use subtle transitions (fade, not bounce)

---

## Anti-AI Style Rules（防止AI風格規則）

Maintain the editorial, refined aesthetic. **Do not allow:**

- ❌ Generic SaaS hero layouts (rounded squares + blue gradients + stock icons)
- ❌ Decorative gradients everywhere (use gradient only for delta atmosphere)
- ❌ Glassmorphism or frosted-glass effects on small elements
- ❌ Inflated whitespace/padding beyond 4pt grid (density matters)
- ❌ Unsupported illustration styles (cartoons, 3D renders, emoji art)
- ❌ Redundant borders on every card (use subtle opacity/shadow instead)
- ❌ Rainbow color palettes (stick to semantic + base palette)

**Why:** The app's value is precise, minimal, and home-screen–ready. AI-generated UI threatens that clarity.

**Evidence:** Design direction emphasizes "editorial, minimal" aesthetic; reference apps (Gogo packing list) show restraint in ornamentation

---

## Accessibility & Dark Mode（無障礙與深色模式）

### Contrast & Readability

- Minimum WCAG AA contrast (4.5:1) on text and interactive elements
- Text on translucent backgrounds should use text shadow or outline for legibility
- Current colors (dusty slate, editorial orange) meet AA on cream/white backgrounds

### Dark Mode

- Status: not yet implemented
- Approach: invert base palette (dark paper, light text), maintain semantic color meaning
- Priority: lock screen first (already white-on-dark), then home widget

**Implementation rule:**
- Define dark mode tokens alongside light mode
- Semantic delta colors (cool/warm/neutral) remain consistent in dark mode
- Base text colors: light gray on dark paper

---

## Implementation Checklist（實作檢查清單）

- [ ] Update `TempDeltaState.primary` colors to design direction values (#5A7A94, #E8A44A, #9E9E9E)
- [ ] Add gradient token definitions for delta atmosphere
- [ ] Create named color tokens (sys-delta-*, sys-text-*, sys-surface-*)
- [ ] Add DM Sans + IBM Plex Mono font files to project
- [ ] Update typography tokens to use new fonts
- [ ] Create icon tokens and replace emoji/SF Symbols with line icons
- [ ] Audit and fix spacing/radius to 4pt grid
- [ ] Add dark mode token variants
- [ ] Create component specs for MetricBlock, CommuteDeltaCard, DeltaAtmosphere
- [ ] Define mascot illustration system tokens
- [ ] Add motion/animation token definitions
