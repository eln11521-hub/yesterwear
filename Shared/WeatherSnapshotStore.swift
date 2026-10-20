import Foundation
import WidgetKit

@MainActor
final class WeatherSnapshotStore: ObservableObject {
    @Published private(set) var snapshot: WeatherSnapshot?
    @Published private(set) var lastError: String?
    @Published private(set) var isLoading = false

    init() {
        snapshot = Self.loadCached()
    }

    nonisolated static func loadCached() -> WeatherSnapshot? {
        guard let data = AppGroup.defaults.data(forKey: AppGroup.Key.weatherSnapshot),
              let decoded = try? JSONDecoder().decode(WeatherSnapshot.self, from: data) else { return nil }
        return decoded
    }

    nonisolated static func saveCached(_ snapshot: WeatherSnapshot) {
        if let data = try? JSONEncoder().encode(snapshot) {
            AppGroup.defaults.set(data, forKey: AppGroup.Key.weatherSnapshot)
        }
    }

    func refresh(settings: AppSettings, yesterdayOutfit: OutfitEntry?) async {
        isLoading = true
        lastError = nil
        defer { isLoading = false }
        do {
            var snap = try await WeatherService.shared.fetch(settings: settings)
            snap.suggestion = OutfitAdvice.text(
                delta: snap.overallDelta,
                rain: snap.showRain,
                yesterday: yesterdayOutfit
            )
            snapshot = snap
            Self.saveCached(snap)
            WidgetCenter.shared.reloadAllTimelines()
        } catch {
            lastError = error.localizedDescription
            // Keep last successful cache (PRD fallback)
            if snapshot == nil {
                snapshot = Self.loadCached()
            }
        }
    }
}
