import sys
from pathlib import Path

import uvicorn

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.rag.ingest import ingest_documents
from app.config import get_settings, configure_langsmith


def main():
    configure_langsmith(get_settings())
    count = ingest_documents()
    print(f"Ingested {count} chunks into Pinecone.")


if __name__ == "__main__":
    main()
