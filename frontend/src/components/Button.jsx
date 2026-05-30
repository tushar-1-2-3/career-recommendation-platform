export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-paper active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-ink text-paper hover:bg-slate hover:shadow-lift focus:ring-ink',
    accent: 'bg-rust text-paper hover:bg-rustlight hover:shadow-lift focus:ring-rust',
    ghost: 'bg-white/60 text-ink border border-cream hover:bg-white hover:shadow-card focus:ring-mist',
    subtle: 'bg-cream text-ink hover:bg-white hover:shadow-card focus:ring-mist',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
