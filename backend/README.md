# Backend
 
このディレクトリには、本プロジェクトのバックエンドアプリケーションを配置する。
 
## 技術スタック
 
| 種別 | 採用技術 |
|------|---------|
| 言語 | Python 3.12 |
| フレームワーク | FastAPI |
| ORM | SQLAlchemy 2.0 |
| マイグレーション | Alembic |
| DB | PostgreSQL 16 |
| 認証 | Firebase Authentication（IDトークン検証） |
| 画像ストレージ | Cloudinary |
| テスト | pytest + TestClient |
| Lint / Format | （任意：flake8 / black） |
 
> 詳細は [`docs/技術選定書.md`](../docs/技術選定書.md) を参照。
 
---
 
## 前提
 
- Docker / Docker Compose が必要（Pythonのローカルインストール不要）
- Firebase プロジェクトのサービスアカウントキーを取得済みであること
- Cloudinary のアカウントを作成済みであること
---
 
## セットアップ
 
```bash
# 1. 環境変数ファイルの用意
cp ../.env.example ../.env
 
# 2. .envに各サービスの値を設定
#    取得場所は下記「環境変数」セクションを参照
 
# 3. コンテナをビルド・起動
docker compose up --build
 
# 4. マイグレーション実行
docker compose exec backend alembic upgrade head
 
# 5. テストデータ投入（任意）
docker compose exec backend python seed.py
```
 
---
 
## 開発コマンド
 
```bash
# 開発サーバー起動（ホットリロード有効）
docker compose up
 
# バックグラウンドで起動
docker compose up -d
 
# 停止
docker compose down
 
# DBデータも含めて全削除（注意！）
docker compose down -v
 
# ログ確認
docker compose logs -f backend
 
# テスト実行
docker compose exec backend pytest tests/ -v
 
# カバレッジ付きでテスト実行
docker compose exec backend pytest tests/ -v --cov=app
 
# マイグレーション適用
docker compose exec backend alembic upgrade head
 
# マイグレーションファイル自動生成
docker compose exec backend alembic revision --autogenerate -m "変更内容"
 
# マイグレーションを1つ戻す
docker compose exec backend alembic downgrade -1
```
 
---
 
## ディレクトリ構成
 
```
backend/
├── Dockerfile.dev
├── requirements.txt          # 依存ライブラリ
├── seed.py                   # テストデータ投入スクリプト
├── alembic.ini               # Alembic設定
├── alembic/
│   ├── env.py
│   └── versions/             # マイグレーションファイル
├── app/
│   ├── main.py               # アプリエントリポイント・CORS設定
│   ├── api/
│   │   └── v1/
│   │       ├── router.py     # ルーター集約
│   │       ├── auth.py       # 認証エンドポイント
│   │       ├── recipes.py    # レシピCRUDエンドポイント
│   │       ├── users.py      # ユーザーエンドポイント
│   │       └── deps.py       # 認証共通処理（get_current_user）
│   ├── core/
│   │   ├── config.py         # 環境変数管理（pydantic-settings）
│   │   ├── database.py       # DB接続・セッション管理
│   │   └── security.py       # Firebase IDトークン検証
│   ├── models/
│   │   └── models.py         # SQLAlchemyモデル（User・Recipe）
│   ├── schemas/
│   │   └── schemas.py        # Pydanticスキーマ（リクエスト/レスポンス型）
│   └── services/
│       └── cloudinary.py     # 画像アップロード処理
└── tests/
    ├── test_security.py      # 認証ロジックの単体テスト
    └── test_recipes.py       # レシピCRUDの単体テスト
```
 
---
 
## 環境変数
 
`.env.example` をコピーして `.env` に値を設定してください。
 
```bash
cp .env.example .env
```
 
| 変数名 | 説明 | 取得場所 |
|--------|------|---------|
| `POSTGRES_USER` | DBユーザー名 | 任意の値でOK |
| `POSTGRES_PASSWORD` | DBパスワード | 任意の値でOK |
| `POSTGRES_DB` | DB名 | 任意の値でOK |
| `DATABASE_URL` | DB接続URL | 上記3つから自動生成 |
| `ENVIRONMENT` | 実行環境（development / production） | `development` で固定 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinaryのクラウド名 | [Cloudinaryダッシュボード](https://cloudinary.com) |
| `CLOUDINARY_API_KEY` | CloudinaryのAPIキー | 同上 |
| `CLOUDINARY_API_SECRET` | CloudinaryのAPIシークレット | 同上 |
| `FIREBASE_PROJECT_ID` | FirebaseプロジェクトID | [Firebaseコンソール](https://console.firebase.google.com) → プロジェクト設定 |
| `FIREBASE_PRIVATE_KEY` | Firebase秘密鍵 | Firebaseコンソール → サービスアカウント → 鍵を生成 |
| `FIREBASE_CLIENT_EMAIL` | Firebaseクライアントメール | 同上 |
 
---
 
## API ドキュメント
 
開発環境では Swagger UI が自動生成されます。
 
```
http://localhost:8000/docs
```
 
> 本番環境（`ENVIRONMENT=production`）では `/docs` は無効化されます。
 
---
 
## レイヤ構成
 
```
リクエスト
    ↓
api/v1/        # エンドポイント定義・リクエスト受付
    ↓
services/      # 外部サービス連携（Cloudinary等）
    ↓
models/        # DBアクセス（SQLAlchemy）
    ↓
DB（PostgreSQL）
```
 
**依存方向のルール**
- `api/v1/` は `models/` と `services/` を呼び出す
- `models/` はDBのみに依存する
- `services/` は外部サービスのみに依存する
- `core/` はどのレイヤからも参照してよい
---
 
## コーディング規約
 
- **型ヒント**を必ず付ける（Pydanticによる自動バリデーションのため）
- **レスポンスは必ずスキーマ（schemas.py）を通す**（直接モデルを返さない）
- **認証が必要なエンドポイント**は `deps.py` の `get_current_user` を `Depends` で使う
- **ログ**はデバッグログを `logger.debug()` で書き、本番環境では出力されないようにする
- **SQLインジェクション対策**としてSQLAlchemyのORMを使い、生クエリを避ける
---
 
## セキュリティ対策
 
| 脅威 | 対策 |
|------|------|
| SQLインジェクション | SQLAlchemy ORM を使用し生クエリを避ける |
| XSS | フロントエンド側でエスケープ処理。バックエンドはJSONのみ返す |
| 不正アクセス | Firebase IDトークンをリクエストごとに検証 |
| 認可漏れ | `PUT` / `DELETE` で `user_id` と一致確認し、不一致は403を返す |
| 機密情報の漏洩 | `.env` を `.gitignore` に含め、シークレットをGitにコミットしない |