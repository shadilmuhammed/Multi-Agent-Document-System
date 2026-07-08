from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.document import Document
from app.core.dependencies import get_current_user
from fastapi import HTTPException
from pathlib import Path

from app.services.vector_service import delete_document
router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.get("/")
def get_documents(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = db.query(Document).filter(
        Document.user_id == current_user.id
    ).all()

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "url": f"http://127.0.0.1:8000/uploads/{document.filename}"
        }
        for document in documents
    ]
@router.delete("/{document_id}")
def delete_user_document(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    # Delete file
    file_path = Path("uploads") / document.filename

    if file_path.exists():
        file_path.unlink()

    # Delete embeddings
    delete_document(document.id)

    # Delete database record
    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully."
    }