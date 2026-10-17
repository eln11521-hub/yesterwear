import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var settings: SettingsStore
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore

    var body: some View {
        let snap = weather.snapshot
        let state = snap.map { TempDeltaState.from(deltaCelsius: $0.overallDelta) } ?? .neutral

        NavigationStack {
            ZStack {
                DeltaAtmosphere(state: state)

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        header(snap: snap, state: state)
                        if let snap {
                            comparison(snap)
                            commute(snap)
                            outfitSection
                            suggestion(snap)
                        } else if weather.isLoading {
                            ProgressView("載入今日與昨日天氣…")
                                .frame(maxWidth: .infinity)
                                .padding(.top, 40)
                        } else {
                            ContentUnavailableView(
                                "尚無天氣資料",
                                systemImage: "cloud",
                                description: Text(weather.lastError ?? "下拉重新整理")
                            )
                        }
                    }
                    .padding(20)
                    .padding(.bottom, 28)
                }
                .refreshable {
                    await weather.refresh(settings: settings.settings, yesterdayOutfit: outfit.yesterday)
                }
            }
            .navigationTitle("昨日對比")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    @ViewBuilder
    private func header(snap: WeatherSnapshot?, state: TempDeltaState) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(settings.settings.cityName)
                .font(YWTypography.caption)
                .tracking(2)
                .foregroundStyle(.secondary)
            HStack(alignment: .firstTextBaseline, spacing: 12) {
                Text(snap.map { "\(Int($0.currentApparent.rounded()))°" } ?? "--°")
                    .font(YWTypography.hero)
                VStack(alignment: .leading, spacing: 2) {
                    Label(state.label, systemImage: state.symbol)
                        .font(YWTypography.body)
                        .foregroundStyle(state.primary)
                    if let snap {
                        Text(String(format: "相對昨天 %+.1f°", snap.overallDelta))
                            .font(YWTypography.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            if let snap {
                HStack(spacing: 16) {
                    Text("氣溫 \(Int(snap.currentTemp.rounded()))°")
                    Text("濕度 \(snap.currentHumidity)%")
                    if snap.showRain { Text("☔ 攜帶雨具") }
                }
                .font(YWTypography.caption)
                .foregroundStyle(.secondary)

                Text(snap.cacheAgeText)
                    .font(YWTypography.micro)
                    .foregroundStyle(.tertiary)
            }
        }
    }

    private func comparison(_ snap: WeatherSnapshot) -> some View {
        HStack(spacing: 12) {
            MetricBlock(title: "今日體感", value: "\(Int(snap.currentApparent.rounded()))°", subtitle: "出門時段基準")
            MetricBlock(title: "昨日實際", value: "\(Int(snap.leave.yesterdayTemp.rounded()))°", subtitle: snap.leave.hourLabel)
            MetricBlock(title: "濕度", value: "\(snap.currentHumidity)%", subtitle: "當前")
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.7))
        )
    }

    private func commute(_ snap: WeatherSnapshot) -> some View {
        VStack(spacing: 12) {
            CommuteDeltaCard(title: "出門 \(snap.leave.hourLabel)", slot: snap.leave)
            CommuteDeltaCard(title: "下班 \(snap.return.hourLabel)", slot: snap.return)
        }
    }

    private var outfitSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("昨日穿搭")
                .font(YWTypography.caption)
                .foregroundStyle(.secondary)
            if let y = outfit.yesterday {
                Text(y.displayText)
                    .font(YWTypography.title)
            } else {
                Text("尚未記錄 — 今天記一筆，明天就會出現在這裡")
                    .font(YWTypography.body)
                    .foregroundStyle(.secondary)
            }
            NavigationLink {
                OutfitLogView()
            } label: {
                Text(outfit.today == nil ? "記錄今日穿搭" : "更新今日穿搭")
                    .font(YWTokens.Type.body)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, YWTokens.Sys.spacingMd)        // 12pt
                    .background(YWTokens.Sys.textPrimary)              // #111 (was 0x1A1A1A)
                    .foregroundStyle(YWTokens.Sys.textOnDark)
                    .clipShape(RoundedRectangle(cornerRadius: YWTokens.Sys.radiusMd, style: .continuous)) // 16pt (was 14, off-grid)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.7))
        )
    }

    private func suggestion(_ snap: WeatherSnapshot) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("穿搭建議")
                .font(YWTypography.caption)
                .foregroundStyle(.secondary)
            Text(snap.suggestion)
                .font(YWTypography.body)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.white.opacity(0.7))
        )
    }
}
