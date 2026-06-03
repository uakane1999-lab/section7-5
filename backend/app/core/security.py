import os
import json
import firebase_admin
from firebase_admin import credentials, auth


def _initialize_firebase() -> firebase_admin.App:
    """Firebase Admin SDKを初期化して返す"""
    # すでに初期化済みなら再利用
    if firebase_admin._apps:
        return firebase_admin.get_app()
    
    credentials_json = os.environ.get("FIREBASE_CREDENTIALS_JSON")
    if not credentials_json:
        raise RuntimeError("FIREBASE_CREDENTIALS_JSON が環境変数に設定されていません")
    
    try:
        firebase_credentials = json.loads(credentials_json)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"FIREBASE_CREDENTIALS_JSON のJSON形式が不正です: {e}")
    
    cred = credentials.Certificate(firebase_credentials)
    return firebase_admin.initialize_app(cred)


def verify_id_token(token: str) -> dict:
    """Firebase IDトークンを検証して、ユーザー情報を取得"""
    _initialize_firebase()  # 呼び出し時に初期化（未初期化なら実行）
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise Exception(f"Token verification failed: {str(e)}")