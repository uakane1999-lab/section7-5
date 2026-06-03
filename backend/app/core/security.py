import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings
import os

# Firebase Admin SDK の初期化
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), '../../', settings.FIREBASE_KEY_PATH))
firebase_app = firebase_admin.initialize_app(cred)


def verify_id_token(token: str) -> dict:
    """Firebase IDトークンを検証して、ユーザー情報を取得"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise Exception(f"Token verification failed: {str(e)}")