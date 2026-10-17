import SwiftUI

/// YWTokens — 昨日天氣對比 design tokens.
///
/// Mirrors the CSS token layers in `design-system/tokens/`:
///   - Ref  : raw authored values (design-system/tokens/tokens-ref.css)
///   - Sys  : semantic roles      (design-system/tokens/tokens-sys.css)
///   - Comp : component slots      (design-system/tokens/tokens-comp.css)
///
/// RULE: Views should reference `YWTokens.Sys.*` (semantic) or component
/// helpers, never `YWTokens.Ref.*` directly and never hardcoded hex/points.
/// See design-system/TOKEN_ARCHITECTURE.md for the full model.
enum YWTokens {

    // MARK: - Reference Layer（引用層）
    // Raw authored values. Do not use directly in views.
    enum Ref {
        // Delta state colors
        static let deltaCold      = Color(hex: 0x5A7A94)   // dusty slate
        static let deltaColdLight = Color(hex: 0x6C8AA4)
        static let deltaColdDark  = Color(hex: 0x435D76)
        static let deltaNeutral   = Color(hex: 0x9E9E9E)
        static let deltaWarm      = Color(hex: 0xE8A44A)   // editorial orange

        // Base palette
        static let paper          = Color(hex: 0xFAF7F2)   // warm cream
        static let card           = Color(hex: 0xF0EBE4)   // beige
        static let ink            = Color(hex: 0x111111)   // near-black
        static let textSecondary  = Color(hex: 0x666666)
        static let textTertiary   = Color(hex: 0x999999)
        static let white          = Color.white

        // Radius (4pt grid)
        static let radiusSm: CGFloat   = 12
        static let radiusMd: CGFloat   = 16
        static let radiusLg: CGFloat   = 20
        static let radiusXl: CGFloat   = 24
        static let radius2xl: CGFloat  = 28
        static let radiusFull: CGFloat = 48

        // Spacing (4pt grid)
        static let spaceXs: CGFloat  = 4
        static let spaceSm: CGFloat  = 8
        static let spaceMd: CGFloat  = 12
        static let spaceLg: CGFloat  = 16
        static let spaceXl: CGFloat  = 20
        static let space2xl: CGFloat = 24

        // Type sizes
        static let typeMicro: CGFloat   = 10
        static let typeCaption: CGFloat = 12
        static let typeBody: CGFloat    = 16
        static let typeTitle: CGFloat   = 22
        static let typeHero: CGFloat    = 44

        // Opacity
        static let opacityGradientMid: Double   = 0.55
        static let opacityGradientLight: Double = 0.18
        static let opacityCardOverlay: Double   = 0.72
        static let opacityCircle1: Double       = 0.22
        static let opacityCircle2: Double       = 0.35
        static let opacitySubtle: Double        = 0.35
        static let opacityDisabled: Double      = 0.5

        // Blur
        static let blurSm: CGFloat = 30
        static let blurLg: CGFloat = 40
    }

    // MARK: - System Layer（系統層）
    // Semantic roles. Prefer these in views.
    enum Sys {
        // Delta semantic colors
        static let deltaCold      = Ref.deltaCold
        static let deltaColdLight = Ref.deltaColdLight
        static let deltaColdDark  = Ref.deltaColdDark
        static let deltaNeutral   = Ref.deltaNeutral
        static let deltaWarm      = Ref.deltaWarm

        // Text
        static let textPrimary   = Ref.ink
        static let textSecondary = Ref.textSecondary
        static let textTertiary  = Ref.textTertiary
        static let textOnDark    = Ref.white

        // Surface
        static let surfacePaper = Ref.paper
        static let surfaceCard  = Ref.card
        static let surfaceWhite = Ref.white

        // Radius
        static let radiusSm   = Ref.radiusSm
        static let radiusMd   = Ref.radiusMd
        static let radiusLg   = Ref.radiusLg
        static let radiusXl   = Ref.radiusXl
        static let radiusFull = Ref.radiusFull

        // Spacing
        static let spacingXs  = Ref.spaceXs
        static let spacingSm  = Ref.spaceSm
        static let spacingMd  = Ref.spaceMd
        static let spacingLg  = Ref.spaceLg
        static let spacingXl  = Ref.spaceXl
        static let spacing2xl = Ref.space2xl

        // Opacity
        static let opacityOverlay: Double  = Ref.opacityCardOverlay
        static let opacitySubtle: Double   = Ref.opacitySubtle
        static let opacityDisabled: Double = Ref.opacityDisabled

        // Motion
        static let motionTapDuration: Double        = 0.08
        static let motionStateDuration: Double      = 0.2
        static let motionTransitionDuration: Double = 0.3
        static let motionScalePressed: CGFloat      = 0.95
    }

    // MARK: - Typography（排版）
    // Font family: design specifies DM Sans (UI) + IBM Plex Mono (numbers).
    // Currently system rounded until font files are bundled. See DESIGN_PRINCIPLES.md.
    enum Type {
        static let hero    = Font.system(size: Ref.typeHero,    weight: .semibold, design: .rounded)
        static let title   = Font.system(size: Ref.typeTitle,   weight: .semibold, design: .rounded)
        static let body    = Font.system(size: Ref.typeBody,    weight: .medium,   design: .rounded)
        static let caption = Font.system(size: Ref.typeCaption, weight: .medium,   design: .rounded)
        static let micro   = Font.system(size: Ref.typeMicro,   weight: .semibold, design: .rounded)
    }
}
