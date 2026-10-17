import Foundation

struct OpenMeteoResponse: Codable {
    let latitude: Double
    let longitude: Double
    let timezone: String
    let current: CurrentWeather?
    let hourly: HourlyWeather
}

struct CurrentWeather: Codable {
    let time: String
    let temperature2m: Double
    let relativeHumidity2m: Int
    let apparentTemperature: Double

    enum CodingKeys: String, CodingKey {
        case time
        case temperature2m = "temperature_2m"
        case relativeHumidity2m = "relative_humidity_2m"
        case apparentTemperature = "apparent_temperature"
    }
}

struct HourlyWeather: Codable {
    let time: [String]
    let temperature2m: [Double]
    let apparentTemperature: [Double]
    let relativeHumidity2m: [Int]
    let precipitationProbability: [Int]

    enum CodingKeys: String, CodingKey {
        case time
        case temperature2m = "temperature_2m"
        case apparentTemperature = "apparent_temperature"
        case relativeHumidity2m = "relative_humidity_2m"
        case precipitationProbability = "precipitation_probability"
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
