# Handoff: My Address, My City — Mejoras de presentación previo envío

**Uso:** Copia y pega este bloque en un nuevo chat para enfocar el agente en mejoras de presentación solamente.

---

## Contexto del proyecto

Proyecto hackathon "My Address, My City" para Montgomery, Alabama. Aplicación cívica residente que muestra zonificación, zona inundable, barrio, distrito de concejo, recursos cercanos (parques, hospitales, centros comunitarios) y actividad reciente (violaciones de código, permisos, 311). Stack: React, TypeScript, Vite, Tailwind, Leaflet, TanStack Query.

---

## Alcance de este chat

### Se permite

- Cambios visuales y de estilo
- Mejoras de UX/UI (layout, contraste, jerarquía, espaciado)
- Refinamiento de textos y microcopy
- Ajustes de visibilidad y legibilidad
- Pequeñas mejoras que mejoren la demo y el pitch

### No se permite

- Cambiar lógica de datos, queries ni servicios
- Añadir nuevas features, módulos o tabs
- Alterar la arquitectura ni el flujo de la app
- Activar Bright Data ni otras integraciones nuevas

---

## Documentos a leer primero

| Prioridad | Documento | Propósito |
|-----------|-----------|-----------|
| 1 | AGENTS.md | Objetivo del producto, módulos y restricciones de alcance |
| 2 | .cursor/rules/ (todas las reglas) | Reglas de UX, datos, puntuación y validación |
| 3 | docs/submission-brief.md | Contexto para el pitch y el demo |
| 4 | docs/demo-script-final.md | Script de demo (60–90 s) y flujos principales |
| 5 | docs/demo-checklist.md | Checklist para verificar que todo funciona antes de presentar |
| 6 | docs/app-claims.md | Claims verificados y no verificados (evitar promesas falsas) |
| 7 | src/config/app-config.ts | Configuración central (ciudad, enlaces, radios, etc.) |
| 8 | docs/qa/final-phase-4-freeze-audit.md | Estado de la última auditoría y congelación |

---

## Estructura de la app

- **Layout:** Mapa a la izquierda, panel derecho con tabs
- **Tabs:** This Address | What's Closest | What's Happening Nearby | Next Steps
- **Features:** Civic Snapshot Summary, About This Data, Copy Link, Demo presets (City Hall, Residential, Outside Montgomery)
- **Responsive:** Mapa arriba, panel abajo en móvil. No hay toggle Map/Details.

---

## Estado actual

- Build: OK (`npm run build`)
- Council District: funciona mediante fallback (Code Violations / 311)
- Next Steps: 4 enlaces oficiales de Montgomery
- Fase 4 congelada; no añadir nuevos features

---

## Reglas rápidas

- **Idioma:** inglés en código, docs, labels, UI y comentarios
- No inventar datos ni presentar info como oficial si no es verificable
- Preferir menos datos a datos incorrectos
- Mantener el flujo demo de 60–90 s

---

## Salida esperada

En cada cambio, el agente debe indicar:

1. **Archivos modificados**
2. **Razón del cambio** (problema que resuelve o mejora que aporta)
3. **Confirmación** de que no se ha alterado la lógica de datos ni el alcance
