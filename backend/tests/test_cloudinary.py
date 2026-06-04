import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi import HTTPException
from app.services.cloudinary import upload_image, delete_image


# ── upload_image ──────────────────────────────
class TestUploadImage:
    @pytest.mark.asyncio
    async def test_正常に画像をアップロードできる(self):
        mock_file = MagicMock()
        mock_file.content_type = "image/jpeg"
        mock_file.read = AsyncMock(return_value=b"fake_image_bytes")

        with patch("app.services.cloudinary.cloudinary.uploader.upload") as mock_upload:
            mock_upload.return_value = {"secure_url": "https://res.cloudinary.com/test/image.jpg"}
            result = await upload_image(mock_file, folder="recipes")
            assert result == "https://res.cloudinary.com/test/image.jpg"
            mock_upload.assert_called_once()

    @pytest.mark.asyncio
    async def test_PNG画像をアップロードできる(self):
        mock_file = MagicMock()
        mock_file.content_type = "image/png"
        mock_file.read = AsyncMock(return_value=b"fake_image_bytes")

        with patch("app.services.cloudinary.cloudinary.uploader.upload") as mock_upload:
            mock_upload.return_value = {"secure_url": "https://res.cloudinary.com/test/image.png"}
            result = await upload_image(mock_file, folder="recipes")
            assert result == "https://res.cloudinary.com/test/image.png"

    @pytest.mark.asyncio
    async def test_非対応のファイル形式は400になる(self):
        mock_file = MagicMock()
        mock_file.content_type = "application/pdf"

        with pytest.raises(HTTPException) as exc_info:
            await upload_image(mock_file)
        assert exc_info.value.status_code == 400
        assert "JPEG・PNG・WebP" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_5MB超のファイルは400になる(self):
        mock_file = MagicMock()
        mock_file.content_type = "image/jpeg"
        mock_file.read = AsyncMock(return_value=b"x" * (5 * 1024 * 1024 + 1))

        with pytest.raises(HTTPException) as exc_info:
            await upload_image(mock_file)
        assert exc_info.value.status_code == 400
        assert "5MB" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_Cloudinaryのアップロード失敗で500になる(self):
        mock_file = MagicMock()
        mock_file.content_type = "image/jpeg"
        mock_file.read = AsyncMock(return_value=b"fake_image_bytes")

        with patch("app.services.cloudinary.cloudinary.uploader.upload", side_effect=Exception("Upload failed")):
            with pytest.raises(HTTPException) as exc_info:
                await upload_image(mock_file)
            assert exc_info.value.status_code == 500
            assert "アップロードに失敗" in exc_info.value.detail


# ── delete_image ──────────────────────────────
class TestDeleteImage:
    def test_正常に画像を削除できる(self):
        image_url = "https://res.cloudinary.com/test/image/upload/v123/recipes/abcdef.jpg"

        with patch("app.services.cloudinary.cloudinary.uploader.destroy") as mock_destroy:
            delete_image(image_url)
            mock_destroy.assert_called_once_with("recipes/abcdef")

    def test_不正なURLはwarningログを残して終了する(self):
        with patch("app.services.cloudinary.cloudinary.uploader.destroy") as mock_destroy:
            with patch("app.services.cloudinary.logger") as mock_logger:
                delete_image("https://invalid-url.com/image.jpg")
                mock_logger.warning.assert_called_once()
                mock_destroy.assert_not_called()

    def test_削除失敗はerrorログを残して処理を止めない(self):
        image_url = "https://res.cloudinary.com/test/image/upload/v123/recipes/abcdef.jpg"

        with patch("app.services.cloudinary.cloudinary.uploader.destroy", side_effect=Exception("Delete failed")):
            with patch("app.services.cloudinary.logger") as mock_logger:
                delete_image(image_url)  # 例外が発生しないことを確認
                mock_logger.error.assert_called_once()