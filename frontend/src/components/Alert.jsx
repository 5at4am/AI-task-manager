import './Alert.css';

export default function Alert({ 
  children, 
  variant = 'info', 
  onClose,
  className = '' 
}) {
  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <span className="alert-content">{children}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
