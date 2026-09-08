import json

import chromadb
from sentence_transformers import SentenceTransformer

from config import (
    CHROMA_COLLECTION_NAME,
    CHROMA_DB_PATH,
    EMBEDDING_MODEL_NAME
)

# Инициализиране на embedding модела и ChromaDB
model = SentenceTransformer(EMBEDDING_MODEL_NAME)
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = client.get_or_create_collection(
    name=CHROMA_COLLECTION_NAME
)

# Зареждане на сватбената база знания
with open(
    "knowledge_base/wedding_knowledge.json",
    "r",
    encoding="utf-8"
) as file:
    knowledge_base = json.load(file)

# Генериране и записване на embedding векторите
for index, item in enumerate(knowledge_base):
    text = f"{item['question']} {item['answer']}"
    embedding = model.encode(text).tolist()

    collection.add(
        ids=[str(index)],
        embeddings=[embedding],
        documents=[text],
        metadatas=[{
            "category": item["category"],
            "answer": item["answer"]
        }]
    )

print("Embeddings created successfully.")