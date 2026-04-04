from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DocumentCreate(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    filetype: str = Field(..., pattern="^(pdf|docx)$")
    filesize: int = Field(..., gt=0)
    page_count: int = Field(..., ge=0)
    word_count: int = Field(..., ge=0)
    content: str = Field(..., min_length=1)


class DocumentResponse(BaseModel):
    id: str
    filename: str
    filetype: str
    filesize: int
    page_count: int
    word_count: int
    content: str
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    id: str
    filename: str
    filetype: str
    filesize: int
    page_count: int
    word_count: int
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentDetailResponse(BaseModel):
    id: str
    filename: str
    filetype: str
    filesize: int
    page_count: int
    word_count: int
    content: str
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
