import httpx
from ..core.config import settings

HF_WHISPER_MODEL = "openai/whisper-base"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_WHISPER_MODEL}"
OCR_SPACE_URL = "https://api.ocr.space/parse/image"


async def transcribe_audio(audio_bytes: bytes) -> str:
    """Sends audio bytes to the Hugging Face Inference API (Whisper) and returns the transcript."""
    headers = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(HF_API_URL, headers=headers, content=audio_bytes)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and "text" in data:
            return data["text"].strip()
        return ""


async def extract_text_from_image(image_bytes: bytes) -> str:
    """Sends image bytes to OCR.space and returns extracted text."""
    headers = {"apikey": settings.OCR_SPACE_API_KEY}
    files = {"file": ("image.jpg", image_bytes)}
    data = {"language": "eng", "isOverlayRequired": "false"}
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OCR_SPACE_URL, headers=headers, files=files, data=data)
        response.raise_for_status()
        result = response.json()
        parsed_results = result.get("ParsedResults") or []
        if parsed_results:
            return (parsed_results[0].get("ParsedText") or "").strip()
        return ""