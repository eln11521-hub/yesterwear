import WidgetKit
import SwiftUI

/// Home Screen widget (systemMedium) — ported from
/// design-system-web/src/components/home-widget-medium/HomeWidgetMedium.tsx
/// (Figma 216:2). The web's tinted gradient is only the wallpaper backdrop of
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
        .supportedFamilies([.systemMedium])
        .contentMarginsDisabled()
    }
}

struct HomeScreenCompareView: View {
    let entry: WeatherEntry

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    var body: some View {
        if let snap = entry.snapshot {
            content(snap)
        } else {
            VStack(spacing: 8) {
                Image("mascot").resizable().scaledToFit().frame(width: 48)
                Text("開啟 App 以載入天氣資料")
                    .font(T.ui(12, .medium))
                    .foregroundStyle(S.textLabel)
            }
        }
    }

    private func content(_ snap: WeatherSnapshot) -> some View {
        let d = WidgetFormat.delta(snap, entry.unit)
        let deltaColor = TempDeltaState.from(deltaCelsius: snap.overallDelta).primary
        return VStack(spacing: 12) {
            HStack(spacing: 14) {
                Image("mascot").resizable().scaledToFit().frame(width: 58)
                VStack(alignment: .leading, spacing: 8) {
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
                    HStack(alignment: .center) {
                        VStack(alignment: .leading, spacing: 0) {
                            Text("體感").font(T.mono(10)).foregroundStyle(S.textLabel)
                            Text("\(DeltaFormat.temp(snap.currentApparent, entry.unit))°")
                                .font(T.ui(40, .bold))
                                .foregroundStyle(S.textPrimary)
                        }
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
                    HStack(spacing: 8) {
                        Text("昨日").font(T.mono(10)).foregroundStyle(S.textLabel)
                        if let y = entry.yesterday {
                            HStack(spacing: 6) {
                                ForEach(y.chips, id: \.self) { chip in
                                    Text(chip.label)
                                        .font(T.ui(12, .medium))
                                        .foregroundStyle(S.textPrimary)
                                        .lineLimit(1)
                                        .padding(.vertical, 5)
                                        .padding(.horizontal, 11)
                                        .background(S.badgeOptionalBg, in: Capsule())
                                }
                            }
                        } else {
                            Text("尚未記錄").font(T.ui(12, .medium)).foregroundStyle(S.textLabel)
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            Rectangle().fill(S.separator).frame(height: 1)

            HStack {
                commute("出門 \(snap.leave.hourLabel)", snap.leave.todayApparent)
                Spacer(minLength: 12)
                commute("下班 \(snap.return.hourLabel)", snap.return.todayApparent)
            }
        }
        .padding(.vertical, 16)
        .padding(.horizontal, 18)
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
