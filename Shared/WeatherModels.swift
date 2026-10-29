import Foundation

struct OpenMeteoResponse: Codable {
    let latitude: Double
    let longitude: Double
    let timezone: String
    let current: CurrentWeather?
    let hourly: HourlyWeather
    let daily: DailyWeather?
}

struct CurrentWeather: Codable {
    let time: String
    let temperature2m: Double
    let relativeHumidity2m: Int
    let apparentTemperature: Double
    let weatherCode: Int?

    enum CodingKeys: String, CodingKey {
        case time
        case temperature2m = "temperature_2m"
        case relativeHumidity2m = "relative_humidity_2m"
        case apparentTemperature = "apparent_temperature"
        case weatherCode = "weather_code"
    }
}

struct DailyWeather: Codable {
    let time: [String]
    let weatherCode: [Int?]
    let temperature2mMax: [Double?]
    let temperature2mMin: [Double?]
    let precipitationProbabilityMax: [Int?]

    enum CodingKeys: String, CodingKey {
        case time
        case weatherCode = "weather_code"
        case temperature2mMax = "temperature_2m_max"
        case temperature2mMin = "temperature_2m_min"
        case precipitationProbabilityMax = "precipitation_probability_max"
    }
}

struct HourlyWeather: Codable {
    let time: [String]
    let temperature2m: [Double]
    let apparentTemperature: [Double]
    let relativeHumidity2m: [Int]
    let precipitationProbability: [Int?]
    let weatherCode: [Int?]?

    enum CodingKeys: String, CodingKey {
        case time
        case temperature2m = "temperature_2m"
        case apparentTemperature = "apparent_temperature"
        case relativeHumidity2m = "relative_humidity_2m"
        case precipitationProbability = "precipitation_probability"
        case weatherCode = "weather_code"
    }
}

struct SlotCompare: Codable, Equatable {
    var hourLabel: String
    var todayTemp: Double
    var yesterdayTemp: Double
    var todayApparent: Double
    var precipProbability: Int

    var delta: Double { todayApparent - yesterdayTemp }

    var rainHint: Bool { precipProbability > 50 }
}

struct WeatherSnapshot: Codable, Equatable {
    var fetchedAt: Date
    var cityName: String
    var timezone: String
    var currentTemp: Double
    var currentApparent: Double
    var currentHumidity: Int
    var overallDelta: Double
    var leave: SlotCompare
    var `return`: SlotCompare
    var suggestion: String
    // Added for the web-parity Dashboard. Optional so snapshots cached by older
    // builds still decode.
    var conditionCode: Int? = nil
    /// Precipitation probability for the current hour (%).
    var rainNow: Int? = nil
    /// Today + next 6 days (daily[0] = today).
    var forecast: [DailyForecast]? = nil
    /// Today 00–23 (今天各時段溫度).
    var hourly: [HourPoint]? = nil
    /// Current hour of day in the city's timezone.
    var nowHour: Int? = nil

    var condition: WeatherCondition { .from(code: conditionCode ?? 0) }

    var state: TempDeltaState { .from(deltaCelsius: overallDelta) }

    var showRain: Bool { leave.rainHint || `return`.rainHint }

    var cacheAgeText: String {
        let mins = Int(Date().timeIntervalSince(fetchedAt) / 60)
        if mins < 1 { return "剛剛更新" }
        if mins < 60 { return "更新於 \(mins) 分鐘前" }
        let hours = mins / 60
        return "更新於 \(hours) 小時前"
    }
}

struct HourPoint: Codable, Equatable {
    var hour: Int
    var apparent: Double
    var conditionCode: Int
    var pop: Int

    var condition: WeatherCondition { .from(code: conditionCode) }
}

struct DailyForecast: Codable, Equatable {
    var dateISO: String     // yyyy-MM-dd
    var conditionCode: Int
    var low: Double
    var high: Double
    var pop: Int            // max precipitation probability (%)

    var condition: WeatherCondition { .from(code: conditionCode) }
}

/// WMO weather code → condition, mirroring the web decode() in
/// design-system-web/src/app/weatherApi.ts.
enum WeatherCondition: String, Codable {
    case sun, partly, overcast, fog, rain, snow, thunder

    static func from(code: Int) -> WeatherCondition {
        switch code {
        case 0: return .sun
        case 1...2: return .partly
        case 3: return .overcast
        case 4...48: return .fog
        case 49...67: return .rain
        case 68...77: return .snow
        case 78...82: return .rain
        case 83...86: return .snow
        default: return .thunder
        }
    }

    /// Label for the current-conditions line (web decode() labels).
    static func label(code: Int) -> String {
        switch code {
        case 0: return "晴天"
        case 1...2: return "多雲時晴"
        case 3: return "陰天"
        case 4...48: return "起霧"
        case 49...67: return "下雨"
        case 68...77: return "下雪"
        case 78...82: return "陣雨"
        case 83...86: return "陣雪"
        default: return "雷雨"
        }
    }

    /// Asset in Shared/SharedAssets.xcassets.
    var asset: String {
        switch self {
        case .sun: return "weather-sun"
        case .partly: return "weather-partly"
        case .overcast: return "weather-overcast"
        case .fog: return "weather-fog"
        case .rain: return "weather-rain"
        case .snow: return "weather-snow"
        case .thunder: return "weather-thunder"
        }
    }

    var isWet: Bool { self == .rain || self == .snow || self == .thunder }
}

/// Delta formatting shared by every surface (web fmtDelta / deltaText).
/// Display converts to the chosen unit; the delta *logic* (color thresholds)
/// always stays in °C.
enum DeltaFormat {
    static func temp(_ celsius: Double, _ unit: TempUnit) -> Int {
        Int((unit == .f ? celsius * 9 / 5 + 32 : celsius).rounded())
    }

    static func text(_ delta: Double, _ unit: TempUnit = .c) -> String {
        let r = Int((unit == .f ? delta * 9 / 5 : delta).rounded())
        if r < 0 { return "↓\(abs(r))°" }
        if r > 0 { return "↑\(r)°" }
        return "±0°"
    }

    /// Hero headline (web headlineFor).
    static func headline(_ delta: Double) -> String {
        if delta <= -3 { return "比昨天涼一些" }
        if delta <= -1 { return "比昨天略涼" }
        if delta >= 3 { return "比昨天暖一些" }
        if delta >= 1 { return "比昨天略暖" }
        return "和昨天差不多"
    }
}

enum OutfitAdvice {
    static func text(delta: Double, rain: Bool, yesterday: OutfitEntry?) -> String {
        let base: String
        switch TempDeltaState.from(deltaCelsius: delta) {
        case .cooler:
            base = yesterday.map { "比昨天冷，建議在「\($0.displayText)」上加一層" }
                ?? "比昨天明顯變冷，建議多加一件外套"
        case .warmer:
            base = yesterday.map { "比昨天熱，可比「\($0.displayText)」再減一層" }
                ?? "比昨天明顯變熱，建議減少疊搭"
        case .neutral:
            base = yesterday.map { "體感接近昨天，可參考「\($0.displayText)」" }
                ?? "體感與昨天接近，維持平常穿搭即可"
        }
        return rain ? "\(base)。☔ 攜帶雨具" : base
    }
}
