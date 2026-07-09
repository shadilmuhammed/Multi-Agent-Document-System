import chromadb
from datetime import datetime
from uuid import uuid4
from sentence_transformers import SentenceTransformer

# ChromaDB client
client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="documents"
)

# Load embedding model once
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def store_embeddings(
    filename,
    chunks,
    embeddings,
    user_id,
    document_id
):
    """
    Store document chunks with embeddings and metadata.
    """

    timestamp = datetime.utcnow().isoformat()

    ids = []
    metadatas = []

    for i in range(len(chunks)):
        ids.append(str(uuid4()))

        metadatas.append({
    "filename": filename,
    "chunk": i,
    "uploaded_at": timestamp,
    "user_id": user_id,
    "document_id": document_id
})

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

def delete_document(document_id):
    collection.delete(
        where={
            "document_id": document_id
        }
    )


def search_documents(
    query,
    user_id,
    document_id
):
    query_embedding = get_model().encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        where={
            "$and": [
                {
                    "user_id": user_id
                },
                {
                    "document_id": document_id
                }
            ]
        },
        n_results=3
    )

    return results["documents"][0]