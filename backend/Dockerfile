FROM python:3.11-slim

WORKDIR /app

# FastAPIと最低限必要なライブラリをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir fastapi uvicorn psycopg2-binary

# 開発環境用コマンド（コードの変更が即時反映されるよう --reload をつける）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]