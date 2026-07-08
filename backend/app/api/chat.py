from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.chat import Chat
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["Chat History"]
)


@router.get("/{document_id}")
def get_chat_history(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = db.query(Chat).filter(
        Chat.user_id == current_user.id,
        Chat.document_id == document_id
    ).all()

    return chats