from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import engine, Base
from app.models.user import User
from app.models.document import Document
from app.models.chat import Chat

from app.api.auth import router as auth_router
from app.api.upload import router as upload_router
from app.api.search import router as search_router
from app.api.document import router as document_router
from app.api.chat import router as chat_router
from app.api.stats import router as stats_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-Agent AI Document System",
    version="1.0.0"
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats_router)
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(search_router)
app.include_router(document_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to the Multi-Agent AI Document System!"
    }