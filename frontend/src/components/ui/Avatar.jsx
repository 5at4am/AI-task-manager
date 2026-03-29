/**
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Avatar({ initials = '?', size = 'md', src, className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0
        bg-linear-to-br from-violet-600 to-violet-400 text-white
        ${sizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={initials} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
