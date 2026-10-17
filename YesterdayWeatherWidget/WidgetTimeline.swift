import WidgetKit
import SwiftUI

struct WeatherEntry: TimelineEntry {
    let date: Date
    let snapshot: WeatherSnapshot?
    let yesterdayOutfit: String?
}

struct WeatherTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> WeatherEntry {
        WeatherEntry(date: .now, snapshot: sample, yesterdayOutfit: "短袖 + 薄外套")
    }

    func getSnapshot(in context: Context, completion: @escaping (WeatherEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WeatherEntry>) -> Void) {
        let entry = loadEntry()
        let next = Calendar.current.date(byAdding: .minute, value: 30, to: .now) ?? .now.addingTimeInterval(1800)
        completion(Timeline(entries: [entry], policy: .after(next)))
    }

    private func loadEntry() -> WeatherEntry {
        let snap = WeatherSnapshotStore.loadCached()
        let outfitText: String?
        if let data = AppGroup.defaults.data(forKey: AppGroup.Key.outfitByDay),
           let map = try? JSONDecoder().decode([String: OutfitEntry].self, from: data) {
            outfitText = map[DayKey.yesterday()]?.displayText
        } else {
            outfitText = nil
        }
        return WeatherEntry(date: .now, snapshot: snap, yesterdayOutfit: outfitText)
    }

    private var sample: WeatherSnapshot {
        WeatherSnapshot(
            fetchedAt: .now,
            cityName: "Edmonton",
            timezone: "America/Edmonton",
            currentTemp: 18,
            currentApparent: 17,
            currentHumidity: 55,
            overallDelta: -3.5,
            leave: SlotCompare(hourLabel: "08:00", todayTemp: 16, yesterdayTemp: 19, todayApparent: 15.5, precipProbability: 60),
            return: SlotCompare(hourLabel: "18:00", todayTemp: 20, yesterdayTemp: 21, todayApparent: 19, precipProbability: 20),
            suggestion: "比昨天冷，建議加一層。☔ 攜帶雨具"
        )
    }
}
