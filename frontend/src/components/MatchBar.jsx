export default function MatchBar({ score, rank }) {
  const colors = ['bg-rust', 'bg-sage', 'bg-slate'];
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-mist w-4">#{rank}</span>
      <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colors[rank - 1] || 'bg-mist'}`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className="text-sm font-semibold tabular-nums w-10 text-right">{score}%</span>
    </div>
  );
}
