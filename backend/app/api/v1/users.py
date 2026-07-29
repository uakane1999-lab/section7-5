from fastapi import APIRouter, Depends
from app.api.v1.deps import get_current_user
from app.schemas.schemas import UserResponse
from app.models.models import User

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user