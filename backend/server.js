import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const monitores = [
  { id: "m-1", nombre: "Carlos Gomez", email: "carlos.gomez37803@ucaldas.edu.co" },
  { id: "m-2", nombre: "Sebastian Martinez", email: "juan.martinez37679@ucaldas.edu.co" },
  { id: "m-3", nombre: "Natalia Ceballos", email: "natalia.ceballos28390@ucaldas.edu.co" },
  { id: "m-4", nombre: "Sofia Espinosa", email: "sofia.espinosa31634@ucaldas.edu.co" },

];

const salones = [
  { id: "s-1", nombre: "Sala 1", sede: "LANS" },
  { id: "s-2", nombre: "Sala 4", sede: "Orlando Sierra" }
];

const turnos = [];

const checkOverlap = (inicio1, fin1, inicio2, fin2) => {
  return inicio1 < fin2 && fin1 > inicio2;
};

app.get('/monitores', (req, res) => {
  res.json(monitores);
});

app.get('/salones', (req, res) => {
  res.json(salones);
});

app.post('/turnos', async (req, res) => {
  const { salon_id, monitor_id, materia, fecha, hora_inicio, hora_fin } = req.body;

  if (!salon_id || !monitor_id || !materia || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: "Faltan campos requeridos", detalle: "salon_id, monitor_id, materia, fecha, hora_inicio, hora_fin" });
  }

  const conflictoSalon = turnos.find(t =>
    t.salon_id === salon_id &&
    t.fecha === fecha &&
    checkOverlap(hora_inicio, hora_fin, t.hora_inicio, t.hora_fin)
  );

  if (conflictoSalon) {
    return res.status(409).json({ error: "Conflicto de salon", detalle: "salon_id" });
  }

  const conflictoMonitor = turnos.find(t =>
    t.monitor_id === monitor_id &&
    t.fecha === fecha &&
    checkOverlap(hora_inicio, hora_fin, t.hora_inicio, t.hora_fin)
  );

  if (conflictoMonitor) {
    return res.status(409).json({ error: "Conflicto de monitor", detalle: "monitor_id" });
  }

  const id = `t-${Date.now()}`;
  const nuevoTurno = { id, salon_id, monitor_id, materia, fecha, hora_inicio, hora_fin };
  turnos.push(nuevoTurno);

  const monitorAsignado = monitores.find(m => m.id === monitor_id);
  const salonAsignado = salones.find(s => s.id === salon_id);

  if (process.env.N8N_WEBHOOK_URL) {
    fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nuevoTurno,
        monitor: monitorAsignado,
        salon: salonAsignado
      })
    }).then(response => {
      console.log('Webhook disparado a n8n. Estado HTTP:', response.status);
    }).catch((err) => {
      console.error('Error enviando webhook a n8n:', err.message);
    });
  }

  res.status(201).json(nuevoTurno);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
