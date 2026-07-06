from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import shutil
from app.services.chunk_service import chunk_text
from app.services.pdf_service import extract_text
from app.services.embedding_service import create_embeddings
from app.services.vector_service import store_embeddings

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(str(file_path))
    chunks = chunk_text(text)
    embeddings = create_embeddings(chunks)
    store_embeddings(file.filename, chunks, embeddings)
    
    
    return {
    "status": "success",
    "filename": file.filename,
    "characters": len(text),
    "chunks_created": len(chunks),
    "embedding_dimension": len(embeddings[0]),
    "message": "Document indexed successfully."
}