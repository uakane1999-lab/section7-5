import os
import json
import firebase_admin
from firebase_admin import credentials, auth


# 環境変数からJSON文字列として読み込む
firebase_credentials = json.loads(os.environ["FIREBASE_CREDENTIALS_JSON"])
cred = credentials.Certificate(firebase_credentials)
firebase_app = firebase_admin.initialize_app(cred)


def verify_id_token(token: str) -> dict:
    """Firebase IDトークンを検証して、ユーザー情報を取得"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise Exception(f"Token verification failed: {str(e)}")