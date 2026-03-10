from pathlib import Path
from typing import List

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from app.services.pinecone_service import add_documents, clear_index


DOCS_DIR = Path(__file__).resolve().parents[2] / "docs"


def load_pdfs() -> List[Document]:
    documents: List[Document] = []
    for pdf_path in DOCS_DIR.glob("*.pdf"):
        loader = PyPDFLoader(str(pdf_path))
        pdf_docs = loader.load()
        # Ensure metadata has filename and page number
        for d in pdf_docs:
            d.metadata["source"] = pdf_path.name
            # PyPDFLoader sets "page" metadata as int already
            if "page" not in d.metadata:
                d.metadata["page"] = d.metadata.get("page_number", 0)
        documents.extend(pdf_docs)
    return documents


def split_documents(documents: List[Document]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ".", " ", ""],
    )
    return splitter.split_documents(documents)


def ingest_documents() -> int:
    """
    Load PDFs, split into chunks, and upload to Pinecone.
    Returns number of chunks ingested.
    """
    raw_docs = load_pdfs()
    if not raw_docs:
        raise RuntimeError(f"No PDF documents found in {DOCS_DIR}")

    filtered_docs: List[Document] = []
    for d in raw_docs:
        word_count = len(d.page_content.split())
        if word_count >= 20:
            filtered_docs.append(d)

    if not filtered_docs:
        raise RuntimeError("All pages were empty or below the 20-word threshold.")

    chunks = split_documents(filtered_docs)
    clear_index()
    add_documents(chunks)
    return len(chunks)
