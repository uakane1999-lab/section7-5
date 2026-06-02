import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token


def test_password_hash():
    password = "mysecretpassword"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True


def test_wrong_password():
    hashed = get_password_hash("correct")
    assert verify_password("wrong", hashed) is False


def test_create_and_decode_token():
    token = create_access_token({"sub": "42"})
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "42"


def test_invalid_token():
    payload = decode_token("invalid.token.here")
    assert payload is None
