import SwiftUI

struct MetricBlock: View {
    let title: String
    let value: String
    let subtitle: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(YWTypography.micro)
                .tracking(1.2)
                .foregroundStyle(.secondary)
            Text(value)
                .font(YWTypography.title)
                .foregroundStyle(Color(hex: 0x1A1A1A))
            if let subtitle {
                Text(subtitle)
                    .font(YWTypography.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct CommuteDeltaCard: View {
    let title: String
    let slot: SlotCompare

    var body: some View {
        let state = TempDeltaState.from(deltaCelsius: slot.delta)
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(YWTypography.body)
                Spacer()
                if slot.rainHint {
                    Text("☔ 攜帶雨具")
                        .font(YWTypography.caption)
                }
            }
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Image(systemName: state.symbol)
                Text(String(format: "%+.1f°", slot.delta))
                    .font(YWTypography.title)
                Spacer()
                Text("今 \(Int(slot.todayApparent.rounded()))° · 昨 \(Int(slot.yesterdayTemp.rounded()))°")
                    .font(YWTypography.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.72))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .strokeBorder(state.primary.opacity(0.35), lineWidth: 1)
        )
    }
}

// MARK: - Previews（組件展示庫）

#Preview("MetricBlock — row") {
    HStack(spacing: YWTokens.Sys.spacingMd) {
        MetricBlock(title: "今日體感", value: "31°", subtitle: "出門時段基準")
        MetricBlock(title: "昨日實際", value: "28°", subtitle: "08:00")
        MetricBlock(title: "濕度", value: "65%", subtitle: "當前")
    }
    .padding(YWTokens.Sys.spacingLg)
    .background(YWTokens.Sys.surfacePaper)
}

#Preview("MetricBlock — no subtitle") {
    MetricBlock(title: "今日體感", value: "31°", subtitle: nil)
        .padding(YWTokens.Sys.spacingLg)
        .background(YWTokens.Sys.surfacePaper)
}

#Preview("CommuteDeltaCard — all states") {
    ZStack {
        DeltaAtmosphere(state: .neutral)
        VStack(spacing: YWTokens.Sys.spacingMd) {
            CommuteDeltaCard(
                title: "出門 08:00",
                slot: SlotCompare(hourLabel: "08:00", todayTemp: 26, yesterdayTemp: 31,
                                  todayApparent: 27, precipProbability: 10)   // −4° cooler
            )
            CommuteDeltaCard(
                title: "中午 12:00",
                slot: SlotCompare(hourLabel: "12:00", todayTemp: 28, yesterdayTemp: 28,
                                  todayApparent: 28.5, precipProbability: 20)  // +0.5° neutral
            )
            CommuteDeltaCard(
                title: "下班 18:00",
                slot: SlotCompare(hourLabel: "18:00", todayTemp: 30, yesterdayTemp: 27,
                                  todayApparent: 30.5, precipProbability: 70)  // +3.5° warmer + rain
            )
        }
        .padding(YWTokens.Sys.spacingLg)
    }
}
