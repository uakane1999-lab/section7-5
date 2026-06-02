# API設計書

## 概要

| 項目 | 内容 |
|---|---|
| プロジェクト名 | 共有レシピアプリ |
| 作成日 | 2026-06-01 |
| 担当 | BE① / BE② |
| 認証方式 | Firebase Auth（IDトークン） |
| 画像保存 | Cloudinary |
| ベースURL | `http://localhost:8000` |

---

## 認証方式

Firebase Auth が発行した **IDトークン** を `Authorization` ヘッダーに付与する。

```
Authorization: Bearer <Firebase IDトークン>
```

バックエンドは Firebase Admin SDK で IDトークンを検証し、`firebase_uid` を取得する。

---

## ステータスコード

| コード | 意味 | 使うタイミング |
|---|---|---|
| `200` | OK | 取得・更新成功 |
| `201` | Created | 新規作成成功 |
| `204` | No Content | 削除成功 |
| `400` | Bad Request | バリデーションエラー・必須項目欠け |
| `401` | Unauthorized | 未認証（IDトークンなし・無効・期限切れ） |
| `403` | Forbidden | 認可エラー（他人のレシピを操作しようとした） |
| `404` | Not Found | 対象リソースが存在しない |
| `409` | Conflict | 重複エラー（同じemail・usernameで登録など） |
| `500` | Internal Server Error | サーバー内部エラー |

---

## 認可ルール

| 操作 | 未認証 | 認証済み（本人） | 認証済み（他人） |
|---|---|---|---|
| `GET /recipes` | ✅ 200 | ✅ 200 | ✅ 200 |
| `GET /recipes/{id}` | ✅ 200 | ✅ 200 | ✅ 200 |
| `GET /recipes/my` | ❌ 401 | ✅ 200 | — |
| `POST /recipes` | ❌ 401 | ✅ 201 | ✅ 201 |
| `PUT /recipes/{id}` | ❌ 401 | ✅ 200 | ❌ 403 |
| `DELETE /recipes/{id}` | ❌ 401 | ✅ 204 | ❌ 403 |
| `GET /users/me` | ❌ 401 | ✅ 200 | — |
| `PUT /users/me` | ❌ 401 | ✅ 200 | — |

---

## エンドポイント一覧

### 認証

| メソッド | パス | 概要 | 認証 | 画面ID |
|---|---|---|---|---|
| `POST` | `/auth/register` | ユーザー登録 | 不要 | UI-001 |
| `POST` | `/auth/login` | ログイン | IDトークン必須 | UI-001 |

### ユーザー

| メソッド | パス | 概要 | 認証 | 画面ID |
|---|---|---|---|---|
| `GET` | `/users/me` | ログイン中ユーザー情報取得 | IDトークン必須 | UI-007 |
| `PUT` | `/users/me` | プロフィール編集 | IDトークン必須 | UI-007 |

### レシピ

| メソッド | パス | 概要 | 認証 | 画面ID |
|---|---|---|---|---|
| `GET` | `/recipes` | レシピ一覧取得 | 不要 | UI-002 |
| `GET` | `/recipes/my` | 自分のレシピ一覧取得 | IDトークン必須 | UI-006 |
| `GET` | `/recipes/{id}` | レシピ詳細取得 | 不要 | UI-003 |
| `POST` | `/recipes` | レシピ新規投稿 | IDトークン必須 | UI-004 |
| `PUT` | `/recipes/{id}` | レシピ更新（本人のみ） | IDトークン必須 | UI-005 |
| `DELETE` | `/recipes/{id}` | レシピ削除（本人のみ） | IDトークン必須 | UI-005 |

---

## エンドポイント詳細

### `POST /auth/register`

フロントでFirebase Authによりユーザー作成後、DBにユーザー情報を登録する。

**リクエスト**
```json
{
  "firebase_uid": "abc123xyz",
  "username": "yamada_taro",
  "email": "yamada@example.com"
}
```

**レスポンス `201`**
```json
{
  "id": "uuid",
  "firebase_uid": "abc123xyz",
  "username": "yamada_taro",
  "email": "yamada@example.com",
  "avatar_url": null,
  "role": "user",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| 必須項目が欠けている | `400` |
| すでに登録済みのemail | `409` |
| すでに登録済みのusername | `409` |

---

### `POST /auth/login`

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
```

**レスポンス `200`**
```json
{
  "id": "uuid",
  "username": "yamada_taro",
  "email": "yamada@example.com",
  "avatar_url": "https://res.cloudinary.com/...",
  "role": "user"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンが無効 | `401` |
| DBにユーザーが存在しない | `404` |

---

### `GET /users/me`

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
```

**レスポンス `200`**
```json
{
  "id": "uuid",
  "username": "yamada_taro",
  "email": "yamada@example.com",
  "avatar_url": "https://res.cloudinary.com/...",
  "role": "user",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンなし・無効・期限切れ | `401` |

---

### `PUT /users/me`

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
Content-Type: multipart/form-data
```

**リクエストボディ**（すべて任意）
| フィールド | 型 | 説明 |
|---|---|---|
| `username` | string | ユーザー名 |
| `avatar` | file | アバター画像（Cloudinaryにアップロード） |

**レスポンス `200`**
```json
{
  "id": "uuid",
  "username": "yamada_taro_new",
  "email": "yamada@example.com",
  "avatar_url": "https://res.cloudinary.com/...",
  "role": "user",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンなし・無効 | `401` |
| usernameが重複 | `409` |

---

### `GET /recipes`

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| `q` | string | 任意 | タイトル・材料のキーワード検索 |
| `page` | integer | 任意 | ページ番号（デフォルト: 1） |
| `limit` | integer | 任意 | 1ページの件数（デフォルト: 20） |

**レスポンス `200`**
```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "recipes": [
    {
      "id": "uuid",
      "title": "親子丼",
      "image_url": "https://res.cloudinary.com/...",
      "user": {
        "id": "uuid",
        "username": "yamada_taro",
        "avatar_url": "https://res.cloudinary.com/..."
      },
      "created_at": "2026-06-01T12:00:00Z"
    }
  ]
}
```

---

### `GET /recipes/my`

自分が投稿したレシピ一覧を取得する。

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
```

**レスポンス `200`**
```json
{
  "total": 5,
  "recipes": [
    {
      "id": "uuid",
      "title": "親子丼",
      "image_url": "https://res.cloudinary.com/...",
      "created_at": "2026-06-01T12:00:00Z",
      "updated_at": "2026-06-01T12:00:00Z"
    }
  ]
}
```

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンなし・無効 | `401` |

---

### `GET /recipes/{id}`

**レスポンス `200`**
```json
{
  "id": "uuid",
  "title": "親子丼",
  "ingredients": "鶏もも肉 200g\n卵 2個\n玉ねぎ 1/2個",
  "instructions": "1. 玉ねぎを薄切りにする\n2. 鶏肉を一口大に切る\n3. だし汁で煮る\n4. 卵でとじる",
  "image_url": "https://res.cloudinary.com/...",
  "user": {
    "id": "uuid",
    "username": "yamada_taro",
    "avatar_url": "https://res.cloudinary.com/..."
  },
  "created_at": "2026-06-01T12:00:00Z",
  "updated_at": "2026-06-01T12:00:00Z"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| 存在しないID | `404` |

---

### `POST /recipes`

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
Content-Type: multipart/form-data
```

**リクエストボディ**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `title` | string | ✅ | レシピタイトル |
| `ingredients` | string | ✅ | 材料 |
| `instructions` | string | ✅ | 調理手順 |
| `image` | file | 任意 | レシピ画像 |

**レスポンス `201`**
```json
{
  "id": "uuid",
  "title": "親子丼",
  "ingredients": "鶏もも肉 200g\n卵 2個\n玉ねぎ 1/2個",
  "instructions": "1. 玉ねぎを薄切りにする...",
  "image_url": "https://res.cloudinary.com/...",
  "user_id": "uuid",
  "created_at": "2026-06-01T12:00:00Z",
  "updated_at": "2026-06-01T12:00:00Z"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンなし・無効 | `401` |
| 必須項目が欠けている | `400` |

---

### `PUT /recipes/{id}`

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
Content-Type: multipart/form-data
```

**リクエストボディ**（すべて任意）
| フィールド | 型 | 説明 |
|---|---|---|
| `title` | string | レシピタイトル |
| `ingredients` | string | 材料 |
| `instructions` | string | 調理手順 |
| `image` | file | レシピ画像（差し替え） |

**レスポンス `200`**
```json
{
  "id": "uuid",
  "title": "親子丼（改）",
  "ingredients": "...",
  "instructions": "...",
  "image_url": "https://res.cloudinary.com/...",
  "user_id": "uuid",
  "created_at": "2026-06-01T12:00:00Z",
  "updated_at": "2026-06-01T15:00:00Z"
}
```

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンなし・無効 | `401` |
| 他人のレシピを操作 | `403` |
| 存在しないID | `404` |

---

### `DELETE /recipes/{id}`

**リクエストヘッダー**
```
Authorization: Bearer <Firebase IDトークン>
```

**レスポンス `204`**（ボディなし）

**エラー**
| ケース | ステータス |
|---|---|
| IDトークンなし・無効 | `401` |
| 他人のレシピを操作 | `403` |
| 存在しないID | `404` |