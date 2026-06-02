from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid


# ── User ──────────────────────────────────────
class UserResponse(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    avatar_url: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Auth ──────────────────────────────────────
class RegisterRequest(BaseModel):
    firebase_uid: str
    username: str
    email: EmailStr


# ── Recipe ────────────────────────────────────
class RecipeCreate(BaseModel):
    title: str
    ingredients: str
    instructions: str


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    ingredients: Optional[str] = None
    instructions: Optional[str] = None


class RecipeResponse(BaseModel):
    id: uuid.UUID
    title: str
    ingredients: str
    instructions: str
    image_url: Optional[str]
    user_id: uuid.UUID
    user: UserResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RecipeListResponse(BaseModel):
    total: int
    page: int
    limit: int
    recipes: List[RecipeResponse]


class MyRecipeResponse(BaseModel):
    id: uuid.UUID
    title: str
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MyRecipeListResponse(BaseModel):
    total: int
    recipes: List[MyRecipeResponse]