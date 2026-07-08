from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.dependencies import get_current_user

from app.models.document import Document
from app.models.chat import Chat

router = APIRouter(
    prefix="/stats",
    tags=["Statistics"]
)

@router.get("/")
def get_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = db.query(Document).filter(
        Document.user_id == current_user.id
    ).count()

    chats = db.query(Chat).filter(
        Chat.user_id == current_user.id
    ).count()

    latest = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.id.desc())
        .limit(5)
        .all()
    )

    return {
        "documents": documents,
        "chats": chats,
        "latest": [
            {
                "id": doc.id,
                "filename": doc.filename
            }
            for doc in latest
        ]
    }