import os
from functools import lru_cache
from pydantic import AnyUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Core
    app_name: str = "Hospital RAG Chatbot"
    environment: str = os.getenv("ENVIRONMENT", "development")

    # API
    backend_host: str = "0.0.0.0"
    backend_port: int = int(os.getenv("PORT", "8000"))

    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./local_chat.db")

    # Pinecone
    pinecone_api_key: str = os.getenv("PINECONE_API_KEY", "")
    pinecone_index_name: str = os.getenv("PINECONE_INDEX_NAME", "hospital-rag-index")

    # LLM providers
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    huggingface_api_key: str | None = os.getenv("HUGGINGFACE_API_KEY")

    # CORS / Frontend
    frontend_origin: AnyUrl | None = None

    # LangSmith / LangChain tracing
    langsmith_tracing: bool = False
    langsmith_endpoint: str | None = None
    langsmith_api_key: str | None = None
    langsmith_project: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()


def configure_langsmith(settings: Settings) -> None:
    """
    Map LangSmith settings to LangChain tracing env vars.
    """
    if not settings.langsmith_tracing:
        return
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    if settings.langsmith_endpoint:
        os.environ["LANGCHAIN_ENDPOINT"] = settings.langsmith_endpoint
    if settings.langsmith_api_key:
        os.environ["LANGCHAIN_API_KEY"] = settings.langsmith_api_key
    if settings.langsmith_project:
        os.environ["LANGCHAIN_PROJECT"] = settings.langsmith_project
