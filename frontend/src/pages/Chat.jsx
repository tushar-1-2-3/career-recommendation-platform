import { useEffect, useRef, useState } from 'react';
import { aiApi } from '../api/client';
import { chatStorage } from '../lib/storage';
import Button from '../components/Button';

const STARTERS = [
  'Which career fits me best?',
  'How do I become a data scientist?',
  'What should I learn in the next 3 months?',
];

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function MarkdownMessage({ content }) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').filter(Boolean);
        const firstLine = lines[0]?.trim() || '';

        if (/^#{1,4}\s+/.test(firstLine)) {
          const text = firstLine.replace(/^#{1,4}\s+/, '');
          return (
            <div key={blockIndex}>
              <h3 className="font-display text-base font-semibold mb-2">{renderInline(text)}</h3>
              {lines.slice(1).map((line, lineIndex) => (
                <p key={lineIndex} className="leading-relaxed">{renderInline(line.trim())}</p>
              ))}
            </div>
          );
        }

        if (lines.every((line) => /^\s*\|.*\|\s*$/.test(line)) && lines.length >= 2) {
          const rows = lines.filter((line) => !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line));
          return (
            <div key={blockIndex} className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-xs">
                <tbody>
                  {rows.map((row, rowIndex) => {
                    const cells = row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
                    const Cell = rowIndex === 0 ? 'th' : 'td';
                    return (
                      <tr key={rowIndex}>
                        {cells.map((cell, cellIndex) => (
                          <Cell key={cellIndex} className="border border-slate/20 px-2 py-1 align-top">
                            {renderInline(cell)}
                          </Cell>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={blockIndex} className="list-disc pl-5 space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
          return (
            <ol key={blockIndex} className="list-decimal pl-5 space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => /^-{3,}$/.test(line.trim()))) {
          return <hr key={blockIndex} className="border-slate/20" />;
        }

        return (
          <div key={blockIndex} className="space-y-1">
            {lines.map((line, lineIndex) => (
              <p key={lineIndex} className="leading-relaxed">{renderInline(line.trim())}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages(chatStorage.get());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    chatStorage.add('user', msg);
    setLoading(true);
    try {
      const { reply } = await aiApi.chat(msg);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      chatStorage.add('assistant', reply);
    } catch (err) {
      const errMsg = `Sorry — ${err.message}`;
      setMessages((m) => [...m, { role: 'assistant', content: errMsg }]);
      chatStorage.add('assistant', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-h-[800px]">
      <header className="mb-4">
        <h1 className="font-display text-3xl font-semibold">Mentor chat</h1>
        <p className="text-slate text-sm mt-1">Uses your local profile when calling AI.</p>
      </header>

      <div className="flex-1 overflow-y-auto bg-white border border-cream rounded-lg p-5 mb-4 space-y-4">
        {!messages.length && (
          <div className="text-center py-8">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => send(s)} className="block mx-auto text-sm px-3 py-2 mb-2 bg-cream rounded-md text-slate">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-lg text-sm break-words ${m.role === 'user' ? 'bg-ink text-paper' : 'bg-cream text-ink'}`}>
              {m.role === 'assistant' ? <MarkdownMessage content={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-mist animate-pulse">Mentor is typing…</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a career question…" className="flex-1 px-4 py-3 bg-white border border-cream rounded-lg outline-none focus:border-slate" />
        <Button type="submit" variant="primary" disabled={loading}>Send</Button>
      </form>
    </div>
  );
}
