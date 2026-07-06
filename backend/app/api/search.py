from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.services.vector_service import search_documents
from app.services.llm_service import ask_llm
from app.core.dependencies import get_current_user

router = APIRouter(tags=["Search"])


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
def search(
    request: SearchRequest,
    current_user=Depends(get_current_user)
):
    # Retrieve relevant chunks from ChromaDB
    documents = search_documents(request.query)

    # Combine retrieved chunks into a single context
    context = "\n\n".join(documents)

    # Generate answer using Llama 3.2
    answer = ask_llm(
        question=request.query,
        context=context
    )

    return {
        "status": "success",
        "question": request.query,
        "retrieved_chunks": len(documents),
        "answer": answer
    }