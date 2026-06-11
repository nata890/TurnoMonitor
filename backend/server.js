import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const monitores = [
  { id: "m-1", nombre: "Carlos Andres Perez", email: "c.perez@ucaldas.edu.co" },
  { id: "m-2", nombre: "Laura Sofia Gomez", email: "l.gomez@ucaldas.edu.co" }
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

  if (process.env.N8N_WEBHOOK_URL) {
    fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoTurno)
    }).catch(() => {});
  }

  res.status(201).json(nuevoTurno);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
