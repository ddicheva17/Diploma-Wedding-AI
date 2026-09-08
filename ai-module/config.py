import os

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "wedding_ai_planner"
}

CHROMA_DB_PATH = "chroma_db"
CHROMA_COLLECTION_NAME = "wedding_knowledge"
EMBEDDING_MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
OPENAI_TEXT_MODEL = "gpt-4.1-mini"
OPENAI_IMAGE_MODEL = "gpt-image-1"