from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Query

from app.database.connection import get_db
from app.models.document import DocumentListResponse, DocumentResponse
from app.services.document_service import delete_document_file, upload_document

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document_endpoint(file: UploadFile = File(...)):
    try:
        return await upload_document(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    db = await get_db()

    try:
        documents = await db.document.find_many(
            skip=skip,
            take=limit,
            order={"uploadedAt": "desc"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil daftar dokumen: {str(e)}")

    return [DocumentListResponse.from_prisma(doc) for doc in documents]


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str):
    db = await get_db()

    try:
        document = await db.document.find_unique(where={"id": doc_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil dokumen: {str(e)}")

    if not document:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan")

    return DocumentResponse.from_prisma(document)


@router.delete("/{doc_id}", status_code=204)
async def delete_document(doc_id: str):
    db = await get_db()

    try:
        document = await db.document.find_unique(where={"id": doc_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus dokumen: {str(e)}")

    if not document:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan")

    delete_document_file(document.filepath)

    try:
        await db.document.delete(where={"id": doc_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus dokumen dari basis data: {str(e)}")
