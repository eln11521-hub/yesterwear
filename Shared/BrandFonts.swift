import CoreText
import Foundation

/// Registers the bundled brand fonts with the current process at launch:
///   - Archivo Black  → display / brand wordmark (onboarding title)
///   - DM Sans        → UI text (variable; weight applied via `.weight()`)
///   - IBM Plex Mono  → numerals / dates
///
/// Call once from the app's `init()` and from the widget bundle's `init()`.
/// `Bundle.main` resolves to whichever bundle is running (app or widget
/// extension); both embed the `.ttf` files from `Shared/Fonts`, so the same
/// call works in each process. Registration must run before any `Font.custom`
/// is first evaluated — the `YWTokens.Type` fonts are lazy `static let`s, so
/// registering in `init()` is early enough.
enum BrandFonts {
    private static var didRegister = false

    static func register() {
        guard !didRegister else { return }
        didRegister = true

        let urls = Bundle.main.urls(forResourcesWithExtension: "ttf", subdirectory: nil) ?? []
        for url in urls {
            CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
        }
    }
}
