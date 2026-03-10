from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import chat, history
from app.config import get_settings, configure_langsmith
from app.db.database import Base, engine


settings = get_settings()
configure_langsmith(settings)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)


# Configure CORS for known frontend origins.
allowed_origins = []
if settings.frontend_origin:
    allowed_origins.append(str(settings.frontend_origin))
else:
    # Local development defaults
    allowed_origins.extend(
        [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat.router)
app.include_router(history.router)


DOCS_DIR = Path(__file__).resolve().parents[1].parent / "backend/docs"
DOCS_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static/docs", StaticFiles(directory=str(DOCS_DIR)), name="docs")


@app.get("/docs-list")
def list_docs():
    files = []
    for p in DOCS_DIR.glob("*.pdf"):
        files.append(
            {
                "filename": p.name,
                "url": f"/static/docs/{p.name}",
            }
        )
    return files


@app.get("/health")
def health():
    return {"status": "ok"}
