import SwiftUI

/// ComponentCatalogView — the SwiftUI-native equivalent of a Storybook catalog.
/// A single scrollable screen showing every design-system component in each of its
/// states/variants, plus token foundations. Useful for visual QA and design review.
///
/// Not wired into the shipping tab bar. Reach it from a DEBUG entry point, or just
/// use the Xcode Canvas previews below. See design-system/components/*.md for specs.
struct ComponentCatalogView: View {
    // Sample commute slots covering every delta state.
    private let cooler = SlotCompare(hourLabel: "08:00", todayTemp: 26, yesterdayTemp: 31,
                                     todayApparent: 27, precipProbability: 10)   // −4°
    private let neutral = SlotCompare(hourLabel: "12:00", todayTemp: 28, yesterdayTemp: 28,
                                      todayApparent: 28.5, precipProbability: 20) // +0.5°
    private let warmerRain = SlotCompare(hourLabel: "18:00", todayTemp: 30, yesterdayTemp: 27,
                                         todayApparent: 30.5, precipProbability: 70) // +3.5° + rain

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: YWTokens.Sys.spacing2xl) {
                foundations
                metricBlockSection
                commuteCardSection
                primaryButtonSection
                atmosphereSection
            }
            .padding(YWTokens.Sys.spacingXl)
        }
        .background(YWTokens.Sys.surfacePaper)
        .navigationTitle("組件展示庫")
    }

    // MARK: Sections

    private var foundations: some View {
        section("Foundations · 色彩") {
            HStack(spacing: YWTokens.Sys.spacingSm) {
                swatch("cold", YWTokens.Sys.deltaCold)
                swatch("neutral", YWTokens.Sys.deltaNeutral)
                swatch("warm", YWTokens.Sys.deltaWarm)
                swatch("ink", YWTokens.Sys.textPrimary)
                swatch("card", YWTokens.Sys.surfaceCard)
            }
        }
    }

    private var metricBlockSection: some View {
        section("MetricBlock") {
            HStack(spacing: YWTokens.Sys.spacingMd) {
                MetricBlock(title: "今日體感", value: "31°", subtitle: "出門時段基準")
                MetricBlock(title: "昨日實際", value: "28°", subtitle: "08:00")
                MetricBlock(title: "濕度", value: "65%", subtitle: "當前")
            }
            .padding(YWTokens.Sys.spacingLg)
            .background(.white.opacity(0.7), in: RoundedRectangle(cornerRadius: YWTokens.Sys.radiusLg))
        }
    }

    private var commuteCardSection: some View {
        section("CommuteDeltaCard · 三種溫差狀態") {
            VStack(spacing: YWTokens.Sys.spacingMd) {
                CommuteDeltaCard(title: "出門 08:00 · 降溫", slot: cooler)
                CommuteDeltaCard(title: "中午 12:00 · 持平", slot: neutral)
                CommuteDeltaCard(title: "下班 18:00 · 升溫 + 雨", slot: warmerRain)
            }
        }
    }

    private var primaryButtonSection: some View {
        section("PrimaryButton · states") {
            VStack(spacing: YWTokens.Sys.spacingMd) {
                PrimaryButton(label: "記錄今日穿搭", action: {})
                PrimaryButton(label: "更新今日穿搭", action: {})
                PrimaryButton(label: "記錄今日穿搭", action: {}, isDisabled: true)
            }
        }
    }

    private var atmosphereSection: some View {
        section("DeltaAtmosphere · 背景漸層") {
            HStack(spacing: YWTokens.Sys.spacingMd) {
                atmosphereTile(.cooler, "涼")
                atmosphereTile(.neutral, "持平")
                atmosphereTile(.warmer, "暖")
            }
        }
    }

    // MARK: Helpers

    private func section<Content: View>(_ title: String, @ViewBuilder _ content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: YWTokens.Sys.spacingMd) {
            Text(title.uppercased())
                .font(YWTokens.Typography.micro)
                .tracking(1.2)
                .foregroundStyle(YWTokens.Sys.textSecondary)
            content()
        }
    }

    private func swatch(_ name: String, _ color: Color) -> some View {
        VStack(spacing: YWTokens.Sys.spacingXs) {
            RoundedRectangle(cornerRadius: YWTokens.Sys.radiusSm)
                .fill(color)
                .frame(width: 56, height: 40)
                .overlay(RoundedRectangle(cornerRadius: YWTokens.Sys.radiusSm)
                    .strokeBorder(.black.opacity(0.08)))
            Text(name).font(YWTokens.Typography.micro).foregroundStyle(YWTokens.Sys.textSecondary)
        }
    }

    private func atmosphereTile(_ state: TempDeltaState, _ label: String) -> some View {
        DeltaAtmosphere(state: state)
            .frame(height: 96)
            .clipShape(RoundedRectangle(cornerRadius: YWTokens.Sys.radiusLg))
            .overlay(Text(label).font(YWTokens.Typography.body).foregroundStyle(state.primary))
    }
}

#Preview("Component Catalog") {
    NavigationStack { ComponentCatalogView() }
}
