import { useEffect, useRef } from "react";
import Message from "./Message.jsx";

function ChatWindow({ messages, loading, onSourceClick }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Hardcoded greeting from the AI
  const initialGreeting = {
    id: "greeting-msg",
    role: "assistant",
    content: "Hello! I am your healthcare chatbot. I'm here to answer your questions using official hospital documents.\n\nHow can I help you today?"
  };

  return (
    <div className="h-full w-full overflow-y-auto px-4 md:px-0 py-6 scroll-smooth">
      <div className="w-full max-w-3xl mx-auto flex flex-col space-y-6">
        
        {/* 1. Always show the initial AI Greeting */}
        <Message message={initialGreeting} />

        {/* 2. The actual user & AI conversation history */}
        {messages.map((m) => (
          <Message key={m.id} message={m} onSourceClick={onSourceClick} />
        ))}
        
        {/* 3. Loading indicator */}
        {loading && (
          <div className="flex justify-start w-full animate-pulse">
            <div className="flex items-center space-x-2 px-2 py-4">
              <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        {/* Invisible div to scroll into view */}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}

export default ChatWindow;
