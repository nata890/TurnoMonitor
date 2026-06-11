const styles = {
  base: {
    padding: '11px 0',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background-color 0.2s, opacity 0.2s',
    flex: 1,
  },
  primary: {
    backgroundColor: '#1e3a5f',
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

const hoverStyles = {
  primary: { backgroundColor: '#152d4a' },
  secondary: { backgroundColor: '#cbd5e1' },
};

export default function Button({ type = 'button', disabled = false, onClick, variant = 'primary', children }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...styles.base,
        ...styles[variant],
        ...(disabled ? styles.disabled : {}),
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = styles[variant].backgroundColor;
          e.currentTarget.style.color = styles[variant].color;
        }
      }}
    >
      {children}
    </button>
  );
}
