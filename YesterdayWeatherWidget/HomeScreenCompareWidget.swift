import WidgetKit
import SwiftUI

struct HomeScreenCompareWidget: Widget {
    let kind = "HomeScreenCompareWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WeatherTimelineProvider()) { entry in
            HomeScreenCompareView(entry: entry)
                .containerBackground(for: .widget) {
                    let state = TempDeltaState.from(deltaCelsius: entry.snapshot?.overallDelta ?? 0)
                    LinearGradient(
                        colors: [state.primary, state.primary.opacity(0.75)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
        }
        .configurationDisplayName("昨日穿搭對比")
        .description("溫差、雙時段對比、昨日穿搭與建議")
        .supportedFamilies([.systemMedium])
    }
}

struct HomeScreenCompareView: View {
    let entry: WeatherEntry

    var body: some View {
        if let snap = entry.snapshot {
            HStack(alignment: .top, spacing: 14) {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        Text(snap.cityName)
                            .font(YWTypography.micro)
                        if snap.showRain {
                            Text("☔ 攜帶雨具")
                                .font(YWTypography.micro)
                        }
                    }
                    .opacity(0.9)

                    Text(String(format: "%+.1f°", snap.overallDelta))
                        .font(.system(size: 36, weight: .semibold, design: .rounded))
                    Text("體感 \(Int(snap.currentApparent.rounded()))° · 濕度 \(snap.currentHumidity)%")
                        .font(YWTypography.caption)
                        .opacity(0.95)
                    Text("出 \(snap.leave.hourLabel) \(String(format: "%+.0f°", snap.leave.delta)) · 退 \(snap.return.hourLabel) \(String(format: "%+.0f°", snap.return.delta))")
                        .font(YWTypography.micro)
                        .opacity(0.9)
                    Text(snap.cacheAgeText)
                        .font(.system(size: 9, weight: .medium))
                        .opacity(0.7)
                }

                Spacer(minLength: 0)

                VStack(alignment: .leading, spacing: 8) {
                    Text("昨日穿搭")
                        .font(YWTypography.micro)
                        .opacity(0.85)
                    Text(entry.yesterdayOutfit ?? "尚未記錄")
                        .font(YWTypography.body)
                        .fixedSize(horizontal: false, vertical: true)
                    Text(snap.suggestion)
                        .font(YWTypography.caption)
                        .opacity(0.95)
                        .lineLimit(4)
                }
                .frame(maxWidth: 160, alignment: .leading)
            }
            .foregroundStyle(.white)
            .padding(4)
        } else {
            Text("開啟 App 以載入天氣資料")
                .foregroundStyle(.white)
                .font(YWTypography.body)
        }
    }
}
