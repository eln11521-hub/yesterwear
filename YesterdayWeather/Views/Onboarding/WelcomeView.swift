import SwiftUI
import UserNotifications

/// Welcome — the single-screen onboarding, ported from the web prototype
/// (design-system-web/src/pages/onboarding/Welcome.tsx, Figma 481:30).
/// Orange splash with the 兔子與太陽 mascot. "Get started" asks for location and
/// notification access through the native iOS prompts, then finishes onboarding.
struct WelcomeView: View {
    var onDone: () -> Void

    @EnvironmentObject private var settingsStore: SettingsStore
    @State private var busy = false

    /// Text on the orange splash (Figma: paper #FBFAF9).
    private let onAccent = YWTokens.Sys.surfacePaper

    var body: some View {
        ZStack {
            YWTokens.Sys.deltaWarm.ignoresSafeArea()

            WelcomeSwoosh()
                .stroke(.white.opacity(0.2), style: StrokeStyle(lineWidth: 20, lineCap: .round))
                .ignoresSafeArea()
                .allowsHitTesting(false)

            VStack(spacing: 0) {
                VStack(spacing: 8) {
                    Text("Yesterwear")
                        .font(YWTokens.Typography.display(46))
                        .tracking(-1)
                        .foregroundStyle(onAccent)
                    Text("Dress by yesterday")
                        .font(YWTokens.Typography.mono(10.5))
                        .tracking(1)
                        .foregroundStyle(onAccent.opacity(0.9))
                }
                .padding(.top, 58)

                Spacer(minLength: 0)
                Image("mascot-welcome")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 220)
                    .accessibilityLabel("Yesterwear 吉祥物")
                Spacer(minLength: 0)

                Text("Stop guessing the degrees — just dress warmer or cooler than yesterday.")
                    .font(YWTokens.Typography.mono(11.5))
                    .tracking(0.4)
                    // web line-height 1.9; SwiftUI adds lineSpacing on top of the face’s ~1.3 natural height
                    .lineSpacing(11.5 * (1.9 - 1.3))
                    .foregroundStyle(onAccent.opacity(0.95))
                    .frame(maxWidth: 260, alignment: .leading)
                    .padding(.bottom, 20)

                Button(action: start) {
                    Text(busy ? "Setting up…" : "Get started")
                        .font(YWTokens.Typography.ui(13.5, .bold))
                        .foregroundStyle(YWTokens.Sys.textOnDark)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(YWTokens.Sys.textPrimary, in: RoundedRectangle(cornerRadius: 12))
                }
                .buttonStyle(PressScaleStyle())
                .disabled(busy)
                .opacity(busy ? 0.7 : 1)
            }
            .padding(.horizontal, 28)
            .padding(.bottom, 28)
        }
    }

    private func start() {
        guard !busy else { return }
        busy = true
        Task {
            if let fix = await OneShotLocation().request() {
                var s = settingsStore.settings
                s.latitude = fix.coordinate.latitude
                s.longitude = fix.coordinate.longitude
                s.cityName = fix.placeName ?? "目前位置"
                s.timezone = fix.timezone ?? TimeZone.current.identifier
                s.useManualLocation = false
                settingsStore.settings = s
            }
            _ = try? await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .sound, .badge])
            busy = false
            onDone()
        }
    }
}

/// Decorative swoosh (Figma 483:637). Authored in the web's 340×720 frame at
/// translate(188, 107) and stretched to fill — same as the SVG's
/// preserveAspectRatio="none".
struct WelcomeSwoosh: Shape {
    private static let origin = CGPoint(x: 0, y: 238.15)
    private static let curves: [(CGFloat, CGFloat, CGFloat, CGFloat, CGFloat, CGFloat)] = [
        (16.48, 230.45, 97.76, 226.68, 207.71, 224.42),
        (246.90, 223.61, 255.15, 233.42, 258.93, 237.79),
        (276.07, 257.62, 278.91, 261.17, 279.92, 293.65),
        (280.75, 320.27, 255.59, 339.53, 250.85, 344.00),
        (226.90, 366.60, 187.93, 374.09, 158.87, 357.95),
        (132.43, 343.26, 131.10, 321.54, 131.19, 303.53),
        (131.30, 281.50, 141.45, 251.99, 159.74, 214.87),
        (185.33, 173.24, 219.07, 129.68, 264.74, 83.39),
        (291.67, 58.19, 326.22, 29.53, 361.83, 0),
    ]

    func path(in rect: CGRect) -> Path {
        let sx = rect.width / 340, sy = rect.height / 720
        func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
            CGPoint(x: rect.minX + (x + 188) * sx, y: rect.minY + (y + 107) * sy)
        }
        var path = Path()
        path.move(to: p(Self.origin.x, Self.origin.y))
        for c in Self.curves {
            path.addCurve(to: p(c.4, c.5), control1: p(c.0, c.1), control2: p(c.2, c.3))
        }
        return path
    }
}

/// Press feedback shared by primary actions (web: transform scale(0.95) on :active).
struct PressScaleStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? YWTokens.Sys.motionScalePressed : 1)
            .animation(.easeOut(duration: YWTokens.Sys.motionTapDuration), value: configuration.isPressed)
    }
}

#Preview {
    WelcomeView(onDone: {})
        .environmentObject(SettingsStore())
}
