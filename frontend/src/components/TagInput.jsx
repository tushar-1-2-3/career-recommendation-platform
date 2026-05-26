import { useState } from 'react';

export default function TagInput({ label, tags = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim();
    if (!val || tags.includes(val)) return;
    onChange([...tags, val]);
    setInput('');
  };

  return (
    <div>
      {label && <span className="block text-sm font-medium text-slate mb-1.5">{label}</span>}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-cream text-sm text-ink rounded"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="text-mist hover:text-rust"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 bg-white border border-cream rounded-md text-ink focus:border-slate outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 text-sm font-medium bg-cream rounded-md hover:bg-cream/70"
        >
          Add
        </button>
      </div>
    </div>
  );
}
