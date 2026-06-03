from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://recipe_user:recipe_pass@db:5432/recipe_db"
    ENVIRONMENT: str = "development"

    # Firebase
    FIREBASE_CREDENTIALS_JSON: str = ""
    FIREBASE_PROJECT_ID: str = "teamb-recipe-app"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    class Config:
        env_file = ".env"


settings = Settings()