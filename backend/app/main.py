from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.search import router as search_router
from app.database.database import engine
from app.models.user import User
from app.database.database import Base
from app.api.auth import router as auth_router

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Multi-Agent AI Document System",
    version="1.0.0"
)

app.include_router(upload_router)
app.include_router(search_router)
app.include_router(auth_router)
@app.get("/")
def home():
    return {
        "message": "Welcome to the Multi-Agent AI Document System!"
    }