# Frontend
 
このディレクトリには、本プロジェクトのフロントエンドアプリケーションを配置する。
 
## 技術スタック
 
| 種別 | 採用技術 |
|------|---------|
| 言語 | TypeScript |
| フレームワーク | Next.js 14（App Router） |
| スタイリング | TailwindCSS） |
| 状態管理 | React Context API（認証状態管理） |
| 認証 | Firebase Authentication |
| テスト | Jest / Playwright |
| Lint / Format | ESLint |
 
> 詳細は [`docs/技術選定書.md`](../docs/技術選定書.md) を参照。
 
---
 
## 前提
 
- Docker / Docker Compose が必要（Node.jsのローカルインストール不要）
- バックエンドが起動済みであること（`http://localhost:8000`）
- Firebase プロジェクトの設定値を取得済みであること
---
 
## セットアップ
 
```bash
# 1. 環境変数ファイルの用意
cp ../.env.example ../.env
 
# 2. .envにFirebaseの値を設定
#    取得場所は下記「環境変数」セクションを参照
 
# 3. コンテナをビルド・起動（バックエンドと同時に起動）
docker compose up --build
```
 
フロントエンド単体で起動する場合（ローカルにNode.jsがある場合）
 
```bash
cd frontend
npm install
npm run dev
```
 
---
 
## 開発コマンド
 
```bash
# 開発サーバー起動（ホットリロード有効）
docker compose up
 
# フロントエンドのログ確認
docker compose logs -f frontend
 
# コンテナ内でコマンドを実行
docker compose exec frontend npm run lint
 
# テスト実行
docker compose exec frontend npm test
```
 
---
 
## ディレクトリ構成
 
```
frontend/
├── Dockerfile.dev
├── package.json
├── tsconfig.json
├── next.config.js
└── src/
    ├── app/                       # ページ（App Router）
    │   ├── layout.tsx             # ルートレイアウト・AuthProvider
    │   ├── globals.css            # グローバルスタイル
    │   ├── page.tsx               # トップページ（/）
    │   ├── login/
    │   │   └── page.tsx           # ログイン画面（/login）
    │   ├── register/
    │   │   └── page.tsx           # 新規登録画面（/register）
    │   └── recipes/
    │       └── page.tsx           # レシピ一覧画面（/recipes）
    ├── lib/                       # ユーティリティ・API クライアント
    │   ├── api.ts                 # バックエンドAPIクライアント
    │   └── auth-context.tsx       # 認証状態管理（Context + Provider）
    └── types/                     # 型定義
        └── index.ts               # API レスポンスの型
```
 
---
 
## 環境変数
 
`.env.example` をコピーして `.env` に値を設定してください。
 
```bash
cp .env.example .env
```
 
| 変数名 | 説明 | 取得場所 |
|--------|------|---------|
| `NEXT_PUBLIC_API_URL` | バックエンドAPIのURL | ローカルは `http://localhost:8000` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase APIキー | [Firebaseコンソール](https://console.firebase.google.com) → プロジェクト設定 → マイアプリ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase認証ドメイン | 同上 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | FirebaseプロジェクトID | 同上 |
 
> `NEXT_PUBLIC_` プレフィックスがついた変数はブラウザから参照できます。シークレットな値は付けないでください。
 
---
 
## ページ一覧
 
| パス | ページ名 | 認証 |
|------|---------|------|
| `/` | トップページ | 不要 |
| `/login` | ログイン | 不要 |
| `/register` | 新規登録 | 不要 |
| `/recipes` | レシピ一覧 | 不要（投稿ボタンはログイン時のみ表示） |
| `/recipes/[id]` | レシピ詳細 | 不要 |
| `/recipes/new` | レシピ投稿 | 必要 |
| `/recipes/[id]/edit` | レシピ編集 | 必要（本人のみ） |
 
---
 
## 認証の仕組み
 
Firebase Authentication を使って認証を管理しています。
 
```
1. ユーザーがログイン画面でメール・パスワードを入力
        ↓
2. Firebase がIDトークンを発行
        ↓
3. IDトークンを localStorage に保存
        ↓
4. APIリクエスト時に Authorization: Bearer <IDトークン> を付与
        ↓
5. バックエンドがIDトークンを検証してユーザーを特定
```
 
認証状態は `src/lib/auth-context.tsx` の `AuthProvider` で管理しています。
認証が必要なページでは `useAuth()` フックを使ってユーザー情報を取得できます。
 
```typescript
const { user, token, login, logout } = useAuth();
```
 
---
 
## APIクライアントの使い方
 
`src/lib/api.ts` に各エンドポイントへのリクエスト関数をまとめています。
 
```typescript
import { recipeApi, authApi } from "@/lib/api";
 
// レシピ一覧取得（認証不要）
const recipes = await recipeApi.list();
 
// レシピ作成（認証必要）
const { token } = useAuth();
const newRecipe = await recipeApi.create({ title, ingredients, instructions }, token);
```
 
---
 
## コーディング規約
 
- `any` 型を避け、`src/types/index.ts` に定義した型を使う
- APIレスポンスの型は `src/types/index.ts` で一元管理する
- ページコンポーネントは `src/app/` に、再利用可能なコンポーネントは `src/components/` に配置する
- 認証が必要なページは `useAuth()` でログイン状態を確認してからレンダリングする
- `"use client"` ディレクティブはクライアントコンポーネントのみに付ける
---
 
## セキュリティ対策
 
| 脅威 | 対策 |
|------|------|
| XSS | Reactの自動エスケープを活用。`dangerouslySetInnerHTML` を使わない |
| トークン漏洩 | `NEXT_PUBLIC_` 変数にシークレット値を入れない |
| 不正アクセス | 認証が必要なページは `useAuth()` でリダイレクト処理を行う |
| CSRF | Cookie を使わず Authorization ヘッダーでトークンを送信する |