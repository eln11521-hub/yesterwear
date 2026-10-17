import SwiftUI

struct DeltaAtmosphere: View {
    let state: TempDeltaState

    var body: some View {
        LinearGradient(
            colors: [
                state.primary.opacity(0.55),
                state.primary.opacity(0.18),
                Color(hex: 0xF7F4EF)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
        .overlay {
            GeometryReader { geo in
                Circle()
                    .fill(state.primary.opacity(0.22))
                    .frame(width: geo.size.width * 0.7)
                    .blur(radius: 40)
                    .offset(x: -40, y: -60)
                Circle()
                    .fill(Color.white.opacity(0.35))
                    .frame(width: geo.size.width * 0.5)
                    .blur(radius: 30)
                    .offset(x: geo.size.width * 0.45, y: geo.size.height * 0.15)
            }
            .allowsHitTesting(false)
        }
    }
}

// MARK: - Previews（組件展示庫）

private func atmospherePreview(_ state: TempDeltaState, _ label: String) -> some View {
    ZStack {
        DeltaAtmosphere(state: state)
        VStack(spacing: 4) {
            Text(label).font(YWTokens.Type.title)
            Text(state.label).font(YWTokens.Type.body).foregroundStyle(state.primary)
        }
        .padding(20)
        .background(.white.opacity(0.7), in: RoundedRectangle(cornerRadius: YWTokens.Sys.radiusLg))
    }
}

#Preview("DeltaAtmosphere — cooler")  { atmospherePreview(.cooler, "比昨天涼") }
#Preview("DeltaAtmosphere — neutral") { atmospherePreview(.neutral, "與昨天接近") }
#Preview("DeltaAtmosphere — warmer")  { atmospherePreview(.warmer, "比昨天暖") }
