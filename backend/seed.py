import uuid
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import User, Recipe
from datetime import datetime

# テストユーザーと firebase_uid
TEST_USERS = [
    {
        "firebase_uid": "ugLC4eSemJYMnFHk1FbeQp5IcJG2",
        "username": "test_user_1",
        "email": "test-user-1@example.com",
        "avatar_url": None,
    },
    {
        "firebase_uid": "test-user-2-uid-dummy",
        "username": "test_user_2",
        "email": "test-user-2@example.com",
        "avatar_url": None,
    },
]

# テストレシピ
TEST_RECIPES = [
    {
        "title": "親子丼",
        "ingredients": "鶏もも肉 200g\n卵 2個\n玉ねぎ 1/2個\nだし汁 200ml\n醤油 大さじ1\n砂糖 小さじ1",
        "instructions": "1. 玉ねぎを薄切りにする\n2. 鶏肉を一口大に切る\n3. だし汁で鶏肉と玉ねぎを煮る\n4. 味付けをして、溶いた卵でとじる\n5. ご飯の上に乗せて完成",
        "image_url": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=400",
        "user_index": 0,
    },
    {
        "title": "カレーライス",
        "ingredients": "鶏肉 300g\n玉ねぎ 2個\n人参 1本\nじゃがいも 3個\nカレールー 1箱\n水 800ml\n油 大さじ1",
        "instructions": "1. 野菜を切る\n2. 鶏肉を炒める\n3. 野菜を加えて炒める\n4. 水を加えて煮込む\n5. カレールーを加えて煮詰める\n6. ご飯に乗せる",
        "image_url": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=400",
        "user_index": 0,
    },
    {
        "title": "味噌汁",
        "ingredients": "だし汁 600ml\n味噌 大さじ3\n豆腐 150g\n玉ねぎ 1/2個\n青ねぎ 少々",
        "instructions": "1. だし汁を沸かす\n2. 豆腐と玉ねぎを入れる\n3. 味噌を溶く\n4. 青ねぎを散らす",
         "image_url": "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400",
        "user_index": 1,
    },
    {
        "title": "パスタ",
        "ingredients": "パスタ 200g\nトマト缶 1個\nニンニク 2片\nオリーブオイル 大さじ2\n塩 少々\nこしょう 少々",
        "instructions": "1. パスタを茹でる\n2. ニンニクをみじん切りにする\n3. オリーブオイルでニンニクを炒める\n4. トマト缶を加えて煮詰める\n5. パスタを加えて混ぜる",
        "image_url": "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=400",
        "user_index": 1,
    },
    {
        "title": "天ぷら",
        "ingredients": "小麦粉 100g\n卵 1個\n水 150ml\n海老 5尾\nなす 1本\nしいたけ 3個\n揚げ油 適量\n塩 少々",
        "instructions": "1. 衣を作る（小麦粉、卵、水を混ぜる）\n2. 油を180℃に温める\n3. 具材に衣をつける\n4. 油で揚げる\n5. 塩をふって完成",
        "image_url": "https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=400",
        "user_index": 0,
    },
]


def seed_database():
    db: Session = SessionLocal()
    try:
        # 既存データを削除（開発環境専用）
        db.query(Recipe).delete()
        db.query(User).delete()
        
        # ユーザーを作成
        users = []
        for user_data in TEST_USERS:
            user = User(
                id=uuid.uuid4(),
                firebase_uid=user_data["firebase_uid"],
                username=user_data["username"],
                email=user_data["email"],
                avatar_url=user_data["avatar_url"],
                role="user",
            )
            db.add(user)
            users.append(user)
        
        db.commit()
        
        # レシピを作成
        for recipe_data in TEST_RECIPES:
            recipe = Recipe(
                id=uuid.uuid4(),
                title=recipe_data["title"],
                ingredients=recipe_data["ingredients"],
                instructions=recipe_data["instructions"],
                image_url=recipe_data["image_url"],
                user_id=users[recipe_data["user_index"]].id,
            )
            db.add(recipe)
        
        db.commit()
        print("✅ Seed data created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating seed data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()