from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import connect_db, disconnect_db
from app.routes.documents import router as documents_router
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
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok", "message": "EduQuest AI API is running"}


app.include_router(documents_router)
app.include_router(soal_router)
app.include_router(word_router)
