from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

from app.config import get_ai_settings_response, save_ai_settings
from app.services.ai_service import test_ai_connection

router = APIRouter(prefix="/api/v1/settings", tags=["settings"])


class AISettingsRequest(BaseModel):
    provider: str = Field(..., pattern="^(gemini|groq)$")
    gemini_api_key: str = ""
    groq_api_key: str = ""


class TestConnectionRequest(BaseModel):
    provider: str = Field(..., pattern="^(gemini|groq)$")
    api_key: str


@router.get("/ai")
async def get_ai_settings():
    return get_ai_settings_response()


@router.post("/ai")
async def update_ai_settings(request: AISettingsRequest):
    try:
        settings = save_ai_settings(
            provider=request.provider,
            gemini_api_key=request.gemini_api_key,
            groq_api_key=request.groq_api_key,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan pengaturan AI: {str(e)}")

    return {
        "message": "Pengaturan AI berhasil disimpan",
        "provider": settings.get("provider"),
    }


@router.post("/ai/test")
async def test_ai_connection_endpoint(request: TestConnectionRequest):
    try:
        result = test_ai_connection(request.provider, request.api_key)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menguji koneksi: {str(e)}")

    return {"message": result}
