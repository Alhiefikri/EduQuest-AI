import uuid
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile

from app.config import ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_DIR
from app.services.parser_service import count_words, extract_text_from_docx, extract_text_from_pdf


def validate_file(file: UploadFile) -> None:
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise ValueError(f"Tipe file tidak didukung. Hanya PDF dan DOCX yang diterima. Tipe file: {file.content_type}")


async def save_uploaded_file(file: UploadFile) -> Tuple[Path, bytes]:
    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"Ukuran file melebihi batas maksimum 10MB")

    if len(content) == 0:
        raise ValueError("File kosong")

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
