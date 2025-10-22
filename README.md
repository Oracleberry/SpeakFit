# SpeakFit

英語の発音練習アプリ - IPA（国際音声記号）を使った発音トレーニング

## 概要

SpeakFitは、英語の発音を体系的に学習できるReact Nativeアプリです。IPA（国際音声記号）を使用して、母音・子音の正確な発音を練習できます。

## 主な機能

- **IPA発音ガイド**: 母音・子音の詳細な発音解説
- **音声再生**: ネイティブ発音のサンプル音声
- **録音機能**: 自分の発音を録音して確認
- **単語帳**: カスタマイズ可能な単語リスト
- **練習モード**: 繰り返し練習による発音の定着
- **ユーザー認証**: 個人の学習進捗を管理

## 技術スタック

- **React Native**: 0.80.2
- **React**: 19.1.0
- **React Navigation**: タブナビゲーション + スタックナビゲーション
- **TypeScript**: 型安全な開発
- **React Native Vector Icons**: アイコン表示
- **その他のライブラリ**:
  - react-native-gesture-handler
  - react-native-safe-area-context
  - react-native-screens


## プロジェクト構成

```
speak_fit/
├── src/
│   ├── contexts/          # React Context (認証など)
│   │   └── AuthContext.tsx
│   └── screens/           # 画面コンポーネント
│       ├── HomeScreen.tsx      # IPA発音ガイド
│       ├── Practice.tsx        # 練習画面
│       ├── VocabularyScreen.tsx # 単語帳
│       ├── WordListScreen.tsx  # 単語リスト
│       ├── RegisterScreen.tsx  # 登録画面
│       ├── LoginScreen.tsx     # ログイン画面
│       └── UserScreen.tsx      # ユーザー画面
├── ios/                   # iOSネイティブコード
├── android/              # Androidネイティブコード
├── App.tsx               # アプリのエントリーポイント
└── package.json          # 依存関係
```

