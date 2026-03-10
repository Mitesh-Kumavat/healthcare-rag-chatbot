from typing import List, Tuple

from langchain_core.documents import Document

from app.services.pinecone_service import similarity_search_with_score


def retrieve_relevant_documents(
    query: str, k: int = 5
) -> List[Tuple[Document, float]]:
    """
    Retrieve top-k relevant documents with scores from Pinecone.
    """
    return similarity_search_with_score(query=query, k=k)

