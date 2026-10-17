import WidgetKit
import SwiftUI

struct LockScreenCompareWidget: Widget {
    let kind = "LockScreenCompareWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            LockScreenCompareView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("昨日溫差")
        .description("今日體感、與昨日總溫差、出門/下班對比與降雨提示")
        .supportedFamilies([.accessoryRectangular])
    }
}

struct LockScreenCompareView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snap = entry.snapshot {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 4) {
                    Text("vs 昨日 \(String(format: "%+.1f°", snap.overallDelta))")
                        .font(.headline)
                    if snap.showRain {
                        Text("☔")
                    }
                }
                Text("體感 \(Int(snap.currentApparent.rounded()))° · 濕度 \(snap.currentHumidity)%")
                    .font(.caption)
                Text("出 \(String(format: "%+.0f°", snap.leave.delta)) · 退 \(String(format: "%+.0f°", snap.return.delta))")
                    .font(.caption2)
                Text(snap.cacheAgeText)
                    .font(.system(size: 9))
                    .opacity(0.7)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        } else {
            Text("開啟 App 載入天氣")
                .font(.caption)
        }
    }
}
