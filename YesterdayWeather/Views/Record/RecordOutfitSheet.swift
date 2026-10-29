import SwiftUI
import UIKit

/// 記錄今天穿搭 — ported from design-system-web/src/pages/record-outfit/RecordOutfitSheet.tsx
/// (Figma 226:3150).
///
/// 主動線: pick 上身基礎層 (required) + 外套疊搭層 (optional) → 儲存今日紀錄.
/// 輔助線: 拍照記錄 → recognition prefills the labels and the sheet enters a 待確認
/// state with the thumbnail beside the tags; nothing auto-saves.
struct RecordOutfitSheet: View {
    var initialTop: TopLayer
    var initialOuter: OuterLayer
    var initialThumb: UIImage? = nil
    var onSave: (_ top: TopLayer, _ outer: OuterLayer, _ photo: UIImage?, _ keptExisting: Bool) -> Void

    @State private var top: TopLayer
    @State private var outer: OuterLayer?
    @State private var thumb: UIImage?
    @State private var hint: String?
    @State private var thumbIsNew = false
    @State private var picking = false

    private typealias T = YWTokens.Typography
    private typealias S = YWTokens.Sys

    init(initialTop: TopLayer, initialOuter: OuterLayer, initialThumb: UIImage? = nil,
         onSave: @escaping (_ top: TopLayer, _ outer: OuterLayer, _ photo: UIImage?, _ keptExisting: Bool) -> Void) {
        self.initialTop = initialTop
        self.initialOuter = initialOuter
        self.initialThumb = initialThumb
        self.onSave = onSave
        _top = State(initialValue: initialTop)
        _outer = State(initialValue: initialOuter)
        _thumb = State(initialValue: initialThumb)
        // A seeded thumbnail is a saved photo reopened via 更新穿搭 — informational hint.
        _hint = State(initialValue: initialThumb == nil ? nil : "幫你記得今天穿了什麼。")
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("記錄今天穿搭")
                    .font(T.ui(22, .semibold))
                    .foregroundStyle(S.textPrimary)

                if let thumb { pendingPanel(thumb) }

                section("上身基礎層", badge: SectionBadge(label: "必選", tone: .required)) {
                    ForEach(TopLayer.allCases) { layer in
                        OutfitChip(label: layer.rawValue, asset: layer.asset, selected: top == layer) { top = layer }
                    }
                }

                section("外套 / 疊搭層", badge: SectionBadge(label: "可選", tone: .optional)) {
                    ForEach(OuterLayer.allCases) { layer in
                        OutfitChip(label: layer.rawValue, asset: layer.asset, selected: outer == layer) { outer = layer }
                    }
                }

                VStack(spacing: 12) {
                    YWSecondaryButton(label: thumb == nil ? "拍照記錄" : "重新拍照", icon: "icon-camera") {
                        picking = true
                    }
                    YWPrimaryButton(label: "儲存今日紀錄", icon: "icon-check") {
                        onSave(top, outer ?? .none, thumbIsNew ? thumb : nil, thumb != nil && !thumbIsNew)
                    }
                }
                .padding(.top, 8)
            }
            .padding(.horizontal, 20)
            .padding(.top, 24)
            .padding(.bottom, 20)
        }
        .scrollIndicators(.hidden)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(S.radius2xl)
        .presentationBackground(S.surfaceWhite)
        .sheet(isPresented: $picking) {
            PhotoPicker { image in
                picking = false
                guard let image else { return }
                accept(photo: image)
            }
            .ignoresSafeArea()
        }
    }

    // MARK: Pieces

    private func section<Badge: View, Chips: View>(
        _ title: String, badge: Badge, @ViewBuilder chips: () -> Chips
    ) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Circle().fill(S.textPrimary).frame(width: 6, height: 6)
                Text(title)
                    .font(T.ui(12))
                    .foregroundStyle(S.textSecondary)
                badge
            }
            ChipFlow(spacing: 12) { chips() }
        }
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
                    pill(top.rawValue)
                    if let outer, outer != .none { pill(outer.rawValue) }
                    if outer == nil { pill("外套待選", empty: true) }
                }
                Button("移除照片") {
                    thumb = nil
                    thumbIsNew = false
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
    private func recognize(_ image: UIImage) -> (top: TopLayer?, outer: OuterLayer?) {
        (.hoodie, .tech)
    }

    private func accept(photo: UIImage) {
        thumb = photo
        thumbIsNew = true
        let r = recognize(photo)
        if let t = r.top { top = t }
        outer = r.outer   // low confidence → leave blank
        hint = r.outer != nil ? "已依照片幫你選好標籤，對一下、不對就改。" : "外套看不太出來，先留空，請你手動選。"
    }
}

/// Camera when the device has one, photo library otherwise (the simulator).
struct PhotoPicker: UIViewControllerRepresentable {
    var onPick: (UIImage?) -> Void

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = UIImagePickerController.isSourceTypeAvailable(.camera) ? .camera : .photoLibrary
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
