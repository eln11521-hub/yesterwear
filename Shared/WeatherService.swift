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

    func fetch(settings: AppSettings) async throws -> WeatherSnapshot {
        var components = URLComponents(string: "https://api.open-meteo.com/v1/forecast")
        components?.queryItems = [
            .init(name: "latitude", value: String(settings.latitude)),
            .init(name: "longitude", value: String(settings.longitude)),
            .init(name: "current", value: "temperature_2m,relative_humidity_2m,apparent_temperature"),
            .init(name: "hourly", value: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability"),
            .init(name: "past_days", value: "1"),
            .init(name: "forecast_days", value: "1"),
            .init(name: "timezone", value: settings.timezone)
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

    func buildSnapshot(
        from response: OpenMeteoResponse,
        settings: AppSettings,
        outfitYesterday: OutfitEntry?
    ) throws -> WeatherSnapshot {
        let leave = try slot(
            response: response,
            todayHour: settings.leaveHour,
            yesterdayHour: settings.leaveHour,
            label: settings.leaveTimeLabel
        )
        let ret = try slot(
            response: response,
            todayHour: settings.returnHour,
            yesterdayHour: settings.returnHour,
            label: settings.returnTimeLabel
        )

        let current = response.current
        let overallDelta = leave.delta
        let rain = leave.rainHint || ret.rainHint

        return WeatherSnapshot(
            fetchedAt: .now,
            cityName: settings.cityName,
            timezone: response.timezone,
            currentTemp: current?.temperature2m ?? leave.todayTemp,
            currentApparent: current?.apparentTemperature ?? leave.todayApparent,
            currentHumidity: current?.relativeHumidity2m ?? 0,
            overallDelta: overallDelta,
            leave: leave,
            return: ret,
            suggestion: OutfitAdvice.text(delta: overallDelta, rain: rain, yesterday: outfitYesterday)
        )
    }

    /// PRD: 溫差 = 今日體感 − 昨日實際溫度（對應通勤時段）
    private func slot(
        response: OpenMeteoResponse,
        todayHour: Int,
        yesterdayHour: Int,
        label: String
    ) throws -> SlotCompare {
        let times = response.hourly.time
        guard times.count >= 2 else { throw WeatherServiceError.missingHour(label) }

        // past_days=1 + forecast_days=1 => [yesterday 00-23][today 00-23]
        let mid = times.count / 2
        let yesterdaySlice = Array(times.prefix(mid))
        let todaySlice = Array(times.suffix(from: mid))

        guard let yIdx = index(in: yesterdaySlice, hour: yesterdayHour),
              let tIdx = index(in: todaySlice, hour: todayHour) else {
            throw WeatherServiceError.missingHour(label)
        }

        let yAbs = yIdx
        let tAbs = mid + tIdx

        return SlotCompare(
            hourLabel: label,
            todayTemp: response.hourly.temperature2m[tAbs],
            yesterdayTemp: response.hourly.temperature2m[yAbs],
            todayApparent: response.hourly.apparentTemperature[tAbs],
            precipProbability: response.hourly.precipitationProbability[tAbs]
        )
    }

    private func index(in times: [String], hour: Int) -> Int? {
        // "2026-08-20T08:00"
        times.firstIndex { time in
            guard let t = time.split(separator: "T").last,
                  let h = Int(t.prefix(2)) else { return false }
            return h == hour
        }
    }
}
