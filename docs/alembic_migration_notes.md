# 📝 Alembic & Docker マイグレーション トラブルシューティング

本プロジェクトの開発において、初期DB設計のマイグレーション（Alembic）適用時に発生したエラーとその解決策をまとめました。今後、環境構築やスキーマ変更で同様の事象が発生した際は、以下の手順を参考にしてください。

---

## 💾 1. 型変換エラー（既存テーブルとの競合）

### 🚨 事象

既存テーブルのカラム型（例: `INTEGER`）を大幅に変更（例: `UUID`）しようとした際、すでにDB内に存在するデータや制約と競合し、マイグレーション適用（`upgrade head`）時にエラーが発生する。

### 🛠️ 解決策

ローカルの検証データごとDBボリュームを完全にリセットし、空の状態からマイグレーションを再生成・適用する。

```powershell
# 1. 既存のDBコンテナとボリューム（データ）を完全に削除
docker compose down -v

# 2. コンテナを再起動（DBは空の状態で立ち上がる）
docker compose up -d
```

---

## 🌀 2. `upgrade()` が空（pass）になる問題

### 🚨 事象

`alembic revision --autogenerate` を実行しても、生成されたマイグレーションファイルの `upgrade()` や `downgrade()` が `pass` のままとなり、SQLAlchemyモデル（`User`、`Recipe` など）の差分が検知されない。

### 💡 原因

Alembic実行時にプロジェクトのソースコード（`app` ディレクトリ）へパスが通っていない、またはモデル定義ファイルが読み込まれていないため、`Base.metadata` にテーブル情報が登録されていない。

### 🛠️ 解決策

`backend/alembic/env.py` にインポートパス設定とモデルの明示的なインポートを追加する。

#### `backend/alembic/env.py`

```python
import sys
import os

# 1. backend/ ディレクトリをパスに追加
sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

from app.core.database import Base

# 2. モデルを明示的にインポート
import app.models.models as project_models

# ...省略...

target_metadata = Base.metadata
```

---

## 👥 3. テーブル重複エラー

### 🚨 事象

コンテナ再起動後に、DB内へ同名テーブル（`users`、`recipes` など）がすでに存在しているというエラーが発生し、マイグレーション適用やアプリケーション起動に失敗する。

Dockerを再起動しただけでは、ボリューム内のデータが残っている場合がある。

### 🛠️ 解決策

DockerのNamed Volumeを明示的に削除し、DBデータを完全にクリーンアップする。

```powershell
# 1. コンテナ停止
docker compose down

# 2. DBボリュームを削除
docker volume rm teamb_section7_postgres_data

# 3. コンテナ再起動
docker compose up -d
```

> ※ ボリューム名は `docker-compose.yml` の設定に合わせて変更してください。

---

## 📜 4. 履歴未記録（リビジョン不一致）エラー

### 🚨 事象

マイグレーションファイル（`versions/xxxx.py`）を手動削除・変更した際、DB側の履歴管理テーブル（`alembic_version`）に記録されたリビジョンIDと不一致が発生する。

その結果、以下のようなエラーが表示される。

```text
Can't locate revision identified by 'xxxx'
```

### 🛠️ 解決策

`alembic stamp` コマンドを利用して、DB側の履歴情報を現在の状態へ強制的に同期する。

#### パターンA：初期状態へ戻す

```powershell
docker compose exec backend alembic stamp base
```

DB側を「マイグレーション未適用状態」として記録する。

#### パターンB：最新状態へ合わせる

```powershell
docker compose exec backend alembic stamp head
```

現在存在する最新リビジョンが適用済みであるとして記録する。

同期後に、必要に応じて以下を再実行する。

```powershell
docker compose exec backend alembic revision --autogenerate -m "create tables"

docker compose exec backend alembic upgrade head
```

---

## ✅ まとめ

Alembicのマイグレーションエラーは、大きく以下の4パターンに分類できる。

| エラー内容 | 主な原因 | 対処方法 |
|-----------|----------|----------|
| 型変換エラー | 既存データとの不整合 | DBボリューム削除・再作成 |
| `upgrade()` が `pass` | モデル未検知 | `env.py` のパス設定とモデル読込 |
| テーブル重複エラー | Dockerボリューム残存 | Named Volume削除 |
| リビジョン不一致 | 履歴情報の不整合 | `alembic stamp` で同期 |

マイグレーション関連のエラーが発生した場合は、まず「DBの状態」「Alembicの履歴」「モデルの読込状況」の3点を確認すると、原因を特定しやすくなる。