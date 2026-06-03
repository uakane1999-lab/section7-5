from fastapi import APIRouter
from app.api.v1 import auth, recipes, users

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])  # prefix戻す
api_router.include_router(users.router, prefix="/users", tags=["users"])