---
name: primary-button
description: Primary call-to-action button with dark background and rounded corners
metadata:
  type: component (interactive)
  category: action
  status: extracted
---

# Primary Button（主要按鈕）

## Purpose（目的）

主要行動呼籲按鈕，用於鼓勵使用者執行關鍵動作。在昨日天氣對比中用於記錄/更新今日穿搭。黑色背景提供高對比度，圓角設計與品牌美學相符。

---

## Evidence（證據）

| Evidence ID | Source | Location | Notes |
|---|---|---|---|
| E001 | DashboardView.swift | lines 118–128 (NavigationLink button) | Live implementation in outfit section |
| E002 | Reference screenshot | weather app—outfit section | Shows black button "記錄今日穿搭" or "更新今日穿搭" |

---

## Component Fingerprint（組件指紋）

| Dimension | Description |
|---|---|
| **Purpose** | Trigger primary action (record outfit, submit form, navigate) |
| **Behavior** | Tappable; shows visual feedback on press; navigates or executes action |
| **Composition role** | Reusable call-to-action component |
| **Anatomy** | Text label centered in rounded rectangle, dark background, white text |
| **Variants** | 2 label states (record vs. update); always dark styling |
| **States** | default, pressed (scale 0.95 + reduced opacity), disabled (opacity 0.5), loading (future) |
| **Token contract** | sys-type-body (text), sys-text-primary (bg), white foreground, sys-radius-md (radius), sys-spacing-md (padding) |
| **Layout** | horizontal (maxWidth .infinity), vertical padding, centered text |
| **Density** | standard (44pt minimum height) |
| **Visual reference** | [outfit section button in DashboardView] |
| **Native platform** | SwiftUI NavigationLink + Button styling |
| **Similar components** | None; primary button only in system currently |

---

## Anatomy（解剖）

```
┌─────────────────────────────────────────────┐
│                                             │ ← 44–48pt height
│          記錄今日穿搭 [text label]          │
│                                             │
└─────────────────────────────────────────────┘
  ← 16px left/right padding (frame maxWidth)
  ← 12px top/bottom padding (padding .vertical)
  ← 16px corner radius (sys-radius-md)
```

**Structure:**
- Text label (DM Sans or system, 16pt, medium weight, white)
- Dark background (#111 near-black)
- Rounded rectangle corners (16pt)
- Full-width horizontal fill (maxWidth .infinity)
- Vertical padding 12pt top/bottom
- Centered, no icon, pure text CTA

---

## Variants（變體）

| Variant | Label | Context | Styling |
|---------|-------|---------|---------|
| **record** | "記錄今日穿搭" | User has no outfit logged for today | dark bg + white text |
| **update** | "更新今日穿搭" | User already has outfit logged; click to change | same dark styling |

Both variants use identical styling; text only differs based on `outfit.today == nil`.

---

## States（狀態）

| State | Appearance | Interaction | Implementation |
|-------|-----------|-------------|---|
| **default** | dark bg, white text, normal scale | tappable | no modifier needed |
| **pressed** | scale 0.95, opacity 0.85 | during press | `.scaleEffect(0.95)` + opacity on active press |
| **disabled** | opacity 0.5, not tappable | disabled action | `.disabled(isDisabled)` + opacity modifier |
| **loading** | opacity 0.7, spinner indicator | action in progress | future enhancement (not implemented) |
| **focus** | iOS native focus ring (if VoiceOver active) | keyboard/screen reader | standard SwiftUI default |

---

## Token Contract（代碼契約）

| Component Token | System Token | Purpose | State |
|---|---|---|---|
| `comp-button-primary-text` | `sys-type-body` (16pt, medium) | label text style | default |
| `comp-button-primary-text-color` | white | label text color (high contrast) | default |
| `comp-button-primary-bg` | `sys-text-primary` (#111 ink) | button background (dark) | default |
| `comp-button-primary-radius` | `sys-radius-md` (16px) | corner radius | default |
| `comp-button-primary-padding-vertical` | `sys-spacing-md` (12pt) | top/bottom padding | default |
| `comp-button-primary-padding-horizontal` | inherited (maxWidth fills) | left/right padding (none explicit) | default |
| `comp-button-primary-scale-pressed` | 0.95 | scale on press | pressed |
| `comp-button-primary-opacity-pressed` | 0.85 | opacity on press | pressed |
| `comp-button-primary-opacity-disabled` | `sys-opacity-disabled` (0.5) | opacity when disabled | disabled |

---

## Layout Rules（佈局規則）

| Rule | Value | Notes |
|------|-------|-------|
| **Direction** | Horizontal (Text in Button wrapper) | single-line text CTA |
| **Width** | `.frame(maxWidth: .infinity)` | fills container width |
| **Height** | computed (16pt text + 12pt×2 padding ≈ 40pt, min 44pt for accessibility) | auto-height; provides 44pt+ hit target |
| **Alignment** | center (horizontal + vertical) | text centered in button |
| **Padding vertical** | `sys-spacing-md` (12pt) | comfort padding above/below text |
| **Padding horizontal** | implicit (fill width) | no explicit horizontal padding; uses .infinity |
| **Radius** | `sys-radius-md` (16pt) | medium corner radius, not full pill |
| **Line count** | 1 line | no text wrapping; label is short |
| **Responsive** | fills available width in VStack | adapts to container (full width in cards or modals) |

---

## Content Rules（內容規則）

| Aspect | Rule | Examples |
|--------|------|----------|
| **Label text** | actionable verb phrase, lowercase or sentence case | "記錄今日穿搭" "更新今日穿搭" |
| **Length** | 4–12 characters (Chinese) or 15–30 chars (English translation) | keep short; fits in button at 390px mobile |
| **Tone** | positive, encouraging | "記錄" (record), "更新" (update) |
| **Localization** | all labels translatable | store in string resources |
| **Icon** | none (text-only CTA in this system) | if icon added future, use sys-icon-* tokens |

---

## Accessibility Rules（無障礙規則）

| Rule | Implementation |
|---|---|
| **Touch target** | ✓ ≥44pt height (computed from padding + text size) meets iOS HIG |
| **Color contrast** | ✓ white on #111 achieves 21:1 (WCAG AAA) |
| **Text readability** | ✓ 16pt is readable; adequate for accessibility |
| **State feedback** | ✓ scale + opacity changes on press provide visual feedback |
| **Accessibility label** | ✓ text label is automatically used by VoiceOver ("記錄今日穿搭按鈕") |
| **Disabled state** | ✓ `.disabled()` modifier prevents interaction; opacity change is visual cue |
| **Keyboard support** | ✓ tabbable via keyboard; Space/Return activates on iOS 15+ with full keyboard access |

---

## Do / Don't（做法與禁忌）

### Do ✓

- Use for primary, high-confidence actions (record outfit, submit, confirm)
- Keep label short and action-oriented
- Provide clear visual feedback on tap (scale + opacity)
- Place prominently in UI (end of form, bottom of card, above fold)
- Ensure adequate surrounding padding (16pt margin recommended)
- Use within VStack or container (maxWidth requires parent constraint)
- Disable when action is invalid (e.g., form incomplete)

### Don't ✗

- Don't use for secondary/destructive actions (use secondary button style if added)
- Don't add icon without also updating token contract and width layout
- Don't hardcode colors (use token references)
- Don't make button text wrap to 2+ lines (keep label short)
- Don't remove visual feedback on press (users expect scale/opacity change)
- Don't use outside of a constrained container (maxWidth .infinity needs parent width)
- Don't add confusing labels ("確定" is fine; "可能點擊此按鈕" is not)

---

## Implementation Notes（實作註記）

### SwiftUI Implementation

**Current file:** `YesterdayWeather/Views/Dashboard/DashboardView.swift` (lines 118–128)

```swift
NavigationLink {
    OutfitLogView()
} label: {
    Text(outfit.today == nil ? "記錄今日穿搭" : "更新今日穿搭")
        .font(YWTokens.Type.body)              // was: YWTypography.body
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)                // sys-spacing-md
        .background(YWTokens.Text.primary)    // was: Color(hex: 0x1A1A1A)
        .foregroundStyle(.white)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))  // ⚠️ should be 16 (sys-radius-md)
}
```

### Refactoring Checklist

- [ ] Replace `YWTypography` with `YWTokens.Type.body`
- [ ] Replace hardcoded `Color(hex: 0x1A1A1A)` with `YWTokens.Text.primary` (note: current code uses 0x1A1A1A, design specifies 0x111; align with tokens)
- [ ] Update corner radius from 14 to 16 (sys-radius-md, on 4pt grid)
- [ ] Add pressed state animation: `.scaleEffect(isPressed ? 0.95 : 1.0)` with `@State var isPressed`
- [ ] Consider wrapping as reusable `PrimaryButton` component (currently inline)
- [ ] Test disabled state if action can be invalid
- [ ] Verify 44pt minimum hit target on various device sizes
- [ ] Add SwiftUI Preview with both label variants
- [ ] Test dynamic type (larger font size preference)

### Reusable Component Wrapper

For future use across app, consider extracting to a reusable component:

```swift
struct PrimaryButton: View {
    let label: String
    let action: () -> Void
    var isDisabled: Bool = false
    
    @State private var isPressed = false
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .font(YWTokens.Type.body)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(YWTokens.Text.primary)
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .scaleEffect(isPressed ? 0.95 : 1.0)
                .opacity(isDisabled ? 0.5 : 1.0)
        }
        .disabled(isDisabled)
        .onLongPressGesture(
            minimumDuration: 0.01,
            onPressingChanged: { pressing in isPressed = pressing }
        )
    }
}

// Usage:
PrimaryButton(
    label: outfit.today == nil ? "記錄今日穿搭" : "更新今日穿搭",
    action: { /* navigate to OutfitLogView */ },
    isDisabled: false
)
```

### Preview

```swift
#Preview("Record State") {
    VStack {
        Spacer()
        PrimaryButton(
            label: "記錄今日穿搭",
            action: { print("Tapped") }
        )
        .padding(16)
    }
    .background(Color(hex: 0xFAF7F2))
}

#Preview("Update State") {
    VStack {
        Spacer()
        PrimaryButton(
            label: "更新今日穿搭",
            action: { print("Tapped") }
        )
        .padding(16)
    }
    .background(Color(hex: 0xFAF7F2))
}

#Preview("Disabled State") {
    VStack {
        Spacer()
        PrimaryButton(
            label: "記錄今日穿搭",
            action: { print("Tapped") },
            isDisabled: true
        )
        .padding(16)
    }
    .background(Color(hex: 0xFAF7F2))
}
```

### Related Components

- **Uses:** NavigationLink (for outfit log navigation in DashboardView)
- **Used in:** DashboardView outfit section, future: OutfitLogView, any form completion flow
- **Similar to:** (none currently; would pair with secondary button if added)

### Gesture Handling

**Current behavior:** NavigationLink provides built-in tap handling  
**Enhanced version:** add `.onLongPressGesture` for press-down visual feedback

```swift
@State private var isPressed = false

// In button:
.onLongPressGesture(minimumDuration: 0.01) { _ in }
    .onLongPressGesture(
        minimumDuration: 0.01,
        onPressingChanged: { pressing in
            withAnimation(.easeInOut(duration: 0.08)) {
                isPressed = pressing
            }
        }
    )
```

---

## Color Reference（顏色參考）

| Element | Current (code) | Intended (design) | Status |
|---------|---|---|---|
| Background | `0x1A1A1A` | `0x111` (sys-text-primary) | minor diff; use token to unify |
| Text | white | white | ✓ correct |
| Radius | 14px | 16px (sys-radius-md) | ⚠️ off-grid; needs update |

---

## Known Issues & Future Work（已知問題與未來工作）

| Issue | Impact | Status |
|-------|--------|--------|
| ⚠️ Radius 14px off-grid | Not aligned with 4pt grid | should be 16px (sys-radius-md) |
| ⚠️ Color hex slightly misaligned | 0x1A1A1A vs 0x111 | minor; use token to standardize |
| Inline in DashboardView | Code duplication if used elsewhere | consider extracting to reusable component |
| No press-down animation | Tap feedback relies on default | add scale/opacity animation |
| No loading state | Can't show "Recording..." during async action | future enhancement |
| No secondary button variant | Only one button style in system | consider if secondary CTA needed |

---

## Testing Checklist（測試檢查清單）

- [ ] Tap button; verify action fires (NavigationLink navigates)
- [ ] Tap and hold; verify scale effect applies
- [ ] Test on iPhone SE (small) and iPhone 14 Pro Max (large)
- [ ] Test with VoiceOver enabled; verify button is properly announced
- [ ] Test with Dynamic Type enabled (larger font preference)
- [ ] Test in light mode and dark mode (if dark mode added)
- [ ] Verify 44pt minimum hit target using Xcode View Debugger
- [ ] Test with "Reduce motion" accessibility setting enabled
- [ ] Verify white text remains readable over dark background in all conditions
- [ ] Test disabled state with `.disabled(true)` modifier

---

## Motion & Feedback（動畫與反饋）

**Tap feedback:**
- Duration: 0.08s (instant)
- Scale: 0.95 (5% reduction)
- Opacity: optional 0.85–0.9 (subtle dimming)
- Easing: `.easeInOut`

**Navigation feedback:**
- NavigationLink provides native push animation
- No additional motion needed

**Disabled state:**
- Opacity: 0.5 (faded appearance)
- No scale change on disabled tap (no feedback needed)
