import Foundation

/// The record sheet's four multi-select groups — mirrors OUTFIT_GROUPS in
/// design-system-web/src/app/outfit.ts. 上身 needs at least one item.
enum OutfitGroup: String, CaseIterable, Identifiable {
    case tops, outers, bottoms, accessories

    var id: String { rawValue }

    var label: String {
        switch self {
        case .tops: return "上身"
        case .outers: return "外套 / 疊搭"
        case .bottoms: return "下身"
        case .accessories: return "配件"
        }
    }

    var required: Bool { self == .tops }

    /// Display order; 外套 is ordered light → heavy.
    var items: [String] {
        switch self {
        case .tops: return ["短袖上衣", "背心無袖", "Polo衫", "長袖上衣", "襯衫", "針織衫", "帽T衛衣", "高領毛衣", "發熱衣"]
        case .outers: return ["薄外套", "連帽外套", "西裝外套", "鋪棉背心", "厚外套夾克", "毛呢大衣", "羽絨外套", "防風防水外套"]
        case .bottoms: return ["短褲", "短裙", "長裙", "長褲", "牛仔褲", "保暖褲"]
        case .accessories: return ["帽子", "毛帽", "圍巾", "手套", "雨傘", "墨鏡"]
        }
    }
}

/// Garment label → icon in Shared/SharedAssets.xcassets (web garmentIcon map).
enum Garment {
    static let asset: [String: String] = [
        "短袖上衣": "garment-short-sleeve", "背心無袖": "garment-vest", "Polo衫": "garment-polo",
        "長袖上衣": "garment-long-sleeve", "襯衫": "garment-shirt", "針織衫": "garment-knit",
        "帽T衛衣": "garment-hoodie", "高領毛衣": "garment-turtleneck", "發熱衣": "garment-thermal",
        "薄外套": "garment-light-jacket", "連帽外套": "garment-hooded-jacket", "西裝外套": "garment-blazer",
        "鋪棉背心": "garment-puffer-vest", "厚外套夾克": "garment-thick-jacket", "毛呢大衣": "garment-wool-coat",
        "羽絨外套": "garment-down-coat", "防風防水外套": "garment-waterproof",
        "短褲": "garment-shorts", "短裙": "garment-skirt", "長裙": "garment-long-skirt",
        "長褲": "garment-trousers", "牛仔褲": "garment-jeans", "保暖褲": "garment-thermal-pants",
        "帽子": "garment-cap", "毛帽": "garment-beanie", "圍巾": "garment-scarf",
        "手套": "garment-gloves", "雨傘": "garment-umbrella", "墨鏡": "garment-sunglasses",
    ]

    /// Labels renamed when the sheet went multi-select (「單穿」no longer means anything).
    static let renamed: [String: String] = [
        "襯衫（單穿）": "襯衫", "針織衫（單穿）": "針織衫", "帽T衛衣（單穿）": "帽T衛衣", "羽絨外套大衣": "羽絨外套",
    ]

    static func chip(_ label: String) -> OutfitChipItem { OutfitChipItem(label: label, asset: asset[label]) }

    /// The warmest outer layer picked.
    static func heaviest(_ outers: [String]) -> String? {
        let order = OutfitGroup.outers.items
        return outers.max { (order.firstIndex(of: $0) ?? 0) < (order.firstIndex(of: $1) ?? 0) }
    }
}

/// One day's picks, per group.
struct OutfitPicks: Codable, Equatable {
    var tops: [String] = []
    var outers: [String] = []
    var bottoms: [String] = []
    var accessories: [String] = []

    subscript(group: OutfitGroup) -> [String] {
        get {
            switch group {
            case .tops: return tops
            case .outers: return outers
            case .bottoms: return bottoms
            case .accessories: return accessories
            }
        }
        set {
            switch group {
            case .tops: tops = newValue
            case .outers: outers = newValue
            case .bottoms: bottoms = newValue
            case .accessories: accessories = newValue
            }
        }
    }

    /// Every picked label, in group order (上身 → 外套 → 下身 → 配件).
    var all: [String] { tops + outers + bottoms + accessories }

    var chips: [OutfitChipItem] { all.map(Garment.chip) }

    /// The two chips a widget has room for: the main top + the outermost layer (web keyChips).
    var keyChips: [OutfitChipItem] {
        [tops.first, Garment.heaviest(outers)].compactMap { $0 }.map(Garment.chip)
    }
}

struct OutfitEntry: Codable, Equatable {
    var dayKey: String
    var picks: OutfitPicks
    /// JPEG filename in the App Group container (photo-confirmed records).
    var thumbnailFile: String? = nil

    var source: String { thumbnailFile == nil ? "manual" : "photo_confirmed" }

    var thumbnailURL: URL? { thumbnailFile.flatMap { AppGroup.containerURL?.appendingPathComponent($0) } }

    var chips: [OutfitChipItem] { picks.chips }

    /// 「長袖上衣＋薄外套」 — used in the widget/notification advice.
    var displayText: String { picks.keyChips.map(\.label).joined(separator: "＋") }

    init(dayKey: String, picks: OutfitPicks, thumbnailFile: String? = nil) {
        self.dayKey = dayKey
        self.picks = picks
        self.thumbnailFile = thumbnailFile
    }

    private enum CodingKeys: String, CodingKey { case dayKey, picks, thumbnailFile, top, outer }

    /// Also reads records saved before multi-select (`top` + `outer` strings).
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        dayKey = try c.decode(String.self, forKey: .dayKey)
        thumbnailFile = try c.decodeIfPresent(String.self, forKey: .thumbnailFile)
        if let picks = try c.decodeIfPresent(OutfitPicks.self, forKey: .picks) {
            self.picks = picks
        } else {
            let fix = { (x: String) in Garment.renamed[x] ?? x }
            let top = try c.decodeIfPresent(String.self, forKey: .top).map(fix)
            let outer = try c.decodeIfPresent(String.self, forKey: .outer).map(fix)
            picks = OutfitPicks(tops: top.map { [$0] } ?? [],
                                outers: outer.flatMap { $0 == "不加外套" ? nil : [$0] } ?? [])
        }
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(dayKey, forKey: .dayKey)
        try c.encode(picks, forKey: .picks)
        try c.encodeIfPresent(thumbnailFile, forKey: .thumbnailFile)
    }
}

struct OutfitChipItem: Hashable {
    var label: String
    var asset: String?
}

/// Today's suggestion, mirroring suggestOutfit() in design-system-web/src/app/weather.ts:
/// colder → the outermost layer one step warmer, warmer → drop it, close → repeat
/// yesterday. Rain adds 雨傘.
struct OutfitSuggestion {
    var picks: OutfitPicks
    var advice: String

    var chips: [OutfitChipItem] { picks.chips }

    private static let warmerOuter: [String: String] = [
        "薄外套": "厚外套夾克", "連帽外套": "厚外套夾克", "鋪棉背心": "厚外套夾克", "防風防水外套": "厚外套夾克",
        "西裝外套": "毛呢大衣", "厚外套夾克": "羽絨外套", "毛呢大衣": "羽絨外套", "羽絨外套": "羽絨外套",
    ]
    private static let coldAccessories: Set<String> = ["毛帽", "圍巾", "手套"]

    static func make(delta: Double, rain: Bool = false, yesterday: OutfitEntry?) -> OutfitSuggestion {
        let y = yesterday?.picks
        let tops = (y?.tops.isEmpty == false) ? y!.tops : ["長袖上衣"]
        let yOuters = y?.outers ?? ["薄外套"]
        let bottoms = y?.bottoms ?? []
        var accessories = y?.accessories ?? []
        let yOuter = Garment.heaviest(yOuters)
        func withRain(_ xs: [String]) -> [String] { rain && !xs.contains("雨傘") ? xs + ["雨傘"] : xs }

        if delta <= -3 {
            let up = warmerOuter[yOuter ?? ""] ?? "厚外套夾克"
            if up == yOuter, !accessories.contains("圍巾") { accessories.append("圍巾") }
            let change = up == "厚外套夾克" ? "換件厚外套" : "換上「\(up)」"
            return .init(picks: .init(tops: tops, outers: [up], bottoms: bottoms, accessories: withRain(accessories)),
                         advice: yesterday != nil
                            ? "建議：比昨天冷，在「\(tops.joined(separator: "＋"))」的基礎上\(change)。"
                            : "建議：比昨天明顯變冷，多加一層外套。")
        }
        if delta >= 3 {
            let advice: String
            if yesterday == nil { advice = "建議：比昨天明顯變熱，減少疊搭。" }
            else if let yOuter { advice = "建議：比昨天熱，可比「\(yOuter)」再減一層。" }
            else { advice = "建議：比昨天熱，換件更薄的上衣。" }
            return .init(picks: .init(tops: tops, outers: yOuters.filter { $0 != yOuter }, bottoms: bottoms,
                                      accessories: withRain(accessories.filter { !coldAccessories.contains($0) })),
                         advice: advice)
        }
        return .init(picks: .init(tops: tops, outers: yOuters, bottoms: bottoms, accessories: withRain(accessories)),
                     advice: yesterday.map { "建議：體感接近昨天，可參考「\($0.picks.all.joined(separator: "＋"))」。" }
                        ?? "建議：體感與昨天接近，維持平常穿搭即可。")
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

    /// Saves today's record. `thumbnailJPEG` keeps the photo as the next-day
    /// anchor; passing nil with `keepThumbnail` retains an existing one.
    func saveToday(_ picks: OutfitPicks, thumbnailJPEG: Data? = nil, keepThumbnail: Bool = false) {
        let key = DayKey.make()
        var file = keepThumbnail ? entries[key]?.thumbnailFile : nil
        if let thumbnailJPEG, let dir = AppGroup.containerURL {
            let name = "outfit-\(key).jpg"
            if (try? thumbnailJPEG.write(to: dir.appendingPathComponent(name), options: .atomic)) != nil {
                file = name
            }
        }
        entries[key] = OutfitEntry(dayKey: key, picks: picks, thumbnailFile: file)
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
