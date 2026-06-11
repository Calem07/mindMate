export function ProgressBar({ value = 0, className = '', barClassName = 'bg-gradient-to-r from-cyan-400 to-teal-400' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full bg-white/5 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
