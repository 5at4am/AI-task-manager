/**
 * variant: 'default' | 'success' | 'warning' | 'danger'
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:
      'bg-violet-50 text-violet-600 dark:bg-violet-600/[.18] dark:text-mist-300 dark:border dark:border-violet-600/30',
    success:
      'bg-[#E8FDF3] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#5DCAA5]',
    warning:
      'bg-[#FFF3E0] text-[#854F0B] dark:bg-[#854F0B]/20 dark:text-[#EF9F27]',
    danger:
      'bg-[#FFEEF0] text-[#993556] dark:bg-[#993556]/20 dark:text-[#ED93B1]',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
