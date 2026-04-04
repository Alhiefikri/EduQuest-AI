from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.connection import connect_db, disconnect_db
from app.routes.documents import router as documents_router
from app.routes.settings import router as settings_router
from app.routes.soal import router as soal_router
from app.routes.word import router as word_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()


app = FastAPI(title="EduQuest AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"status": "ok", "message": "EduQuest AI API is running"}


app.include_router(documents_router)
app.include_router(soal_router)
app.include_router(word_router)
app.include_router(settings_router)
