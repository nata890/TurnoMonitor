#!/bin/bash

# GET Monitores
curl -X GET http://localhost:3000/monitores
echo -e "\n"

# GET Salones
curl -X GET http://localhost:3000/salones
echo -e "\n"

# POST Turno - Caso de exito
curl -X POST http://localhost:3000/turnos \
-H "Content-Type: application/json" \
-d '{"salon_id":"s-1","monitor_id":"m-1","materia":"Programacion","fecha":"2023-11-01","hora_inicio":"08:00","hora_fin":"10:00"}'
echo -e "\n"

# POST Turno - Conflicto de salon (Mismo salon, diferente monitor, solapa horario)
curl -X POST http://localhost:3000/turnos \
-H "Content-Type: application/json" \
-d '{"salon_id":"s-1","monitor_id":"m-2","materia":"Bases de Datos","fecha":"2023-11-01","hora_inicio":"09:00","hora_fin":"11:00"}'
echo -e "\n"

# POST Turno - Conflicto de monitor (Diferente salon, mismo monitor, solapa horario)
curl -X POST http://localhost:3000/turnos \
-H "Content-Type: application/json" \
-d '{"salon_id":"s-2","monitor_id":"m-1","materia":"Algoritmia","fecha":"2023-11-01","hora_inicio":"09:00","hora_fin":"11:00"}'
echo -e "\n"
