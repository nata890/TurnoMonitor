const keyframes = `
@keyframes tm-spin {
  to { transform: rotate(360deg); }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('tm-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'tm-spinner-style';
  style.textContent = keyframes;
  document.head.appendChild(style);
}

export default function Spinner({ size = 17, color = '#fff', dark = false }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        border: `2.5px solid ${dark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.3)'}`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'tm-spin 0.65s linear infinite',
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}
