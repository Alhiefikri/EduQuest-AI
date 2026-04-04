from datetime import datetime
import json
from typing import List, Optional

from pydantic import BaseModel, Field


class SoalItem(BaseModel):
    nomor: int
    pertanyaan: str
    pilihan: Optional[List[str]] = None
    jawaban: str
    pembahasan: Optional[str] = None
    gambar_prompt: Optional[str] = None


class GenerateSoalRequest(BaseModel):
    modul_id: Optional[str] = None
    mata_pelajaran: str = Field(..., min_length=1, max_length=100)
    topik: Optional[str] = None
    fase: Optional[str] = None
    kelas: Optional[str] = None
    tipe_soal: str = Field(..., pattern="^(pilihan_ganda|isian|essay|campuran)$")
    jumlah_soal: int = Field(..., ge=1, le=100)
    difficulty: str = Field(..., pattern="^(mudah|sedang|sulit|campuran)$")
    gaya_soal: List[str] = Field(default_factory=lambda: ["formal_academic"])
    include_pembahasan: bool = True
    include_kunci: bool = True
    include_gambar: bool = False


class GenerateSoalResponse(BaseModel):
    id: str
    modul_id: Optional[str]
    mata_pelajaran: str
    topik: Optional[str]
    tipe_soal: str
    difficulty: str
    gaya_soal: List[str] = Field(default_factory=list)
    jumlah_soal: int
    include_pembahasan: bool
    include_kunci: bool
    include_gambar: bool
    data_soal: List[SoalItem]
    status: str
    created_at: datetime
    updated_at: datetime

    @classmethod
    def _parse_gaya_soal(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, list):
            return value
        if not value:
            return ["formal_academic"]
        return [value]

    class Config:
        from_attributes = True

    @classmethod
    def from_prisma(cls, soal) -> "GenerateSoalResponse":
        return cls(
            id=soal.id,
            modul_id=soal.modulId,
            mata_pelajaran=soal.mataPelajaran,
            topik=soal.topik,
            tipe_soal=soal.tipeSoal,
            difficulty=soal.difficulty,
            # Handle gaya_soal if it's a string (legacy) or missing
            gaya_soal=cls._parse_gaya_soal(getattr(soal, 'gayaSoal', "formal_academic")),
            jumlah_soal=soal.jumlahSoal,
            include_pembahasan=soal.includePembahasan,
            include_kunci=soal.includeKunci,
            include_gambar=soal.includeGambar,
            data_soal=json.loads(soal.dataSoal),
            status=soal.status,
            created_at=soal.createdAt,
            updated_at=soal.updatedAt,
        )


class SoalListResponse(BaseModel):
    id: str
    modul_id: Optional[str]
    mata_pelajaran: str
    topik: Optional[str]
    tipe_soal: str
    difficulty: str
    gaya_soal: List[str] = Field(default_factory=list)
    jumlah_soal: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @classmethod
    def _parse_gaya_soal(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, list):
            return value
        if not value:
            return ["formal_academic"]
        return [value]

    @classmethod
    def from_prisma(cls, soal) -> "SoalListResponse":
        return cls(
            id=soal.id,
            modul_id=soal.modulId,
            mata_pelajaran=soal.mataPelajaran,
            topik=soal.topik,
            tipe_soal=soal.tipeSoal,
            difficulty=soal.difficulty,
            gaya_soal=cls._parse_gaya_soal(getattr(soal, 'gayaSoal', "formal_academic")),
            jumlah_soal=soal.jumlahSoal,
            status=soal.status,
            created_at=soal.createdAt,
            updated_at=soal.updatedAt,
        )


class UpdateSoalRequest(BaseModel):
    data_soal: Optional[List[SoalItem]] = None
    status: Optional[str] = None
    topik: Optional[str] = None


class RegenerateSingleSoalRequest(BaseModel):
    nomor_soal: int
    gaya_soal: List[str] = Field(default_factory=lambda: ["formal_academic"])
    feedback: Optional[str] = None


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
