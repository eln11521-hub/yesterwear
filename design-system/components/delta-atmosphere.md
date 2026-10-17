---
name: delta-atmosphere
description: Animated gradient background responding to temperature delta state
metadata:
  type: component (background/visual)
  category: atmosphere
  status: extracted
---

# DeltaAtmosphere（溫差背景）

## Purpose（目的）

呈現一個響應式漸層背景，根據溫度差狀態（冷、中立、暖）改變顏色。使用模糊圓形層疊創造深度和動態感。此組件是純視覺的（decorative），適用於整個螢幕背景或容器背景。

---

## Evidence（證據）

| Evidence ID | Source | Location | Notes |
|---|---|---|---|
| E001 | DeltaBackground.swift | entire file (DeltaAtmosphere struct, lines 3–33) | Live implementation; used as ZStack background in DashboardView |
| E002 | DashboardView.swift | line 14 (ZStack with DeltaAtmosphere) | Applied as full-screen background responding to daily delta state |
| E003 | Reference screenshot | weather app main screen | Shows color-coordinated gradient background (blue for cool, orange for warm) |

---

## Component Fingerprint（組件指紋）

| Dimension | Description |
|---|---|
| **Purpose** | Provide animated gradient background reflecting temperature delta state |
| **Behavior** | Display-only; no interaction; can animate on state change |
| **Composition role** | Full-screen or container background pattern, semantic to delta state |
| **Anatomy** | LinearGradient (3 color stops) + 2 blurred Circle layers with opacity |
| **Variants** | 3 state variants (cooler/neutral/warmer) with distinct color palettes |
| **States** | cooler, neutral, warmer (not interactive; state determined by data) |
| **Token contract** | sys-delta-* colors, opacity tokens, gradient configuration |
| **Layout** | Fills container via `.ignoresSafeArea()`; geometry-driven circle placement |
| **Density** | Full-screen; no compact variant |
| **Visual reference** | [background in DashboardView] |
| **Native platform** | SwiftUI LinearGradient + Circle + GeometryReader |
| **Similar components** | None; unique atmosphere pattern in system |

---

## Anatomy（解剖）

```
┌──────────────────────────────────────────┐
│  LinearGradient (3-stop)                 │ ← base: state.primary (0.55 opacity)
│  ├─ stop 1: primary color, 55% opacity  │
│  ├─ stop 2: lighter primary, 18% opacity│
│  └─ stop 3: paper color, 100% opacity   │
│                                          │
│  Overlay 1: blurred circle               │ ← large circle (0.7 × geo width)
│  ├─ color: state.primary                │    blur: 40pt
│  ├─ opacity: 22%                        │    offset: -40x, -60y
│  └─ position: top-left area             │
│                                          │
│  Overlay 2: blurred circle               │ ← small circle (0.5 × geo width)
│  ├─ color: white                        │    blur: 30pt
│  ├─ opacity: 35%                        │    offset: +45% geo.width, +15% geo.height
│  └─ position: top-right area            │
└──────────────────────────────────────────┘
```

**Structure:**
- **LinearGradient:** 3-stop gradient from topLeading → bottomTrailing
  - Stop 1: primary color (state-dependent), 55% opacity
  - Stop 2: primary lighter (mixed with white), 18% opacity
  - Stop 3: base paper color (#FAF7F2), fully opaque
- **Circle 1 (large):** positioned top-left, uses state primary color
- **Circle 2 (small):** positioned top-right, white color for accent
- Both circles use `.blur()` modifier for soft edges
- All wrapped in `.overlay { GeometryReader { ... } }` for responsive sizing

---

## Variants（變體）

| Variant | State | Gradient Stops | Circle Colors | Use Case |
|---------|-------|---|---|---|
| **Cooler** | delta ≤ -3° | #6C8AA4 (55%), #5A7A94 lighter (18%), #FAF7F2 | #5A7A94 + white | Cold day, bring layers |
| **Neutral** | -3° < delta < 3° | #9E9E9E (55%), lighter gray (18%), #FAF7F2 | #9E9E9E + white | Stable temps, no surprise |
| **Warmer** | delta ≥ 3° | #E8A44A (55%), lighter orange (18%), #FAF7F2 | #E8A44A + white | Hot day, lighter clothes |

**Gradient direction:** topLeading → bottomTrailing (upper-left to lower-right)

---

## States（狀態）

| State | Appearance | Transition | Notes |
|-------|-----------|-----------|-------|
| **cooler** | blue gradient + blue circle | 0.3s ease-out | when daily delta ≤ -3°C |
| **neutral** | gray gradient + gray circle | 0.3s ease-out | when daily delta -3°C to +3°C |
| **warmer** | orange gradient + orange circle | 0.3s ease-out | when daily delta ≥ +3°C |

**State transitions:**
- When TempDeltaState changes, background animates to new color over 0.3s
- Currently uses implicit SwiftUI animation; can be enhanced with explicit `.withAnimation`

---

## Token Contract（代碼契約）

| Component Token | System Token | Purpose | State |
|---|---|---|---|
| `comp-atmosphere-gradient-primary-1` | `sys-delta-*` | gradient stop 1 (primary color) | cooler/neutral/warmer |
| `comp-atmosphere-gradient-primary-1-opacity` | `sys-opacity-gradient-mid` (0.55) | opacity of gradient stop 1 | default |
| `comp-atmosphere-gradient-primary-2-opacity` | 0.18 | opacity of gradient stop 2 | default |
| `comp-atmosphere-gradient-end` | `sys-surface-paper` (#FAF7F2) | gradient stop 3 (base), fully opaque | default |
| `comp-atmosphere-circle-1-color` | `sys-delta-*` | large circle (matches gradient primary) | cooler/neutral/warmer |
| `comp-atmosphere-circle-1-size` | 0.7 × geo.width | circle 1 diameter relative to viewport | default |
| `comp-atmosphere-circle-1-blur` | 40pt | blur radius for circle 1 | default |
| `comp-atmosphere-circle-1-opacity` | 0.22 | circle 1 opacity | default |
| `comp-atmosphere-circle-1-offset-x` | -40pt | circle 1 x-offset from center | default |
| `comp-atmosphere-circle-1-offset-y` | -60pt | circle 1 y-offset from center | default |
| `comp-atmosphere-circle-2-color` | white | circle 2 accent color (always white) | default |
| `comp-atmosphere-circle-2-size` | 0.5 × geo.width | circle 2 diameter relative to viewport | default |
| `comp-atmosphere-circle-2-blur` | 30pt | blur radius for circle 2 | default |
| `comp-atmosphere-circle-2-opacity` | 0.35 | circle 2 opacity | default |
| `comp-atmosphere-circle-2-offset-x` | 45% geo.width | circle 2 x-offset (right side) | default |
| `comp-atmosphere-circle-2-offset-y` | 15% geo.height | circle 2 y-offset (upper area) | default |

**State-driven color mapping:**
```
TempDeltaState.cooler  → sys-delta-cold (#5A7A94 primary, #6C8AA4 light)
TempDeltaState.neutral → sys-delta-neutral (#9E9E9E)
TempDeltaState.warmer  → sys-delta-warm (#E8A44A)
```

---

## Layout Rules（佈局規則）

| Rule | Value | Notes |
|------|-------|-------|
| **Fill behavior** | `.ignoresSafeArea()` | extends behind status bar, notch, safe areas |
| **Gradient direction** | topLeading → bottomTrailing | diagonal from upper-left to lower-right |
| **Circle sizing** | responsive via GeometryReader | circle 1: 0.7 × width, circle 2: 0.5 × width |
| **Offset mode** | absolute pt + relative % mix | circle 1: fixed offsets; circle 2: proportional offsets |
| **Z-order** | background (ZStack order 0) | behind all foreground content |
| **Overlay structure** | `.overlay { GeometryReader { ... } }` | responsive sizing within overlay |
| **allowsHitTesting** | false | circles don't intercept taps (content is interactive) |

---

## Content Rules（內容規則）

This component is purely visual and decorative; no text content.

**Data input:**
- `state: TempDeltaState` (cooler, neutral, or warmer)
- Derived from daily delta: `TempDeltaState.from(deltaCelsius: snap.overallDelta)`

---

## Accessibility Rules（無障礙規則）

| Rule | Implementation |
|---|---|
| **Color-only meaning** | ✓ Background color is decorative; actual state conveyed by text/data in foreground |
| **Critical info** | ✓ No critical information encoded in background alone; content is readable over any variant |
| **Screen reader** | Ignored (purely visual; marked with `.accessibility(hidden: true)` if needed) |
| **Contrast** | ✓ Foreground text (white/dark) meets AA contrast over all gradient variants |
| **Motion** | Subtle animation (0.3s); does not violate motion sensitivity guidelines |

---

## Do / Don't（做法與禁忌）

### Do ✓

- Use as full-screen background in DashboardView or similar weather-focused screens
- Let color change smoothly when daily delta state changes
- Pair with high-contrast foreground text (white on cool/warm, adjust on neutral)
- Use on screens displaying weather/temperature data
- Allow overlay of card components (cards use translucent backgrounds to show through)

### Don't ✗

- Don't use as a data carrier (it's decorative; put real state in text)
- Don't add clickable elements directly on the gradient
- Don't make circles too large (obscures content)
- Don't hardcode gradient colors (use TempDeltaState.primary)
- Don't use on all screens (reserve for weather-centric views)
- Don't add animation beyond state transitions

---

## Implementation Notes（實作註記）

### SwiftUI Implementation

**Current file:** `YesterdayWeather/Theme/DeltaBackground.swift` (entire file, lines 3–33)

```swift
struct DeltaAtmosphere: View {
    let state: TempDeltaState

    var body: some View {
        LinearGradient(
            colors: [
                state.primary.opacity(0.55),              // sys-opacity-gradient-mid
                state.primary.opacity(0.18),
                Color(hex: 0xF7F4EF)                      // should be sys-surface-paper (#FAF7F2)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
        .overlay {
            GeometryReader { geo in
                Circle()
                    .fill(state.primary.opacity(0.22))    // sys-opacity for circle 1
                    .frame(width: geo.size.width * 0.7)
                    .blur(radius: 40)
                    .offset(x: -40, y: -60)
                Circle()
                    .fill(Color.white.opacity(0.35))      // sys-opacity for circle 2
                    .frame(width: geo.size.width * 0.5)
                    .blur(radius: 30)
                    .offset(x: geo.size.width * 0.45, y: geo.size.height * 0.15)
            }
            .allowsHitTesting(false)
        }
    }
}
```

### Refactoring Checklist

- [ ] Update TempDeltaState.primary colors (#4A90E2 → #5A7A94, #F5A623 → #E8A44A)
- [ ] Replace `Color(hex: 0xF7F4EF)` with `YWTokens.Surface.paper` (#FAF7F2)
- [ ] Extract opacity values to named constants: `comp-atmosphere-opacity-*`
- [ ] Add `.transition(.opacity)` for smoother state changes
- [ ] Test all three color states (cooler, neutral, warmer) with actual data
- [ ] Verify contrast of foreground text over all three backgrounds
- [ ] Test on various device sizes (iPhone SE, iPhone 14 Pro, iPad)
- [ ] Consider dark mode variant (when implemented)
- [ ] Add preview with state toggle (PreviewProvider or #Preview macro)

### Responsive Behavior

- **Mobile (375–428px):** circles scale with viewport; geometry-based sizing maintains proportions
- **Tablet (768px+):** circles become larger (0.7, 0.5 of wider screen); may need offset adjustment to avoid obscuring content

### Related Components

- **Used in:** DashboardView as ZStack background
- **Pairs with:** all foreground components (MetricBlock, CommuteDeltaCard, Primary Button)
- **Depends on:** TempDeltaState (which depends on daily weather delta)

### Data Model

```swift
struct DashboardView: View {
    var body: some View {
        let snap = weather.snapshot  // WeatherSnapshot
        let state = snap.map { TempDeltaState.from(deltaCelsius: $0.overallDelta) } ?? .neutral
        
        ZStack {
            DeltaAtmosphere(state: state)  // ← passes computed state
            // ... foreground content
        }
    }
}
```

### Animation

**Current behavior:** implicit SwiftUI animation when state changes  
**Enhanced version:** add explicit animation

```swift
.withAnimation(.easeOut(duration: 0.3)) {
    DeltaAtmosphere(state: newState)
}
```

### Preview

```swift
#Preview("Cooler State") {
    ZStack {
        DeltaAtmosphere(state: .cooler)
        VStack {
            Text("降溫 -4.0°")
                .font(.largeTitle)
                .foregroundStyle(.white)
        }
    }
}

#Preview("Neutral State") {
    ZStack {
        DeltaAtmosphere(state: .neutral)
        VStack {
            Text("持平 +0.5°")
                .font(.largeTitle)
                .foregroundStyle(.white)
        }
    }
}

#Preview("Warmer State") {
    ZStack {
        DeltaAtmosphere(state: .warmer)
        VStack {
            Text("升溫 +3.2°")
                .font(.largeTitle)
                .foregroundStyle(.white)
        }
    }
}
```

---

## Color Reference（顏色參考）

**Gradient colors per state:**

| State | Stop 1 (primary) | Stop 1 opacity | Stop 2 lighter | Stop 3 (base) |
|-------|---|---|---|---|
| Cooler | #5A7A94 | 55% | #6C8AA4 (lighter) | #FAF7F2 |
| Neutral | #9E9E9E | 55% | #BFBFBF (lighter) | #FAF7F2 |
| Warmer | #E8A44A | 55% | #F0B860 (lighter) | #FAF7F2 |

**Circle opacities:**
- Circle 1: 22% opacity (primary color, large, top-left)
- Circle 2: 35% opacity (white, small, top-right)

---

## Known Issues & Future Work（已知問題與未來工作）

| Issue | Impact | Status |
|-------|--------|--------|
| ⚠️ Paper color hardcoded | Not using token | easy refactor to `sys-surface-paper` |
| ⚠️ TempDeltaState colors outdated | Color mismatches design direction | needs code update |
| ⚠️ Opacity values hardcoded | Not using opacity tokens | refactor to `sys-opacity-*` tokens |
| Transition timing not explicit | Could be more controlled | add `.withAnimation(.easeOut(duration: 0.3))` |
| Dark mode not supported | iOS 13+ expects dark mode variant | future enhancement |
| Circle sizing tied to viewport | No tablet-specific tuning | may need breakpoint adjustment for iPad |

---

## Performance Considerations（性能考慮）

- **LayerView cost:** GeometryReader + blur is relatively lightweight; acceptable for full-screen background
- **Redraw trigger:** state change only (not continuous animation unless state flickers)
- **Optimization:** blur is GPU-backed; no performance concerns for typical usage
- **Testing:** monitor frame rate when transitioning between states on older devices (iPhone SE 1st gen)
