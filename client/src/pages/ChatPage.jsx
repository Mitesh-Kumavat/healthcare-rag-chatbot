import { useEffect, useRef, useState } from "react";
import ChatWindow from "./../components/ChatWindow.jsx";
import InputBox from "./../components/InputBox.jsx";
import PdfModal from "./../components/PdfModal.jsx";
import { sendChatMessage, fetchDocuments, fetchHistory } from "../services/api.js";

const SESSION_STORAGE_KEY = "hospital_rag_session_id";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const SAMPLE_QUESTIONS =[
  "What are the common symptoms of asthma?",
  "How is diabetes managed in daily life?",
  "What are the current guidelines for COVID-19 care?",
  "When should I seek help for a fever?",
];

function ChatPage() {
  const[sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const inputRef = useRef(null);

  // --- DARK MODE THEME LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("theme");
      if (saved) return saved === "dark";
      // Fallback to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  // -----------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error("Failed to load documents", err);
      }

      const existingSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (existingSessionId) {
        setSessionId(existingSessionId);
        try {
          const history = await fetchHistory(existingSessionId);
          const mappedMessages = history.map((m, idx) => ({
            id: `history-${idx}`,
            role: m.role,
            content: m.content,
            sources: m.sources,
          }));
          setMessages(mappedMessages);
        } catch (err) {
          console.error("Failed to load chat history", err);
        }
      }
    };

    loadInitialData();
  },[]);

  const handleSend = async (question) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) =>[...prev, userMessage]);
    setLoading(true);
    try {
      const result = await sendChatMessage({ sessionId, question: trimmed });
      if (!sessionId && result.session_id) {
        setSessionId(result.session_id);
        window.localStorage.setItem(SESSION_STORAGE_KEY, result.session_id);
      }
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.answer,
        sources: result.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content: "There was an error contacting the server.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const toFullUrl = (path) =>
    path?.startsWith("http")
      ? path
      : `${API_BASE.replace(/\/$/, "")}${path?.startsWith("/") ? "" : "/"}${path || ""}`;

  const openDocument = (doc) => {
    if (!doc) return;
    setSelectedDoc({
      ...doc,
      url: toFullUrl(doc.url),
    });
  };

  const handleSourceClick = ({ filename, pages }) => {
    const doc = documents.find((d) => d.filename === filename);
    if (!doc) return;
    openDocument({
      filename,
      url: doc.url,
      pages,
    });
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-gray-50 dark:bg-[#171717] border-r border-gray-200 dark:border-gray-800 transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Knowledge Base</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Reference documents for the healthcare chatbot.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {documents.map((doc) => (
            <button
              key={doc.filename}
              type="button"
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              onClick={() => openDocument({ filename: doc.filename, url: doc.url, pages:[] })}
            >
              <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{doc.filename}</span>
            </button>
          ))}
          {documents.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 italic">
              No documents found.
            </p>
          )}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full">
        
        {/* Top Header & Theme Toggle */}
        <header className="flex shrink-0 items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 transition-colors">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-tight">
            Healthcare Chatbot
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              // Sun icon for Dark Mode
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon icon for Light Mode
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

        {/* Chat Window Container (Now always visible) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatWindow
            messages={messages}
            loading={loading}
            onSourceClick={handleSourceClick}
          />
        </div>

        {/* Fixed Input Box at Bottom */}
        <div className="shrink-0 p-4 w-full bg-white dark:bg-gray-900 transition-colors">
          {messages.length === 0 && (
            <div className="w-full max-w-3xl mx-auto mb-3 flex flex-wrap gap-2 justify-center">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="px-3 py-2 text-xs sm:text-sm text-left bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
                  onClick={() => handleSampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <InputBox
            onSend={handleSend}
            disabled={loading}
            value={inputValue}
            setValue={setInputValue}
            ref={inputRef}
          />
          <p className="text-center text-xs text-gray-400 mt-3 pb-2">
            AI can make mistakes. Check important information using the provided document sources.
          </p>
        </div>
      </main>

      <PdfModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}

export default ChatPage;
