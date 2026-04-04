import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from fastapi.staticfiles import StaticFiles  # type: ignore

from app.database.connection import connect_db, disconnect_db  # type: ignore
from app.routes.documents import router as documents_router  # type: ignore
from app.routes.settings import router as settings_router  # type: ignore
from app.routes.soal import router as soal_router  # type: ignore
from app.routes.word import router as word_router  # type: ignore


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()


# Setup directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

# Ensure uploads directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app = FastAPI(title="EduQuest AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
async def root():
    return {"status": "ok", "message": "EduQuest AI API is running"}


app.include_router(documents_router)
app.include_router(soal_router)
app.include_router(word_router)
app.include_router(settings_router)
