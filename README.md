# 🏥 HealthCare RAG Chatbot

An intelligent, Retrieval-Augmented Generation (RAG) chatbot designed to answer Healthcare questions strictly based on internal hospital documentation (PDFs). 

This system ensures **zero hallucinations** by retrieving relevant context from a Pinecone vector database before generating responses using a Large Language Model.

---

## 🏗️ Architecture & Tech Stack

### Backend (Python / FastAPI)
* **Framework:** FastAPI
* **RAG Pipeline:** LangChain 
* **Embeddings:** `sentence-transformers/all-MiniLM-L6-v2` 
* **Vector Database:** Pinecone
* **LLM Provider:** Hugging Face API (`meta-llama/Llama-3.1-8B-Instruct`)
* **Observability & Tracing:** LangSmith
* **Database (Chat History):** SQLite (SQLAlchemy ORM)
* **Document Processing:** PyPDF & RecursiveCharacterTextSplitter

### Frontend (React / Vite)
* **Framework:** React.js (Vite)
* **Package Manager:** NPM
* **Styling:** TailwindCSS (assuming standard Vite setup)

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Prerequisites
* Python 3.11+
* Node.js v18+
* API Keys for **Pinecone** and **Hugging Face** .

### 2️⃣ Backend Setup
Navigate to the root directory where the Python backend is located.

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cpu
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=sqlite:///./local_chat.db

   #PineCone
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=hospital-rag-index

   # Hugging Face
   HUGGINGFACE_API_KEY=your_huggingface_token
   HUGGINGFACEHUB_API_TOKEN=your_huggingface_token  # Required for LangChain
   # Optional: GEMINI_API_KEY=your_gemini_api_key

   # LangSmith Tracing & Monitoring
    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=your_langsmith_api_key
    LANGSMITH_PROJECT=healthcare-rag-chatbot
   ```

4. **Ingest PDFs into Pinecone:**
   Place your hospital PDFs inside the `docs/` folder, then run the ingestion script to chunk and upload them:
   ```bash
   python app/rag/ingest.py
   ```

5. **Start the API Server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *The backend will be available at `http://localhost:8000/`.*

---

### 3️⃣ Frontend Setup
Open a new terminal and navigate to the `client` directory.

1. **Install Node modules:**
   ```bash
   cd client
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file inside the `client` folder:
   ```env
   VITE_BASE_BACKEND_URL=http://localhost:8000
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---


## 🧩 How It Works

1. **Document Ingestion:** Hospital PDFs are loaded, split into 800-character chunks with a 150-character overlap, and converted into mathematical vectors (embeddings) using a lightweight model (`all-MiniLM-L6-v2`). These vectors are stored in Pinecone.
2. **Retrieval:** When a user asks a question, the question is converted into a vector. Pinecone performs a similarity search to find the top 5 most relevant document chunks.
3. **Generation & Conversational Memory:** The retrieved chunks—along with the **last 10 messages of the user's specific session history**—are injected into a Prompt Template. This gives the LLM conversational memory to perfectly answer follow-up questions while generating the final response. 
4. **Safety Mechanisms:** If the user asks non-healthcare questions, or if the answer is not in the retrieved documents, the LLM is instructed to strictly reply with a fallback message, completely preventing AI hallucinations.
5. **Observability**: Every prompt execution, retrieval step, and LLM generation is traced in real-time using LangSmith. This allows developers to monitor token usage, latency, and the exact chunks retrieved for debugging and quality control.
