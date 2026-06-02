from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import RegisterRequest, UserResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # メール重複チェック
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=409, detail="このメールアドレスはすでに登録されています")
    # ユーザー名重複チェック
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=409, detail="このユーザー名はすでに使われています")

    user = User(
        firebase_uid=req.firebase_uid,
        username=req.username,
        email=req.email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=UserResponse)
def login(db: Session = Depends(get_db)):
    # TODO: #4完了後にFirebase Token検証を追加
    raise HTTPException(status_code=401, detail="認証機能実装後に有効化されます")
