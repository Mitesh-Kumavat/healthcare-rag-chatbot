from typing import List, Dict, Any

from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

from app.config import get_settings
from app.services.embedding_service import get_embedding_function


settings = get_settings()


def get_pinecone_client() -> Pinecone:
    return Pinecone(api_key=settings.pinecone_api_key)


def get_vector_store() -> PineconeVectorStore:
    """
    Returns a LangChain PineconeVectorStore instance for the configured index.
    Assumes the index has already been created in Pinecone dashboard.
    """
    embedding = get_embedding_function()
    return PineconeVectorStore(
        index_name=settings.pinecone_index_name,
        embedding=embedding,
        text_key="text",
        pinecone_api_key=settings.pinecone_api_key,
    )


def similarity_search_with_score(
    query: str, k: int = 5
) -> List[tuple]:
    """
    Wrapper for similarity search returning documents and scores.
    """
    vector_store = get_vector_store()
    return vector_store.similarity_search_with_score(query, k=k)


def add_documents(documents: List[Any]) -> List[str]:
    """
    Add LangChain Document objects to Pinecone.
    """
    vector_store = get_vector_store()
    return vector_store.add_documents(documents)


def clear_index() -> None:
    """
    Delete all vectors from the configured Pinecone index.
    """
    client = get_pinecone_client()
    index = client.Index(settings.pinecone_index_name)
    index.delete(delete_all=True)
