import SwiftUI
import UserNotifications

/// 設定 — ported from design-system-web/src/pages/settings/SettingsScreen.tsx
/// (Figma 404:10). Warm ground, white grouped cards with hairline dividers.
struct SettingsView: View {
    @EnvironmentObject private var store: SettingsStore
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore
    @Environment(\.openURL) private var openURL

    @State private var query = ""
    @State private var results: [WeatherService.Place] = []
    @State private var geoState: GeoState = .idle
    @State private var notifAuthorized = false
    @State private var notifDenied = false

    private enum GeoState { case idle, locating, denied }

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("設定")
                .font(T.ui(22, .semibold))
                .foregroundStyle(S.textPrimary)
                .padding(.horizontal, 20)
                .padding(.top, 20)
                .padding(.bottom, 8)

            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    commuteGroup
                    locationGroup
                    unitGroup
                    notificationGroup
                    Color.clear.frame(height: 64 + 32)   // floating-nav clearance
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
            }
            .scrollIndicators(.hidden)
        }
        .background(S.surfaceWarm.ignoresSafeArea())
        .task { await refreshNotifStatus() }
        .onChange(of: store.settings) { old, new in
            // Only refetch when something that affects the weather changed.
            let weatherKeys = (old.latitude, old.longitude, old.leaveHour, old.returnHour)
                != (new.latitude, new.longitude, new.leaveHour, new.returnHour)
            if weatherKeys {
                Task { await weather.refresh(settings: new, yesterdayOutfit: outfit.yesterday) }
            }
        }
    }

    // MARK: 通勤時段

    private var commuteGroup: some View {
        group("通勤時段", note: "決定 Widget 與通知中出門／下班時段的溫度比對基準。") {
            card {
                timeRow("出門時間", minutes: store.settings.leaveHour * 60 + store.settings.leaveMinute) { m in
                    store.settings.leaveHour = m / 60
                    store.settings.leaveMinute = m % 60
                }
                divider
                timeRow("下班時間", minutes: store.settings.returnHour * 60 + store.settings.returnMinute) { m in
                    store.settings.returnHour = m / 60
                    store.settings.returnMinute = m % 60
                }
            }
        }
    }

    // MARK: 地點設定

    private var locationGroup: some View {
        let manual = store.settings.useManualLocation
        return group("地點設定", note: manual
                     ? "固定城市模式下，旅行時資料不會跟著你移動。"
                     : "自動定位：旅行跨城市時，昨日仍以你昨天所在地的體感為基準。") {
            Segmented(options: ["GPS 自動定位", "手動輸入城市"], selected: manual ? 1 : 0) {
                store.settings.useManualLocation = $0 == 1
            }
            card {
                if manual {
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
                    .padding(EdgeInsets(top: 12, leading: 12, bottom: 4, trailing: 12))
                    ForEach(results) { place in
                        Rectangle().fill(S.line).frame(height: 1)
                        Button {
                            choose(place)
                        } label: {
                            Text(place.name)
                                .font(T.ui(14))
                                .foregroundStyle(S.textPrimary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.vertical, 12)
                                .padding(.horizontal, 16)
                                .contentShape(Rectangle())
                        }
                        .buttonStyle(.plain)
                    }
                    divider
                    valueRow("目前地點", store.settings.cityName)
                } else {
                    valueRow("目前地點", store.settings.cityName)
                    divider
                    Button(action: useGps) {
                        HStack {
                            Text(geoState == .locating ? "定位中…" : "使用目前位置")
                                .font(T.ui(15))
                                .foregroundStyle(S.textPrimary)
                            Spacer()
                            Text("›").font(T.ui(18)).foregroundStyle(S.textTertiary)
                        }
                        .padding(.vertical, 14)
                        .padding(.horizontal, 16)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    if geoState == .denied {
                        divider
                        permissionHint(prefix: "尚未取得定位權限，可", link: "前往系統設定", suffix: "或改用手動輸入城市。") {
                            openSystemSettings()
                        }
                        .padding(.vertical, 12)
                        .padding(.horizontal, 16)
                    }
                }
            }
        }
    }

    // MARK: 溫度單位

    private var unitGroup: some View {
        group("溫度單位", note: "跟隨系統地區（美國 °F，其餘 °C）。全域生效，溫差同步換算，色彩門檻不變。") {
            Segmented(options: ["攝氏 °C", "華氏 °F"], selected: store.settings.unit == .f ? 1 : 0) {
                store.settings.unit = $0 == 1 ? .f : .c
            }
        }
    }

    // MARK: 通知管理

    private var notificationGroup: some View {
        let s = store.settings
        return group("通知管理", note: "通勤提醒為出門／下班前 30 分；晚間預覽預設 21:30（可設 20:00–23:00）。僅在溫差 ≥ 3° 或降雨 > 50% 時推播。") {
            card {
                toggleRow("通勤提醒", isOn: binding(\.notifCommute))
                if notifAuthorized && s.notifCommute {
                    divider
                    timeRow("出門提醒時間", minutes: s.leaveAlert) { store.settings.leaveAlertMinutes = $0 }
                    divider
                    timeRow("下班提醒時間", minutes: s.returnAlert) { store.settings.returnAlertMinutes = $0 }
                }
                divider
                toggleRow("晚間天氣預覽", isOn: binding(\.notifEvening))
                if notifAuthorized && s.notifEvening {
                    divider
                    timeRow("推播時間", minutes: s.eveningMinutes, range: (20 * 60)...(23 * 60)) {
                        store.settings.eveningMinutes = $0
                    }
                }
            }
            .opacity(notifAuthorized ? 1 : S.opacityDisabled)
            .disabled(!notifAuthorized)

            if !notifAuthorized {
                permissionHint(prefix: "尚未開啟通知權限，", link: "前往系統設定", suffix: "後即可開啟提醒。") {
                    Task { await requestNotif() }
                }
                .padding(.horizontal, 4)
                .padding(.top, 2)
            }
        }
    }

    // MARK: Building blocks

    private func group<Content: View>(_ title: String, note: String? = nil, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel(title)
            content()
            if let note {
                Text(note)
                    .font(T.ui(12))
                    .lineSpacing(12 * 0.2)
                    .foregroundStyle(S.textLabel)
                    .padding(.horizontal, 4)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private func card<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(spacing: 0) { content() }
            .background(S.surfaceWhite)
            .clipShape(RoundedRectangle(cornerRadius: S.radiusLg))
            .overlay(RoundedRectangle(cornerRadius: S.radiusLg).strokeBorder(S.line, lineWidth: 1))
    }

    private var divider: some View {
        Rectangle().fill(S.line).frame(height: 1).padding(.leading, 16)
    }

    private func valueRow(_ label: String, _ value: String) -> some View {
        HStack(spacing: 12) {
            Text(label).font(T.ui(15)).foregroundStyle(S.textPrimary)
            Spacer(minLength: 0)
            Text(value).font(T.ui(15)).foregroundStyle(S.textLabel).lineLimit(1)
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 16)
    }

    private func toggleRow(_ label: String, isOn: Binding<Bool>) -> some View {
        HStack(spacing: 12) {
            Text(label).font(T.ui(15)).foregroundStyle(S.textPrimary)
            Spacer(minLength: 0)
            Toggle("", isOn: isOn).labelsHidden().toggleStyle(YWToggleStyle())
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 16)
    }

    /// Time row: label + mono time (web <input type="time">) backed by the
    /// native compact hour/minute picker.
    private func timeRow(_ label: String, minutes: Int, range: ClosedRange<Int> = 0...(24 * 60 - 1),
                         set: @escaping (Int) -> Void) -> some View {
        let cal = Calendar.current
        let base = cal.startOfDay(for: .now)
        let date = Binding<Date>(
            get: { base.addingTimeInterval(TimeInterval(minutes * 60)) },
            set: {
                let c = cal.dateComponents([.hour, .minute], from: $0)
                set(min(max((c.hour ?? 0) * 60 + (c.minute ?? 0), range.lowerBound), range.upperBound))
            }
        )
        let bounds = base.addingTimeInterval(TimeInterval(range.lowerBound * 60))...base.addingTimeInterval(TimeInterval(range.upperBound * 60))
        return HStack(spacing: 12) {
            Text(label).font(T.ui(15)).foregroundStyle(S.textPrimary)
            Spacer(minLength: 0)
            DatePicker("", selection: date, in: bounds, displayedComponents: .hourAndMinute)
                .labelsHidden()
                .environment(\.locale, Locale(identifier: "en_GB"))   // 24-hour, like the web
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
    }

    private func permissionHint(prefix: String, link: String, suffix: String, action: @escaping () -> Void) -> some View {
        (Text(prefix) + Text(link).fontWeight(.semibold).foregroundColor(S.textPrimary).underline() + Text(suffix))
            .font(T.ui(12))
            .lineSpacing(12 * 0.2)
            .foregroundStyle(S.textLabel)
            .onTapGesture(perform: action)
    }

    private func binding(_ key: WritableKeyPath<AppSettings, Bool>) -> Binding<Bool> {
        Binding(get: { store.settings[keyPath: key] }, set: { store.settings[keyPath: key] = $0 })
    }

    // MARK: Actions

    private func search() {
        let q = query
        Task { results = (try? await WeatherService.shared.geocode(q)) ?? [] }
    }

    private func choose(_ place: WeatherService.Place) {
        var s = store.settings
        s.cityName = place.name
        s.latitude = place.lat
        s.longitude = place.lon
        if let tz = place.timezone { s.timezone = tz }
        store.settings = s
        results = []
        query = ""
    }

    private func useGps() {
        geoState = .locating
        Task {
            if let fix = await OneShotLocation().request() {
                var s = store.settings
                s.latitude = fix.coordinate.latitude
                s.longitude = fix.coordinate.longitude
                s.cityName = fix.placeName ?? "目前位置"
                s.timezone = fix.timezone ?? TimeZone.current.identifier
                store.settings = s
                geoState = .idle
            } else {
                geoState = .denied
            }
        }
    }

    private func refreshNotifStatus() async {
        let status = await UNUserNotificationCenter.current().notificationSettings().authorizationStatus
        notifAuthorized = status == .authorized || status == .provisional
        notifDenied = status == .denied
    }

    private func requestNotif() async {
        if notifDenied {
            openSystemSettings()
            return
        }
        _ = try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])
        await refreshNotifStatus()
    }

    private func openSystemSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) { openURL(url) }
    }
}

// MARK: - Controls

/// Two-option segmented control (web .yw-settings__segmented).
private struct Segmented: View {
    let options: [String]
    let selected: Int
    var onSelect: (Int) -> Void

    var body: some View {
        HStack(spacing: 4) {
            ForEach(options.indices, id: \.self) { i in
                let active = i == selected
                Button { onSelect(i) } label: {
                    Text(options[i])
                        .font(YWTokens.Typography.ui(13, .medium))
                        .foregroundStyle(active ? YWTokens.Sys.textPrimary : YWTokens.Sys.textMuted)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 9)
                        .padding(.horizontal, 8)
                        .background {
                            if active {
                                RoundedRectangle(cornerRadius: YWTokens.Sys.radiusSm)
                                    .fill(YWTokens.Sys.surfaceWhite)
                                    .shadow(color: YWTokens.Sys.textPrimary.opacity(0.08), radius: 1.5, y: 1)
                            }
                        }
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .animation(.easeOut(duration: YWTokens.Sys.motionStateDuration), value: active)
            }
        }
        .padding(4)
        .background(YWTokens.Sys.surfaceRaised, in: RoundedRectangle(cornerRadius: YWTokens.Sys.radiusMd))
    }
}

/// 44×26 ink toggle (web .yw-settings__toggle).
struct YWToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button { configuration.isOn.toggle() } label: {
            Capsule()
                .fill(configuration.isOn ? YWTokens.Sys.textPrimary : YWTokens.Sys.line)
                .frame(width: 44, height: 26)
                .overlay(alignment: configuration.isOn ? .trailing : .leading) {
                    Circle()
                        .fill(.white)
                        .shadow(color: .black.opacity(0.2), radius: 1, y: 1)
                        .frame(width: 20, height: 20)
                        .padding(3)
                }
                .animation(.easeOut(duration: YWTokens.Sys.motionStateDuration), value: configuration.isOn)
        }
        .buttonStyle(.plain)
        .accessibilityValue(configuration.isOn ? "開" : "關")
    }
}
