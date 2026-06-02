import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.v1.deps import get_current_user, get_admin_user
from app.models.models import Recipe, User
from app.schemas.schemas import RecipeCreate, RecipeUpdate, RecipeResponse

router = APIRouter()


def _parse_recipe(recipe: Recipe) -> dict:
    """DB保存したJSON文字列をリストに変換"""
    recipe.ingredients = json.loads(recipe.ingredients)
    recipe.steps = json.loads(recipe.steps)
    return recipe


@router.get("/", response_model=List[RecipeResponse])
def list_recipes(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    recipes = db.query(Recipe).offset(skip).limit(limit).all()
    return [_parse_recipe(r) for r in recipes]


@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return _parse_recipe(recipe)


@router.post("/", response_model=RecipeResponse, status_code=201)
def create_recipe(
    recipe_in: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = Recipe(
        title=recipe_in.title,
        description=recipe_in.description,
        ingredients=json.dumps(recipe_in.ingredients, ensure_ascii=False),
        steps=json.dumps(recipe_in.steps, ensure_ascii=False),
        author_id=current_user.id,
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return _parse_recipe(recipe)


@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe_in: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    # 自分のレシピ or 管理者のみ編集可
    if recipe.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    if recipe_in.title is not None:
        recipe.title = recipe_in.title
    if recipe_in.description is not None:
        recipe.description = recipe_in.description
    if recipe_in.ingredients is not None:
        recipe.ingredients = json.dumps(recipe_in.ingredients, ensure_ascii=False)
    if recipe_in.steps is not None:
        recipe.steps = json.dumps(recipe_in.steps, ensure_ascii=False)

    db.commit()
    db.refresh(recipe)
    return _parse_recipe(recipe)


@router.delete("/{recipe_id}", status_code=204)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(recipe)
    db.commit()
