import { useState, useEffect } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import FeedbackAlert from '../molecules/FeedbackAlert';

const baseUrl = 'http://localhost:3000';

export default function FormularioTurno() {
  const [sede, setSede] = useState('');
  const [salaId, setSalaId] = useState('');
  const [monitorId, setMonitorId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  // Estados para datos reales del backend
  const [monitoresReal, setMonitoresReal] = useState([]);
  const [salasFiltradas, setSalasFiltradas] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState({ type: '', message: '' });

  // 1. Cargar Monitores desde el Backend Real al montar el componente
  useEffect(() => {
    fetch(`${baseUrl}/monitores`)
      .then(res => res.json())
      .then(data => setMonitoresReal(data))
      .catch(() => setMonitoresReal([]));
  }, []);

  // 2. Selector dinámico de salas (Consumiendo /salones y filtrando localmente)
  useEffect(() => {
    if (!sede) {
      setSalasFiltradas([]);
      return;
    }

    fetch(`${baseUrl}/salones`)
      .then(res => res.json())
      .then(data => {
        // Mapeo adaptativo: Filtramos por la sede seleccionada
        const filtradas = data.filter(s => s.sede === sede);

        // Simulación de franja horaria requerida por el flujo del taller
        const horaNum = parseInt(hora?.split(':')[0] || 0, 10);
        const disponibles = horaNum >= 12 && horaNum < 14
          ? filtradas.filter((_, i) => i === 0)
          : filtradas;

        setSalasFiltradas(disponibles);
      })
      .catch(() => setSalasFiltradas([]));
  }, [sede, hora]);

  // 3. Envío adaptado al payload Express de tu compañero
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!sede || !salaId || !monitorId || !fecha || !hora) {
      setAlerta({ type: 'error', message: 'Todos los campos son requeridos' });
      return;
    }

    setCargando(true);
    setAlerta({ type: '', message: '' });

    // Cálculo automático de hora_fin (hora_inicio + 2 horas) exigido por el backend Express
    const [hH, mM] = hora.split(':').map(Number);
    const horaFinCalculada = `${String(hH + 2).padStart(2, '0')}:${String(mM).padStart(2, '0')}`;

    try {
      const res = await fetch(`${baseUrl}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: salaId,         // Mapeado de salaId
          monitor_id: monitorId,     // Mapeado de monitorId
          materia: 'Asignación de monitor', // Requisito extra del backend provisional
          fecha: fecha,
          hora_inicio: hora,
          hora_fin: horaFinCalculada
        }),
      });

      const data = await res.json();

      if (res.status === 201 || res.ok) {
        setAlerta({
          type: 'success',
          message: `Turno asignado con éxito en el backend real.`
        });
        // Limpiar formulario
        setSede('');
        setSalaId('');
        setMonitorId('');
        setFecha('');
        setHora('');
      } else if (res.status === 409) {
        // Traducir la validación de conflicto de Express a los motivos del Arquitecto
        const motivoAmigable = data?.detalle === 'salon_id'
          ? 'Conflicto: La sala seleccionada ya tiene una clase o turno activo.'
          : 'Conflicto: El monitor ya cuenta con un turno asignado en esta franja.';
        setAlerta({ type: 'error', message: motivoAmigable });
      } else if (res.status === 400) {
        setAlerta({ type: 'error', message: data?.error || 'Solicitud inválida (400).' });
      }
    } catch (error) {
      setAlerta({ type: 'error', message: 'Error de conexión con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  const formularioValido = sede && salaId && monitorId && fecha && hora;

  return (
    <form onSubmit={manejarEnvio} style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 440, width: '100%' }}>
      <FeedbackAlert type={alerta.type} message={alerta.message} />

      <FormField label="Sede">
        <select value={sede} onChange={e => { setSede(e.target.value); setSalaId(''); }}>
          <option value="">Seleccione una sede</option>
          <option value="LANS">Sede LANS</option>
          <option value="Orlando Sierra">Sede Orlando Sierra</option>
        </select>
      </FormField>

      <FormField label="Sala">
        <select value={salaId} onChange={e => setSalaId(e.target.value)} disabled={!sede || salasFiltradas.length === 0}>
          <option value="">Seleccione una sala</option>
          {salasFiltradas.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Fecha">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      </FormField>

      <FormField label="Hora de Inicio">
        <input type="time" value={hora} onChange={e => setHora(e.target.value)} />
      </FormField>

      <FormField label="Monitor">
        <select value={monitorId} onChange={e => setMonitorId(e.target.value)}>
          <option value="">Seleccione un monitor</option>
          {monitoresReal.map(m => (
            <option key={m.id} value={m.id}>{m.nombre} ({m.email || 'Sin correo'})</option>
          ))}
        </select>
      </FormField>

      <Button type="submit" disabled={!formularioValido || cargando} variant="primary">
        {cargando ? 'Asignando...' : 'Asignar Turno'}
      </Button>
    </form>
  );
}