import SwiftUI

/// App shell, mirroring the web App: two tabs (天氣 / 設定) switched by the
/// floating pill nav, with the record-outfit sheet raised from the Home CTA.
struct RootTabView: View {
    @State private var tab = "weather"
    @State private var recording = false

    private let items = [
        FloatingNavItem(id: "weather", label: "天氣", icon: "nav-thermometer"),
        FloatingNavItem(id: "settings", label: "設定", icon: "nav-gear"),
    ]

    var body: some View {
        ZStack(alignment: .bottom) {
            Group {
                if tab == "weather" {
                    HomeView(onRecord: { recording = true })
                } else {
                    SettingsView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            FloatingNav(items: items, activeId: tab) { tab = $0 }
                .padding(.bottom, 8)
        }
        .sheet(isPresented: $recording) {
            OutfitLogView()
        }
    }
}
