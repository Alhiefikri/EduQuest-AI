import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
DATABASE_URL = os.getenv("DATABASE_URL", f"file:{BASE_DIR}/data/soal.db")
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
