import pytest
from unittest.mock import patch, MagicMock
from app.core.security import verify_id_token


class TestVerifyIdToken:
    def test_正常なトークンでユーザー情報が返る(self):
        mock_decoded = {
            "uid": "test_firebase_uid_123",
            "email": "test@example.com",
        }
        with patch("app.core.security.auth.verify_id_token", return_value=mock_decoded):
            with patch("app.core.security._initialize_firebase"):
                result = verify_id_token("valid_token")
                assert result["uid"] == "test_firebase_uid_123"
                assert result["email"] == "test@example.com"

    def test_無効なトークンで例外が発生する(self):
        with patch("app.core.security.auth.verify_id_token", side_effect=Exception("Invalid token")):
            with patch("app.core.security._initialize_firebase"):
                with pytest.raises(Exception) as exc_info:
                    verify_id_token("invalid_token")
                assert "Token verification failed" in str(exc_info.value)

    def test_期限切れトークンで例外が発生する(self):
        with patch("app.core.security.auth.verify_id_token", side_effect=Exception("Token expired")):
            with patch("app.core.security._initialize_firebase"):
                with pytest.raises(Exception) as exc_info:
                    verify_id_token("expired_token")
                assert "Token verification failed" in str(exc_info.value)

    def test_FIREBASE_CREDENTIALS_JSONが未設定の場合エラーになる(self):
        with patch.dict("os.environ", {}, clear=True):
            with patch("firebase_admin._apps", {}):
                with pytest.raises(RuntimeError) as exc_info:
                    verify_id_token("any_token")
                assert "FIREBASE_CREDENTIALS_JSON" in str(exc_info.value)