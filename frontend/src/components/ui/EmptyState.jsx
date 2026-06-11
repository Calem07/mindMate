export function EmptyState({ icon = '🐱', title, description, action }) {
  return (
    <div className="glass-panel rounded-3xl p-10 text-center max-w-md mx-auto">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}
