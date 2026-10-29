import SwiftUI

@main
struct YesterdayWeatherApp: App {
    @StateObject private var settingsStore = SettingsStore()
    @StateObject private var outfitStore = OutfitStore()
    @StateObject private var weatherStore = WeatherSnapshotStore()
    @AppStorage(AppGroup.Key.onboardingDone, store: AppGroup.defaults)
    private var onboardingDone = false

    init() {
        BrandFonts.register()
    }

    var body: some Scene {
        WindowGroup {
            Group {
                if onboardingDone {
                    RootTabView()
                } else {
                    WelcomeView(onDone: {
                        onboardingDone = true
                    })
                }
            }
            .environmentObject(settingsStore)
            .environmentObject(outfitStore)
            .environmentObject(weatherStore)
            .preferredColorScheme(.light)
            .task {
                await weatherStore.refresh(
                    settings: settingsStore.settings,
                    yesterdayOutfit: outfitStore.yesterday
                )
            }
        }
    }
}
