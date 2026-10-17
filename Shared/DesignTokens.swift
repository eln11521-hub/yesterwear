import SwiftUI

enum TempDeltaState: Equatable {
    case cooler
    case neutral
    case warmer

    static func from(deltaCelsius: Double) -> TempDeltaState {
        if deltaCelsius <= -3 { return .cooler }
        if deltaCelsius >= 3 { return .warmer }
        return .neutral
    }

    /// Semantic delta color. Sourced from the design token layer (YWTokens.Sys)
    /// so values stay aligned with the design direction (2026-08-27 refinement:
    /// cool → dusty slate #5A7A94, warm → editorial orange #E8A44A).
    var primary: Color {
        switch self {
        case .cooler: return YWTokens.Sys.deltaCold      // was #4A90E2
        case .neutral: return YWTokens.Sys.deltaNeutral  // #9E9E9E (unchanged)
        case .warmer: return YWTokens.Sys.deltaWarm      // was #F5A623
        }
    }

    var label: String {
        switch self {
        case .cooler: return "降溫"
        case .neutral: return "持平"
        case .warmer: return "升溫"
        }
    }

    var symbol: String {
        switch self {
        case .cooler: return "arrow.down"
        case .neutral: return "equal"
        case .warmer: return "arrow.up"
        }
    }
}

/// Typography scale. Delegates to the token layer (YWTokens.Type) so the
/// type scale has a single source of truth. Retained as `YWTypography` for
/// backwards compatibility with existing views; new code may use YWTokens.Type.
enum YWTypography {
    static let hero = YWTokens.Type.hero
    static let title = YWTokens.Type.title
    static let body = YWTokens.Type.body
    static let caption = YWTokens.Type.caption
    static let micro = YWTokens.Type.micro
}

extension Color {
    init(hex: UInt32, opacity: Double = 1) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(.sRGB, red: r, green: g, blue: b, opacity: opacity)
    }
}
