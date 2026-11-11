import PhotosUI
import SwiftUI
import UIKit

/// 記錄今天穿搭 — ported from design-system-web/src/pages/record-outfit/RecordOutfitSheet.tsx
/// (Figma 226:3150).
///
/// 主動線: every group (上身 / 外套 / 下身 / 配件) is multi-select; 上身 needs at
/// least one item → 儲存今日紀錄. Fixed height: the title stays on top, the actions
/// stay at the bottom and only the chip groups scroll.
/// 輔助線: 拍照記錄 → recognition prefills the labels and the sheet enters a 待確認
/// state with the thumbnail beside the tags; nothing auto-saves.
struct RecordOutfitSheet: View {
    var initialThumb: UIImage? = nil
    var onSave: (_ picks: OutfitPicks, _ photo: UIImage?, _ keptExisting: Bool) -> Void

    @State private var picks: OutfitPicks
    @State private var thumb: UIImage?
    @State private var hint: String?
    @State private var outerUnsure = false
    @State private var thumbIsNew = false
    /// 拍照來源 action sheet (Figma 232:5) → camera or a single library photo.
    @State private var choosingSource = false
    @State private var shooting = false
    @State private var browsing = false
    @State private var libraryItem: PhotosPickerItem?

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    private static var hasCamera: Bool {
        #if targetEnvironment(simulator)
        false
        #else
        UIImagePickerController.isSourceTypeAvailable(.camera)
        #endif
    }

    init(initial: OutfitPicks, initialThumb: UIImage? = nil,
         onSave: @escaping (_ picks: OutfitPicks, _ photo: UIImage?, _ keptExisting: Bool) -> Void) {
        self.initialThumb = initialThumb
        self.onSave = onSave
        _picks = State(initialValue: initial)
        _thumb = State(initialValue: initialThumb)
        // A seeded thumbnail is a saved photo reopened via 更新穿搭 — informational hint.
        _hint = State(initialValue: initialThumb == nil ? nil : "幫你記得今天穿了什麼。")
    }

    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 8) {
                Text("記錄今天穿搭")
                    .font(T.ui(22, .semibold))
                    .foregroundStyle(S.textPrimary)
                Text("每一區都可以複選，上身至少選一件。")
                    .font(T.ui(12))
                    .foregroundStyle(S.textLabel)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 20)
            .padding(.top, 4)
            .padding(.bottom, 16)

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    if let thumb { pendingPanel(thumb) }
                    ForEach(OutfitGroup.allCases) { group($0) }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)
            }
            .scrollIndicators(.hidden)

            VStack(spacing: 12) {
                YWSecondaryButton(label: thumb == nil ? "拍照記錄" : "重新拍照", icon: "icon-camera") {
                    choosingSource = true
                }
                YWPrimaryButton(label: "儲存今日紀錄", icon: "icon-check") {
                    onSave(picks, thumbIsNew ? thumb : nil, thumb != nil && !thumbIsNew)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 8)   // the sheet adds the home-indicator inset below
            .overlay(alignment: .top) { Rectangle().fill(S.line).frame(height: 1) }
        }
        .overlay { if choosingSource { sourceSheet } }
        .animation(.easeOut(duration: 0.2), value: choosingSource)
        .fullScreenCover(isPresented: $shooting) {
            CameraPicker { image in
                shooting = false
                if let image { accept(photo: image) }
            }
            .ignoresSafeArea()
        }
        .photosPicker(isPresented: $browsing, selection: $libraryItem, matching: .images)
        .onChange(of: libraryItem) { _, item in
            guard let item else { return }
            Task {
                if let data = try? await item.loadTransferable(type: Data.self), let image = UIImage(data: data) {
                    accept(photo: image)
                }
                libraryItem = nil
            }
        }
    }

    // MARK: 拍照來源 (Figma 232:5)

    /// Bottom action sheet: 拍照 / 從相簿選擇單張 on one white card, 取消 below.
    private var sourceSheet: some View {
        ZStack(alignment: .bottom) {
            // Reach over the sheet's handle strip and home-indicator inset too
            // (the sheet clips to its own shape).
            Color.black.opacity(0.3)
                .padding(.top, -24)
                .padding(.bottom, -48)
                .onTapGesture { choosingSource = false }
            VStack(spacing: 8) {
                VStack(spacing: 0) {
                    if Self.hasCamera {
                        sourceRow("拍照", icon: "icon-camera") { choosingSource = false; shooting = true }
                        Rectangle().fill(S.line).frame(height: 1)
                    }
                    sourceRow("從相簿選擇單張", systemIcon: "photo") { choosingSource = false; browsing = true }
                }
                .background(S.surfaceWhite, in: RoundedRectangle(cornerRadius: S.radiusMd))
                Button { choosingSource = false } label: {
                    Text("取消")
                        .font(T.ui(15, .semibold))
                        .foregroundStyle(S.textPrimary)
                        .frame(maxWidth: .infinity, minHeight: 52)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .background(S.surfaceWhite, in: RoundedRectangle(cornerRadius: S.radiusMd))
            }
            .padding(.horizontal, 8)
            .padding(.bottom, 8)
            .transition(.move(edge: .bottom))
        }
        .transition(.opacity)
    }

    private func sourceRow(_ label: String, icon: String? = nil, systemIcon: String? = nil, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon { AssetIcon(name: icon, size: 18) }
                if let systemIcon { Image(systemName: systemIcon).font(.system(size: 16)) }
                Text(label).font(T.ui(15))
            }
            .foregroundStyle(S.textPrimary)
            .frame(maxWidth: .infinity, minHeight: 52)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    // MARK: Pieces

    private func group(_ g: OutfitGroup) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Circle().fill(S.textPrimary).frame(width: 6, height: 6)
                Text(g.label)
                    .font(T.ui(12))
                    .foregroundStyle(S.textSecondary)
                SectionBadge(label: g.required ? "必選" : "可選", tone: g.required ? .required : .optional)
                Spacer(minLength: 0)
                if !picks[g].isEmpty {
                    Text("已選 \(picks[g].count)")
                        .font(T.mono(10.5))
                        .foregroundStyle(S.textLabel)
                }
            }
            ChipFlow(spacing: 12) {
                ForEach(g.items, id: \.self) { label in
                    OutfitChip(label: label, asset: Garment.asset[label], selected: picks[g].contains(label)) {
                        toggle(g, label)
                    }
                }
            }
        }
    }

    private func toggle(_ g: OutfitGroup, _ label: String) {
        var list = picks[g]
        if let i = list.firstIndex(of: label) {
            if g.required, list.count == 1 { return }   // 上身 keeps at least one
            list.remove(at: i)
        } else {
            list.append(label)
        }
        picks[g] = list.sorted { (g.items.firstIndex(of: $0) ?? 0) < (g.items.firstIndex(of: $1) ?? 0) }
        if g == .outers { outerUnsure = false }
    }

    private func pendingPanel(_ image: UIImage) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .frame(width: 60, height: 60)
                .clipShape(RoundedRectangle(cornerRadius: S.radiusMd))
                .overlay(RoundedRectangle(cornerRadius: S.radiusMd).strokeBorder(S.line, lineWidth: 1))
                .accessibilityLabel("今日穿搭照片")
            VStack(alignment: .leading, spacing: 8) {
                Text(hint ?? "已依照片幫你選好標籤，對一下、不對就改。")
                    .font(T.ui(11))
                    .lineSpacing(11 * 0.2)
                    .foregroundStyle(S.textLabel)
                ChipFlow(spacing: 8) {
                    ForEach(picks.tops + picks.outers, id: \.self) { pill($0) }
                    if outerUnsure { pill("外套待選", empty: true) }
                }
                Button("移除照片") {
                    thumb = nil
                    thumbIsNew = false
                    outerUnsure = false
                    hint = nil
                }
                .font(T.ui(11))
                .underline()
                .foregroundStyle(S.textLabel)
                .padding(.top, 2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(12)
        .background(S.surfacePaper, in: RoundedRectangle(cornerRadius: S.radiusLg))
        .overlay(RoundedRectangle(cornerRadius: S.radiusLg).strokeBorder(S.line, lineWidth: 1))
    }

    private func pill(_ text: String, empty: Bool = false) -> some View {
        Text(text)
            .font(T.ui(11.5, .medium))
            .foregroundStyle(empty ? S.textLabel : S.textPrimary)
            .padding(.vertical, 3)
            .padding(.horizontal, 9)
            .background(empty ? .clear : S.badgeOptionalBg, in: Capsule())
            .overlay {
                if empty { Capsule().strokeBorder(S.line, style: StrokeStyle(lineWidth: 1, dash: [3])) }
            }
            .fixedSize()
    }

    // MARK: Photo

    /// On-device recognition stub — same fixed result as the web prototype.
    /// A nil layer = confidence below threshold, left blank (寧缺勿錯填).
    private func recognize(_ image: UIImage) -> (tops: [String]?, outers: [String]?) {
        (["帽T衛衣"], ["連帽外套"])
    }

    private func accept(photo: UIImage) {
        thumb = photo
        thumbIsNew = true
        let r = recognize(photo)
        if let t = r.tops { picks.tops = t }
        picks.outers = r.outers ?? []
        outerUnsure = r.outers == nil
        hint = r.outers != nil ? "已依照片幫你選好標籤，對一下、不對就改。" : "外套看不太出來，先留空，請你手動選。"
    }
}

/// The system camera. The simulator reports a camera but has no feed (the
/// shutter stays disabled), so it only offers the photo library there.
struct CameraPicker: UIViewControllerRepresentable {
    var onPick: (UIImage?) -> Void

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator(onPick: onPick) }

    final class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let onPick: (UIImage?) -> Void
        init(onPick: @escaping (UIImage?) -> Void) { self.onPick = onPick }

        func imagePickerController(_ picker: UIImagePickerController,
                                   didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            onPick(info[.originalImage] as? UIImage)
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) { onPick(nil) }
    }
}

extension UIImage {
    /// Square-ish thumbnail JPEG for the next-day anchor.
    func thumbnailJPEG(maxSide: CGFloat = 480) -> Data? {
        let scale = min(1, maxSide / max(size.width, size.height))
        let target = CGSize(width: size.width * scale, height: size.height * scale)
        let image = UIGraphicsImageRenderer(size: target).image { _ in draw(in: CGRect(origin: .zero, size: target)) }
        return image.jpegData(compressionQuality: 0.8)
    }
}
