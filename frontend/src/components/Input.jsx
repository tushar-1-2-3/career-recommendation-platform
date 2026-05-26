export default function Input({ label, hint, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-slate mb-1.5">{label}</span>
      )}
      <input
        className={`w-full px-3.5 py-2.5 bg-white border border-cream rounded-md text-ink placeholder:text-mist focus:border-slate focus:ring-1 focus:ring-slate outline-none transition ${className}`}
        {...props}
      />
      {hint && <span className="mt-1 block text-xs text-mist">{hint}</span>}
    </label>
  );
}
