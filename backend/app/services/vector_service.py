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
model = SentenceTransformer("all-MiniLM-L6-v2")


def store_embeddings(filename, chunks, embeddings):
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
            "uploaded_at": timestamp
        })

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )


def search_documents(query):
    """
    Search the vector database using the query.
    """

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    return results["documents"][0]