# LocalStorage 依存度を減らすための計画

## 現在の LocalStorage 使用状況

### 使用箇所
- **page.tsx**: 選択されたアイテム、顧客情報、合計金額の保存・読み込み
- **confirmation/page.tsx**: 保存された情報の読み込み
- **instructions/page.tsx**: 収集日、備考の保存と、保存された情報の読み込み

### 保存されるデータ
- `selectedItems`: 選択されたアイテムのリスト
- `customerInfo`: 顧客情報（名前、住所、電話番号、メール、廃棄予定日）
- `totalAmount`: 合計金額
- `collectionDate`: 収集日
- `notes`: 備考

## 代替案

### 1. React Context + State Management（推奨）
**メリット**:
- データの一元管理
- TypeScript で型安全
- リアルタイムでの状態同期
- ブラウザリロード以外でのデータ消失なし

**実装方法**:
```typescript
// Context API + useReducer を使用
const AppContext = createContext()
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}
```

### 2. URL パラメータ・クエリパラメータ
**メリット**:
- ブックマーク可能
- URLで状態を共有可能
- リロード時も状態維持

**デメリット**:
- 大量のデータには不向き
- URLが長くなる

### 3. SessionStorage
**メリット**:
- タブ単位でのデータ管理
- LocalStorage より軽量

**デメリット**:
- タブを閉じると消失
- 根本的な解決にはならない

### 4. IndexedDB
**メリット**:
- 大量データの保存可能
- 構造化データの保存

**デメリット**:
- 複雑な実装
- 小規模アプリには過剰

## 推奨実装プラン

### フェーズ1: Context API の導入
1. `src/contexts/AppContext.tsx` を作成
2. 全てのページで共有する状態を Context で管理
3. LocalStorage への依存を段階的に削除

### フェーズ2: ページ間ナビゲーションの改善
1. Next.js の `useRouter` を活用
2. 必要に応じて URL パラメータでの状態管理
3. 戻るボタンの動作を自然にする

### フェーズ3: データ永続化の最適化
1. 必要最小限のデータのみ永続化
2. 一時的なデータは Context のみで管理
3. 重要なデータ（顧客情報など）のみ選択的に永続化

## 実装優先度

### 高: すぐに実装すべき
- Context API の導入
- 基本的な状態管理の移行

### 中: 次のフェーズで実装
- URL パラメータでの状態管理
- ナビゲーションの改善

### 低: 将来的に検討
- より高度な状態管理ライブラリ（Zustand、Jotai）の導入
- サーバーサイドでの状態管理

## 期待される効果

1. **開発効率の向上**: 状態の一元管理により、デバッグが容易
2. **ユーザー体験の向上**: ページ間でのデータ同期がスムーズ
3. **保守性の向上**: LocalStorage の散在を避け、コードの可読性向上
4. **型安全性**: TypeScript での型チェックが効く
5. **テスト容易性**: 状態管理ロジックのテストが書きやすい

## 注意点

- 既存の機能を壊さないよう段階的に移行
- ブラウザリロード時の動作について慎重に検討
- SEO への影響を考慮（SPA のため影響は限定的）