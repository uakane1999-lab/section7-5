import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.models.models import User, Recipe
import uuid
from unittest.mock import patch

# ── テスト用DBセットアップ ────────────────────
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    """各テスト前にDBを初期化・テスト後にクリーンアップ"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user():
    """テスト用ユーザーをDBに作成して返す"""
    db = TestingSessionLocal()
    user = User(
        id=uuid.uuid4(),
        firebase_uid="test_firebase_uid",
        username="testuser",
        email="test@example.com",
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


@pytest.fixture
def test_recipe(test_user):
    """テスト用レシピをDBに作成して返す"""
    db = TestingSessionLocal()
    recipe = Recipe(
        id=uuid.uuid4(),
        title="テスト親子丼",
        ingredients="鶏もも肉 200g\n卵 2個",
        instructions="1. 玉ねぎを切る\n2. 煮る\n3. 卵でとじる",
        user_id=test_user.id,
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    db.close()
    return recipe


# ── GET /recipes/ ────────────────────────────
class TestListRecipes:
    def test_正常にレシピ一覧が取得できる(self, test_recipe):
        response = client.get("/api/v1/recipes/")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["page"] == 1
        assert data["limit"] == 20
        assert len(data["recipes"]) == 1

    def test_レシピが0件の場合(self):
        response = client.get("/api/v1/recipes/")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["recipes"] == []

    def test_キーワード検索でタイトルが絞り込める(self, test_recipe):
        response = client.get("/api/v1/recipes/?q=親子丼")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1

    def test_キーワード検索でヒットしない場合(self, test_recipe):
        response = client.get("/api/v1/recipes/?q=存在しないレシピ")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0

    def test_ページングが機能する(self, test_user):
        # レシピを3件作成
        db = TestingSessionLocal()
        for i in range(3):
            db.add(Recipe(
                id=uuid.uuid4(),
                title=f"レシピ{i}",
                ingredients="材料",
                instructions="手順",
                user_id=test_user.id,
            ))
        db.commit()
        db.close()

        response = client.get("/api/v1/recipes/?page=1&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 3
        assert len(data["recipes"]) == 2


# ── GET /recipes/{id} ────────────────────────
class TestGetRecipe:
    def test_正常にレシピ詳細が取得できる(self, test_recipe):
        response = client.get(f"/api/v1/recipes/{test_recipe.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "テスト親子丼"

    def test_存在しないIDは404になる(self):
        response = client.get(f"/api/v1/recipes/{uuid.uuid4()}")
        assert response.status_code == 404


# ── POST /recipes/ ───────────────────────────
class TestCreateRecipe:
    def test_レシピが作成できる(self, test_user):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass

    def test_未認証の場合は401になる(self):
        # TODO: #4マージ後に実装
        pass

    def test_必須項目が欠けている場合は400になる(self, test_user):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass


# ── PUT /recipes/{id} ────────────────────────
class TestUpdateRecipe:
    def test_本人はレシピを更新できる(self, test_recipe):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass

    def test_他人のレシピは403になる(self, test_recipe):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass

    def test_存在しないIDは404になる(self):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass


# ── DELETE /recipes/{id} ─────────────────────
class TestDeleteRecipe:
    def test_本人はレシピを削除できる(self, test_recipe):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass

    def test_他人のレシピは403になる(self, test_recipe):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass

    def test_存在しないIDは404になる(self):
        # TODO: #4マージ後に認証ヘッダーを追加
        pass

# ── 認証モック用ヘルパー ──────────────────────
def override_get_current_user(user: User):
    from app.api.v1.deps import get_current_user
    from app.main import app
    app.dependency_overrides[get_current_user] = lambda: user


def clear_overrides():
    from app.main import app
    app.dependency_overrides = {get_db: override_get_db}


# ── GET /recipes/my ───────────────────────────
class TestMyRecipes:
    def test_自分のレシピ一覧が取得できる(self, test_recipe, test_user):
        override_get_current_user(test_user)
        response = client.get("/api/v1/recipes/my")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["recipes"][0]["title"] == "テスト親子丼"
        clear_overrides()

    def test_未認証の場合は401になる(self):
        response = client.get("/api/v1/recipes/my")
        assert response.status_code == 401


# ── POST /recipes/ 認証あり ───────────────────
class TestCreateRecipeWithAuth:
    def test_認証済みユーザーが画像なしでレシピを作成できる(self, test_user):
        override_get_current_user(test_user)
        response = client.post(
            "/api/v1/recipes/",
            data={
                "title": "新しいレシピ",
                "ingredients": "材料A\n材料B",
                "instructions": "手順1\n手順2",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "新しいレシピ"
        # user情報はuser.usernameで確認
        assert data["user"]["id"] == str(test_user.id)
        clear_overrides()

    def test_必須項目のingredientsが欠けている場合は422になる(self, test_user):
        override_get_current_user(test_user)
        response = client.post(
            "/api/v1/recipes/",
            data={
                "title": "タイトルだけ",
                # ingredients・instructionsなし
            },
        )
        assert response.status_code == 422
        clear_overrides()

    def test_画像ありでレシピを作成できる(self, test_user):  # ← ここに追加
        override_get_current_user(test_user)

        with patch("app.api.v1.recipes.upload_image", return_value="https://res.cloudinary.com/test/image.jpg"):
            response = client.post(
                "/api/v1/recipes/",
                files={"image": ("test.jpg", b"fake_image", "image/jpeg")},
                data={
                    "title": "画像ありレシピ",
                    "ingredients": "材料",
                    "instructions": "手順",
                },
            )
        assert response.status_code == 201
        assert response.json()["image_url"] == "https://res.cloudinary.com/test/image.jpg"
        clear_overrides()


# ── PUT /recipes/{id} 認証あり ────────────────
class TestUpdateRecipeWithAuth:
    def test_認証済み本人がレシピを更新できる(self, test_recipe, test_user):
        override_get_current_user(test_user)
        response = client.put(
            f"/api/v1/recipes/{test_recipe.id}",
            data={"title": "更新後のタイトル"},
        )
        assert response.status_code == 200
        assert response.json()["title"] == "更新後のタイトル"
        clear_overrides()

    def test_他人のレシピは403になる(self, test_recipe):
        # DBセッション内でユーザーを作成しIDだけ取得
        db = TestingSessionLocal()
        other_user = User(
            id=uuid.uuid4(),
            firebase_uid="other_firebase_uid",
            username="otheruser",
            email="other@example.com",
            role="user",
        )
        db.add(other_user)
        db.commit()
        # セッションを閉じる前にIDを取得
        other_user_id = other_user.id
        db.refresh(other_user)
        
        # モック用にセッションに紐付いた状態で使う
        override_get_current_user(other_user)
        response = client.put(
            f"/api/v1/recipes/{test_recipe.id}",
            data={"title": "不正な更新"},
        )
        db.close()
        assert response.status_code == 403
        clear_overrides()


# ── DELETE /recipes/{id} 認証あり ─────────────
class TestDeleteRecipeWithAuth:
    def test_認証済み本人がレシピを削除できる(self, test_recipe, test_user):
        override_get_current_user(test_user)
        response = client.delete(f"/api/v1/recipes/{test_recipe.id}")
        assert response.status_code == 204

        response = client.get(f"/api/v1/recipes/{test_recipe.id}")
        assert response.status_code == 404
        clear_overrides()

    def test_他人のレシピは403になる(self, test_recipe):
        db = TestingSessionLocal()
        other_user = User(
            id=uuid.uuid4(),
            firebase_uid="other_firebase_uid_2",
            username="otheruser2",
            email="other2@example.com",
            role="user",
        )
        db.add(other_user)
        db.commit()
        db.refresh(other_user)

        override_get_current_user(other_user)
        response = client.delete(f"/api/v1/recipes/{test_recipe.id}")
        db.close()
        assert response.status_code == 403
        clear_overrides()