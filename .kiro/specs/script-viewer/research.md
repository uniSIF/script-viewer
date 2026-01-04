# Research & Design Decisions

## Summary
- **Feature**: script-viewer
- **Discovery Scope**: New Feature（グリーンフィールド）
- **Key Findings**:
  - 純粋なクライアントサイドWebアプリとして実装可能
  - React + TypeScript + Viteの構成が最適
  - File APIによるローカルファイル読み込みで十分

## Research Log

### 技術スタック選定

- **Context**: グリーンフィールドプロジェクトとして、モダンで保守性の高い技術スタックを選定する必要がある
- **Sources Consulted**: React公式ドキュメント、Vite公式ドキュメント、State of JS 2024
- **Findings**:
  - React 18: 安定版、Concurrent Featuresによるパフォーマンス向上
  - TypeScript 5: 型安全性確保、開発体験向上
  - Vite 5: 高速なHMR、ESModulesベースの効率的なビルド
  - 状態管理: シンプルな要件のためuseState/useReducerで十分
- **Implications**: 外部ライブラリへの依存を最小限に抑え、シンプルな構成を維持

### ファイル入力方式

- **Context**: 複数JSONファイルの入力方法を検討
- **Sources Consulted**: MDN Web Docs (File API, Drag and Drop API)
- **Findings**:
  - File API: 全モダンブラウザでサポート
  - Drag and Drop API: 直感的なUX提供
  - FileReader API: 非同期ファイル読み込み
  - multiple属性: 複数ファイル同時選択可能
- **Implications**: 追加ライブラリ不要でネイティブAPIのみで実装可能

### フィルタリング実装

- **Context**: キャラクターフィルター機能の実装方式
- **Findings**:
  - クライアントサイドフィルタリングで十分（データ量が限定的）
  - Set型による選択状態管理が効率的
  - 空の選択セット = 全表示として扱うことでUXを簡素化
- **Implications**: 追加の検索ライブラリ不要

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Single Page App (React) | コンポーネントベースUI | 再利用性、型安全性、エコシステム | バンドルサイズ | 採用 |
| Vanilla JS | フレームワークなし | 軽量、依存なし | 保守性、コード量増加 | 見送り |
| Vue.js | リアクティブUI | 学習コスト低 | チーム習熟度 | 見送り |

## Design Decisions

### Decision: React + TypeScript + Vite構成

- **Context**: モダンで保守性の高いフロントエンド構成が必要
- **Alternatives Considered**:
  1. Vanilla JS — 軽量だが保守性に難
  2. Next.js — SSR不要、オーバースペック
  3. React + Vite — 必要十分な機能
- **Selected Approach**: React + TypeScript + Viteのシンプルな構成
- **Rationale**:
  - 型安全性による開発効率向上
  - Viteによる高速な開発体験
  - 必要最小限の依存関係
- **Trade-offs**: Reactのバンドルサイズ（約40KB gzip）
- **Follow-up**: パフォーマンス計測、必要に応じて最適化

### Decision: ローカル状態管理のみ使用

- **Context**: アプリケーション状態管理の方式選定
- **Alternatives Considered**:
  1. Redux/Zustand — グローバル状態管理
  2. React Context — コンポーネント間共有
  3. useState/useReducer — ローカル状態
- **Selected Approach**: useState/useReducerによるローカル状態管理
- **Rationale**:
  - 状態が単純（ファイルリスト、選択キャラクター）
  - コンポーネント階層が浅い
  - 追加依存不要
- **Trade-offs**: 状態が複雑化した場合は再検討が必要
- **Follow-up**: 機能追加時に状態管理の再評価

### Decision: ファイル別セクション表示

- **Context**: 複数ファイルのセリフ表示方式
- **Alternatives Considered**:
  1. 全ファイル統合表示 — シンプルだがファイル境界不明
  2. タブ切り替え — ファイル間移動が手間
  3. セクション分割 — 一覧性と構造化の両立
- **Selected Approach**: ファイルごとにセクションを分けて連続表示
- **Rationale**:
  - ストーリーの流れを追いやすい
  - ファイルの区切りが明確
  - スクロールで全体を俯瞰可能
- **Trade-offs**: ファイル数が多い場合の表示量
- **Follow-up**: 折りたたみ機能の検討（将来拡張）

## Risks & Mitigations

- 大容量ファイル読み込み時のメモリ使用 — ファイルサイズ上限の設定を検討
- 大量セリフ時のレンダリング性能 — 仮想スクロール導入を将来検討
- ブラウザ互換性 — モダンブラウザのみサポートと明記

## References

- [React 18 Documentation](https://react.dev/) — コンポーネント設計
- [Vite Documentation](https://vitejs.dev/) — ビルド設定
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API) — ファイル読み込み実装
- [MDN Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) — D&D実装
