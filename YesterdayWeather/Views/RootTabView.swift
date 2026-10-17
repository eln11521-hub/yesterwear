import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem { Label("今日", systemImage: "thermometer.medium") }
            OutfitLogView()
                .tabItem { Label("穿搭", systemImage: "tshirt") }
            SettingsView()
                .tabItem { Label("設定", systemImage: "gearshape") }
        }
        .tint(Color(hex: 0x1C1C1C))
    }
}
