const styles = {
  success: {
    color: '#16a34a',
    backgroundColor: '#f0fdf4',
    border: '1px solid #16a34a',
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    border: '1px solid #dc2626',
  },
};

const alertBase = {
  padding: '14px 16px',
  borderRadius: 8,
  fontSize: 14,
  lineHeight: 1.5,
  marginBottom: 20,
};

export default function FeedbackAlert({ type = 'success', message }) {
  if (!message) return null;

  return (
    <div style={{ ...alertBase, ...styles[type] }}>
      {message}
    </div>
  );
}
