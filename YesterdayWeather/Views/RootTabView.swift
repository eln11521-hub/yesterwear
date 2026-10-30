import SwiftUI

/// App shell, mirroring the web App: two tabs (天氣 / 設定) switched by the
/// floating pill nav, with the record-outfit sheet raised from the Home CTA.
struct RootTabView: View {
    @EnvironmentObject private var settings: SettingsStore
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore

    @State private var tab = "weather"
    @State private var recording = false
    @State private var switchingPlace = false

    private let items = [
        FloatingNavItem(id: "weather", label: "天氣", icon: "nav-thermometer"),
        FloatingNavItem(id: "settings", label: "設定", icon: "nav-gear"),
    ]

    var body: some View {
        ZStack(alignment: .bottom) {
            Group {
                if tab == "weather" {
                    HomeView(onRecord: { recording = true }, onSwitchPlace: { switchingPlace = true })
                } else {
                    SettingsView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            FloatingNav(items: items, activeId: tab) { tab = $0 }
                .padding(.bottom, 8)
        }
        // In-app sheets (edge to edge, over the floating nav).
        .ywSheet(isPresented: $recording) { recordSheet }
        .ywSheet(isPresented: $switchingPlace, fraction: 0.7) { LocationSheet() }
    }

    /// Seeds with today's record when updating, otherwise today's suggestion
    /// (web App: initial = today ?? suggestion).
    private var recordSheet: some View {
        let suggestion = OutfitSuggestion.make(
            delta: weather.snapshot?.overallDelta ?? 0, rain: weather.snapshot?.showRain ?? false,
            yesterday: outfit.yesterday)
        let today = outfit.today
        let thumb = today?.thumbnailURL.flatMap { UIImage(contentsOfFile: $0.path) }
        return RecordOutfitSheet(
            initial: today?.picks ?? suggestion.picks,
            initialThumb: thumb
        ) { picks, photo, keptExisting in
            outfit.saveToday(picks,
                             thumbnailJPEG: photo?.thumbnailJPEG(), keepThumbnail: keptExisting)
            recording = false
            Task { await weather.refresh(settings: settings.settings, yesterdayOutfit: outfit.yesterday) }
        }
    }
}
