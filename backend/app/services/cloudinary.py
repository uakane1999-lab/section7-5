import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile
from app.core.config import settings

# Cloudinary初期化
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def upload_image(file: UploadFile, folder: str = "recipes") -> str:
    """
    画像をCloudinaryにアップロードしてURLを返す
    """
    # ファイル形式チェック
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="画像はJPEG・PNG・WebP形式のみアップロードできます"
        )

    # ファイルサイズチェック
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="画像サイズは5MB以下にしてください"
        )

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="image",
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"画像のアップロードに失敗しました: {str(e)}"
        )


def delete_image(image_url: str) -> None:
    """
    CloudinaryからURLの画像を削除する
    レシピ削除・画像差し替え時に呼び出す
    """
    try:
        # URLからpublic_idを抽出
        # 例: https://res.cloudinary.com/xxx/image/upload/v123/recipes/abcdef.jpg
        #     → recipes/abcdef
        parts = image_url.split("/upload/")
        if len(parts) < 2:
            return
        public_id_with_ext = parts[1].split("/", 1)[-1]  # バージョン番号を除去
        public_id = public_id_with_ext.rsplit(".", 1)[0]  # 拡張子を除去
        cloudinary.uploader.destroy(public_id)
    except Exception:
        # 画像削除失敗はログだけ残して処理を止めない
        pass