import cloudinary
import cloudinary.uploader
from app.core.config import settings


def init_cloudinary():
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )


def upload_image(file_bytes: bytes, folder: str = "recipes") -> str:
    """画像をCloudinaryにアップロードしてURLを返す"""
    init_cloudinary()
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="image",
    )
    return result["secure_url"]


def delete_image(public_id: str) -> None:
    """CloudinaryからURLを削除する"""
    init_cloudinary()
    cloudinary.uploader.destroy(public_id)