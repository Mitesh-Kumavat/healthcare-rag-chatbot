## Hospital Document RAG Chatbot

This project is a production-ready Retrieval Augmented Generation (RAG) chatbot for hospital documents, built with FastAPI (backend), React/Vite (frontend), Pinecone, and free LLM APIs (Gemini / HuggingFace).

### Backend (FastAPI)

- **Serve API**:
  - `uvicorn app.main:app --reload --host --port 8000 --log-level info`
- **Environment variables** (in `.env` for local, Render env vars in production):
  - `PINECONE_API_KEY`
  - `PINECONE_INDEX_NAME`
  - `GEMINI_API_KEY`
  - `HUGGINGFACE_API_KEY` 
  - `DATABASE_URL` (e.g. `sqlite:///./chat.db`)
  - `FRONTEND_ORIGIN` (e.g. `http://localhost:5173`)

### Ingestion

1. Place 4–5 Healthcare PDFs into `backend/docs/`.
2. From `backend/`:
   - `python -m venv .venv && .venv\Scripts\activate` (on Windows) or `source .venv/bin/activate` (on Unix)
   - `pip install -r requirements.txt`
   - `python scripts/ingest.py`

This will split PDFs, create embeddings with `sentence-transformers/all-MiniLM-L6-v2`, and upload them to Pinecone with metadata `{source, page}`.

### Frontend (React + Vite)

From `client/`:

- `npm install`
- `npm run dev`

Configure `VITE_API_BASE_URL` in `client/.env` to point to the FastAPI backend (Render URL in production, `http://localhost:8000` in dev).

