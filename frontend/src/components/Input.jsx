import './Input.css';

export default function Input({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input id={inputId} className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}
