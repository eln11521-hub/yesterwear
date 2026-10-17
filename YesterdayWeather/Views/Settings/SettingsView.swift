import SwiftUI
import CoreLocation

struct SettingsView: View {
    @EnvironmentObject private var settingsStore: SettingsStore
    @EnvironmentObject private var weather: WeatherSnapshotStore
    @EnvironmentObject private var outfit: OutfitStore
    @StateObject private var locator = LocationHelper()

    var body: some View {
        NavigationStack {
            Form {
                Section("通勤時段") {
                    Stepper(
                        "出門 \(settingsStore.settings.leaveTimeLabel)",
                        value: Binding(
                            get: { settingsStore.settings.leaveHour },
                            set: { settingsStore.settings.leaveHour = $0 }
                        ),
                        in: 5...11
                    )
                    Stepper(
                        "下班 \(settingsStore.settings.returnTimeLabel)",
                        value: Binding(
                            get: { settingsStore.settings.returnHour },
                            set: { settingsStore.settings.returnHour = $0 }
                        ),
                        in: 15...22
                    )
                }

                Section("地點") {
                    Toggle("手動輸入城市座標", isOn: Binding(
                        get: { settingsStore.settings.useManualLocation },
                        set: { settingsStore.settings.useManualLocation = $0 }
                    ))
                    TextField("城市名稱", text: Binding(
                        get: { settingsStore.settings.cityName },
                        set: { settingsStore.settings.cityName = $0 }
                    ))
                    HStack {
                        TextField("緯度", value: Binding(
                            get: { settingsStore.settings.latitude },
                            set: { settingsStore.settings.latitude = $0 }
                        ), format: .number)
                        TextField("經度", value: Binding(
                            get: { settingsStore.settings.longitude },
                            set: { settingsStore.settings.longitude = $0 }
                        ), format: .number)
                    }
                    TextField("時區 (IANA)", text: Binding(
                        get: { settingsStore.settings.timezone },
                        set: { settingsStore.settings.timezone = $0 }
                    ))
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()

                    Button("使用目前定位") {
                        locator.request()
                    }
                    if let err = locator.errorText {
                        Text(err).foregroundStyle(.red).font(YWTypography.caption)
                    }
                }

                Section("Widget 教學") {
                    Label("iOS：長按桌面 → 右上角 + → 搜尋 Yesterday Weather → 選尺寸加入", systemImage: "lanyardcard")
                    Label("鎖定畫面：自訂 → 鎖定畫面 → 加入小工具", systemImage: "lock.rectangle.on.rectangle")
                }

                Section {
                    Button("立即重新整理天氣") {
                        Task {
                            await weather.refresh(
                                settings: settingsStore.settings,
                                yesterdayOutfit: outfit.yesterday
                            )
                        }
                    }
                }

                #if DEBUG
                Section("開發者") {
                    NavigationLink("組件展示庫 (Catalog)") {
                        ComponentCatalogView()
                    }
                }
                #endif
            }
            .navigationTitle("設定")
            .onChange(of: locator.coordinate?.latitude) { _, _ in
                applyLocation()
            }
            .onChange(of: settingsStore.settings) { _, newValue in
                Task {
                    await weather.refresh(settings: newValue, yesterdayOutfit: outfit.yesterday)
                }
            }
        }
    }

    private func applyLocation() {
        guard let c = locator.coordinate else { return }
        settingsStore.settings.latitude = c.latitude
        settingsStore.settings.longitude = c.longitude
        settingsStore.settings.useManualLocation = false
        settingsStore.settings.cityName = locator.placeName ?? "目前位置"
        if let tz = TimeZone.current.identifier as String? {
            settingsStore.settings.timezone = tz
        }
    }
}

@MainActor
final class LocationHelper: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published var coordinate: CLLocationCoordinate2D?
    @Published var placeName: String?
    @Published var errorText: String?

    private let manager = CLLocationManager()

    override init() {
        super.init()
        manager.delegate = self
    }

    func request() {
        errorText = nil
        manager.requestWhenInUseAuthorization()
        manager.requestLocation()
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.first else { return }
        Task { @MainActor in
            self.coordinate = loc.coordinate
            let geocoder = CLGeocoder()
            if let place = try? await geocoder.reverseGeocodeLocation(loc).first {
                self.placeName = place.locality ?? place.name
            }
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in
            self.errorText = error.localizedDescription
        }
    }
}
