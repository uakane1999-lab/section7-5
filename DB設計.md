# DB設計書

## 概要

| 項目 | 内容 |
|---|---|
| プロジェクト名 | 共有レシピアプリ |
| DB種別 | PostgreSQL |
| 作成日 | 2026-06-01 |
| 担当 | BE① |
| 認証 | Firebase Auth |
| 画像保存 | Cloudinary |

---

## テーブル一覧

| テーブル名 | 概要 |
|---|---|
| `users` | ユーザー情報（Firebase UIDと紐付け・アバター画像URL） |
| `recipes` | レシピ情報（タイトル・材料・手順・画像URL） |

---

## テーブル定義

### `users`

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `gen_random_uuid()` | 主キー |
| `firebase_uid` | `VARCHAR(128)` | NOT NULL | — | Firebase Auth の UID |
| `username` | `VARCHAR(50)` | NOT NULL | — | ユーザー名 |
| `email` | `VARCHAR(255)` | NOT NULL | — | メールアドレス |
| `avatar_url` | `VARCHAR(500)` | NULL | — | アバター画像（Cloudinary URL） |
| `role` | `VARCHAR(20)` | NOT NULL | `'user'` | ロール（`user` 固定） |
| `created_at` | `TIMESTAMP` | NOT NULL | `NOW()` | 作成日時 |

**制約**
- `PRIMARY KEY (id)`
- `UNIQUE (firebase_uid)`
- `UNIQUE (email)`
- `UNIQUE (username)`

**DDL**
```sql
CREATE TABLE users (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  email        VARCHAR(255) NOT NULL UNIQUE,
  avatar_url   VARCHAR(500),
  role         VARCHAR(20)  NOT NULL DEFAULT 'user',
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

---

### `recipes`

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `gen_random_uuid()` | 主キー |
| `title` | `VARCHAR(200)` | NOT NULL | — | レシピタイトル |
| `ingredients` | `TEXT` | NOT NULL | — | 材料 |
| `instructions` | `TEXT` | NOT NULL | — | 調理手順 |
| `image_url` | `VARCHAR(500)` | NULL | — | レシピ画像（Cloudinary URL） |
| `user_id` | `UUID` | NOT NULL | — | 投稿者（外部キー） |
| `created_at` | `TIMESTAMP` | NOT NULL | `NOW()` | 作成日時 |
| `updated_at` | `TIMESTAMP` | NOT NULL | `NOW()` | 更新日時 |

**制約**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`

**DDL**
```sql
CREATE TABLE recipes (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(200) NOT NULL,
  ingredients  TEXT         NOT NULL,
  instructions TEXT         NOT NULL,
  image_url    VARCHAR(500),
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recipes_user_id    ON recipes(user_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
```

---

## ER図

```
users                              recipes
+----------------------+           +----------------------+
| id (PK)              |1        * | id (PK)              |
| firebase_uid (UNIQUE)|---------->| user_id (FK)         |
| username (UNIQUE)    |           | title                |
| email (UNIQUE)       |           | ingredients          |
| avatar_url           |           | instructions         |
| role                 |           | image_url            |
| created_at           |           | created_at           |
+----------------------+           | updated_at           |
                                   +----------------------+
```

---

## インデックス

| テーブル | カラム | 種別 | 目的 |
|---|---|---|---|
| `users` | `firebase_uid` | UNIQUE INDEX | IDトークン検証後のユーザー検索 |
| `users` | `email` | UNIQUE INDEX | メール重複チェック |
| `users` | `username` | UNIQUE INDEX | ユーザー名重複チェック |
| `recipes` | `user_id` | INDEX | ユーザーごとのレシピ一覧取得 |
| `recipes` | `created_at` | INDEX | 新着順ソート |

---

## ロール定義

| ロール | 説明 | 権限 |
|---|---|---|
| `user` | 唯一のロール | 全レシピ閲覧可。自分のレシピのみ作成・編集・削除可。プロフィール編集可。 |

---

## 環境変数

```env
# PostgreSQL
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=recipe_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 今後の拡張候補

| テーブル | 概要 | 優先度 |
|---|---|---|
| `favorites` | いいね機能（users × recipes の中間テーブル） | 中 |
| `comments` | コメント機能 | 中 |