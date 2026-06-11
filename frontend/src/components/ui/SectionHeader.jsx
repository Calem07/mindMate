import { ChevronRight } from 'lucide-react';

export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          {action} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
