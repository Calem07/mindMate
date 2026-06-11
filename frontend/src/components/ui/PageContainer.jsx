export function PageContainer({ children, className = '' }) {
  return (
    <div className={`space-y-5 pb-12 max-w-[1700px] mx-auto ${className}`}>{children}</div>
  );
}
