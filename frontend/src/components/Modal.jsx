import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    // Store currently focused element for focus restoration
    previousActiveElement.current = document.activeElement;

    // Focus the modal when it opens
    modalRef.current?.focus();

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Trap focus within modal
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      // Restore focus to previously focused element
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-950/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white dark:bg-void-800 rounded-2xl shadow-lg border border-violet-200 dark:border-violet-600/20 overflow-hidden animate-fade-up outline-none"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-100 dark:border-violet-600/15">
          <h2 id="modal-title" className="text-base font-semibold text-text-heading dark:text-mist-100">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted dark:text-mist-500 hover:text-text-body dark:hover:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-700 transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
