from fastapi import APIRouter, Depends
from app.api.v1.deps import get_current_user, get_admin_user
from app.schemas.schemas import UserResponse
from app.models.models import User
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import List

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),  # 管理者のみ
):
    return db.query(User).all()
