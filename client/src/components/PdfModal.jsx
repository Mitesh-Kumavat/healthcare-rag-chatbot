import { useEffect } from "react";

function PdfModal({ document, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (document) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
    return () => { window.document.body.style.overflow = "auto"; };
  }, [document]);

  if (!document) return null;

  const firstPage =
    document.pages && document.pages.length > 0 ? document.pages[0] : null;
  const urlWithPage = firstPage
    ? `${document.url}#page=${firstPage}`
    : document.url;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2 overflow-hidden">
            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
              {document.filename}
            </span>
            {firstPage && (
              <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                Page {firstPage}
              </span>
            )}
          </div>
          <button 
            type="button" 
            className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors" 
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Iframe */}
        <div className="flex-1 w-full bg-gray-100 dark:bg-black">
          <iframe
            title={document.filename}
            src={urlWithPage}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}

export default PdfModal;