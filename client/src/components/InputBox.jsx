import { forwardRef, useState } from "react";

const InputBox = forwardRef(function InputBox(
  { onSend, disabled, value: externalValue, setValue: setExternalValue },
  ref
) {
  const[internalValue, setInternalValue] = useState("");
  const value = externalValue ?? internalValue;
  const setValue = setExternalValue ?? setInternalValue;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <form 
        onSubmit={handleSubmit}
        className="flex items-end bg-gray-100 dark:bg-gray-800 border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 focus-within:ring-4 focus-within:ring-gray-100 dark:focus-within:ring-gray-800/50 rounded-3xl transition-all duration-200 p-2 shadow-sm"
      >
        <textarea
          className="flex-1 max-h-48 min-h-[44px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none resize-none px-4 py-2.5 text-[15px] leading-relaxed"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Healthcare Chatbot..."
          disabled={disabled}
          ref={ref}
        />
        <button 
          className="mb-0.5 mr-0.5 p-2 rounded-full bg-black text-white dark:bg-white dark:text-black disabled:opacity-30 hover:opacity-80 transition-opacity flex items-center justify-center shrink-0" 
          type="submit" 
          disabled={disabled || !value.trim()}
          title="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </button>
      </form>
    </div>
  );
});

export default InputBox;
