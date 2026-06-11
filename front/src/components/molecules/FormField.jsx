import { Children, cloneElement } from 'react';

const inputStyles = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  border: '1px solid #dcdfe6',
  borderRadius: 8,
  background: '#fff',
  color: '#1f2937',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function FormField({ label, htmlFor, children, error }) {
  const enhanced = Children.map(children, (child) => {
    if (!child) return child;
    return cloneElement(child, {
      style: { ...inputStyles, ...child.props.style },
      onFocus: (e) => {
        e.currentTarget.style.borderColor = '#2563eb';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)';
        child.props.onFocus?.(e);
      },
      onBlur: (e) => {
        e.currentTarget.style.borderColor = '#dcdfe6';
        e.currentTarget.style.boxShadow = 'none';
        child.props.onBlur?.(e);
      },
    });
  });

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        htmlFor={htmlFor}
        style={{
          display: 'block',
          fontSize: 14,
          fontWeight: 500,
          color: '#606266',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {enhanced}
      {error && (
        <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}
