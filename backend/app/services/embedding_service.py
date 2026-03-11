from functools import lru_cache
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from app.config import get_settings

settings = get_settings()

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

@lru_cache()
def get_embedding_function():
    """
    Returns a cached HuggingFace API Embeddings instance.
    This runs via the cloud API so it uses ZERO local RAM!
    """
    if not settings.huggingface_api_key:
        raise ValueError("HUGGINGFACE_API_KEY is missing in your environment variables!")
        
    return HuggingFaceInferenceAPIEmbeddings(
        api_key=settings.huggingface_api_key,
        model_name=EMBEDDING_MODEL_NAME
    )