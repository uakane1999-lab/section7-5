from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import uuid

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models.models import Recipe, User
from app.schemas.schemas import (
    RecipeResponse,
    RecipeListResponse,
    MyRecipeListResponse,
)
from app.services.cloudinary import upload_image, delete_image

router = APIRouter()


# ── 一覧取得 ──────────────────────────────────
@router.get("/", response_model=RecipeListResponse)
def list_recipes(
    q: Optional[str] = Query(None, description="キーワード検索"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Recipe)

    if q:
        query = query.filter(
            or_(
                Recipe.title.ilike(f"%{q}%"),
                Recipe.ingredients.ilike(f"%{q}%"),
            )
        )

    total = query.count()
    recipes = (
        query.order_by(Recipe.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {"total": total, "page": page, "limit": limit, "recipes": recipes}


# ── 自分のレシピ一覧 ──────────────────────────
@router.get("/my", response_model=MyRecipeListResponse)
async def my_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipes = (
        db.query(Recipe)
        .filter(Recipe.user_id == current_user.id)
        .order_by(Recipe.created_at.desc())
        .all()
    )
    return {"total": len(recipes), "recipes": recipes}


# ── 詳細取得 ──────────────────────────────────
@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: uuid.UUID, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="レシピが見つかりません")
    return recipe


# ── 新規作成 ──────────────────────────────────
@router.post("/", response_model=RecipeResponse, status_code=201)
async def create_recipe(
    title: str = Form(...),
    ingredients: str = Form(...),
    instructions: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_url = None
    if image:
        image_url = await upload_image(image, folder="recipes")

    recipe = Recipe(
        title=title,
        ingredients=ingredients,
        instructions=instructions,
        image_url=image_url,
        user_id=current_user.id,
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


# ── 更新 ──────────────────────────────────────
@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: uuid.UUID,
    title: Optional[str] = Form(None),
    ingredients: Optional[str] = Form(None),
    instructions: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="レシピが見つかりません")

    # 認可チェック：本人のみ編集可
    if recipe.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="編集権限がありません")

    if title is not None:
        recipe.title = title
    if ingredients is not None:
        recipe.ingredients = ingredients
    if instructions is not None:
        recipe.instructions = instructions

    if image:
        if recipe.image_url:
            delete_image(recipe.image_url)
        recipe.image_url = await upload_image(image, folder="recipes")

    db.commit()
    db.refresh(recipe)
    return recipe


# ── 削除 ──────────────────────────────────────
@router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(
    recipe_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="レシピが見つかりません")

    # 認可チェック：本人のみ削除可
    if recipe.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="削除権限がありません")

    if recipe.image_url:
        delete_image(recipe.image_url)

    db.delete(recipe)
    db.commit()