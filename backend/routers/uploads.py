from fastapi import APIRouter, Depends, UploadFile, File
from ..core.dependencies import require_role
from ..services.media_processing import transcribe_audio, extract_text_from_image
from pathlib import Path
import shutil
import uuid

router = APIRouter(prefix="/api/submissions", tags=["uploads"])

UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
VOICE_DIR = UPLOADS_DIR / "voice"
PHOTO_DIR = UPLOADS_DIR / "photos"
VOICE_DIR.mkdir(parents=True, exist_ok=True)
PHOTO_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload-voice")
async def upload_voice(file: UploadFile = File(...), current_user: dict = Depends(require_role("citizen"))):
    ext = Path(file.filename).suffix or ".webm"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = VOICE_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with open(file_path, "rb") as f:
        audio_bytes = f.read()

    try:
        transcript = await transcribe_audio(audio_bytes)
    except Exception:
        transcript = ""

    return {"media_url": f"/uploads/voice/{filename}", "transcript": transcript}


@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...), current_user: dict = Depends(require_role("citizen"))):
    ext = Path(file.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = PHOTO_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with open(file_path, "rb") as f:
        image_bytes = f.read()

    try:
        ocr_text = await extract_text_from_image(image_bytes)
    except Exception:
        ocr_text = ""

    return {"media_url": f"/uploads/photos/{filename}", "ocr_text": ocr_text}