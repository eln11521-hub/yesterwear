import SwiftUI

/// Home — the Dashboard, ported from design-system-web/src/pages/home/HomeScreen.tsx
/// (Figma 174:2 v4d). Paper ground with #f5f5f5 cards: hero → commute → outfit →
/// 今天各時段溫度 → week forecast → widget promo. No tab bar: the header gear opens
/// Settings, pull-to-refresh reloads, and 記錄今天穿搭 is a sticky CTA at the
/// bottom. Weight tiers: 21°C Bold, headline SemiBold, numbers Medium, rest Regular.
struct HomeView: View {
    var onRecord: () -> Void = {}
    var onSwitchPlace: () -> Void = {}
    var onOpenSettings: () -> Void = {}

    @EnvironmentObject private var settings: SettingsStore
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    private var unit: TempUnit { settings.settings.unit }
    private var suffix: String { unit == .f ? "°F" : "°C" }
    private func deg(_ c: Double) -> Int { DeltaFormat.temp(c, unit) }

    var body: some View {
        VStack(spacing: 0) {
            TopBar(
                location: settings.settings.cityName,
                date: dateLabel,
                onLocationTap: { onSwitchPlace() },
                onSettingsTap: onOpenSettings
            )
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)

            ScrollView {
                VStack(spacing: 16) {
                    if let snap = weather.snapshot {
                        hero(snap)
                        commuteCard(snap)
                        outfitCard(snap)
                        if let hours = snap.hourly, !hours.isEmpty {
                            hourlyCard(hours, nowHour: snap.nowHour)
                        }
                        if let days = snap.forecast, !days.isEmpty {
                            forecast(days, currentApparent: snap.currentApparent)
                        }
                    } else {
                        placeholder
                    }
                    WidgetPromoCard(title: "把 Widget 加到桌面", subtitle: "長按桌面 →「+」→ 搜尋加入")
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }
            .scrollIndicators(.hidden)
            .refreshable { await reload() }
            // Sticky CTA. The inset makes the scroll content end CTA + safe area +
            // 24pt above the bottom, so the last card always scrolls clear of it.
            .safeAreaInset(edge: .bottom, spacing: 0) { stickyCTA }
        }
        .background(S.surfacePaper.ignoresSafeArea())
    }

    /// 記錄今天穿搭 pinned to the bottom (card-aligned), behind it a 24pt fade
    /// from clear to the paper ground — the only solid-ink element on the page.
    private var stickyCTA: some View {
        VStack(spacing: 0) {
            LinearGradient(colors: [S.surfacePaper.opacity(0), S.surfacePaper],
                           startPoint: .top, endPoint: .bottom)
                .frame(height: 24)
                .allowsHitTesting(false)
            YWPrimaryButton(
                label: outfit.today == nil ? "記錄今天穿搭" : "更新今日穿搭",
                icon: "icon-tag",
                pill: true,
                action: onRecord
            )
            .padding(.horizontal, 16)
            .padding(.bottom, 4)
            .background(S.surfacePaper)
        }
    }

    // MARK: Hero

    private func hero(_ snap: WeatherSnapshot) -> some View {
        let delta = DeltaFormat.text(snap.overallDelta, unit)
        // Figma 173:2893 v4d: 現在體感 column (96pt) + condition/headline,
        // bottom-aligned, gap 16 — no mascot.
        return VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .bottom, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("現在體感")
                        .font(T.mono(11))
                        .foregroundStyle(S.textMutedWarm)
                    Text("\(deg(snap.currentApparent))\(suffix)")
                        .font(T.ui(44, .bold))
                        .foregroundStyle(S.textPrimary)
                        .lineLimit(1)
                        .fixedSize()
                }
                .frame(minWidth: 96, alignment: .leading)
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 4) {
                        WeatherGlyph(condition: snap.condition, size: 20)
                        Text(WeatherCondition.label(code: snap.conditionCode ?? 0))
                            .font(T.ui(14))
                            .foregroundStyle(S.textPrimary)
                    }
                    Text(DeltaFormat.headline(snap.overallDelta))
                        .font(T.ui(24, .semibold))
                        .foregroundStyle(S.textPrimary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.bottom, 6)
            }

            Rectangle().fill(S.line).frame(height: 1)

            VStack(spacing: 4) {
                metricRow("實際氣溫", "\(deg(snap.currentTemp))\(suffix)") {
                    Text("較昨日 \(delta)")
                        .font(T.ui(11))
                        .foregroundStyle(S.textOnDark)
                        .padding(.vertical, 5)
                        .padding(.leading, 10)
                        .padding(.trailing, 11)
                        .background(DeltaTint.color(for: delta), in: Capsule())
                }
                metricRow("濕度", "\(snap.currentHumidity)%") { EmptyView() }
            }
        }
        .ywCard(padding: EdgeInsets(top: 16, leading: 16, bottom: 16, trailing: 16))
    }

    private func metricRow<Trailing: View>(_ label: String, _ value: String, @ViewBuilder trailing: () -> Trailing) -> some View {
        HStack(spacing: 24) {
            // Web uses 42px; the CJK fallback for the mono face runs slightly
            // wider on iOS, so give it 46pt and never wrap.
            Text(label)
                .font(T.mono(10.5))
                .foregroundStyle(S.textLabel)
                .lineLimit(1)
                .fixedSize()
                .frame(width: 46, alignment: .leading)
            Text(value)
                .font(T.ui(16))
                .foregroundStyle(S.textPrimary)
            Spacer(minLength: 0)
            trailing()
        }
    }

    // MARK: Outfit

    private func outfitCard(_ snap: WeatherSnapshot) -> some View {
        let suggestion = OutfitSuggestion.make(delta: snap.overallDelta, rain: snap.showRain, yesterday: outfit.yesterday)
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
                ForEach(suggestion.chips, id: \.self) { c in
                    OutfitChip(label: c.label, asset: c.asset, compact: true)
                }
            }
            adviceText(suggestion.advice)
                .font(T.ui(12))
                .lineSpacing(12 * 0.3)   // web line-height 1.6
        }
        .ywCard()
    }

    /// 「建議：」 bold ink + the rest in the label gray (Figma 173:2914).
    private func adviceText(_ advice: String) -> Text {
        let prefix = "建議："
        guard advice.hasPrefix(prefix) else { return Text(advice).foregroundColor(S.textLabel) }
        return Text(prefix).foregroundColor(S.textPrimary)
            + Text(advice.dropFirst(prefix.count)).foregroundColor(S.textLabel)
    }

    // MARK: Commute

    private func commuteCard(_ snap: WeatherSnapshot) -> some View {
        let rain = snap.rainNow ?? 0
        return VStack(alignment: .leading, spacing: 12) {
            SectionLabel("通勤時段溫度")
            HStack(spacing: 0) {
                CommuteColumn(
                    slot: "出門 \(snap.leave.hourLabel)",
                    temp: "\(deg(snap.leave.todayApparent))°",
                    delta: DeltaFormat.text(snap.leave.delta, unit)
                )
                Spacer(minLength: 0); vRule; Spacer(minLength: 0)
                CommuteColumn(
                    slot: "下班 \(snap.return.hourLabel)",
                    temp: "\(deg(snap.return.todayApparent))°",
                    delta: DeltaFormat.text(snap.return.delta, unit)
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

    // MARK: Hourly

    private func hourlyCard(_ hours: [HourPoint], nowHour: Int?) -> some View {
        let leave = settings.settings.leaveHour, ret = settings.settings.returnHour
        let items = hours.map { h in
            HourlyStrip.Item(
                hour: h.hour,
                temp: deg(h.apparent),
                condition: h.condition,
                pop: h.condition.isWet && h.pop >= 40 ? h.pop : nil,
                now: h.hour == nowHour,
                slot: h.hour == leave ? "出門" : h.hour == ret ? "下班" : nil
            )
        }
        return VStack(alignment: .leading, spacing: 12) {
            SectionLabel("今天各時段溫度")
            HourlyStrip(items: items)
        }
        .ywCard()
    }

    // MARK: Forecast

    private func forecast(_ days: [DailyForecast], currentApparent: Double) -> some View {
        let lows = days.map { deg($0.low) }, highs = days.map { deg($0.high) }
        let weekMin = lows.min() ?? 0, weekMax = highs.max() ?? 0
        return VStack(alignment: .leading, spacing: 12) {
            Text("未來一週天氣")
                .font(T.ui(15))
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
                        current: i == 0 ? deg(currentApparent) : nil   // today's feels-like knob
                    )
                    // Full-bleed 6% ink separators (Figma 174:102).
                    if i < days.count - 1 { Rectangle().fill(S.textPrimary.opacity(0.06)).frame(height: 1) }
                }
            }
            .ywCard(padding: EdgeInsets())
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
