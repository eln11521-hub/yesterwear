import Foundation

enum AppGroup {
    static let id = "group.com.yesterdayweather.shared"
    static var defaults: UserDefaults {
        UserDefaults(suiteName: id) ?? .standard
    }

    /// Shared container (app + widget) for files such as outfit thumbnails.
    static var containerURL: URL? {
        FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: id)
    }

    enum Key {
        static let weatherSnapshot = "weatherSnapshot.v1"
        static let outfitByDay = "outfitByDay.v1"
        static let settings = "appSettings.v1"
        static let onboardingDone = "onboardingDone.v1"
    }
}
