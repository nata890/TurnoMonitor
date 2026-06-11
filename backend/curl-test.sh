BASE=http://localhost:3000

# 1. Salas disponibles para sede LANS a las 9:00 AM Colombia (UTC-5 = 14:00 UTC)
curl -s "$BASE/salas/disponibles?sedeId=sede-lans&hora=2025-09-15T14:00:00Z" | jq .

# 2. Lista de monitores
curl -s "$BASE/monitores" | jq .

# 3. Asignar turno — caso exitoso
curl -s -X POST "$BASE/turnos" \
  -H "Content-Type: application/json" \
  -d '{
    "monitorId":     "mon-1",
    "salaId":        "sala-l1",
    "coordinadorId": "coord-1",
    "horaInicio":    "2025-09-15T14:00:00Z"
  }' | jq .

# 4. Conflicto: monitor ya en turno (ejecutar despues del caso exitoso)
curl -s -X POST "$BASE/turnos" \
  -H "Content-Type: application/json" \
  -d '{
    "monitorId":     "mon-1",
    "salaId":        "sala-l2",
    "coordinadorId": "coord-1",
    "horaInicio":    "2025-09-15T14:00:00Z"
  }' | jq .

# 5. Conflicto: sala con clase (sala-l3 tiene clase el lunes 8-10, 14:00 UTC = 9:00 Colombia)
curl -s -X POST "$BASE/turnos" \
  -H "Content-Type: application/json" \
  -d '{
    "monitorId":     "mon-2",
    "salaId":        "sala-l3",
    "coordinadorId": "coord-1",
    "horaInicio":    "2025-09-15T14:00:00Z"
  }' | jq .

# 6. Conflicto: fuera de franja (22:00 Colombia = 03:00 UTC siguiente dia)
curl -s -X POST "$BASE/turnos" \
  -H "Content-Type: application/json" \
  -d '{
    "monitorId":     "mon-2",
    "salaId":        "sala-l1",
    "coordinadorId": "coord-1",
    "horaInicio":    "2025-09-16T03:00:00Z"
  }' | jq .
