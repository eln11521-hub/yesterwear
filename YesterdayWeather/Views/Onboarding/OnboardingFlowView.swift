import SwiftUI
import UserNotifications
import CoreLocation

struct OnboardingFlowView: View {
    var onFinished: () -> Void

    @EnvironmentObject private var settings: SettingsStore
    @State private var step = 0
    @StateObject private var locator = LocationHelper()
    @State private var showManualLocation = false

    var body: some View {
        ZStack {
            Color(hex: 0xF7F4EF).ignoresSafeArea()

            VStack(spacing: 0) {
                TabView(selection: $step) {
                    welcome.tag(0)
                    locationStep.tag(1)
                    notificationStep.tag(2)
                    widgetIntro.tag(3)
                    widgetHowTo.tag(4)
                    doneStep.tag(5)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut(duration: 0.35), value: step)
            }
        }
    }

    private var welcome: some View {
        VStack(spacing: 28) {
            Spacer()
            LockScreenWidgetPreview(delta: -3.5, rain: true)
                .frame(height: 120)
                .padding(.horizontal, 28)
            VStack(spacing: 10) {
                Text("Yesterday Weather")
                    .font(YWTokens.Typography.display(34))
                Text("用昨天的體感，決定今天怎麼穿")
                    .font(YWTypography.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }
            Spacer()
            primaryButton("開始") { step = 1 }
        }
        .padding(24)
    }

    private var locationStep: some View {
        VStack(alignment: .leading, spacing: 20) {
            Spacer()
            Text("需要你的位置")
                .font(YWTokens.Typography.display(28))
            Text("用來取得今日與昨日的實際氣溫與體感。僅供天氣對比，不會用於其他用途。")
                .font(YWTypography.body)
                .foregroundStyle(.secondary)
            if showManualLocation {
                TextField("城市名稱", text: Binding(
                    get: { settings.settings.cityName },
                    set: { settings.settings.cityName = $0 }
                ))
                .textFieldStyle(.roundedBorder)
                HStack {
                    TextField("緯度", value: Binding(
                        get: { settings.settings.latitude },
                        set: { settings.settings.latitude = $0 }
                    ), format: .number)
                    .textFieldStyle(.roundedBorder)
                    TextField("經度", value: Binding(
                        get: { settings.settings.longitude },
                        set: { settings.settings.longitude = $0 }
                    ), format: .number)
                    .textFieldStyle(.roundedBorder)
                }
                Text("預設為 Edmonton（你提供的 API 座標）")
                    .font(YWTypography.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            primaryButton(showManualLocation ? "使用此城市，繼續" : "允許定位") {
                if showManualLocation {
                    settings.settings.useManualLocation = true
                    step = 2
                } else {
                    locator.request()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                        if locator.coordinate != nil {
                            settings.settings.latitude = locator.coordinate!.latitude
                            settings.settings.longitude = locator.coordinate!.longitude
                            settings.settings.cityName = locator.placeName ?? "目前位置"
                            settings.settings.timezone = TimeZone.current.identifier
                            settings.settings.useManualLocation = false
                            step = 2
                        } else {
                            showManualLocation = true
                        }
                    }
                }
            }
            Button("拒絕，改手動輸入城市") {
                showManualLocation = true
            }
            .font(YWTypography.caption)
            .frame(maxWidth: .infinity)
        }
        .padding(24)
    }

    private var notificationStep: some View {
        VStack(alignment: .leading, spacing: 20) {
            Spacer()
            Text("通勤前提醒")
                .font(YWTokens.Typography.display(28))
            Text("開啟通知，才能在出門／下班前提醒溫差與降雨變化。預設 08:00 / 18:00，之後可在設定調整。")
                .font(YWTypography.body)
                .foregroundStyle(.secondary)
            Spacer()
            primaryButton("開啟通知") {
                Task {
                    _ = try? await UNUserNotificationCenter.current()
                        .requestAuthorization(options: [.alert, .sound, .badge])
                    step = 3
                }
            }
            Button("暫時跳過") { step = 3 }
                .font(YWTypography.caption)
                .frame(maxWidth: .infinity)
        }
        .padding(24)
    }

    private var widgetIntro: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Widget 才是舞台")
                    .font(YWTokens.Typography.display(28))
                    .padding(.top, 24)

                Text("鎖定畫面 2×1")
                    .font(YWTypography.caption)
                    .foregroundStyle(.secondary)
                LockScreenWidgetPreview(delta: -4, rain: true)

                Text("主畫面 4×2 · 顏色隨溫差變化")
                    .font(YWTypography.caption)
                    .foregroundStyle(.secondary)
                    .padding(.top, 8)

                HStack(spacing: 10) {
                    HomeWidgetPreview(delta: -4, title: "降溫")
                    HomeWidgetPreview(delta: 1, title: "持平")
                    HomeWidgetPreview(delta: 4, title: "升溫")
                }
                .frame(height: 140)

                Spacer(minLength: 20)
                primaryButton("下一步：如何加入") { step = 4 }
            }
            .padding(24)
        }
    }

    private var widgetHowTo: some View {
        VStack(alignment: .leading, spacing: 18) {
            Spacer()
            Text("把小工具加到桌面")
                .font(YWTokens.Typography.display(28))
            stepRow(1, "長按桌面空白處")
            stepRow(2, "點右上角「+」")
            stepRow(3, "搜尋 Yesterday Weather")
            stepRow(4, "選鎖定畫面矩形或主畫面中尺寸，加入")
            Spacer()
            primaryButton("我已完成") { step = 5 }
            Button("稍後再說") { step = 5 }
                .font(YWTypography.caption)
                .frame(maxWidth: .infinity)
        }
        .padding(24)
    }

    private var doneStep: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 56))
                .foregroundStyle(Color(hex: 0x4A90E2))
                .symbolEffect(.bounce, value: step == 5)
            Text("準備完成")
                .font(YWTokens.Typography.display(28))
            Text("首頁會展開 Widget 的完整對比。日常就看鎖定畫面／桌面小工具即可。")
                .font(YWTypography.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
            Spacer()
            primaryButton("進入首頁") { onFinished() }
        }
        .padding(24)
    }

    private func primaryButton(_ title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(YWTypography.body)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color(hex: 0x1A1A1A))
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    private func stepRow(_ n: Int, _ text: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Text("\(n)")
                .font(YWTypography.caption)
                .frame(width: 24, height: 24)
                .background(Color(hex: 0x1A1A1A))
                .foregroundStyle(.white)
                .clipShape(Circle())
            Text(text)
                .font(YWTypography.body)
        }
    }
}

struct LockScreenWidgetPreview: View {
    let delta: Double
    let rain: Bool
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text("vs 昨日")
                    if rain { Text("☔") }
                }
                .font(YWTypography.micro)
                Text(String(format: "%+.1f° · 體感 18°", delta))
                    .font(YWTypography.body)
                Text("出門 -3° · 下班 -1°")
                    .font(YWTypography.micro)
                    .opacity(0.7)
            }
            Spacer()
        }
        .padding(14)
        .foregroundStyle(.white)
        .background(Color.black)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

struct HomeWidgetPreview: View {
    let delta: Double
    let title: String
    var body: some View {
        let state = TempDeltaState.from(deltaCelsius: delta)
        VStack(alignment: .leading, spacing: 6) {
            Text(title).font(YWTypography.micro).foregroundStyle(.white.opacity(0.85))
            Text(String(format: "%+.0f°", delta)).font(YWTypography.title).foregroundStyle(.white)
            Text("短袖+薄外套").font(YWTypography.micro).foregroundStyle(.white.opacity(0.9))
            Spacer(minLength: 0)
        }
        .padding(10)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(state.primary)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}
