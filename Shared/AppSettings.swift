import Foundation

struct AppSettings: Codable, Equatable {
    var leaveHour: Int
    var leaveMinute: Int
    var returnHour: Int
    var returnMinute: Int
    var latitude: Double
    var longitude: Double
    var timezone: String
    var cityName: String
    var useManualLocation: Bool

    static let `default` = AppSettings(
        leaveHour: 8,
        leaveMinute: 0,
        returnHour: 18,
        returnMinute: 0,
        latitude: 53.54,
        longitude: -113.49,
        timezone: "America/Edmonton",
        cityName: "Edmonton",
        useManualLocation: true
    )

    var leaveTimeLabel: String {
        String(format: "%02d:%02d", leaveHour, leaveMinute)
    }

    var returnTimeLabel: String {
        String(format: "%02d:%02d", returnHour, returnMinute)
    }
}

@MainActor
final class SettingsStore: ObservableObject {
    @Published var settings: AppSettings {
        didSet { persist() }
    }

    init() {
        if let data = AppGroup.defaults.data(forKey: AppGroup.Key.settings),
           let decoded = try? JSONDecoder().decode(AppSettings.self, from: data) {
            settings = decoded
        } else {
            settings = .default
        }
    }

    private func persist() {
        if let data = try? JSONEncoder().encode(settings) {
            AppGroup.defaults.set(data, forKey: AppGroup.Key.settings)
        }
    }
}
