from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── User ──────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Auth ──────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ── Recipe ────────────────────────────────────
class RecipeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: List[str]
    steps: List[str]


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[List[str]] = None
    steps: Optional[List[str]] = None


class RecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    ingredients: List[str]
    steps: List[str]
    author_id: int
    author: UserResponse
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
