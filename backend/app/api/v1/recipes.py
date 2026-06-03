from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models.models import Recipe, User
from app.schemas.schemas import RecipeResponse, RecipeListResponse
from app.core.cloudinary import upload_image

router = APIRouter(tags=["recipes"])


@router.get("", response_model=RecipeListResponse)
def list_recipes(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """レシピ一覧取得（未認証でも可）"""
    total = db.query(Recipe).count()
    recipes = db.query(Recipe).offset(skip).limit(limit).all()
    recipe_responses = []
    for recipe in recipes:
        recipe_responses.append({
            "id": recipe.id,
            "title": recipe.title,
            "ingredients": recipe.ingredients,
            "instructions": recipe.instructions,
            "image_url": recipe.image_url,
            "user": {
                "id": recipe.user.id,
                "username": recipe.user.username,
                "avatar_url": recipe.user.avatar_url,
            },
            "created_at": recipe.created_at,
            "updated_at": recipe.updated_at,
        })
    return {
        "total": total,
        "page": skip // limit + 1,
        "limit": limit,
        "recipes": recipe_responses,
    }


@router.get("/my", response_model=RecipeListResponse)
def get_my_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """自分のレシピ一覧取得（認証必須）"""
    recipes = db.query(Recipe).filter(Recipe.user_id == current_user.id).all()
    total = len(recipes)
    recipe_responses = []
    for recipe in recipes:
        recipe_responses.append({
            "id": recipe.id,
            "title": recipe.title,
            "ingredients": recipe.ingredients,
            "instructions": recipe.instructions,
            "image_url": recipe.image_url,
            "user": {
                "id": recipe.user.id,
                "username": recipe.user.username,
                "avatar_url": recipe.user.avatar_url,
            },
            "created_at": recipe.created_at,
            "updated_at": recipe.updated_at,
        })
    return {
        "total": total,
        "page": 1,
        "limit": total,
        "recipes": recipe_responses,
    }


@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: UUID, db: Session = Depends(get_db)):
    """レシピ詳細取得（未認証でも可）"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return {
        "id": recipe.id,
        "title": recipe.title,
        "ingredients": recipe.ingredients,
        "instructions": recipe.instructions,
        "image_url": recipe.image_url,
        "user": {
            "id": recipe.user.id,
            "username": recipe.user.username,
            "avatar_url": recipe.user.avatar_url,
        },
        "created_at": recipe.created_at,
        "updated_at": recipe.updated_at,
    }


@router.post("", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    title: str = Form(...),
    ingredients: str = Form(...),
    instructions: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """レシピ新規投稿（認証必須）"""
    image_url = None
    if image:
        file_bytes = await image.read()
        image_url = upload_image(file_bytes)

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
    return {
        "id": recipe.id,
        "title": recipe.title,
        "ingredients": recipe.ingredients,
        "instructions": recipe.instructions,
        "image_url": recipe.image_url,
        "user": {
            "id": recipe.user.id,
            "username": recipe.user.username,
            "avatar_url": recipe.user.avatar_url,
        },
        "created_at": recipe.created_at,
        "updated_at": recipe.updated_at,
    }


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: UUID,
    title: Optional[str] = Form(None),
    ingredients: Optional[str] = Form(None),
    instructions: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """レシピ更新（本人のみ）"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    if recipe.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if title is not None:
        recipe.title = title
    if ingredients is not None:
        recipe.ingredients = ingredients
    if instructions is not None:
        recipe.instructions = instructions
    if image:
        file_bytes = await image.read()
        recipe.image_url = upload_image(file_bytes)

    db.commit()
    db.refresh(recipe)
    return {
        "id": recipe.id,
        "title": recipe.title,
        "ingredients": recipe.ingredients,
        "instructions": recipe.instructions,
        "image_url": recipe.image_url,
        "user": {
            "id": recipe.user.id,
            "username": recipe.user.username,
            "avatar_url": recipe.user.avatar_url,
        },
        "created_at": recipe.created_at,
        "updated_at": recipe.updated_at,
    }


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """レシピ削除（本人のみ）"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    if recipe.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(recipe)
    db.commit()