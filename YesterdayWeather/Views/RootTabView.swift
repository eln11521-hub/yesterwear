import SwiftUI

/// App shell, mirroring the web App: Home, with Settings pushed from the header
/// gear (no tab bar) and the record-outfit / place sheets raised over it.
struct RootTabView: View {
    @EnvironmentObject private var settings: SettingsStore
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore

    @State private var showingSettings = false
    @State private var recording = false
    @State private var switchingPlace = false

    var body: some View {
        ZStack {
            HomeView(onRecord: { recording = true },
                     onSwitchPlace: { switchingPlace = true },
                     onOpenSettings: { showingSettings = true })
            if showingSettings {
                SettingsView(onBack: { showingSettings = false })
                    .background(YWTokens.Sys.surfacePaper.ignoresSafeArea())
                    .compositingGroup()   // slide as one layer (no lagging header button)
                    .transition(.move(edge: .trailing))
                    .zIndex(1)
            }
        }
        .animation(.spring(duration: 0.35, bounce: 0), value: showingSettings)
        // In-app sheets (edge to edge).
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
