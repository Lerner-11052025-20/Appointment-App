export default function Button({ children, variant = 'brand', className = '', loading, disabled, ...props }) {
  const base = variant === 'ghost' ? 'btn-ghost' : 'btn-brand';
  return (
    <button className={`${base} w-full ${className}`} disabled={disabled || loading} {...props}>
      {loading && <span className="loader-ring" />}
      {children}
    </button>
  );
}