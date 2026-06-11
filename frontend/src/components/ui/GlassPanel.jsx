export function GlassPanel({ className = '', children, as: Tag = 'div', ...props }) {
  return (
    <Tag className={`glass-panel rounded-3xl ${className}`} {...props}>
      {children}
    </Tag>
  );
}
