from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://recipe_user:recipe_pass@db:5432/recipe_db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24時間
    ENVIRONMENT: str = "development"
    
    # Firebase
    FIREBASE_KEY_PATH: str = "firebase-key.json"
    FIREBASE_PROJECT_ID: str = "teamb-recipe-app"

    class Config:
        env_file = ".env"


settings = Settings()