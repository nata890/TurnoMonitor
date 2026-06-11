import { useState } from 'react';

const styles = {
  base: {
    padding: '11px 20px',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background-color 0.2s',
    width: '100%',
  },
  primary: {
    backgroundColor: '#1e3a8a',
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

const hoverColors = {
  primary: '#1d4ed8',
  secondary: '#cbd5e1',
};

export default function Button({ type = 'button', disabled = false, onClick, variant = 'primary', children }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.base,
        ...styles[variant],
        backgroundColor: hover && !disabled ? hoverColors[variant] : styles[variant].backgroundColor,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      {children}
    </button>
  );
}
