# 🍳 Recipe Share App

レシピ共有アプリのモノレポ構成です。

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js 14 + TypeScript |
| バックエンド | Python 3.12 + FastAPI |
| データベース | PostgreSQL 16 |
| コンテナ | Docker / Docker Compose |

## ディレクトリ構成

```
recipe-app/
├── docker-compose.yml
├── .env.example
├── frontend/          # Next.js
│   ├── Dockerfile.dev
│   └── src/
│       ├── app/       # ページ (App Router)
│       ├── lib/       # API クライアント・認証
│       └── types/     # 型定義
└── backend/           # FastAPI
    ├── Dockerfile.dev
    ├── requirements.txt
    └── app/
        ├── api/v1/    # エンドポイント
        ├── core/      # 設定・DB・認証
        ├── models/    # SQLAlchemy モデル
        └── schemas/   # Pydantic スキーマ
```

## 🚀 セットアップ（初回）

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

## 🔄 日常の開発フロー

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

## 🧪 テスト実行

```bash
# バックエンドのテスト
docker compose exec backend pytest tests/ -v
```

## API エンドポイント一覧

### 認証
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /api/v1/auth/register | ユーザー登録 |
| POST | /api/v1/auth/login | ログイン |

### レシピ
| メソッド | パス | 認証 | 説明 |
|---------|------|------|------|
| GET | /api/v1/recipes/ | 不要 | レシピ一覧 |
| GET | /api/v1/recipes/{id} | 不要 | レシピ詳細 |
| POST | /api/v1/recipes/ | 必要 | レシピ作成 |
| PUT | /api/v1/recipes/{id} | 必要 | レシピ更新（本人 or 管理者）|
| DELETE | /api/v1/recipes/{id} | 必要 | レシピ削除（本人 or 管理者）|

### ユーザー
| メソッド | パス | 認証 | 説明 |
|---------|------|------|------|
| GET | /api/v1/users/me | 必要 | 自分の情報 |
| GET | /api/v1/users/ | 管理者のみ | ユーザー一覧 |

## 認可ロール

| ロール | できること |
|-------|-----------|
| 未ログイン | レシピ閲覧のみ |
| 一般ユーザー | レシピ閲覧・自分のレシピのCRUD |
| 管理者 | 全レシピ・全ユーザーの管理 |
