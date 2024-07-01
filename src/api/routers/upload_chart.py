from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import io
from utils import scale_down_image, get_feedback
import logging
import os
router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/upload-chart/")
async def upload_chart(file: UploadFile = File(...), aiprompt: str = Form(...)):
    content = await file.read()
    image_stream = io.BytesIO(content)

    try:
        image = Image.open(image_stream)
        if image.format.lower() not in ["png", "jpeg", "gif", "webp"]:
            return JSONResponse(content={"error": "Unsupported image format"}, status_code=400)

        image_size = image_stream.getbuffer().nbytes
        if image_size > 20 * 1024 * 1024:
            return JSONResponse(content={"error": "Image size exceeds 20 MB"}, status_code=400)

        image = scale_down_image(image)

        temp_file_path = "/tmp/temp_image.png"
        image.save(temp_file_path, format="PNG")
    except Exception as e:
        logger.error(f"Failed to process image: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=400)

    feedback = get_feedback(temp_file_path, aiprompt)
    return JSONResponse(content={"feedback": feedback})
