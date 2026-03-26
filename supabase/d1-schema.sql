-- =====================================================
-- EduCiencias - Schema Cloudflare D1
-- SQLite para la plataforma educativa
-- =====================================================

-- =====================================================
-- TABLA DE PERFILES (usuarios)
-- =====================================================
CREATE TABLE IF NOT EXISTS perfiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'docente', 'estudiante')),
    nombre TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE DOCENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS docentes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    escuela TEXT NOT NULL,
    grados TEXT NOT NULL,
    bio TEXT DEFAULT '',
    razon TEXT,
    activo INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE ESTUDIANTES
-- =====================================================
CREATE TABLE IF NOT EXISTS estudiantes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    grado TEXT NOT NULL,
    maestro_id TEXT,
    metas TEXT DEFAULT '',
    puntos INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE ASIGNACIONES
-- =====================================================
CREATE TABLE IF NOT EXISTS asignaciones (
    id TEXT PRIMARY KEY,
    maestro_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    grado TEXT NOT NULL,
    tipo TEXT DEFAULT 'tarea',
    fase_5e TEXT,
    permite_archivos INTEGER DEFAULT 0,
    recurso_iframe TEXT,
    fecha_inicio TEXT,
    fecha_vencimiento TEXT,
    valor_puntos INTEGER DEFAULT 100,
    activa INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE ENTREGAS
-- =====================================================
CREATE TABLE IF NOT EXISTS entregas (
    id TEXT PRIMARY KEY,
    estudiante_id TEXT NOT NULL,
    asignacion_id TEXT NOT NULL,
    contenido TEXT DEFAULT '',
    archivo_url TEXT,
    cuaderno TEXT,
    calificacion INTEGER,
    retroalimentacion TEXT DEFAULT '',
    fecha_entrega TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE EVALUACIONES
-- =====================================================
CREATE TABLE IF NOT EXISTS evaluaciones (
    id TEXT PRIMARY KEY,
    maestro_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    preguntas TEXT NOT NULL,
    grado TEXT NOT NULL,
    fecha_vencimiento TEXT,
    activa INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE PROYECTOS STEAM
-- =====================================================
CREATE TABLE IF NOT EXISTS proyectos_steam (
    id TEXT PRIMARY KEY,
    maestro_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    asignatura TEXT DEFAULT '',
    tema TEXT DEFAULT '',
    steam TEXT,
    fases TEXT,
    materiales TEXT,
    resumen TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE METACOGNICIÓN
-- =====================================================
CREATE TABLE IF NOT EXISTS metacognicion (
    id TEXT PRIMARY KEY,
    estudiante_id TEXT NOT NULL,
    fecha TEXT DEFAULT (date('now')),
    aprendi TEXT NOT NULL,
    dificultad TEXT NOT NULL,
    nueva_pregunta TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE SUGERENCIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS sugerencias (
    id TEXT PRIMARY KEY,
    maestro_id TEXT NOT NULL,
    texto TEXT NOT NULL,
    respuesta TEXT,
    procesada INTEGER DEFAULT 0,
    fecha TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE FORO DOCENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS foro_docentes (
    id TEXT PRIMARY KEY,
    maestro_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    imagenes TEXT,
    grado TEXT,
    resuelto INTEGER DEFAULT 0,
    respuesta TEXT,
    fecha TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE BIODIVERSIDAD
-- =====================================================
CREATE TABLE IF NOT EXISTS biodiversidad (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_cientifico TEXT,
    tipo TEXT,
    descripcion TEXT,
    imagen_url TEXT,
    region TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    rol TEXT NOT NULL,
    usuario TEXT NOT NULL,
    accion TEXT NOT NULL,
    detalles TEXT DEFAULT '{}',
    ip_address TEXT,
    fecha TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TABLA DE SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_estudiantes_maestro ON estudiantes(maestro_id);
CREATE INDEX IF NOT EXISTS idx_estudiantes_grado ON estudiantes(grado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_maestro ON asignaciones(maestro_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_grado ON asignaciones(grado);
CREATE INDEX IF NOT EXISTS idx_entregas_estudiante ON entregas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_entregas_asignacion ON entregas(asignacion_id);
CREATE INDEX IF NOT EXISTS idx_metacognicion_estudiante ON metacognicion(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs(fecha);

-- =====================================================
-- DATOS INICIALES
-- =====================================================
INSERT INTO settings (clave, valor) VALUES 
    ('site_name', 'EduCiencias IA'),
    ('welcome_message', 'Plataforma Inteligente de Ciencias Naturales'),
    ('maintenance_mode', 'false');

INSERT INTO perfiles (id, email, rol, nombre, password) VALUES 
    ('admin', 'admin@educiencias.com', 'admin', 'Administrador', 'admin123');
