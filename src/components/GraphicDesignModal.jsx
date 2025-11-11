import { useEffect } from 'react';

export default function GraphicDesignModal({ design, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#2a3142] border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700 text-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="w-full bg-gray-900">
          <img 
            src={design.image} 
            alt={design.title}
            className="w-full h-auto max-h-[60vh] object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23333" width="800" height="600"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EDesign Preview%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full mb-3">
              {design.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {design.title}
            </h2>
          </div>

          {design.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {design.description}
              </p>
            </div>
          )}

          {design.tools && design.tools.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Tools Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {design.tools.map((tool, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-xs bg-gray-800/50 border border-gray-700 text-gray-300 rounded"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {design.date && (
            <div className="text-sm text-gray-500">
              Created: {design.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
