import Foundation

/// Place names from the geocoders can come back in Simplified Chinese (e.g.
/// 「东京都」); the app only shows Traditional (Taiwan) characters. Same curated
/// character map as the web (design-system-web/scripts/gen-s2t.mjs), which leaves
/// characters that are valid Traditional (台, 里, 后…) untouched — ICU's
/// Hans-Hant transform would turn 后里 into 後里.
enum Traditional {
    private static let map: [Character: Character] = {
        let chars = Array(s2tPairs)
        var m: [Character: Character] = [:]
        m.reserveCapacity(chars.count / 2)
        for i in stride(from: 0, to: chars.count - 1, by: 2) { m[chars[i]] = chars[i + 1] }
        return m
    }()

    static func convert(_ text: String) -> String {
        String(text.map { map[$0] ?? $0 })
    }
}

extension String {
    /// This string with Simplified Chinese characters converted to Traditional.
    var traditional: String { Traditional.convert(self) }
}
