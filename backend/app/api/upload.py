from fastapi import APIRouter, UploadFile, File, Depends
from pathlib import Path
import shutil

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.document import Document
from app.core.dependencies import get_current_user

from app.services.pdf_service import extract_text
from app.services.chunk_service import chunk_text
from app.services.embedding_service import create_embeddings
from app.services.vector_service import store_embeddings

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    text = extract_text(str(file_path))

    # Chunk text
    chunks = chunk_text(text)

    # Create embeddings
    embeddings = create_embeddings(chunks)

    # Save document to SQLite
    document = Document(
        filename=file.filename,
        user_id=current_user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # Store embeddings in ChromaDB
    store_embeddings(
        filename=file.filename,
        chunks=chunks,
        embeddings=embeddings,
        user_id=current_user.id,
        document_id=document.id
    )

    return {
        "status": "success",
        "filename": file.filename,
        "document_id": document.id,
        "uploaded_by": current_user.email,
        "characters": len(text),
        "chunks_created": len(chunks),
        "embedding_dimension": len(embeddings[0]),
        "message": "Document indexed successfully."
    }