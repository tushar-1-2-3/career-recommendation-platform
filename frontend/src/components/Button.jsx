export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-paper disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-ink text-paper hover:bg-slate focus:ring-ink',
    accent: 'bg-rust text-paper hover:bg-rustlight focus:ring-rust',
    ghost: 'bg-transparent text-ink border border-cream hover:bg-cream focus:ring-mist',
    subtle: 'bg-cream text-ink hover:bg-cream/80 focus:ring-mist',
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
