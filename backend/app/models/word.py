from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TemplateUploadResponse(BaseModel):
    id: str
    nama: str
    file_path: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True

    @classmethod
    def from_prisma(cls, template) -> "TemplateUploadResponse":
        return cls(
            id=template.id,
            nama=template.nama,
            file_path=template.filePath,
            is_default=template.isDefault,
            created_at=template.createdAt,
        )


class TemplateListResponse(BaseModel):
    id: str
    nama: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True

    @classmethod
    def from_prisma(cls, template) -> "TemplateListResponse":
        return cls(
            id=template.id,
            nama=template.nama,
            is_default=template.isDefault,
            created_at=template.createdAt,
        )


class GenerateWordRequest(BaseModel):
    soal_id: str = Field(..., min_length=1)
    template_id: Optional[str] = None
    judul_ujian: Optional[str] = None
    nama_siswa: Optional[str] = None
    kelas: Optional[str] = None
    tanggal: Optional[str] = None
    sertakan_kunci_terpisah: bool = False


class GenerateWordResponse(BaseModel):
    file_path: str
    file_name: str
    message: str


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
