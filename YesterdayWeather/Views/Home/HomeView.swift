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
                        outfitCard(snap)
                        // Older caches have no 3h-back/24h-ahead window — hide until refresh.
                        if let hours = snap.hourly, !hours.isEmpty, hours.allSatisfy({ $0.offset != nil && $0.actual != nil }) {
                            hourlyCard(hours)
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
            Group {
                // Solid ink until today is recorded, then an outlined white pill.
                if outfit.today == nil {
                    YWPrimaryButton(label: "記錄今天穿搭", icon: "icon-tag", pill: true, action: onRecord)
                } else {
                    YWSecondaryButton(label: "更新今日穿搭", icon: "icon-tag", pill: true, action: onRecord)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 4)
            .background(S.surfacePaper)
        }
    }

    // MARK: Hero

    /// Figma 608:1479: centred 現在體感 / 溫度 / 比較句 / 天氣, then 實際氣溫 · 濕度 ·
    /// 降雨, then the commute summary sentence.
    private func hero(_ snap: WeatherSnapshot) -> some View {
        let rain = snap.rainNow ?? 0
        return VStack(spacing: 16) {
            VStack(spacing: 8) {
                VStack(spacing: 0) {
                    Text("現在體感")
                        .font(T.ui(12))
                        .foregroundStyle(S.textMutedWarm)
                    Text("\(deg(snap.currentApparent))\(suffix)")
                        .font(T.ui(43, .bold))
                        .foregroundStyle(S.textPrimary)
                        .lineLimit(1)
                        .fixedSize()
                }
                Text(DeltaFormat.headline(snap.overallDelta))
                    .font(T.ui(16, .medium))
                    .foregroundStyle(S.textPrimary)
                HStack(spacing: 4) {
                    WeatherGlyph(condition: snap.condition, size: 20)
                    Text(WeatherCondition.label(code: snap.conditionCode ?? 0))
                        .font(T.ui(14))
                        .foregroundStyle(S.textPrimary)
                }
            }
            HStack(spacing: 4) {
                metric("實際氣溫", "\(deg(snap.currentTemp))\(suffix)")
                metric("濕度", "\(snap.currentHumidity)%")
                metric("降雨", "\(rain)%")
            }
            Text(commuteSentence(snap, rainPossible: rain > 0))
                .font(T.ui(12))
                .lineSpacing(12 * 0.3)   // web line-height 1.6
                .foregroundStyle(S.textBody)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(maxWidth: .infinity)
        .ywCard(padding: EdgeInsets(top: 16, leading: 16, bottom: 16, trailing: 16))
    }

    private func metric(_ label: String, _ value: String) -> some View {
        VStack(spacing: 0) {
            Text(label).font(T.ui(12)).foregroundStyle(S.textLabel)
            Text(value).font(T.ui(16)).foregroundStyle(S.textPrimary).frame(height: 24)
        }
        .frame(maxWidth: .infinity)
    }

    /// 「較昨日下降 2°」 from a delta like ↓2° / ↑1° / ±0°.
    private func deltaPhrase(_ deltaC: Double) -> String {
        let text = DeltaFormat.text(deltaC, unit)
        let n = text.filter(\.isNumber)
        if text.contains("↓") { return "較昨日下降 \(n)°" }
        if text.contains("↑") { return "較昨日上升 \(n)°" }
        return "與昨日持平"
    }

    /// Figma 665:2194 / web commuteSentence.
    private func commuteSentence(_ snap: WeatherSnapshot, rainPossible: Bool) -> String {
        "出門時間體感溫度 \(deg(snap.leave.todayApparent))°，\(deltaPhrase(snap.leave.delta))；"
            + "下班時間體感溫度為 \(deg(snap.return.todayApparent))°，\(deltaPhrase(snap.return.delta))。"
            + (rainPossible ? "今日有降雨機率，記得攜帶雨具。" : "")
    }

    // MARK: Outfit

    private func outfitCard(_ snap: WeatherSnapshot) -> some View {
        let suggestion = OutfitSuggestion.make(delta: snap.overallDelta, rain: snap.showRain, yesterday: outfit.yesterday)
        let advice = suggestion.advice.hasPrefix("建議：") ? String(suggestion.advice.dropFirst(3)) : suggestion.advice
        return VStack(alignment: .leading, spacing: 12) {
            // 昨日穿搭 above 今日穿搭; today's record becomes 昨日 tomorrow.
            dayColumn("昨日穿搭", outfit.yesterday, empty: "尚無昨日紀錄")
            dayColumn("今日穿搭", outfit.today, empty: "尚未記錄", onOpen: onRecord)
            SectionLabel("今日建議穿搭")
            Text(advice)
                .font(T.ui(12))
                .lineSpacing(12 * 0.3)   // web line-height 1.6
                .foregroundStyle(S.textBody)
        }
        .ywCard()
    }

    private func dayColumn(_ title: String, _ entry: OutfitEntry?, empty: String, onOpen: (() -> Void)? = nil) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionLabel(title)
            if let entry {
                ChipLine(chips: entry.picks.rankedChips, onOpen: onOpen)
            } else {
                Text(empty)
                    .font(T.ui(12))
                    .foregroundStyle(S.textLabel)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: Hourly

    private func hourlyCard(_ hours: [HourPoint]) -> some View {
        let leave = settings.settings.leaveHour, back = settings.settings.returnHour
        let items = hours.map { h in
            HourlyChart.Item(
                offset: h.offset ?? 0,
                hour: h.hour,
                day: h.day ?? 0,
                feels: deg(h.apparent),
                actual: deg(h.actual ?? h.apparent),
                condition: h.condition,
                slot: h.hour == leave ? "出門" : (h.hour == back ? "下班" : nil)
            )
        }
        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                SectionLabel("各時段體感溫度")
                Spacer(minLength: 8)
                Text("前 3 小時・未來 24 小時").font(T.ui(12)).foregroundStyle(S.textLabel).lineLimit(1)
            }
            HourlyChart(items: items)
        }
        .ywCard(padding: EdgeInsets(top: 12, leading: 16, bottom: 16, trailing: 16))
    }

    // MARK: Forecast

    private func forecast(_ days: [DailyForecast], currentApparent: Double) -> some View {
        let lows = days.map { deg($0.low) }, highs = days.map { deg($0.high) }
        let weekMin = lows.min() ?? 0, weekMax = highs.max() ?? 0
        // Figma 608:1543: the heading sits inside the card (24 leading, 12 vertical).
        return VStack(alignment: .leading, spacing: 0) {
            SectionLabel("未來一週天氣")
                .padding(.leading, 24)
                .padding(.vertical, 12)
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
        }
        .ywCard(padding: EdgeInsets())
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
