import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Bot, User } from "lucide-react";

function Message({ message, onSourceClick }) {
  const isUser = message.role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      
      {isUser ? (
        // User Message Styling
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3 rounded-3xl text-[15px] shadow-sm">
            {message.content}
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center shrink-0 mb-0.5">
            <User className="w-4 h-4" />
          </div>
        </div>
      ) : (
        // Assistant Message Styling
        <div className="w-full max-w-[100%] sm:max-w-[85%] px-2">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sources
              </span>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((src, idx) => {
                  const pages = src.pages ?? [];
                  const pageLabel =
                    pages.length === 1
                      ? `Pg ${pages[0]}`
                      : `Pgs ${pages.join(", ")}`;
                  return (
                    <button
                      key={`${src.document}-${idx}`}
                      type="button"
                      onClick={() => onSourceClick?.({ filename: src.document, pages })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {src.document}{" "}
                      <span className="text-gray-400 dark:text-gray-500 border-l border-gray-300 dark:border-gray-600 pl-1.5 ml-0.5">
                        {pageLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Message;
