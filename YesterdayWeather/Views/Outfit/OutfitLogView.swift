import SwiftUI

struct OutfitLogView: View {
    @EnvironmentObject private var outfit: OutfitStore
    @EnvironmentObject private var weather: WeatherSnapshotStore
    @EnvironmentObject private var settings: SettingsStore

    @State private var top: TopLayer = .shortSleeve
    @State private var outer: OuterLayer = .none
    @State private var savedFlash = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    if let yesterday = outfit.yesterday {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("昨日（唯讀）")
                                .font(YWTypography.caption)
                                .foregroundStyle(.secondary)
                            Text(yesterday.displayText)
                                .font(YWTypography.title)
                        }
                        .padding(16)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: 0xF0EEEA))
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }

                    section(title: "上身基礎層（必選）") {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                            ForEach(TopLayer.allCases) { item in
                                choiceChip(
                                    title: "\(item.emoji) \(item.shortLabel)",
                                    selected: top == item
                                ) { top = item }
                            }
                        }
                    }

                    section(title: "外套 / 疊搭層") {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                            ForEach(OuterLayer.allCases) { item in
                                choiceChip(
                                    title: "\(item.emoji) \(item.shortLabel)",
                                    selected: outer == item
                                ) { outer = item }
                            }
                        }
                    }

                    Button {
                        outfit.saveToday(top: top, outer: outer)
                        savedFlash = true
                        Task {
                            await weather.refresh(settings: settings.settings, yesterdayOutfit: outfit.yesterday)
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                            savedFlash = false
                        }
                    } label: {
                        Text(savedFlash ? "已記住今天的穿搭" : "儲存今日穿搭")
                            .font(YWTypography.body)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(savedFlash ? Color(hex: 0x4A90E2) : Color(hex: 0x1A1A1A))
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }

                    if let today = outfit.today {
                        Text("今日已記錄：\(today.displayText)")
                            .font(YWTypography.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(20)
            }
            .background(Color(hex: 0xF7F4EF).ignoresSafeArea())
            .navigationTitle("穿搭標記")
            .onAppear {
                if let today = outfit.today {
                    top = today.top
                    outer = today.outer
                }
            }
        }
    }

    private func section<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(YWTypography.caption)
                .foregroundStyle(.secondary)
            content()
        }
    }

    private func choiceChip(title: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(YWTypography.caption)
                .frame(maxWidth: .infinity, minHeight: 52)
                .padding(.horizontal, 8)
                .background(selected ? Color(hex: 0x1A1A1A) : Color.white)
                .foregroundStyle(selected ? Color.white : Color(hex: 0x1A1A1A))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .strokeBorder(Color.black.opacity(0.06), lineWidth: 1)
                )
        }
        .buttonStyle(.plain)
    }
}
