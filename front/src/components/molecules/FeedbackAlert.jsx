const styles = {
  success: {
    color: '#155724',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
  },
  error: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
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
