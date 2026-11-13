import SwiftUI

// Native ports of the web design-system components in
// design-system-web/src/components/. Sizes, colors and spacing follow each
// component's CSS; the web Storybook is the reference for every value here.

private typealias T = YWTokens.Typography
private typealias S = YWTokens.Sys

// MARK: - Shared glyphs

/// Solid map pin with a punched-out center (web TopBar PinIcon, 24×24 grid).
struct PinGlyph: Shape {
    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height) / 24
        func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: rect.minX + x * s, y: rect.minY + y * s) }
        var path = Path()
        // Teardrop: circle of r=8 at (12,10) closing to a point at (12,22).
        path.move(to: p(12, 22))
        path.addCurve(to: p(4, 10), control1: p(12, 22), control2: p(4, 16))
        path.addArc(center: p(12, 10), radius: 8 * s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: false)
        path.addCurve(to: p(12, 22), control1: p(20, 16), control2: p(12, 22))
        path.closeSubpath()
        path.addEllipse(in: CGRect(origin: p(9.5, 7.5), size: CGSize(width: 5 * s, height: 5 * s)))
        return path
    }
}

/// Template asset rendered at a fixed square size (web <Icon>, CSS-mask tinted).
struct AssetIcon: View {
    let name: String
    var size: CGFloat = 16

    var body: some View {
        Image(name)
            .renderingMode(.template)
            .resizable()
            .scaledToFit()
            .frame(width: size, height: size)
    }
}

/// Weather condition art (multi-color, web <WeatherIcon> as <img>).
struct WeatherGlyph: View {
    let condition: WeatherCondition
    var size: CGFloat = 22

    var body: some View {
        Image(condition.asset)
            .resizable()
            .scaledToFit()
            .frame(width: size, height: size)
    }
}

/// 兔子與太陽 mascot (web <Mascot>). Every delta state shares the neutral art
/// today; cold/warm illustrations drop in here when they exist.
struct MascotView: View {
    var size: CGFloat = 108
    var state: TempDeltaState = .neutral

    var body: some View {
        Image("mascot")
            .resizable()
            .scaledToFit()
            .frame(width: size)
            .accessibilityLabel("昨日天氣對比 吉祥物")
    }
}

/// Delta direction color: rising → warm, falling → cold, flat → neutral.
enum DeltaTint {
    static func color(for text: String) -> Color {
        if text.contains("↑") { return S.deltaWarm }
        if text.contains("↓") { return S.deltaCold }
        return S.deltaNeutral
    }
}

// MARK: - TopBar

/// Location (tap to switch places) + date on the left, refresh on the right
/// (web TopBar, Figma 174:7).
struct TopBar: View {
    let location: String
    /// Optional — the v5 home header shows only the place.
    var date: String? = nil
    /// Tap the pin + place to switch places.
    var onLocationTap: (() -> Void)? = nil
    /// Tap the gear to open Settings (refresh is pull-to-refresh).
    var onSettingsTap: () -> Void = {}

    var body: some View {
        HStack(spacing: 12) {
            HStack(spacing: 6) {
                Button { onLocationTap?() } label: {
                    HStack(spacing: 6) {
                        PinGlyph()
                            .fill(S.textPrimary, style: FillStyle(eoFill: true))
                            .frame(width: 16, height: 16)
                        Text(location)
                            .font(T.ui(16, .semibold))
                            .foregroundStyle(S.textPrimary)
                            .lineLimit(1)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .disabled(onLocationTap == nil)
                .accessibilityLabel("目前地點：\(location)，點擊切換地點")
                if let date { Text(date)
                    .font(T.mono(11))
                    .foregroundStyle(S.textMutedWarm)
                    .lineLimit(1) }
            }
            Spacer(minLength: 0)
            // 44×44 hit area; the negative padding keeps the glyph flush with the
            // card edge and centred on the place name.
            Button(action: onSettingsTap) {
                AssetIcon(name: "nav-gear", size: 20)
                    .foregroundStyle(S.textLabel)
                    .frame(width: 44, height: 44)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .padding(.vertical, -12)
            .padding(.trailing, -12)
            .accessibilityLabel("設定")
        }
    }
}

struct SectionLabel<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        // Figma 486:16 (v5): 5pt ink dot + 14 Medium ink.
        HStack(spacing: 10) {
            Circle().fill(S.textPrimary).frame(width: 5, height: 5)
            content
                .font(T.ui(14, .medium))
                .foregroundStyle(S.textPrimary)
        }
    }
}

extension SectionLabel where Content == Text {
    init(_ title: String) { self.init { Text(title) } }
}

// MARK: - OutfitChip

/// Garment chip (web OutfitChip, Figma 226:3163 / compact 173:2919).
struct OutfitChip: View {
    let label: String
    var asset: String? = nil
    var selected: Bool = false
    var compact: Bool = false
    var action: (() -> Void)? = nil

    var body: some View {
        let fg: Color = selected ? S.textOnDark : (compact ? S.textBody : S.textPrimary)
        let content = HStack(spacing: 6) {
            if let asset { AssetIcon(name: asset, size: compact ? 14 : 16) }
            Text(label)
                .font(T.ui(compact ? 12 : 14, .medium))
                .lineLimit(1)
                .fixedSize()
        }
        .foregroundStyle(fg)
        .padding(.leading, compact ? 10 : 12)
        .padding(.trailing, compact ? 12 : 14)
        .padding(.vertical, compact ? 6 : 9)
        .background(selected ? S.textPrimary : S.surfaceWhite, in: Capsule())
        .overlay(Capsule().strokeBorder(selected ? S.textPrimary : S.line, lineWidth: 1))
        .animation(.easeOut(duration: S.motionStateDuration), value: selected)

        if let action {
            Button(action: action) { content }.buttonStyle(.plain)
        } else {
            content
        }
    }
}

/// 昨日穿搭 on one line (web ChipLine): up to 3 chips — fewer when they don't
/// fit — and the rest folded into「+N」, which expands the row in place.
struct ChipLine: View {
    let chips: [OutfitChipItem]
    @State private var expanded = false

    private static let maxShown = 3

    var body: some View {
        if expanded {
            ChipFlow {
                ForEach(chips, id: \.self) { chip($0) }
                more("收合") { expanded = false }
            }
        } else {
            line
        }
    }

    /// The longest prefix (≤ 3) that fits, then +N.
    private var line: some View {
        ViewThatFits(in: .horizontal) {
            ForEach(Array((1...max(1, min(Self.maxShown, chips.count))).reversed()), id: \.self) { k in
                HStack(spacing: 8) {
                    ForEach(chips.prefix(k), id: \.self) { chip($0) }
                    if chips.count > k {
                        more("+\(chips.count - k)") { expanded = true }
                    }
                }
            }
        }
    }

    private func chip(_ c: OutfitChipItem) -> some View {
        OutfitChip(label: c.label, asset: c.asset, compact: true)
    }

    /// +N / 收合 — a text-only compact chip.
    private func more(_ label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(T.ui(12, .medium))
                .foregroundStyle(S.textBody)
                .lineLimit(1)
                .fixedSize()
                .padding(.horizontal, 12)
                .frame(height: 28)
                .background(S.surfaceWhite, in: Capsule())
                .overlay(Capsule().strokeBorder(S.line, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}

/// Wrapping row of chips (web .yw-home__chips: flex-wrap, gap 8).
struct ChipFlow: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowH: CGFloat = 0, maxX: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x > 0, x + s.width > width { x = 0; y += rowH + spacing; rowH = 0 }
            x += s.width + spacing
            rowH = max(rowH, s.height)
            maxX = max(maxX, x - spacing)
        }
        return CGSize(width: maxX, height: y + rowH)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowH: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x > bounds.minX, x + s.width > bounds.maxX { x = bounds.minX; y += rowH + spacing; rowH = 0 }
            v.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(s))
            x += s.width + spacing
            rowH = max(rowH, s.height)
        }
    }
}

// MARK: - Commute column

/// Slot · temp · note column (web CommuteRow, Figma Commute Row 504:231). The
/// last line is 「較昨日 ↓3°」 when `delta` is set, otherwise `note` — both muted.
struct CommuteColumn: View {
    let slot: String
    let temp: String
    var delta: String? = nil
    var note: String? = nil

    var body: some View {
        VStack(spacing: 3) {
            Text(slot)
                .font(T.mono(10.5))
                .foregroundStyle(S.textLabel)
            Text(temp)
                .font(T.ui(24, .medium))
                .tracking(-0.24)
                .foregroundStyle(S.textPrimary)
            if let line = delta.map({ "較昨日 \($0)" }) ?? note {
                Text(line)
                    .font(T.ui(10))
                    .foregroundStyle(S.textMutedWarm)
            }
        }
        .lineLimit(1)
        .fixedSize()
        .padding(.horizontal, 8)
    }
}

// MARK: - Forecast row

/// One day of the week forecast (web ForecastRow, Figma 174:87):
/// day · icon(+pop) · low · range bar(+today knob) · high.
struct ForecastRow: View {
    let day: String
    let condition: WeatherCondition
    let low: Int
    let high: Int
    let weekMin: Int
    let weekMax: Int
    var pop: Int? = nil
    var current: Int? = nil

    var body: some View {
        HStack(spacing: 10) {
            Text(day)
                .font(T.ui(12))
                .foregroundStyle(Color(hex: 0x555553))
                .frame(width: 38, alignment: .leading)
            VStack(spacing: 1) {
                WeatherGlyph(condition: condition, size: 22)
                if let pop {
                    Text("\(pop)%")
                        .font(T.ui(9))
                        .foregroundStyle(S.deltaCold)
                }
            }
            .frame(width: 30)
            Text("\(low)°")
                .font(T.ui(14))
                .foregroundStyle(Color(hex: 0x8E8E8C))
                .frame(width: 26, alignment: .trailing)
            bar
            Text("\(high)°")
                .font(T.ui(14, .medium))
                .foregroundStyle(S.textPrimary)
                .frame(width: 26, alignment: .trailing)
        }
        .padding(.vertical, 11)
        .padding(.horizontal, 16)
    }

    private var bar: some View {
        let span = Double(max(weekMax - weekMin, 1))
        func clamp(_ v: Double) -> Double { max(0, min(1, v)) }
        let left = clamp(Double(low - weekMin) / span)
        let width = clamp(Double(high - low) / span)
        let knob = current.map { clamp(Double($0 - weekMin) / span) }

        // Figma 608:1555: 4pt bar, track = ink 8%, fill = body ink; optional knob.
        return GeometryReader { geo in
            let w = geo.size.width
            ZStack(alignment: .leading) {
                Capsule().fill(S.textPrimary.opacity(0.08)).frame(height: 4)
                Capsule().fill(S.textBody)
                    .frame(width: max(8, w * width), height: 4)
                    .offset(x: w * left)
                if let knob {
                    Circle()
                        .fill(.white)
                        .overlay(Circle().strokeBorder(S.textPrimary.opacity(0.15), lineWidth: 1))
                        .frame(width: 9, height: 9)
                        .offset(x: w * knob - 4.5)
                }
            }
            .frame(width: w, height: geo.size.height)
        }
        .frame(height: 9)
    }
}

// MARK: - Primary button

/// Full-width primary CTA (web PrimaryButton: Outfit SemiBold 15, py15 px24,
/// radius 16, ink, scale 0.95 on press).
struct YWPrimaryButton: View {
    let label: String
    var icon: String? = nil
    var isDisabled: Bool = false
    /// Fully rounded, 14pt label — the Home 記錄今天穿搭 CTA (Figma 515:901).
    var pill: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon { AssetIcon(name: icon, size: 18) }
                Text(label).font(T.ui(pill ? 14 : 15, pill ? .bold : .semibold))
            }
            .foregroundStyle(S.textOnDark)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 15)
            .padding(.horizontal, 24)
            .background(S.textPrimary, in: RoundedRectangle(cornerRadius: pill ? 100 : S.radiusMd))
        }
        .buttonStyle(PressScaleStyle())
        .disabled(isDisabled)
        .opacity(isDisabled ? S.opacityDisabled : 1)
    }
}

// MARK: - Floating nav

struct FloatingNavItem: Identifiable {
    let id: String
    let label: String
    let icon: String
}

/// Pill tab bar (web FloatingNav, Gogo-style).
struct FloatingNav: View {
    let items: [FloatingNavItem]
    let activeId: String
    var onSelect: (String) -> Void

    var body: some View {
        HStack(spacing: 4) {
            ForEach(items) { item in
                let active = item.id == activeId
                Button { onSelect(item.id) } label: {
                    VStack(spacing: 3) {
                        AssetIcon(name: item.icon, size: 20)
                        Text(item.label)
                            .font(T.ui(11, .medium))
                    }
                    .foregroundStyle(active ? S.textOnDark : S.textHint)
                    .padding(.vertical, 8)
                    .padding(.horizontal, 16)
                    .background(active ? S.textPrimary : .clear, in: RoundedRectangle(cornerRadius: 16))
                    .contentShape(RoundedRectangle(cornerRadius: 16))
                }
                .buttonStyle(.plain)
                .animation(.easeOut(duration: S.motionStateDuration), value: active)
            }
        }
        .padding(6)
        .background(S.surfaceWhite, in: RoundedRectangle(cornerRadius: 22))
        .overlay(RoundedRectangle(cornerRadius: 22).strokeBorder(S.line, lineWidth: 1))
        .shadow(color: Color(hex: 0x291F0A).opacity(0.16), radius: 4, y: 6)
    }
}

// MARK: - Widget promo card

/// 「把 Widget 加到桌面」banner (web WidgetPromoCard, Figma 173:2932 deco).
struct WidgetPromoCard: View {
    let title: String
    let subtitle: String
    var action: () -> Void = {}

    var body: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(T.ui(16, .medium))
                    .foregroundStyle(S.textPrimary)
                Text(subtitle)
                    .font(T.ui(12))
                    .foregroundStyle(S.textPrimary.opacity(0.7))
            }
            Spacer(minLength: 0)
            Button(action: action) {
                // White, not ink: the sticky CTA is the page's only solid-ink element.
                AssetIcon(name: "icon-arrow-right", size: 18)
                    .foregroundStyle(S.textPrimary)
                    .frame(width: 38, height: 38)
                    .background(S.surfaceWhite, in: Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(title)
        }
        .padding(.vertical, 24)
        .padding(.horizontal, 16)
        .background(alignment: .topTrailing) {
            PromoSwoosh()
                .stroke(.white.opacity(0.43), style: StrokeStyle(lineWidth: 20, lineCap: .round, lineJoin: .round))
                .frame(width: 127.347, height: 123.054)
                .rotationEffect(.degrees(-89.81))
                .frame(width: 123.486, height: 127.764)
                .offset(x: -15.51, y: -16)
        }
        .background(S.promoBg)
        .clipShape(RoundedRectangle(cornerRadius: 24))
    }
}

/// Looping stroke from Figma 173:2932, authored in a 128×124 box.
private struct PromoSwoosh: Shape {
    func path(in rect: CGRect) -> Path {
        let sx = rect.width / 128, sy = rect.height / 124
        func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: rect.minX + x * sx, y: rect.minY + y * sy) }
        let c: [(CGFloat, CGFloat, CGFloat, CGFloat, CGFloat, CGFloat)] = [
            (5.80, 81.11, 34.41, 79.78, 73.11, 78.98),
            (86.90, 78.70, 89.80, 82.15, 91.13, 83.69),
            (97.16, 90.67, 97.28, 96.25, 97.23, 109.92),
            (97.22, 113.07, 95.58, 114.91, 93.91, 116.48),
            (85.48, 124.44, 63.46, 123.56, 51.85, 122.07),
            (46.67, 121.40, 46.14, 113.17, 46.17, 106.83),
            (46.21, 99.08, 49.79, 88.69, 56.22, 75.62),
            (65.23, 60.97, 77.10, 45.64, 93.18, 29.35),
            (102.65, 20.48, 114.82, 10.39, 127.35, 0),
        ]
        var path = Path()
        path.move(to: p(0, 83.82))
        for k in c { path.addCurve(to: p(k.4, k.5), control1: p(k.0, k.1), control2: p(k.2, k.3)) }
        return path
    }
}

// MARK: - Card container

extension View {
    /// Raised card on the paper ground (web .yw-home__card, Figma var card #f5f5f5).
    /// `fillHeight` lets the card stretch to the height its parent offers,
    /// content pinned to the top (Home's outfit card on the first screen).
    func ywCard(padding: EdgeInsets = EdgeInsets(top: 12, leading: 16, bottom: 12, trailing: 16),
                fillHeight: Bool = false) -> some View {
        self
            .padding(padding)
            .frame(maxWidth: .infinity, maxHeight: fillHeight ? .infinity : nil, alignment: .topLeading)
            .background(S.surfaceRaised, in: RoundedRectangle(cornerRadius: S.radiusXl))
    }
}

// MARK: - Secondary button

/// Outlined secondary action (web SecondaryButton: ink hairline border, transparent).
struct YWSecondaryButton: View {
    let label: String
    var icon: String? = nil
    /// Fully rounded, 14pt Bold on a white fill — the Home CTA once today is
    /// recorded (查看今日穿搭); same size as the YWPrimaryButton pill.
    var pill: Bool = false
    let action: () -> Void

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: pill ? 100 : S.radiusMd)
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon { AssetIcon(name: icon, size: 18) }
                Text(label).font(T.ui(pill ? 14 : 15, pill ? .bold : .semibold))
            }
            .foregroundStyle(S.textPrimary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 15)
            .padding(.horizontal, 24)
            .background(pill ? S.surfaceWhite : .clear, in: shape)
            .overlay(shape.strokeBorder(S.textPrimary, lineWidth: 1))
            .contentShape(shape)
        }
        .buttonStyle(PressScaleStyle())
    }
}

// MARK: - Section badge

/// 必選 / 可選 tag (web SectionBadge, Figma 226:3160 / 226:3191).
struct SectionBadge: View {
    enum Tone { case required, optional }
    let label: String
    let tone: Tone

    var body: some View {
        Text(label)
            .font(T.ui(11, .medium))
            .foregroundStyle(tone == .required ? S.badgeRequiredText : S.badgeOptionalText)
            .padding(.vertical, 3)
            .padding(.horizontal, 8)
            .background(tone == .required ? S.badgeRequiredBg : S.badgeOptionalBg,
                        in: RoundedRectangle(cornerRadius: 12))
    }
}

// MARK: - Hourly forecast

/// 今天各時段溫度 (web HourlyForecast): today's hours as a horizontal strip —
/// time · weather glyph · feels-like · rain % when wet. The current hour gets an
/// ink dot, 「現在」 and a white chip; commute hours a 出門 / 下班 tag. Scrolls
/// "now" to the center on appear.
/// 各時段體感溫度 — ported from design-system-web/src/components/hourly-forecast/
/// HourlyForecast.tsx (Figma 608:1520). Two tabs under one commute line: 今天各時段
/// (a horizontal strip of hours) and 相比昨天 — an overview chart of today's feels-like
/// (solid — ink up to now, lighter ahead) against yesterday's (dashed) across
/// 00–24, a dot at now. It shows the shape of the day, not exact readings: the
/// legend gives both values at now, and dragging across the chart reads any hour.
/// Above it, one line about the next commute against the same hour the day before.
struct HourlyChart: View {
    struct Item: Identifiable {
        var id: Int { offset }
        let offset: Int          // hours from now (-3…24)
        let hour: Int
        let day: Int
        let feels: Int
        let actual: Int
        let condition: WeatherCondition
        /// 出門 / 下班 when this hour is one of the user's commute times.
        var slot: String? = nil
    }

    let today: [Int]
    let yesterday: [Int]
    let nowHour: Int
    /// The 3h-back → 24h-ahead window — for the next commute (incl. tomorrow).
    var items: [Item] = []

    @State private var hover: Int?
    /// 0 = 今天各時段 (hours strip), 1 = 相比昨天 (overview chart).
    @State private var tab = 0

    private static let plotH: CGFloat = 112, yLabelW: CGFloat = 28

    private var at: Int { min(max(hover ?? nowHour, 0), 23) }
    /// 出門 / 下班 hours from the user's settings (the window tags them).
    private var commutes: [(label: String, hour: Int)] {
        var seen = Set<String>()
        return items.compactMap { it in
            guard let s = it.slot, (0..<24).contains(it.hour), seen.insert(s).inserted else { return nil }
            return (s, it.hour)
        }
    }
    private var bounds: (lo: Int, hi: Int) {
        let all = today + yesterday
        let lo = all.min() ?? 0
        return (lo, max(all.max() ?? 0, lo + 1))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let line = summary { Text(line).font(T.ui(12)).foregroundStyle(S.textBody) }
            YWSegmented(options: ["今天各時段", "相比昨天"], selected: tab, inset: true) { tab = $0 }
            if tab == 0 {
                strip
            } else {
                legend
                VStack(spacing: 4) {
                    if !commutes.isEmpty { marks.padding(.trailing, Self.yLabelW).padding(.bottom, -4) }
                    HStack(alignment: .top, spacing: 8) {
                        GeometryReader { geo in plot(geo.size) }
                            .frame(height: Self.plotH)
                        VStack(alignment: .leading) {
                            Text("\(bounds.hi)°")
                            Spacer()
                            Text("\(bounds.lo)°")
                        }
                        .font(T.ui(10))
                        .foregroundStyle(S.textLabel)
                        .frame(width: Self.yLabelW - 8, height: Self.plotH, alignment: .leading)
                    }
                    xAxis.padding(.trailing, Self.yLabelW)
                }
            }
        }
    }

    // MARK: 今天各時段

    /// Hours 3h back → 24h ahead, scrolling edge to edge across the card (bleeds
    /// over its 16pt padding). 現在 and the 出門 / 下班 hours sit on white chips.
    private var strip: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 4) { ForEach(items) { column($0) } }
                .padding(.horizontal, 16)
        }
        .scrollIndicators(.hidden)
        .padding(.horizontal, -16)
    }

    /// Figma 668:1252: time 8 SemiBold, 體感 14 Medium, 實際 10; past hours muted.
    private func column(_ h: Item) -> some View {
        let past = h.offset < 0, now = h.offset == 0
        let tag = now ? "現在" : (!past ? h.slot : nil)
        return VStack(spacing: 6) {
            Text(tag ?? String(format: "%02d:00", h.hour))
                .font(T.ui(8, .semibold))
                .foregroundStyle(tag != nil ? S.textPrimary : S.textLabel)
                .lineLimit(1).fixedSize()
                .frame(height: 10)
            WeatherGlyph(condition: h.condition, size: 18).opacity(past ? 0.45 : 1)
            Text("\(h.feels)°").font(T.ui(14, .medium)).foregroundStyle(past ? S.textHint : S.textPrimary)
                .frame(height: 18)
            Text("實際 \(h.actual)°").font(T.ui(10)).foregroundStyle(past ? S.textHint : S.textLabel)
                .lineLimit(1).fixedSize()
                .frame(height: 12)
        }
        .frame(width: 48, height: 92)
        .background(tag != nil ? S.surfaceWhite : .clear, in: RoundedRectangle(cornerRadius: S.radiusMd))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(tag ?? String(format: "%02d:00", h.hour))，體感 \(h.feels)°，實際 \(h.actual)°")
    }

    // MARK: 相比昨天

    /// Next commute: today's against yesterday; once those have passed, tomorrow's
    /// against today — the same hour the day before either way.
    private var summary: String? {
        guard let next = items.first(where: { $0.offset > 0 && $0.slot != nil }),
              (0..<24).contains(next.hour) else { return nil }
        let before = next.day == 0 ? yesterday[next.hour] : today[next.hour]
        let d = next.feels - before
        let slot = next.slot ?? "通勤"
        let when = next.day == 0 ? "今天" : (slot == "出門" ? "明早" : "明天")
        let ref = next.day == 0 ? "昨天" : "今天"
        let diff = d == 0 ? "和\(ref)差不多" : "比\(ref)\(d > 0 ? "高" : "低") \(abs(d))°"
        return "\(when) \(String(format: "%02d:00", next.hour)) \(slot)體感 \(next.feels)°，\(diff)"
    }

    /// The legend doubles as the read-out: values at now, or at the dragged hour.
    private var legend: some View {
        HStack(spacing: 12) {
            // Which hour the values are for: 現在 04:00, or the dragged hour.
            Text((hover == nil ? "現在 " : "") + String(format: "%02d:00", at))
                .font(T.ui(12, .medium))
                .foregroundStyle(S.textPrimary)
                .monospacedDigit()
            HStack(spacing: 6) {
                Capsule().fill(S.textPrimary).frame(width: 16, height: 2)
                Text("今天體感")
                Text("\(today[at])°").font(T.ui(12, .medium)).foregroundStyle(S.textPrimary)
            }
            HStack(spacing: 6) {
                Path { p in p.move(to: .init(x: 0, y: 1)); p.addLine(to: .init(x: 16, y: 1)) }
                    .stroke(S.textHint, style: StrokeStyle(lineWidth: 2, dash: [4, 4]))
                    .frame(width: 16, height: 2)
                Text("昨天體感")
                Text("\(yesterday[at])°").font(T.ui(12, .medium)).foregroundStyle(S.textPrimary)
            }
        }
        .font(T.ui(12))
        .foregroundStyle(S.textMutedWarm)
        .lineLimit(1)
        .minimumScaleFactor(0.85)   // stays on one line on narrow phones
    }

    private func plot(_ size: CGSize) -> some View {
        let (lo, hi) = bounds
        let x = { (h: Int) in CGFloat(h) / 23 * size.width }
        let y = { (v: Int) in 8 + CGFloat(hi - v) / CGFloat(hi - lo) * (size.height - 16) }
        func line(_ vals: [Int], _ from: Int, _ to: Int) -> Path {
            Path { p in
                guard from <= to else { return }
                for h in from...to {
                    let pt = CGPoint(x: x(h), y: y(vals[h]))
                    h == from ? p.move(to: pt) : p.addLine(to: pt)
                }
            }
        }
        let now = min(max(nowHour, 0), 23)
        return ZStack(alignment: .topLeading) {
            ForEach([0, 3, 6, 9, 12, 15, 18, 21], id: \.self) { h in
                Path { p in p.move(to: .init(x: x(h), y: 0)); p.addLine(to: .init(x: x(h), y: size.height)) }
                    .stroke(S.line, lineWidth: 1)
            }
            ForEach(commutes, id: \.label) { c in
                Path { p in p.move(to: .init(x: x(c.hour), y: 0)); p.addLine(to: .init(x: x(c.hour), y: size.height)) }
                    .stroke(S.textMutedWarm, style: StrokeStyle(lineWidth: 1, dash: [3, 3]))
            }
            line(yesterday, 0, 23).stroke(S.textHint, style: StrokeStyle(lineWidth: 2, dash: [4, 4]))
            line(today, now, 23).stroke(S.textMutedWarm, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
            line(today, 0, now).stroke(S.textPrimary, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
            if let hover {
                Path { p in p.move(to: .init(x: x(hover), y: 0)); p.addLine(to: .init(x: x(hover), y: size.height)) }
                    .stroke(S.textMutedWarm, lineWidth: 1)
            }
            ForEach(commutes, id: \.label) { c in
                Circle().fill(S.surfaceRaised)
                    .overlay(Circle().strokeBorder(S.textPrimary, lineWidth: 2))
                    .frame(width: 8, height: 8)
                    .position(x: x(c.hour), y: y(today[c.hour]))
            }
            Circle().fill(S.textPrimary)
                .overlay(Circle().stroke(S.surfaceRaised, lineWidth: 2))
                .frame(width: 8, height: 8)
                .position(x: x(at), y: y(today[at]))
        }
        .contentShape(Rectangle())
        // Simultaneous, so a vertical swipe that starts on the chart still scrolls the page.
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { g in hover = min(max(Int((g.location.x / size.width * 23).rounded()), 0), 23) }
                .onEnded { _ in hover = nil }
        )
        .accessibilityElement()
        .accessibilityLabel("今天與昨天的體感溫度，現在今天 \(today[now])°、昨天 \(yesterday[now])°")
    }

    /// 出門 / 下班 tags above the plot, over their hour (kept inside at either end).
    private var marks: some View {
        GeometryReader { geo in
            ForEach(commutes, id: \.label) { c in
                Text("\(c.label) \(String(format: "%02d:00", c.hour))")
                    .font(T.ui(10, .medium))
                    .foregroundStyle(S.textPrimary)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 1)
                    .background(S.surfaceWhite, in: Capsule())
                    .fixedSize()
                    .alignmentGuide(.leading) { d in
                        let x = CGFloat(c.hour) / 23 * geo.size.width
                        let anchor = c.hour < 2 ? 0 : (c.hour > 21 ? d.width : d.width / 2)
                        return anchor - x
                    }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(height: 16)
        .accessibilityHidden(true)
    }

    private var xAxis: some View {
        GeometryReader { geo in
            ForEach([0, 3, 6, 9, 12, 15, 18, 21], id: \.self) { h in
                Text("\(h)")
                    .font(T.ui(10))
                    .foregroundStyle(S.textLabel)
                    .fixedSize()
                    .position(x: h == 0 ? 4 : CGFloat(h) / 23 * geo.size.width, y: 6)
            }
        }
        .frame(height: 12)
        .accessibilityHidden(true)
    }
}

// MARK: Segmented control

/// 2–3 equal segments on a rounded track, the active one a white pill (web
/// SegmentedControl, Figma 497:137). `inset` tints the track for use on a raised card.
struct YWSegmented: View {
    let options: [String]
    let selected: Int
    var inset = false
    var onSelect: (Int) -> Void

    var body: some View {
        HStack(spacing: 4) {
            ForEach(options.indices, id: \.self) { i in
                let active = i == selected
                Button { onSelect(i) } label: {
                    Text(options[i])
                        .font(T.ui(13, .medium))
                        .foregroundStyle(active ? S.textPrimary : S.textMuted)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 9)
                        .padding(.horizontal, 8)
                        .background {
                            if active {
                                RoundedRectangle(cornerRadius: S.radiusSm)
                                    .fill(S.surfaceWhite)
                                    .shadow(color: S.textPrimary.opacity(0.08), radius: 1.5, y: 1)
                            }
                        }
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(active ? .isSelected : [])
                .animation(.easeOut(duration: S.motionStateDuration), value: active)
            }
        }
        .padding(4)
        .background(inset ? S.textPrimary.opacity(0.05) : S.surfaceRaised,
                    in: RoundedRectangle(cornerRadius: S.radiusMd))
    }
}

// MARK: Bottom sheet

private struct YWSheetDismissKey: EnvironmentKey {
    static let defaultValue: () -> Void = {}
}

extension EnvironmentValues {
    /// Closes the enclosing `ywSheet` (the system `dismiss` doesn't apply to it).
    var ywDismissSheet: () -> Void {
        get { self[YWSheetDismissKey.self] }
        set { self[YWSheetDismissKey.self] = newValue }
    }
}

/// Edge-to-edge bottom sheet with a fixed height (web .yw-sheet): white, top
/// corners only, flush with the screen sides and bottom. iOS 26+ draws partial-
/// height system sheets as inset floating cards, so this is drawn in-app. Drag
/// the handle down (or tap the scrim) to close; the content scrolls freely.
private struct YWSheetModifier<Sheet: View>: ViewModifier {
    @Binding var isPresented: Bool
    /// Share of the screen height the sheet occupies.
    var fraction: CGFloat
    @ViewBuilder var sheet: () -> Sheet

    @State private var drag: CGFloat = 0
    private typealias S = YWTokens.Sys

    func body(content: Content) -> some View {
        content.overlay {
            GeometryReader { geo in
                let keyboard = geo.safeAreaInsets.bottom > 100
                let bottomInset = keyboard ? 0 : geo.safeAreaInsets.bottom
                let screen = geo.size.height + geo.safeAreaInsets.top + geo.safeAreaInsets.bottom
                let height = min(screen * fraction, geo.size.height + bottomInset)

                ZStack(alignment: .bottom) {
                    if isPresented {
                        Color.black.opacity(0.4)
                            .ignoresSafeArea()
                            .onTapGesture { close() }
                            .transition(.opacity)

                        VStack(spacing: 0) {
                            handle
                            sheet()
                                .frame(maxHeight: .infinity, alignment: .top)
                                .environment(\.ywDismissSheet, close)
                            Color.clear.frame(height: bottomInset)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: height)
                        .background(S.surfaceWhite)
                        .clipShape(UnevenRoundedRectangle(topLeadingRadius: S.radius2xl, topTrailingRadius: S.radius2xl))
                        .shadow(color: .black.opacity(0.18), radius: 12, y: -3)
                        .offset(y: drag)
                        .transition(.move(edge: .bottom))
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
                .ignoresSafeArea(.container, edges: .bottom)
                .animation(.spring(duration: 0.35, bounce: 0), value: isPresented)
            }
        }
    }

    /// Grab area: the 36×4 bar plus padding, draggable to close.
    private var handle: some View {
        Capsule()
            .fill(S.line)
            .frame(width: 36, height: 4)
            .frame(maxWidth: .infinity)
            .padding(.top, 12)
            .padding(.bottom, 8)
            .contentShape(Rectangle())
            .gesture(
                DragGesture(coordinateSpace: .global)
                    .onChanged { drag = max(0, $0.translation.height) }
                    .onEnded { v in
                        if v.translation.height > 120 || v.predictedEndTranslation.height > 240 {
                            close()
                        } else {
                            withAnimation(.spring(duration: 0.3, bounce: 0)) { drag = 0 }
                        }
                    }
            )
            .accessibilityLabel("關閉")
            .accessibilityAddTraits(.isButton)
            .accessibilityAction { close() }
    }

    private func close() {
        isPresented = false
        drag = 0
    }
}

extension View {
    /// Present `sheet` as the app's fixed-height, edge-to-edge bottom sheet.
    func ywSheet<Sheet: View>(isPresented: Binding<Bool>, fraction: CGFloat = 0.84,
                              @ViewBuilder content: @escaping () -> Sheet) -> some View {
        modifier(YWSheetModifier(isPresented: isPresented, fraction: fraction, sheet: content))
    }
}
