import Foundation

enum TempUnit: String, Codable { case c = "C", f = "F" }

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
    // Web-parity settings (design-system-web/src/app/useSettingsStore.ts).
    var unit: TempUnit = .c
    var notifCommute: Bool = true
    /// Minutes after midnight; nil = 30 min before the commute time.
    var leaveAlertMinutes: Int? = nil
    var returnAlertMinutes: Int? = nil
    var notifEvening: Bool = true
    var eveningMinutes: Int = 21 * 60 + 30

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

    // Older saved settings lack the newer keys — decode them leniently.
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        leaveHour = try c.decode(Int.self, forKey: .leaveHour)
        leaveMinute = try c.decode(Int.self, forKey: .leaveMinute)
        returnHour = try c.decode(Int.self, forKey: .returnHour)
        returnMinute = try c.decode(Int.self, forKey: .returnMinute)
        latitude = try c.decode(Double.self, forKey: .latitude)
        longitude = try c.decode(Double.self, forKey: .longitude)
        timezone = try c.decode(String.self, forKey: .timezone)
        cityName = try c.decode(String.self, forKey: .cityName)
        useManualLocation = try c.decode(Bool.self, forKey: .useManualLocation)
        unit = try c.decodeIfPresent(TempUnit.self, forKey: .unit) ?? .c
        notifCommute = try c.decodeIfPresent(Bool.self, forKey: .notifCommute) ?? true
        leaveAlertMinutes = try c.decodeIfPresent(Int.self, forKey: .leaveAlertMinutes)
        returnAlertMinutes = try c.decodeIfPresent(Int.self, forKey: .returnAlertMinutes)
        notifEvening = try c.decodeIfPresent(Bool.self, forKey: .notifEvening) ?? true
        eveningMinutes = try c.decodeIfPresent(Int.self, forKey: .eveningMinutes) ?? 21 * 60 + 30
    }

    init(leaveHour: Int, leaveMinute: Int, returnHour: Int, returnMinute: Int,
         latitude: Double, longitude: Double, timezone: String, cityName: String,
         useManualLocation: Bool) {
        self.leaveHour = leaveHour
        self.leaveMinute = leaveMinute
        self.returnHour = returnHour
        self.returnMinute = returnMinute
        self.latitude = latitude
        self.longitude = longitude
        self.timezone = timezone
        self.cityName = cityName
        self.useManualLocation = useManualLocation
    }

    /// Default alert = 30 min before the commute slot (web minus30).
    var leaveAlert: Int { leaveAlertMinutes ?? max(0, leaveHour * 60 + leaveMinute - 30) }
    var returnAlert: Int { returnAlertMinutes ?? max(0, returnHour * 60 + returnMinute - 30) }

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
