import Foundation

enum WeatherServiceError: LocalizedError {
    case badURL
    case badResponse
    case decoding
    case missingHour(String)

    var errorDescription: String? {
        switch self {
        case .badURL: return "無法建立天氣請求"
        case .badResponse: return "天氣服務回應異常"
        case .decoding: return "天氣資料解析失敗"
        case .missingHour(let h): return "缺少 \(h) 時段資料"
        }
    }
}

actor WeatherService {
    static let shared = WeatherService()

    /// Mirrors fetchWeather() in design-system-web/src/app/weatherApi.ts.
    func fetch(settings: AppSettings) async throws -> WeatherSnapshot {
        var components = URLComponents(string: "https://api.open-meteo.com/v1/forecast")
        components?.queryItems = [
            .init(name: "latitude", value: String(settings.latitude)),
            .init(name: "longitude", value: String(settings.longitude)),
            .init(name: "current", value: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code"),
            .init(name: "hourly", value: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability"),
            .init(name: "daily", value: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"),
            .init(name: "past_days", value: "1"),
            .init(name: "forecast_days", value: "7"),
            .init(name: "timezone", value: "auto")
        ]
        guard let url = components?.url else { throw WeatherServiceError.badURL }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw WeatherServiceError.badResponse
        }
        let decoded: OpenMeteoResponse
        do {
            decoded = try JSONDecoder().decode(OpenMeteoResponse.self, from: data)
        } catch {
            throw WeatherServiceError.decoding
        }
        return try buildSnapshot(from: decoded, settings: settings, outfitYesterday: nil)
    }

    /// past_days=1 → hourly[0..<24] is yesterday, hourly[24...] is today onward.
    private static let dayHours = 24

    func buildSnapshot(
        from response: OpenMeteoResponse,
        settings: AppSettings,
        outfitYesterday: OutfitEntry?
    ) throws -> WeatherSnapshot {
        let hourly = response.hourly
        let leave = try slot(response: response, hour: settings.leaveHour, label: settings.leaveTimeLabel)
        let ret = try slot(response: response, hour: settings.returnHour, label: settings.returnTimeLabel)

        let current = response.current
        // PRD 3.3: 溫差 = 今日體感 − 昨日同一小時實際溫度, read at the current hour.
        let nowIdx = currentHourIndex(response) ?? (Self.dayHours + leave.hourOffset)
        let overallDelta = nowIdx >= Self.dayHours && nowIdx < hourly.apparentTemperature.count
            ? hourly.apparentTemperature[nowIdx] - hourly.temperature2m[nowIdx - Self.dayHours]
            : leave.delta
        let rainNow = nowIdx < hourly.precipitationProbability.count
            ? (hourly.precipitationProbability[nowIdx] ?? 0) : 0

        return WeatherSnapshot(
            fetchedAt: .now,
            cityName: settings.cityName,
            timezone: response.timezone,
            currentTemp: current?.temperature2m ?? leave.compare.todayTemp,
            currentApparent: current?.apparentTemperature ?? leave.compare.todayApparent,
            currentHumidity: current?.relativeHumidity2m ?? 0,
            overallDelta: overallDelta,
            leave: leave.compare,
            return: ret.compare,
            suggestion: OutfitAdvice.text(delta: overallDelta, rain: leave.compare.rainHint || ret.compare.rainHint, yesterday: outfitYesterday),
            conditionCode: current?.weatherCode,
            rainNow: rainNow,
            forecast: forecast(response.daily)
        )
    }

    /// daily[0] = yesterday (past_days=1), so today onward starts at index 1.
    private func forecast(_ daily: DailyWeather?) -> [DailyForecast]? {
        guard let daily, daily.time.count > 1 else { return nil }
        return daily.time.indices.dropFirst().compactMap { i in
            guard let lo = daily.temperature2mMin[i], let hi = daily.temperature2mMax[i] else { return nil }
            return DailyForecast(
                dateISO: daily.time[i],
                conditionCode: daily.weatherCode[i] ?? 0,
                low: lo,
                high: hi,
                pop: daily.precipitationProbabilityMax[i] ?? 0
            )
        }
    }

    private func currentHourIndex(_ response: OpenMeteoResponse) -> Int? {
        guard let now = response.current?.time.prefix(13) else { return nil }   // yyyy-MM-ddTHH
        return response.hourly.time.firstIndex { $0.prefix(13) == now }
    }

    /// PRD: 溫差 = 今日體感 − 昨日實際溫度（對應通勤時段）
    private func slot(response: OpenMeteoResponse, hour: Int, label: String) throws
        -> (compare: SlotCompare, delta: Double, hourOffset: Int) {
        let hourly = response.hourly
        let tAbs = Self.dayHours + hour
        let yAbs = hour
        guard (0..<24).contains(hour), tAbs < hourly.time.count, tAbs < hourly.apparentTemperature.count else {
            throw WeatherServiceError.missingHour(label)
        }
        let compare = SlotCompare(
            hourLabel: label,
            todayTemp: hourly.temperature2m[tAbs],
            yesterdayTemp: hourly.temperature2m[yAbs],
            todayApparent: hourly.apparentTemperature[tAbs],
            precipProbability: hourly.precipitationProbability[tAbs] ?? 0
        )
        return (compare, compare.delta, hour)
    }
}
