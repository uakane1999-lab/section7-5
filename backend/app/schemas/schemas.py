from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


# ── User ──────────────────────────────────────
class UserCreate(BaseModel):
    firebase_uid: str
    username: str
    email: EmailStr


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    avatar_url: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Auth ──────────────────────────────────────
class LoginRequest(BaseModel):
    id_token: str


class UserMeResponse(BaseModel):
    id: UUID
    username: str
    email: str
    avatar_url: Optional[str]
    role: str

    class Config:
        from_attributes = True


# ── Recipe ────────────────────────────────────
class RecipeCreate(BaseModel):
    title: str
    ingredients: str
    instructions: str
    image_url: Optional[str] = None


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    ingredients: Optional[str] = None
    instructions: Optional[str] = None
    image_url: Optional[str] = None


class RecipeUserResponse(BaseModel):
    id: UUID
    username: str
    avatar_url: Optional[str]

    class Config:
        from_attributes = True


class RecipeResponse(BaseModel):
    id: UUID
    title: str
    ingredients: str
    instructions: str
    image_url: Optional[str]
    user: RecipeUserResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RecipeListResponse(BaseModel):
    total: int
    page: int
    limit: int
    recipes: list[RecipeResponse]