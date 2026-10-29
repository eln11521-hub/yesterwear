import WidgetKit
import SwiftUI

/// Lock Screen widget (accessoryRectangular, 172×76) — ported from
/// design-system-web/src/components/lock-widget/LockWidget.tsx (Figma 173:2940).
/// iOS renders lock-screen widgets monochrome, so it uses white + opacities only.
struct LockScreenCompareWidget: Widget {
    let kind = "LockScreenCompareWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            LockScreenCompareView(entry: entry)
                .containerBackground(for: .widget) { AccessoryWidgetBackground() }
        }
        .configurationDisplayName("昨日溫差")
        .description("今日體感與昨天的溫差")
        .supportedFamilies([.accessoryRectangular])
        .contentMarginsDisabled()
    }
}

struct LockScreenCompareView: View {
    let entry: WeatherEntry

    private typealias T = YWTokens.Typography

    var body: some View {
        if let snap = entry.snapshot {
            let d = WidgetFormat.delta(snap, entry.unit)
            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 8) {
                    Text(WidgetFormat.locationLine(snap))
                        .font(T.mono(9.5))
                        .opacity(0.9)
                        .lineLimit(1)
                    Spacer(minLength: 0)
                    Image(snap.condition.asset)
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                }
                HStack(alignment: .bottom, spacing: 8) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("體感").font(T.mono(8.5)).opacity(0.7)
                        Text("\(DeltaFormat.temp(snap.currentApparent, entry.unit))°")
                            .font(T.ui(26, .bold))
                    }
                    Spacer(minLength: 0)
                    VStack(alignment: .trailing, spacing: 1) {
                        Text("比昨天").font(T.mono(8.5)).opacity(0.7)
                        Text("\(d.arrow) \(d.abs)°").font(T.ui(16, .bold))
                    }
                }
            }
            .foregroundStyle(.white)
            .padding(.vertical, 12)
            .padding(.horizontal, 14)
        } else {
            Text("開啟 App 載入天氣")
                .font(T.ui(12, .medium))
        }
    }
}
