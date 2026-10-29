import SwiftUI

/// Home — the Dashboard, ported from design-system-web/src/pages/home/HomeScreen.tsx
/// (Figma 174:2 v4d). Warm ground with raised paper cards.
struct HomeView: View {
    var onRecord: () -> Void = {}

    @EnvironmentObject private var settings: SettingsStore
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    var body: some View {
        VStack(spacing: 0) {
            TopBar(
                location: settings.settings.cityName,
                date: dateLabel,
                refreshing: weather.isLoading,
                onRefresh: refresh
            )
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)

            ScrollView {
                VStack(spacing: 16) {
                    if let snap = weather.snapshot {
                        hero(snap)
                        outfitCard(snap)
                        commuteCard(snap)
                        YWPrimaryButton(
                            label: outfit.today == nil ? "記錄今天穿搭" : "更新今日穿搭",
                            icon: "icon-tag",
                            action: onRecord
                        )
                        if let days = snap.forecast, !days.isEmpty {
                            forecast(days, currentApparent: snap.currentApparent)
                        }
                    } else {
                        placeholder
                    }
                    WidgetPromoCard(title: "把 Widget 加到桌面", subtitle: "長按桌面 →「+」→ 搜尋加入")
                    // Clearance for the floating nav (≈65pt + 16pt inset).
                    Color.clear.frame(height: 96)
                }
                .padding(.horizontal, 16)
            }
            .scrollIndicators(.hidden)
            .refreshable { await reload() }
        }
        .background(S.surfaceWarm.ignoresSafeArea())
    }

    // MARK: Hero

    private func hero(_ snap: WeatherSnapshot) -> some View {
        let delta = DeltaFormat.text(snap.overallDelta)
        return VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                MascotView(size: 100, state: snap.state)
                VStack(alignment: .leading, spacing: 2) {
                    Text("現在體感")
                        .font(T.ui(11))
                        .foregroundStyle(S.textMutedWarm)
                    Text("\(Int(snap.currentApparent.rounded()))°C")
                        .font(T.ui(44))
                        .foregroundStyle(S.textPrimary)
                    HStack(spacing: 4) {
                        WeatherGlyph(condition: snap.condition, size: 24)
                        Text(WeatherCondition.label(code: snap.conditionCode ?? 0))
                            .font(T.ui(14, .medium))
                            .foregroundStyle(S.textPrimary)
                    }
                    Text(DeltaFormat.headline(snap.overallDelta))
                        .font(T.ui(24, .bold))
                        .foregroundStyle(S.textPrimary)
                        .padding(.top, 4)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            Rectangle().fill(S.line).frame(height: 1)

            VStack(spacing: 4) {
                metricRow("實際氣溫", "\(Int(snap.currentTemp.rounded()))°C") {
                    Text("較昨日 \(delta)")
                        .font(T.ui(11, .semibold))
                        .foregroundStyle(S.textOnDark)
                        .padding(.vertical, 5)
                        .padding(.horizontal, 10)
                        .background(DeltaTint.color(for: delta), in: Capsule())
                }
                metricRow("濕度", "\(snap.currentHumidity)%") { EmptyView() }
            }
        }
        .ywCard(padding: EdgeInsets(top: 16, leading: 16, bottom: 16, trailing: 16))
    }

    private func metricRow<Trailing: View>(_ label: String, _ value: String, @ViewBuilder trailing: () -> Trailing) -> some View {
        HStack(spacing: 16) {
            Text(label)
                .font(T.ui(10.5))
                .foregroundStyle(S.textLabel)
                .frame(width: 52, alignment: .leading)
            Text(value)
                .font(T.ui(16, .semibold))
                .foregroundStyle(S.textPrimary)
            Spacer(minLength: 0)
            trailing()
        }
    }

    // MARK: Outfit

    private func outfitCard(_ snap: WeatherSnapshot) -> some View {
        let suggestion = OutfitSuggestion.make(delta: snap.overallDelta, yesterday: outfit.yesterday)
        return VStack(alignment: .leading, spacing: 12) {
            SectionLabel("昨日穿搭")
            if let y = outfit.yesterday {
                ChipFlow {
                    ForEach(y.chips, id: \.self) { OutfitChip(label: $0.label, asset: $0.asset, compact: true) }
                }
            } else {
                Text("尚無昨日紀錄")
                    .font(T.ui(13))
                    .foregroundStyle(S.textLabel)
            }
            SectionLabel("今日建議穿搭")
            ChipFlow {
                ForEach(Array(suggestion.chips.enumerated()), id: \.element) { i, c in
                    OutfitChip(label: c.label, asset: c.asset, selected: i == 0, compact: true)
                }
            }
            Text(suggestion.advice)
                .font(T.ui(12))
                .lineSpacing(12 * 0.1)
                .foregroundStyle(S.textMutedWarm)
        }
        .ywCard()
    }

    // MARK: Commute

    private func commuteCard(_ snap: WeatherSnapshot) -> some View {
        let rain = snap.rainNow ?? 0
        return VStack(alignment: .leading, spacing: 12) {
            SectionLabel("通勤時段溫度")
            HStack(spacing: 0) {
                CommuteColumn(
                    slot: "出門 \(snap.leave.hourLabel)",
                    temp: "\(Int(snap.leave.todayApparent.rounded()))°",
                    delta: DeltaFormat.text(snap.leave.delta)
                )
                Spacer(minLength: 0); vRule; Spacer(minLength: 0)
                CommuteColumn(
                    slot: "下班 \(snap.return.hourLabel)",
                    temp: "\(Int(snap.return.todayApparent.rounded()))°",
                    delta: DeltaFormat.text(snap.return.delta)
                )
                Spacer(minLength: 0); vRule; Spacer(minLength: 0)
                // 降雨 reuses the commute column visual (value + optional note).
                CommuteColumn(slot: "降雨", temp: "\(rain)%", note: rain > 0 ? "攜帶雨具" : nil)
            }
        }
        .ywCard()
    }

    private var vRule: some View {
        Rectangle().fill(S.line).frame(width: 1, height: 40)
    }

    // MARK: Forecast

    private func forecast(_ days: [DailyForecast], currentApparent: Double) -> some View {
        let lows = days.map { Int($0.low.rounded()) }, highs = days.map { Int($0.high.rounded()) }
        let weekMin = lows.min() ?? 0, weekMax = highs.max() ?? 0
        return VStack(alignment: .leading, spacing: 12) {
            Text("未來一週天氣")
                .font(T.ui(15, .semibold))
                .foregroundStyle(S.textPrimary)
            VStack(spacing: 0) {
                ForEach(Array(days.enumerated()), id: \.offset) { i, d in
                    ForecastRow(
                        day: i == 0 ? "今天" : Self.weekday(d.dateISO),
                        condition: d.condition,
                        low: lows[i],
                        high: highs[i],
                        weekMin: weekMin,
                        weekMax: weekMax,
                        pop: d.condition.isWet && d.pop >= 40 ? d.pop : nil,
                        current: i == 0 ? Int(currentApparent.rounded()) : nil
                    )
                    if i < days.count - 1 { Rectangle().fill(S.line).frame(height: 1) }
                }
            }
            .ywCard(padding: EdgeInsets(top: 2, leading: 16, bottom: 2, trailing: 16))
        }
    }

    // MARK: Placeholder

    private var placeholder: some View {
        VStack(spacing: 12) {
            if weather.isLoading {
                ProgressView()
                Text("載入今日與昨日天氣…")
            } else {
                Text(weather.lastError ?? "尚無天氣資料")
                Button("重新整理", action: refresh)
            }
        }
        .font(T.ui(13))
        .foregroundStyle(S.textLabel)
        .frame(maxWidth: .infinity, minHeight: 240)
        .ywCard()
    }

    // MARK: Data

    private func refresh() { Task { await reload() } }

    private func reload() async {
        await weather.refresh(settings: settings.settings, yesterdayOutfit: outfit.yesterday)
    }

    private static let weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"]

    /// 「· 今天 週四 8/20」 in the snapshot's city timezone (web dateLabel).
    private var dateLabel: String {
        var cal = Calendar(identifier: .gregorian)
        if let tz = weather.snapshot.flatMap({ TimeZone(identifier: $0.timezone) }) { cal.timeZone = tz }
        let c = cal.dateComponents([.weekday, .month, .day], from: .now)
        return "· 今天 \(Self.weekdays[(c.weekday ?? 1) - 1]) \(c.month ?? 0)/\(c.day ?? 0)"
    }

    private static func weekday(_ iso: String) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        f.timeZone = TimeZone(identifier: "UTC")
        guard let d = f.date(from: iso) else { return "" }
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "UTC")!
        return weekdays[cal.component(.weekday, from: d) - 1]
    }
}
