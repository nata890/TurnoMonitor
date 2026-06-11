export default function FormField({ label, htmlFor, children, error }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        htmlFor={htmlFor}
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: '#374151',
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}
