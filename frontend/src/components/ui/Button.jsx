/**
 * Design-system Button — uses only design-token Tailwind classes.
 * variant: 'primary' | 'ghost' | 'soft'
 * size:    'sm' | 'md' | 'lg' | 'xl'
 * theme:   'light' | 'dark'  (defaults to CSS dark-class context)
 */
export default function UIButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-base',
  };

  const variants = {
    primary:
      'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg ' +
      'shadow-sm hover:shadow-md transition-all duration-[250ms] ' +
      'dark:bg-gradient-to-br dark:from-violet-600 dark:to-violet-400 ' +
      'dark:shadow-[0_0_28px_rgba(124,111,224,.38)] dark:hover:shadow-[0_0_48px_rgba(124,111,224,.50)]',
    ghost:
      'border border-violet-200 text-violet-600 hover:bg-violet-50 rounded-lg font-semibold ' +
      'transition-all duration-[150ms] ' +
      'dark:border-violet-600/30 dark:text-mist-300 dark:hover:border-violet-600/60 dark:hover:bg-transparent',
    soft:
      'bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-lg font-semibold ' +
      'transition-all duration-[150ms] ' +
      'dark:bg-violet-600/15 dark:text-mist-300 dark:hover:bg-violet-600/25',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
