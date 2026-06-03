import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_id_token
from app.models.models import User
from pydantic import BaseModel

router = APIRouter(tags=["auth"])


# リクエスト・レスポンスモデル
class RegisterRequest(BaseModel):
    firebase_uid: str
    username: str
    email: str


class RegisterResponse(BaseModel):
    id: str
    firebase_uid: str
    username: str
    email: str
    avatar_url: str | None
    role: str
    created_at: str


class LoginRequest(BaseModel):
    id_token: str


class LoginResponse(BaseModel):
    id: str
    username: str
    email: str
    avatar_url: str | None
    role: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    avatar_url: str | None
    role: str


# エンドポイント
@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """ユーザー登録"""
    # 既存ユーザーチェック
    existing_user = db.query(User).filter(
        (User.firebase_uid == request.firebase_uid) | (User.email == request.email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    
    # 新規ユーザー作成
    user = User(
        id=uuid.uuid4(),
        firebase_uid=request.firebase_uid,
        username=request.username,
        email=request.email,
        avatar_url=None,
        role="user",
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id),
        "firebase_uid": user.firebase_uid,
        "username": user.username,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """ログイン・IDトークン検証"""
    try:
        # IDトークン検証
        decoded_token = verify_id_token(request.id_token)
        firebase_uid = decoded_token.get("uid")
        
        # DBからユーザー情報取得
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        return {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "role": user.role,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_me(authorization: str = Header(None), db: Session = Depends(get_db)):
    """ログイン中のユーザー情報取得"""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    # "Bearer <token>" から token を抽出
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token format")
    
    try:
        decoded_token = verify_id_token(token)
        firebase_uid = decoded_token.get("uid")
        
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        return {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "role": user.role,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")