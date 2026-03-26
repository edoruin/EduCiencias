# EduCiencias

Plataforma educativa de Ciencias Naturales con IA para escuelas de La Romana, República Dominicana.

## Características

- **Roles**: Estudiante, Maestro, Administrador
- **Gestión académica**: Asignaciones, evaluaciones, proyectos STEAM
- **IA Tutor**: Asistente de ciencias naturales
- **Metacognición**: Reflexiones de estudiantes

## Tecnologías

- **Frontend**: HTML/JS con TailwindCSS
- **Backend**: Flask (Python)
- **AI**: Google Gemini + HuggingFace Agent
- **Storage**: Supabase / HuggingFace Datasets / JSON local

## Despliegue

### Opción 1: HuggingFace Spaces (Recomendado)
```bash
# 1. Crear Space en hf.co/new-space
# 2. Seleccionar "Flask" como template
# 3. Subir archivos y configurar secrets:
#    - HF_TOKEN
#    - GEMINI_API_KEY
#    - SUPABASE_URL (opcional)
#    - SUPABASE_ANON_KEY (opcional)
```

### Opción 2: GitHub Pages + Supabase
```bash
# 1. Crear tabla en Supabase:
CREATE TABLE educiencias_data (
    id TEXT PRIMARY KEY,
    data JSONB
);

# 2. Configurar en frontend:
window.SUPABASE_URL = 'https://xxx.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';

# 3. Deploy a GitHub Pages
```

### Opción 3: Local
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configurar variables
python app.py
```

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `SECRET_KEY` | Clave secreta de Flask |
| `ADMIN_USER` | Usuario administrador |
| `ADMIN_PASS` | Contraseña administrador |
| `GEMINI_API_KEY` | API de Google Gemini |
| `HF_TOKEN` | Token HuggingFace |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Clave pública de Supabase |

## Estructura

```
EduCiencias/
├── app.py              # Backend Flask
├── templates/
│   └── index.html     # Frontend SPA
├── requirements.txt   # Dependencias Python
└── .env.example      # Plantilla de configuración
```
