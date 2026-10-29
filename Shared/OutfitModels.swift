import Foundation

enum TopLayer: String, Codable, CaseIterable, Identifiable {
    case shortSleeve = "短袖上衣"
    case tank = "背心無袖"
    case longSleeve = "長袖上衣"
    case shirt = "襯衫（單穿）"
    case knit = "針織衫（單穿）"
    case hoodie = "帽T衛衣（單穿）"

    var id: String { rawValue }

    var emoji: String {
        switch self {
        case .shortSleeve: return "👕"
        case .tank: return "🎽"
        case .longSleeve: return "👔"
        case .shirt: return "🧣"
        case .knit: return "🧶"
        case .hoodie: return "🧥"
        }
    }

    /// Garment icon in Shared/SharedAssets.xcassets (web garmentIcon map).
    var asset: String {
        switch self {
        case .shortSleeve: return "garment-short-sleeve"
        case .tank: return "garment-vest"
        case .longSleeve, .shirt: return "garment-long-sleeve"
        case .knit: return "garment-knit"
        case .hoodie: return "garment-hoodie"
        }
    }

    var shortLabel: String {
        switch self {
        case .shortSleeve: return "短袖"
        case .tank: return "背心"
        case .longSleeve: return "長袖"
        case .shirt: return "襯衫"
        case .knit: return "針織"
        case .hoodie: return "帽T"
        }
    }
}

enum OuterLayer: String, Codable, CaseIterable, Identifiable {
    case none = "不加外套"
    case light = "薄外套"
    case tech = "連帽外套"
    case thick = "厚外套夾克"
    case down = "羽絨外套大衣"
    case rain = "防風防水外套"

    var id: String { rawValue }

    var emoji: String {
        switch self {
        case .none: return "🚫"
        case .light: return "🧥"
        case .tech: return "🦺"
        case .thick: return "🧥"
        case .down: return "🥶"
        case .rain: return "☂️"
        }
    }

    /// Garment icon in Shared/SharedAssets.xcassets (web garmentIcon map).
    var asset: String {
        switch self {
        case .none: return "garment-no-jacket"
        case .light: return "garment-light-jacket"
        case .tech: return "garment-hooded-jacket"
        case .thick: return "garment-thick-jacket"
        case .down: return "garment-down-coat"
        case .rain: return "garment-waterproof"
        }
    }

    var shortLabel: String {
        switch self {
        case .none: return "無外套"
        case .light: return "薄外套"
        case .tech: return "機能外套"
        case .thick: return "厚外套"
        case .down: return "羽絨"
        case .rain: return "防水外套"
        }
    }
}

struct OutfitEntry: Codable, Equatable {
    var dayKey: String
    var top: TopLayer
    var outer: OuterLayer

    var displayText: String {
        if outer == .none {
            return "\(top.emoji) \(top.shortLabel)"
        }
        return "\(top.emoji) \(top.shortLabel) + \(outer.emoji) \(outer.shortLabel)"
    }
}

/// Chip labels for a top + outer combo — 「不加外套」collapses to just the top
/// (web comboChips).
struct OutfitChipItem: Hashable {
    var label: String
    var asset: String
}

extension OutfitEntry {
    var chips: [OutfitChipItem] { OutfitSuggestion.chips(top: top, outer: outer) }
}

/// Today's suggestion, mirroring suggestOutfit() in design-system-web/src/app/weather.ts.
struct OutfitSuggestion {
    var top: TopLayer
    var outer: OuterLayer
    var advice: String

    static func make(delta: Double, yesterday: OutfitEntry?) -> OutfitSuggestion {
        let base = yesterday?.top ?? .longSleeve
        let yOuter = yesterday?.outer ?? .light
        if delta <= -3 {
            return .init(top: base, outer: .thick, advice: yesterday.map {
                "建議：比昨天冷，在「\($0.top.rawValue)」的基礎上換件厚外套。"
            } ?? "建議：比昨天明顯變冷，多加一層外套。")
        }
        if delta >= 3 {
            return .init(top: base, outer: .none, advice: yesterday != nil
                ? "建議：比昨天熱，可比「\(yOuter.rawValue)」再減一層。"
                : "建議：比昨天明顯變熱，減少疊搭。")
        }
        return .init(top: base, outer: yOuter, advice: yesterday != nil
            ? "建議：體感接近昨天，可參考「\(yOuter.rawValue)」。"
            : "建議：體感與昨天接近，維持平常穿搭即可。")
    }

    var chips: [OutfitChipItem] { Self.chips(top: top, outer: outer) }

    static func chips(top: TopLayer, outer: OuterLayer) -> [OutfitChipItem] {
        let t = OutfitChipItem(label: top.rawValue, asset: top.asset)
        return outer == .none ? [t] : [t, OutfitChipItem(label: outer.rawValue, asset: outer.asset)]
    }
}

enum DayKey {
    static func make(from date: Date = .now, calendar: Calendar = .current) -> String {
        let f = DateFormatter()
        f.calendar = calendar
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    static func yesterday(from date: Date = .now, calendar: Calendar = .current) -> String {
        let y = calendar.date(byAdding: .day, value: -1, to: date) ?? date
        return make(from: y, calendar: calendar)
    }
}

@MainActor
final class OutfitStore: ObservableObject {
    @Published private(set) var entries: [String: OutfitEntry] = [:]

    init() {
        load()
    }

    var today: OutfitEntry? { entries[DayKey.make()] }
    var yesterday: OutfitEntry? { entries[DayKey.yesterday()] }

    func saveToday(top: TopLayer, outer: OuterLayer) {
        let key = DayKey.make()
        entries[key] = OutfitEntry(dayKey: key, top: top, outer: outer)
        persist()
    }

    private func load() {
        guard let data = AppGroup.defaults.data(forKey: AppGroup.Key.outfitByDay),
              let decoded = try? JSONDecoder().decode([String: OutfitEntry].self, from: data) else { return }
        entries = decoded
    }

    private func persist() {
        if let data = try? JSONEncoder().encode(entries) {
            AppGroup.defaults.set(data, forKey: AppGroup.Key.outfitByDay)
        }
    }
}
