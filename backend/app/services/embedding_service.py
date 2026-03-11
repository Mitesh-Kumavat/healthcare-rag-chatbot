from functools import lru_cache
# Using the updated, modern import so it doesn't throw warnings
from langchain_huggingface import HuggingFaceEmbeddings

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

@lru_cache()
def get_embedding_function():
    """
    Runs the embedding model locally on the CPU.
    Since we installed the CPU-only version of PyTorch, this will only use ~90MB of RAM!
    """
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)