import WidgetKit
import SwiftUI

/// Home Screen widget (systemMedium) — ported from
/// design-system-web/src/components/home-widget-medium/HomeWidgetMedium.tsx
/// (Figma 390:2). The web's tinted gradient is only the wallpaper backdrop of
/// the preview; the widget itself is the white card.
struct HomeScreenCompareWidget: Widget {
    let kind = "HomeScreenCompareWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            HomeScreenCompareView(entry: entry)
                .containerBackground(YWTokens.Sys.surfaceWhite, for: .widget)
        }
        .configurationDisplayName("昨日穿搭對比")
        .description("今日體感、與昨天的溫差、昨日穿搭與通勤時段")
        .supportedFamilies([.systemSmall, .systemMedium])
        .contentMarginsDisabled()
    }
}

struct HomeScreenCompareView: View {
    let entry: WeatherEntry
    @Environment(\.widgetFamily) private var family

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    var body: some View {
        if let snap = entry.snapshot {
            if family == .systemSmall { small(snap) } else { content(snap) }
        } else {
            VStack(spacing: 8) {
                Image("mascot").resizable().scaledToFit().frame(width: 48)
                Text("開啟 App 以載入天氣資料")
                    .font(T.ui(12, .medium))
                    .foregroundStyle(S.textLabel)
            }
        }
    }

    /// Real systemMedium proportions (≈ 338–364 × 158–170pt): no mascot, one
    /// 16pt margin all round; the flexible gaps absorb the size differences
    /// between devices so nothing is squeezed against the edges.
    private func content(_ snap: WeatherSnapshot) -> some View {
        let d = WidgetFormat.delta(snap, entry.unit)
        let deltaColor = TempDeltaState.from(deltaCelsius: snap.overallDelta).primary
        return VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 8) {
                Text(WidgetFormat.locationLine(snap))
                    .font(T.mono(10))
                    .foregroundStyle(S.textLabel)
                    .lineLimit(1)
                if snap.showRain {
                    HStack(spacing: 3) {
                        Image("weather-rain-umbrella").resizable().scaledToFit().frame(width: 12, height: 12)
                        Text("攜帶雨具").font(T.ui(10))
                    }
                    .foregroundStyle(S.deltaCold)
                    .fixedSize()
                }
            }
            Spacer(minLength: 4)
            Text("體感").font(T.mono(10)).foregroundStyle(S.textLabel)
            HStack(alignment: .center) {
                Text("\(DeltaFormat.temp(snap.currentApparent, entry.unit))°")
                    .font(T.ui(34, .bold))
                    .foregroundStyle(S.textPrimary)
                    .frame(height: 36)
                Spacer(minLength: 0)
                Text("\(d.arrow) \(d.abs)° 比昨天")
                    .font(T.ui(11, .semibold))
                    .foregroundStyle(S.textOnDark)
                    .padding(.vertical, 5)
                    .padding(.leading, 10)
                    .padding(.trailing, 11)
                    .background(deltaColor, in: Capsule())
                    .fixedSize()
            }
            Spacer(minLength: 6)
            HStack(spacing: 8) {
                Text("昨日").font(T.mono(10)).foregroundStyle(S.textLabel)
                if let y = entry.yesterday {
                    HStack(spacing: 6) {
                        ForEach(y.picks.keyChips, id: \.self) { chip in
                            Text(chip.label)
                                .font(T.ui(12, .medium))
                                .foregroundStyle(S.textPrimary)
                                .lineLimit(1)
                                .padding(.vertical, 4)
                                .padding(.horizontal, 10)
                                .background(S.badgeOptionalBg, in: Capsule())
                        }
                    }
                } else {
                    Text("尚未記錄").font(T.ui(12, .medium)).foregroundStyle(S.textLabel)
                }
            }
            Spacer(minLength: 8)
            Rectangle().fill(S.separator).frame(height: 1)
            Spacer(minLength: 8)
            HStack {
                commute("出門 \(snap.leave.hourLabel)", snap.leave.todayApparent)
                Spacer(minLength: 12)
                commute("下班 \(snap.return.hourLabel)", snap.return.todayApparent)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(16)
    }

    /// 2×2 — ported from design-system-web/src/components/home-widget-small/HomeWidgetSmall.tsx
    /// (Figma 424:10): hero (體感 + delta) on top, 昨日 + commute below the divider.
    private func small(_ snap: WeatherSnapshot) -> some View {
        let d = WidgetFormat.delta(snap, entry.unit)
        let deltaColor = TempDeltaState.from(deltaCelsius: snap.overallDelta).primary
        return VStack(alignment: .leading, spacing: 0) {
            Text(WidgetFormat.locationLine(snap))
                .font(T.mono(9.5))
                .foregroundStyle(S.textLabel)
                .lineLimit(1)
            Spacer(minLength: 4)
            HStack(alignment: .center, spacing: 6) {
                VStack(alignment: .leading, spacing: 0) {
                    Text("體感").font(T.mono(9.5)).foregroundStyle(S.textLabel)
                    Text("\(DeltaFormat.temp(snap.currentApparent, entry.unit))°")
                        .font(T.ui(30, .bold))
                        .foregroundStyle(S.textPrimary)
                        .frame(height: 32)
                }
                Spacer(minLength: 0)
                Text("\(d.arrow) \(d.abs)° 比昨天")
                    .font(T.ui(10, .semibold))
                    .foregroundStyle(S.textOnDark)
                    .padding(.vertical, 4)
                    .padding(.horizontal, 8)
                    .background(deltaColor, in: Capsule())
                    .fixedSize()
            }
            Spacer(minLength: 6)
            Rectangle().fill(S.separator).frame(height: 1)
            Spacer(minLength: 6)
            HStack(spacing: 6) {
                Text("昨日").font(T.mono(9.5)).foregroundStyle(S.textLabel).fixedSize()
                if let y = entry.yesterday {
                    HStack(spacing: 5) {
                        ForEach(y.picks.keyChips, id: \.self) { chip in
                            Text(chip.label)
                                .font(T.ui(10.5, .medium))
                                .foregroundStyle(S.textPrimary)
                                .lineLimit(1)
                                .fixedSize()
                                .padding(.vertical, 3)
                                .padding(.horizontal, 8)
                                .background(S.badgeOptionalBg, in: Capsule())
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .clipped()
                } else {
                    Text("尚未記錄").font(T.ui(10.5, .medium)).foregroundStyle(S.textLabel)
                }
            }
            Spacer(minLength: 6)
            HStack {
                smallCommute("出門", snap.leave.todayApparent)
                Spacer(minLength: 8)
                smallCommute("下班", snap.return.todayApparent)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(14)
    }

    private func smallCommute(_ slot: String, _ apparent: Double) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text(slot).font(T.mono(9.5)).foregroundStyle(S.textLabel)
            Text("\(DeltaFormat.temp(apparent, entry.unit))°")
                .font(T.ui(12, .bold))
                .foregroundStyle(S.textPrimary)
        }
    }

    private func commute(_ slot: String, _ apparent: Double) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 6) {
            Text(slot).font(T.mono(10)).foregroundStyle(S.textLabel)
            Text("體感").font(T.mono(9)).foregroundStyle(S.textLabel)
            Text("\(DeltaFormat.temp(apparent, entry.unit))°")
                .font(T.ui(14, .bold))
                .foregroundStyle(S.textPrimary)
        }
    }
}
