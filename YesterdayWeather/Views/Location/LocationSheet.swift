import SwiftUI

/// 切換地點 — ported from design-system-web/src/pages/location-sheet/LocationSheet.tsx.
/// One place at a time (single select): 使用目前位置 (GPS), a city search, or
/// 最近使用. Picking one switches Home to that place's weather and closes.
struct LocationSheet: View {
    @EnvironmentObject private var store: SettingsStore
    @Environment(\.ywDismissSheet) private var dismiss

    @State private var query = ""
    @State private var results: [WeatherService.Place] = []
    @State private var searched = false
    @State private var gpsState: GPSState = .idle

    private enum GPSState { case idle, locating, denied }

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    var body: some View {
        let s = store.settings
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("切換地點")
                    .font(T.ui(22, .semibold))
                    .foregroundStyle(S.textPrimary)

                searchField

                if searched {
                    group("搜尋結果") {
                        if results.isEmpty {
                            note("找不到「\(query)」，換個關鍵字試試。")
                        } else {
                            card {
                                ForEach(Array(results.enumerated()), id: \.element.id) { i, r in
                                    if i > 0 { divider }
                                    row(r.name, picked: s.useManualLocation && isCurrent(r.lat, r.lon)) {
                                        pick(SavedPlace(name: r.name, latitude: r.lat, longitude: r.lon, timezone: r.timezone))
                                    }
                                }
                            }
                        }
                    }
                }

                group("目前位置") {
                    card {
                        row(gpsState == .locating ? "定位中…" : "使用目前位置",
                            hint: s.useManualLocation ? nil : s.cityName,
                            pin: true,
                            picked: !s.useManualLocation,
                            action: useGps)
                    }
                    if gpsState == .denied {
                        note("無法取得定位，請開啟定位權限或改用搜尋。")
                    }
                }

                if !s.recentPlaces.isEmpty {
                    group("最近使用") {
                        card {
                            ForEach(Array(s.recentPlaces.enumerated()), id: \.element.id) { i, p in
                                if i > 0 { divider }
                                row(p.name, picked: s.useManualLocation && isCurrent(p.latitude, p.longitude)) { pick(p) }
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 4)
            .padding(.bottom, 24)
        }
        .scrollIndicators(.hidden)
    }

    // MARK: Pieces

    private var searchField: some View {
        HStack(spacing: 8) {
            TextField("搜尋城市…", text: $query)
                .font(T.ui(14))
                .padding(.vertical, 10)
                .padding(.horizontal, 12)
                .background(S.surfacePaper, in: RoundedRectangle(cornerRadius: S.radiusSm))
                .overlay(RoundedRectangle(cornerRadius: S.radiusSm).strokeBorder(S.line, lineWidth: 1))
                .submitLabel(.search)
                .onSubmit(search)
            Button("搜尋", action: search)
                .font(T.ui(14, .semibold))
                .foregroundStyle(S.textOnDark)
                .padding(.vertical, 10)
                .padding(.horizontal, 16)
                .background(S.textPrimary, in: RoundedRectangle(cornerRadius: S.radiusSm))
        }
    }

    private func group<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel(title)
            content()
        }
    }

    private func card<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(spacing: 0) { content() }
            .clipShape(RoundedRectangle(cornerRadius: S.radiusLg))
            .overlay(RoundedRectangle(cornerRadius: S.radiusLg).strokeBorder(S.line, lineWidth: 1))
    }

    private var divider: some View {
        Rectangle().fill(S.line).frame(height: 1)
    }

    private func row(_ label: String, hint: String? = nil, pin: Bool = false, picked: Bool,
                     action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if pin {
                    PinGlyph()
                        .fill(S.textPrimary, style: FillStyle(eoFill: true))
                        .frame(width: 16, height: 16)
                }
                Text(label).font(T.ui(15)).foregroundStyle(S.textPrimary).lineLimit(1)
                if let hint {
                    Text(hint).font(T.ui(13)).foregroundStyle(S.textLabel).lineLimit(1)
                }
                Spacer(minLength: 0)
                if picked {
                    AssetIcon(name: "icon-check", size: 18).foregroundStyle(S.textPrimary)
                }
            }
            .padding(.vertical, 14)
            .padding(.horizontal, 16)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(picked ? .isSelected : [])
    }

    private func note(_ text: String) -> some View {
        Text(text)
            .font(T.ui(12))
            .foregroundStyle(S.textLabel)
            .padding(.horizontal, 4)
    }

    // MARK: Actions

    private func isCurrent(_ lat: Double, _ lon: Double) -> Bool {
        abs(store.settings.latitude - lat) < 0.01 && abs(store.settings.longitude - lon) < 0.01
    }

    private func search() {
        let q = query
        Task {
            results = (try? await WeatherService.shared.geocode(q)) ?? []
            searched = true
        }
    }

    private func pick(_ place: SavedPlace) {
        store.select(place)
        dismiss()
    }

    private func useGps() {
        gpsState = .locating
        Task {
            if let fix = await OneShotLocation().request() {
                store.select(SavedPlace(name: fix.placeName ?? "目前位置",
                                        latitude: fix.coordinate.latitude,
                                        longitude: fix.coordinate.longitude,
                                        timezone: fix.timezone), gps: true)
                gpsState = .idle
                dismiss()
            } else {
                gpsState = .denied
            }
        }
    }
}
