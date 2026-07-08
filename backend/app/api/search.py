from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.services.vector_service import search_documents
from app.services.llm_service import ask_llm
from app.core.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.document import Document
from app.models.chat import Chat

router = APIRouter(tags=["Search"])


class SearchRequest(BaseModel):
    document_id: int
    query: str


@router.post("/search")
def search(
    request: SearchRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Check that the document belongs to the logged-in user
    document = db.query(Document).filter(
        Document.id == request.document_id,
        Document.user_id == current_user.id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    # Search only inside this document
    documents = search_documents(
        request.query,
        current_user.id,
        request.document_id
    )

    context = "\n\n".join(documents)

    answer = ask_llm(
        question=request.query,
        context=context
    )

    # Save chat history
    chat = Chat(
        user_id=current_user.id,
        document_id=request.document_id,
        question=request.query,
        answer=answer
    )

    db.add(chat)
    db.commit()

    return {
    "status": "success",
    "question": request.query,
    "retrieved_chunks": len(documents),
    "answer": answer,
    "sources": documents
}