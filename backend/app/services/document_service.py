import os
import uuid
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile

from app.config import ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_DIR
from app.database.connection import get_db
from app.models.document import DocumentResponse
from app.services.parser_service import count_words, extract_text_from_docx, extract_text_from_pdf


def validate_file(file: UploadFile) -> None:
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise ValueError(f"Unsupported file type. Only PDF and DOCX are accepted. Got: {file.content_type}")

    content_length = file.size
    if content_length and content_length > MAX_FILE_SIZE:
        raise ValueError(f"File size exceeds maximum limit of 10MB")


async def save_uploaded_file(file: UploadFile) -> Tuple[Path, bytes]:
    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"File size exceeds maximum limit of 10MB")

    if len(content) == 0:
        raise ValueError("File is empty")

    file_ext = ".pdf" if file.content_type == "application/pdf" else ".docx"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as f:
        f.write(content)

    return file_path, content


def extract_document_info(file_content: bytes, content_type: str) -> dict:
    if content_type == "application/pdf":
        text, page_count = extract_text_from_pdf(file_content)
    else:
        text, page_count = extract_text_from_docx(file_content)

    word_count = count_words(text)

    return {
        "content": text,
        "page_count": page_count,
        "word_count": word_count,
    }


async def upload_document(file: UploadFile) -> DocumentResponse:
    validate_file(file)

    file_path, file_content = await save_uploaded_file(file)
    filetype = "pdf" if file.content_type == "application/pdf" else "docx"

    try:
        doc_info = extract_document_info(file_content, file.content_type)
    except ValueError as e:
        if file_path.exists():
            os.remove(file_path)
        raise

    db = await get_db()

    try:
        document = await db.document.create(
            data={
                "filename": file.filename,
                "filetype": filetype,
                "filepath": str(file_path),
                "filesize": len(file_content),
                "pageCount": doc_info["page_count"],
                "wordCount": doc_info["word_count"],
                "content": doc_info["content"],
            }
        )
    except Exception as e:
        if file_path.exists():
            os.remove(file_path)
        raise RuntimeError(f"Failed to save document to database: {str(e)}")

    return DocumentResponse.from_prisma(document)


def delete_document_file(filepath: str) -> None:
    file_path = Path(filepath)
    if file_path.exists():
        os.remove(file_path)
