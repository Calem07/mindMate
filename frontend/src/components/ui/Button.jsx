const variants = {
  primary:
    'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]',
  secondary:
    'bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 text-teal-300',
  ghost: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
