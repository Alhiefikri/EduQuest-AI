import json
from typing import List

from fastapi import APIRouter, HTTPException, Query

from app.database.connection import get_db
from app.models.soal import (
    GenerateSoalRequest,
    GenerateSoalResponse,
    SoalListResponse,
    UpdateSoalRequest,
)
from app.services.ai_service import generate_soal

router = APIRouter(prefix="/api/v1/soal", tags=["soal"])


@router.post("/generate", response_model=GenerateSoalResponse, status_code=201)
async def generate_soal_endpoint(request: GenerateSoalRequest):
    db = await get_db()

    konten_modul = ""
    if request.modul_id:
        modul = await db.modulajar.find_unique(where={"id": request.modul_id})
        if not modul:
            raise HTTPException(status_code=404, detail="Modul ajar tidak ditemukan")
        konten_modul = modul.kontenTeks
        if not request.topik:
            request.topik = modul.judul

    if not konten_modul and not request.topik:
        raise HTTPException(
            status_code=400,
            detail="Harap pilih modul ajar atau isi topik secara manual",
        )

    if not konten_modul:
        konten_modul = f"Mata pelajaran: {request.mata_pelajaran}. Topik: {request.topik}"

    try:
        soal_list = generate_soal(
            jumlah_soal=request.jumlah_soal,
            tipe_soal=request.tipe_soal,
            mata_pelajaran=request.mata_pelajaran,
            difficulty=request.difficulty,
            include_pembahasan=request.include_pembahasan,
            include_gambar=request.include_gambar,
            konten_modul=konten_modul,
            topik=request.topik or "",
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    data_soal_json = json.dumps(soal_list, ensure_ascii=False)

    try:
        soal = await db.soal.create(
            data={
                "modulId": request.modul_id,
                "mataPelajaran": request.mata_pelajaran,
                "topik": request.topik,
                "tipeSoal": request.tipe_soal,
                "difficulty": request.difficulty,
                "jumlahSoal": request.jumlah_soal,
                "includePembahasan": request.include_pembahasan,
                "includeKunci": request.include_kunci,
                "includeGambar": request.include_gambar,
                "dataSoal": data_soal_json,
                "status": "draft",
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menyimpan soal ke basis data: {str(e)}",
        )

    return GenerateSoalResponse.from_prisma(soal)


@router.get("/")
async def list_soal(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: str = Query(None, alias="status"),
):
    db = await get_db()

    where = {}
    if status_filter:
        where["status"] = status_filter

    try:
        soal_list = await db.soal.find_many(
            where=where if where else None,
            skip=skip,
            take=limit,
            order={"createdAt": "desc"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mengambil daftar soal: {str(e)}",
        )

    return [SoalListResponse.from_prisma(soal) for soal in soal_list]


@router.get("/{soal_id}", response_model=GenerateSoalResponse)
async def get_soal(soal_id: str):
    db = await get_db()

    try:
        soal = await db.soal.find_unique(where={"id": soal_id})
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mengambil soal: {str(e)}",
        )

    if not soal:
        raise HTTPException(status_code=404, detail="Soal tidak ditemukan")

    return GenerateSoalResponse.from_prisma(soal)


@router.put("/{soal_id}", response_model=GenerateSoalResponse)
async def update_soal(soal_id: str, request: UpdateSoalRequest):
    db = await get_db()

    try:
        soal = await db.soal.find_unique(where={"id": soal_id})
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mengambil soal: {str(e)}",
        )

    if not soal:
        raise HTTPException(status_code=404, detail="Soal tidak ditemukan")

    update_data = {}
    if request.data_soal is not None:
        update_data["dataSoal"] = json.dumps(
            [item.model_dump() for item in request.data_soal],
            ensure_ascii=False,
        )
    if request.status is not None:
        update_data["status"] = request.status
    if request.topik is not None:
        update_data["topik"] = request.topik

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada data yang diperbarui",
        )

    try:
        updated_soal = await db.soal.update(
            where={"id": soal_id},
            data=update_data,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal memperbarui soal: {str(e)}",
        )

    return GenerateSoalResponse.from_prisma(updated_soal)


@router.delete("/{soal_id}", status_code=204)
async def delete_soal(soal_id: str):
    db = await get_db()

    try:
        soal = await db.soal.find_unique(where={"id": soal_id})
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menghapus soal: {str(e)}",
        )

    if not soal:
        raise HTTPException(status_code=404, detail="Soal tidak ditemukan")

    try:
        await db.soal.delete(where={"id": soal_id})
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menghapus soal dari basis data: {str(e)}",
        )
