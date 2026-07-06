from fastapi import APIRouter, UploadFile, File, Depends
from pathlib import Path
import shutil

from app.services.chunk_service import chunk_text
from app.services.pdf_service import extract_text
from app.services.embedding_service import create_embeddings
from app.services.vector_service import store_embeddings
from app.core.dependencies import get_current_user

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(str(file_path))
    chunks = chunk_text(text)
    embeddings = create_embeddings(chunks)

    store_embeddings(
        file.filename,
        chunks,
        embeddings
    )

    return {
        "status": "success",
        "filename": file.filename,
        "uploaded_by": current_user.email,
        "characters": len(text),
        "chunks_created": len(chunks),
        "embedding_dimension": len(embeddings[0]),
        "message": "Document indexed successfully."
    }