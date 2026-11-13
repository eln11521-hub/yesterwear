import WidgetKit
import SwiftUI

struct WeatherEntry: TimelineEntry {
    let date: Date
    let snapshot: WeatherSnapshot?
    let yesterday: OutfitEntry?
    let unit: TempUnit
}

/// Reads the App Group cache, and on each scheduled reload also fetches fresh
/// weather itself so the widget stays current without opening the app.
struct WeatherTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> WeatherEntry {
        WeatherEntry(date: .now, snapshot: Self.sample, yesterday: Self.sampleOutfit, unit: .c)
    }

    func getSnapshot(in context: Context, completion: @escaping (WeatherEntry) -> Void) {
        if context.isPreview && WeatherSnapshotStore.loadCached() == nil {
            completion(placeholder(in: context))
        } else {
            completion(entry(snapshot: WeatherSnapshotStore.loadCached()))
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WeatherEntry>) -> Void) {
        Task {
            var snap = WeatherSnapshotStore.loadCached()
            if let settings = Self.settings(),
               let fresh = try? await WeatherService.shared.fetch(settings: settings) {
                WeatherSnapshotStore.saveCached(fresh)
                snap = fresh
            }
            let next = Calendar.current.date(byAdding: .minute, value: 30, to: .now) ?? .now.addingTimeInterval(1800)
            completion(Timeline(entries: [entry(snapshot: snap)], policy: .after(next)))
        }
    }

    private func entry(snapshot: WeatherSnapshot?) -> WeatherEntry {
        WeatherEntry(date: .now, snapshot: snapshot, yesterday: Self.yesterdayOutfit(),
                     unit: Self.settings()?.unit ?? .c)
    }

    private static func settings() -> AppSettings? {
        guard let data = AppGroup.defaults.data(forKey: AppGroup.Key.settings) else { return nil }
        return try? JSONDecoder().decode(AppSettings.self, from: data)
    }

    private static func yesterdayOutfit() -> OutfitEntry? {
        guard let data = AppGroup.defaults.data(forKey: AppGroup.Key.outfitByDay),
              let map = try? JSONDecoder().decode([String: OutfitEntry].self, from: data) else { return nil }
        return map[DayKey.yesterday()]
    }

    static let sampleOutfit = OutfitEntry(dayKey: DayKey.yesterday(), picks: OutfitPicks(tops: ["長袖上衣"], outers: ["薄外套"]))

    static let sample = WeatherSnapshot(
        fetchedAt: .now,
        cityName: "Edmonton",
        timezone: "America/Edmonton",
        currentTemp: 18,
        currentApparent: 16,
        currentHumidity: 65,
        overallDelta: -3,
        leave: SlotCompare(hourLabel: "08:00", todayTemp: 17, yesterdayTemp: 18, todayApparent: 16, precipProbability: 60),
        return: SlotCompare(hourLabel: "18:00", todayTemp: 15, yesterdayTemp: 18, todayApparent: 14, precipProbability: 20),
        suggestion: "",
        conditionCode: 0,
        rainNow: 20
    )
}

/// Shared widget formatting (web deltaDisplay / deltaStateColor).
enum WidgetFormat {
    /// 比昨天 pill: today's feels-like vs yesterday's feels-like at this hour, as
    /// the difference of the two rounded values (the big number is the shown one).
    static func delta(_ snap: WeatherSnapshot, _ unit: TempUnit) -> (arrow: String, abs: Int) {
        let d: Int
        if let y = snap.yesterdayApparentNow {
            d = DeltaFormat.temp(snap.currentApparent, unit) - DeltaFormat.temp(y, unit)
        } else {
            let raw = snap.overallDelta
            d = Int((unit == .f ? raw * 9 / 5 : raw).rounded())
        }
        return (d < 0 ? "↓" : d > 0 ? "↑" : "±", abs(d))
    }

    /// Delta state (tint / pill colour) from the same feels-vs-feels comparison.
    static func state(_ snap: WeatherSnapshot) -> TempDeltaState {
        .from(deltaCelsius: snap.nowDelta)
    }

    /// 「EDMONTON · 今天」, plus how old the data is once it's over an hour stale.
    static func locationLine(_ snap: WeatherSnapshot) -> String {
        let stale = Date().timeIntervalSince(snap.fetchedAt) >= 3600 ? " · \(snap.cacheAgeText)" : ""
        return "\(snap.cityName.uppercased()) · 今天\(stale)"
    }
}
