import chromadb
from sentence_transformers import SentenceTransformer

from config import (
    CHROMA_COLLECTION_NAME,
    CHROMA_DB_PATH,
    EMBEDDING_MODEL_NAME
)

model = SentenceTransformer(EMBEDDING_MODEL_NAME)
client_chroma = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = client_chroma.get_or_create_collection(
    name=CHROMA_COLLECTION_NAME
)


def search_knowledge(question):
    question_embedding = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    documents = results["documents"][0]
    return "\n".join(documents)