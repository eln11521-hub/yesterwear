import SwiftUI

/// Press feedback for primary CTAs: 0.95 scale + brief ease.
/// Uses ButtonStyle so the tap action and pressed state never conflict.
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(YWTokens.Typography.body)
            .frame(maxWidth: .infinity)
            .padding(.vertical, YWTokens.Sys.spacingMd)          // 12pt
            .background(YWTokens.Sys.textPrimary)                // #111 ink
            .foregroundStyle(YWTokens.Sys.textOnDark)            // white
            .clipShape(RoundedRectangle(cornerRadius: YWTokens.Sys.radiusMd, style: .continuous)) // 16pt
            .scaleEffect(configuration.isPressed ? YWTokens.Sys.motionScalePressed : 1)
            .animation(.easeInOut(duration: YWTokens.Sys.motionTapDuration), value: configuration.isPressed)
    }
}

/// PrimaryButton — the app's primary call-to-action.
/// Token-backed per design-system/components/primary-button.md.
struct PrimaryButton: View {
    let label: String
    let action: () -> Void
    var isDisabled: Bool = false

    var body: some View {
        Button(label, action: action)
            .buttonStyle(PrimaryButtonStyle())
            .disabled(isDisabled)
            .opacity(isDisabled ? YWTokens.Sys.opacityDisabled : 1)   // 0.5 disabled
    }
}

#Preview("PrimaryButton — states") {
    VStack(spacing: YWTokens.Sys.spacingLg) {
        PrimaryButton(label: "記錄今日穿搭", action: {})
        PrimaryButton(label: "更新今日穿搭", action: {})
        PrimaryButton(label: "記錄今日穿搭", action: {}, isDisabled: true)
    }
    .padding(YWTokens.Sys.spacingLg)
    .background(YWTokens.Sys.surfacePaper)
}
