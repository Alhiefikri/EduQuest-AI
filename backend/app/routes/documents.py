import os
import shutil
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.database.connection import get_db
from app.models.document import DocumentCreate, DocumentListResponse, DocumentResponse
from app.services.document_service import extract_document_info, save_uploaded_file, validate_file

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(file: UploadFile = File(...)):
    try:
        validate_file(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        file_path, file_content = await save_uploaded_file(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        doc_info = extract_document_info(file_content, file.content_type)
    except ValueError as e:
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=422, detail=str(e))

    filetype = "pdf" if file.content_type == "application/pdf" else "docx"

    doc_data = DocumentCreate(
        filename=file.filename,
        filetype=filetype,
        filesize=len(file_content),
        page_count=doc_info["page_count"],
        word_count=doc_info["word_count"],
        content=doc_info["content"],
    )

    db = await get_db()

    try:
        document = await db.document.create(
            data={
                "filename": doc_data.filename,
                "filetype": doc_data.filetype,
                "filesize": doc_data.filesize,
                "pageCount": doc_data.page_count,
                "wordCount": doc_data.word_count,
                "content": doc_data.content,
            }
        )
    except Exception as e:
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan dokumen ke database: {str(e)}")

    return DocumentResponse(
        id=document.id,
        filename=document.filename,
        filetype=document.filetype,
        filesize=document.filesize,
        page_count=document.pageCount,
        word_count=document.wordCount,
        content=document.content,
        uploaded_at=document.uploadedAt,
        updated_at=document.updatedAt,
    )


@router.get("/", response_model=List[DocumentListResponse])
async def list_documents():
    db = await get_db()

    try:
        documents = await db.document.find_many(order={"uploadedAt": "desc"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil daftar dokumen: {str(e)}")

    return [
        DocumentListResponse(
            id=doc.id,
            filename=doc.filename,
            filetype=doc.filetype,
            filesize=doc.filesize,
            page_count=doc.pageCount,
            word_count=doc.wordCount,
            uploaded_at=doc.uploadedAt,
            updated_at=doc.updatedAt,
        )
        for doc in documents
    ]


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str):
    db = await get_db()

    try:
        document = await db.document.find_unique(where={"id": doc_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil dokumen: {str(e)}")

    if not document:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan")

    return DocumentResponse(
        id=document.id,
        filename=document.filename,
        filetype=document.filetype,
        filesize=document.filesize,
        page_count=document.pageCount,
        word_count=document.wordCount,
        content=document.content,
        uploaded_at=document.uploadedAt,
        updated_at=document.updatedAt,
    )


@router.delete("/{doc_id}", status_code=204)
async def delete_document(doc_id: str):
    db = await get_db()

    try:
        document = await db.document.find_unique(where={"id": doc_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus dokumen: {str(e)}")

    if not document:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan")

    try:
        await db.document.delete(where={"id": doc_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus dokumen dari database: {str(e)}")
