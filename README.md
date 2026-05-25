# Kanturno - Turnos justos para karaoke

🎤 Sistema completo de gestión de turnos para karaoke con algoritmo de prioridad justa.

## ✨ Características

- **Algoritmo dinámico** basado en:
  - Tiempo de espera
  - Número de personas por mesa
  - Canciones ya cantadas por el grupo
- **Máximo 3 canciones por mesa** en cola
- **Efecto swoosh** al cambiar de turno
- **Interfaz premium** con modo oscuro/claro automático
- **Persistencia local** (recarga la página y no pierdes la cola)
- **Simulación automática** de duración de canciones (5 segundos para demo)

## 🚀 Despliegue en Netlify + GitHub

1. **Clona este repositorio** en GitHub
2. **Ve a [Netlify](https://netlify.com)** y haz clic en "New site from Git"
3. **Conecta tu repositorio de GitHub**
4. **Configuración:**
   - Build command: (dejar vacío)
   - Publish directory: `.`
5. **Haz clic en "Deploy site"**

Listo. Tu Kanturno estará vivo en `https://tu-app.netlify.app`

## 🛠️ Personalización

Edita las constantes en `script.js`:

```javascript
const MAX_CANCIONES_POR_MESA = 3;   // Máximo por grupo
const ALPHA = 0.1;                 // Peso por número de personas
const BETA = 0.2;                  // Penalización por cantar mucho
const DURACION_SIMULADA_CANCION_SEGUNDOS = 5;  // Duración demo
```

---
Creado por Datatester con ❤️ para karaokes justos.