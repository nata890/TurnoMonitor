import FormularioTurno from './components/organisms/FormularioTurno';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#1a1a2e',
            letterSpacing: '-0.3px',
            margin: 0,
          }}
        >
          Sistema TurnoMonitores
        </h1>
        <p
          style={{
            fontSize: 13,
            color: '#64748b',
            margin: '4px 0 0',
          }}
        >
          Universidad de Caldas
        </p>
      </header>

      <FormularioTurno />
    </div>
  );
}
