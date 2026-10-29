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
    // Raw authored values — mirrors design-system-web/tokens/tokens-ref.css.
    // Do not use directly in views.
    enum Ref {
        // Delta state colors
        static let deltaCold      = Color(hex: 0x5A7A94)   // dusty slate, 降溫
        static let deltaColdLight = Color(hex: 0x6C8AA4)
        static let deltaColdDark  = Color(hex: 0x435D76)
        static let deltaNeutral   = Color(hex: 0xA09A94)   // 持平 (warmed 2026-10)
        static let deltaWarm      = Color(hex: 0xE8A44A)   // editorial orange, 升溫

        // Base palette (Figma Variables, node 174:2)
        static let paper     = Color(hex: 0xFBFAF9)
        static let card      = Color(hex: 0xF5F5F5)
        static let cardWarm  = Color(hex: 0xF3E6DA)
        static let line      = Color(hex: 0xE6E0D8)
        static let ink       = Color(hex: 0x111111)
        static let white     = Color.white
        static let muted     = Color(hex: 0x6F6964)
        static let muted2    = Color(hex: 0xB5AFA8)
        static let grayMid   = Color(hex: 0x666666)
        static let grayLight = Color(hex: 0x999999)
        static let label     = Color(hex: 0x8C8680)
        static let gray8a    = Color(hex: 0x8A8A8A)
        static let sep       = Color(hex: 0xEFEDEA)

        // Badges + promo
        static let badgeWarmBg     = Color(hex: 0xFBEEDD)
        static let badgeWarmText   = Color(hex: 0xB9741F)
        static let badgeNeutralBg  = Color(hex: 0xF0EBE4)
        static let promoBg         = Color(hex: 0xF5C88A)

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
        static let opacitySolid: Double         = 1
        static let opacityGradientMid: Double   = 0.55
        static let opacityGradientLight: Double = 0.18
        static let opacityStrong: Double        = 0.72
        static let opacityFaint: Double         = 0.22
        static let opacitySoft: Double          = 0.35
        static let opacityHalf: Double          = 0.5
        static let opacitySheer: Double         = 0.15

        // Blur
        static let blurSm: CGFloat = 30
        static let blurLg: CGFloat = 40

        // Icon
        static let iconSm: CGFloat = 16
        static let iconMd: CGFloat = 20
        static let iconLg: CGFloat = 24
    }

    // MARK: - System Layer（系統層）
    // Semantic roles — mirrors design-system-web/tokens/tokens-sys.css.
    enum Sys {
        // Delta
        static let deltaCold      = Ref.deltaCold
        static let deltaColdLight = Ref.deltaColdLight
        static let deltaColdDark  = Ref.deltaColdDark
        static let deltaNeutral   = Ref.deltaNeutral
        static let deltaWarm      = Ref.deltaWarm

        // Text
        static let textPrimary   = Ref.ink
        static let textSecondary = Ref.grayMid
        static let textTertiary  = Ref.grayLight
        static let textOnDark    = Ref.white
        static let textLabel     = Ref.label     // small mono labels
        static let textMuted     = Ref.gray8a    // section labels
        static let textMutedWarm = Ref.muted     // warm secondary
        static let textHint      = Ref.muted2    // warm tertiary / hint
        static let separator     = Ref.sep

        // Badges + promo
        static let badgeRequiredBg   = Ref.badgeWarmBg
        static let badgeRequiredText = Ref.badgeWarmText
        static let badgeOptionalBg   = Ref.badgeNeutralBg
        static let badgeOptionalText = Ref.gray8a
        static let promoBg           = Ref.promoBg

        // Surface
        static let surfacePaper  = Ref.paper
        static let surfaceRaised = Ref.card
        static let surfaceCard   = Ref.card      // legacy alias of surfaceRaised
        static let surfaceWarm   = Ref.cardWarm
        static let surfaceWhite  = Ref.white
        static let line          = Ref.line

        // Radius
        static let radiusSm   = Ref.radiusSm
        static let radiusMd   = Ref.radiusMd
        static let radiusLg   = Ref.radiusLg
        static let radiusXl   = Ref.radiusXl
        static let radius2xl  = Ref.radius2xl
        static let radiusFull = Ref.radiusFull

        // Spacing
        static let spacingXs  = Ref.spaceXs
        static let spacingSm  = Ref.spaceSm
        static let spacingMd  = Ref.spaceMd
        static let spacingLg  = Ref.spaceLg
        static let spacingXl  = Ref.spaceXl
        static let spacing2xl = Ref.space2xl

        // Opacity
        static let opacityOverlay: Double  = Ref.opacityStrong
        static let opacitySubtle: Double   = Ref.opacitySoft
        static let opacityDisabled: Double = Ref.opacityHalf
        static let opacityFaint: Double    = Ref.opacitySheer

        // Icon
        static let iconSm = Ref.iconSm
        static let iconMd = Ref.iconMd
        static let iconLg = Ref.iconLg

        // Motion
        static let motionTapDuration: Double        = 0.08
        static let motionStateDuration: Double      = 0.2
        static let motionTransitionDuration: Double = 0.3
        static let motionScalePressed: CGFloat      = 0.95
    }

    // MARK: - Typography（排版）
    // Bundled brand fonts, registered at launch by BrandFonts.register():
    //   DM Sans (UI, variable) · IBM Plex Mono (numerals/dates) · Archivo Black (display).
    // Mirrors the web tokens --yw-sys-font-ui / --yw-sys-font-mono + the Archivo Black wordmark.
    enum Typography {
        private static let uiFace = "DMSans-9ptRegular"        // variable; weight via .weight()
        private static let monoMedium = "IBMPlexMono-Medium"
        private static let monoSemibold = "IBMPlexMono-SemiBold"
        private static let displayFace = "ArchivoBlack-Regular"

        // UI text — DM Sans
        static let hero    = Font.custom(uiFace, size: Ref.typeHero).weight(.semibold)
        static let title   = Font.custom(uiFace, size: Ref.typeTitle).weight(.semibold)
        static let body    = Font.custom(uiFace, size: Ref.typeBody).weight(.medium)
        static let caption = Font.custom(uiFace, size: Ref.typeCaption).weight(.medium)
        static let micro   = Font.custom(uiFace, size: Ref.typeMicro).weight(.semibold)

        // Display — Archivo Black (brand wordmark / onboarding title)
        static func display(_ size: CGFloat = Ref.typeHero) -> Font {
            Font.custom(displayFace, size: size)
        }

        /// DM Sans at an arbitrary size — the web screens use many exact px sizes.
        static func ui(_ size: CGFloat, _ weight: Font.Weight = .regular) -> Font {
            Font.custom(uiFace, size: size).weight(weight)
        }

        /// IBM Plex Mono at an arbitrary size. Only Medium (500) and SemiBold
        /// (600) are bundled; .semibold and heavier map to SemiBold.
        static func mono(_ size: CGFloat, _ weight: Font.Weight = .medium) -> Font {
            let heavy: [Font.Weight] = [.semibold, .bold, .heavy, .black]
            return Font.custom(heavy.contains(weight) ? monoSemibold : monoMedium, size: size)
        }
    }
}
