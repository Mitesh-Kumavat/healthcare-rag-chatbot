from functools import lru_cache

from langchain_community.embeddings import HuggingFaceEmbeddings


EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache()
def get_embedding_function() -> HuggingFaceEmbeddings:
    """
    Returns a cached HuggingFaceEmbeddings instance.
    Uses a small, fast model suitable for free-tier hosting.
    """
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

