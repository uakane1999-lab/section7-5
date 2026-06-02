# 🍳 ふわっとレシピ

## 企画
みんなで料理レシピを投稿できるwebサイト

## アーキテクチャ図

<!-- TODO: システム構成図（C4 / 簡易構成図）をここに貼る。draw.io / Mermaid いずれでも可。-->
※追って更新します。

## ディレクトリ構成

<!-- TODO: 最後に書き加える。-->
※追って更新します。

## ドキュメント
- [要件定義書](./docs/要件定義.md)
- [画面設計書](./docs/画面設計.md)
- [API設計書](./docs/API設計.md)
- [DB設計書](./docs/DB設計.md)

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js 14 + TypeScript |
| バックエンド | Python 3.12 + FastAPI |
| データベース | PostgreSQL 16 |
| コンテナ | Docker / Docker Compose |

## ブランチ運用ルール

### ブランチ構成

```
main        ← 本番リリース用（直接pushしない）
 └── develop ← 統合ブランチ（各featureのマージ先）
       └── feature/xxx ← 各担当者の作業ブランチ
```

### 作業の流れ

```bash
# 1. developブランチを最新にする
git switch develop
git pull origin develop

# 2. featureブランチを作成（developから派生）
git switch -c feature/作業内容

# 3. 作業・コミット
git add .
git commit -m "feat: 〇〇を実装"

# 4. developにPull Requestを出す
git push origin feature/作業内容
# → GitHubでPRを作成 → レビュー → developにマージ
```

### ブランチ命名規則

| 種別 | 形式 | 例 |
|---|---|---|
| 環境構築 | `feature/setup-xxx` | `feature/setup-docker` |
| 機能追加 | `feature/add-xxx` | `feature/add-board-crud` |
| バグ修正 | `fix/xxx` | `fix/auth-middleware` |
| ドキュメント | `docs/xxx` | `docs/design-document` |

### コミットメッセージ規則

| プレフィックス | 用途 |
|---|---|
| `feat:` | 新機能の追加 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメントのみの変更 |
| `chore:` | 設定ファイル・環境構築 |
| `test:` | テストの追加・修正 |
| `refactor:` | リファクタリング |

---

## セットアップ（初回）

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd recipe-app
```

### 2. 環境変数を設定

```bash
cp .env.example .env
# 必要に応じて .env を編集
```

### 3. Docker で起動

```bash
docker compose up --build
```

| サービス | URL |
|---------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンド API | http://localhost:8000 |
| API ドキュメント | http://localhost:8000/docs |

## 日常の開発フロー

```bash
# 起動
docker compose up

# 停止
docker compose down

# DBのデータも含めて全削除
docker compose down -v

# ログ確認
docker compose logs -f backend
docker compose logs -f frontend
```

## テスト実行

```bash
# バックエンドのテスト
docker compose exec backend pytest tests/ -v
```

