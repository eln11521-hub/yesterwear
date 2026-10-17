---
Report Language: zh-Hant (繁體中文)
---

# Storybook Implementation Map（Storybook 實作對照）

## Target（目標）

| 項目 | 值 |
|------|-----|
| Scope mode | Template bootstrap → Foundations + Component pass |
| Workspace root | `design-system-web/`（專案根的子資料夾，與 iOS 專案並存） |
| Framework | React 19 + Vite 8 |
| Storybook | 10.4.1（`@storybook/react-vite`, builder = Vite） |
| Package manager | npm |
| Token prefix | `yw`（`--yw-ref/sys/comp-*`） |
| Bootstrap | bundled `storybook-template`（使用者於 2026-09-02 明確選擇 React） |
| Decision evidence | 使用者要求「用 React 先看設計系統長怎樣」；原生 iOS 不能跑 Storybook |
| Migration | none — iOS SwiftUI app 保持不變；React 為並行的設計系統展示 |

## Token Integration（Token 整合）

`tokens/tokens-ref.css` / `tokens-sys.css` / `tokens-comp.css` 由根 `tokens/` 移植而來，
改用 `--yw-` 前綴並維持嚴格 ref→sys→comp 繼承。`npm run check:tokens` 通過。

## Component Implementation（組件實作）

| Design-system 組件 | 來源規格 | 產品目標 | Decision | Status |
|---|---|---|---|---|
| MetricBlock | components/metric-block.md | `src/components/metric-block/` | create | done |
| CommuteDeltaCard | components/commute-delta-card.md | `src/components/commute-delta-card/` | create | done |
| DeltaAtmosphere | components/delta-atmosphere.md | `src/components/delta-atmosphere/` | create | done |
| PrimaryButton | components/primary-button.md | `src/components/primary-button/` | create | done |

共用邏輯：`src/components/_shared/delta.ts`（溫差狀態，門檻 ±3°C，對齊 iOS `TempDeltaState`）
與 `_shared/DeltaGlyph.tsx`（line-icon 箭頭 + 雨傘，遵守「line icons 非 emoji」方向）。

每個組件都有 co-located `.tsx` + `.css` + `.stories.tsx`，story meta 帶 `tags: ["autodocs"]`
與 `figmaSourceUrl`（Figma 檔案 URL；目前無 per-node 節點）。

## State Coverage（狀態覆蓋）

| 組件 | evidenced | out-of-scope（未做，已標註） |
|---|---|---|
| MetricBlock | default, no-subtitle, row | loading/error（display-only，不適用） |
| CommuteDeltaCard | cooler, neutral, warmer, +rain, over-atmosphere | loading/skeleton（無證據，暫不做） |
| DeltaAtmosphere | cooler, neutral, warmer, with-content | 狀態轉場動畫（需 spec） |
| PrimaryButton | default, update, disabled | loading spinner（無證據） |

## Verification（驗證）

| 檢查 | 結果 |
|------|------|
| `npm run check:tokens` | ✅ 通過（前綴 yw，ref→sys→comp 繼承正確） |
| `npm run storybook` | ✅ 啟動於 localhost:6006，四組件 + Autodocs 正常渲染 |
| `npm run typecheck` | ⚠️ 僅 `.storybook/main.ts`/`preview.ts` 範本設定型別不符（review-comment 屬性）；不影響執行 |
| `npm run check:storybook-catalog` | ⚠️ 需要 `ripgrep`(rg)；本機未安裝，非程式碼問題 |
| Figma export addon | 未安裝（可選）；核心 Storybook 已可用 |

## Open Items（待辦）

- 範本殘留的金融 design-system 文檔（`design-system-web/design-system/**`）與 Foundations
  story 的舊 token 資料尚未清成天氣版本；不影響四組件展示。
- `.storybook` 範本型別不符 + 缺 `rg`：若要 `npm run check` 全綠需另外處理。
- 若日後要 Storybook→Figma 匯入，再確認 bundled importer plugin。
