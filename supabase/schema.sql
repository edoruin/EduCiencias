-- =====================================================
-- EduCiencias - Schema de Supabase
-- PostgreSQL para la plataforma educativa
-- =====================================================

-- =====================================================
-- EXTensiones necesarias
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA DE USUARIOS (Auth)
-- =====================================================
-- Nota: Esta tabla se conecta con Supabase Auth
-- Los datos de autenticación están en auth.users

CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'docente', 'estudiante')),
    nombre TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE DOCENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.docentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    escuela TEXT NOT NULL,
    grados TEXT NOT NULL, -- JSON array: ["1ro Secundaria", "2do Secundaria"]
    bio TEXT DEFAULT '',
    razon TEXT, -- Razón por la que usa la plataforma
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE ESTUDIANTES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.estudiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    grado TEXT NOT NULL,
    maestro_id UUID REFERENCES public.docentes(id) ON DELETE SET NULL,
    metas TEXT DEFAULT '', -- Metas de aprendizaje
    insignias TEXT DEFAULT '[]', -- JSON array de insignias
    puntos INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE ASIGNACIONES (Tareas/Laboratorios)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.asignaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maestro_id UUID REFERENCES public.docentes(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    grado TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('tarea', 'laboratorio')),
    fase_5e TEXT, -- JSON: {enganche, exploracion, explicacion, elaboracion, evaluacion}
    permite_archivos BOOLEAN DEFAULT false,
    recurso_iframe TEXT,
    fecha_inicio TEXT,
    fecha_vencimiento TEXT,
    valor_puntos INTEGER DEFAULT 100,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE ENTREGAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.entregas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE,
    asignacion_id UUID REFERENCES public.asignaciones(id) ON DELETE CASCADE,
    contenido TEXT DEFAULT '',
    archivo_url TEXT,
    cuaderno JSONB, -- Para laboratorio: {hipotesis, materiales, datos, conclusiones}
    calificacion INTEGER,
    retroalimentacion TEXT DEFAULT '',
    fecha_entrega TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE EVALUACIONES (Quizzes)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maestro_id UUID REFERENCES public.docentes(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    preguntas JSONB NOT NULL, -- Array de preguntas
    grado TEXT NOT NULL,
    fecha_vencimiento TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE RESULTADOS DE QUIZZ
-- =====================================================
CREATE TABLE IF NOT EXISTS public.resultados_quiz (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE,
    evaluacion_id UUID REFERENCES public.evaluaciones(id) ON DELETE CASCADE,
    respuestas JSONB NOT NULL,
    calificacion INTEGER NOT NULL,
    tiempo_segundos INTEGER,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE PROYECTOS STEAM
-- =====================================================
CREATE TABLE IF NOT EXISTS public.proyectos_steam (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maestro_id UUID REFERENCES public.docentes(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    asignatura TEXT DEFAULT '',
    tema TEXT DEFAULT '',
    steam JSONB, -- {S: bool, T: bool, E: bool, A: bool, M: bool}
    fases JSONB, -- Array de fases del proyecto
    materiales JSONB, -- Array de materiales
    resumen TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE METACOGNICIÓN (Diario Científico)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.metacognicion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    aprendi TEXT NOT NULL, -- "¿Qué aprendí hoy?"
    dificultad TEXT NOT NULL, -- "¿Qué tema te dio mayor dificultad?"
    nueva_pregunta TEXT, -- Nueva pregunta que le gustaría responder
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE SUGERENCIAS (Maestro → Admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sugerencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maestro_id UUID REFERENCES public.docentes(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    respuesta TEXT,
    procesada BOOLEAN DEFAULT false,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE FORO DOCENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.foro_docentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maestro_id UUID REFERENCES public.docentes(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    imagenes JSONB, -- Array de URLs de imágenes
    grado TEXT,
    resuelto BOOLEAN DEFAULT false,
    respuesta TEXT,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE BIODIVERSIDAD
-- =====================================================
CREATE TABLE IF NOT EXISTS public.biodiversidad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    nombre_cientifico TEXT,
    tipo TEXT, -- planta, animal, hongo
    descripcion TEXT,
    imagen_url TEXT,
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE LOGS DEL SISTEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rol TEXT NOT NULL,
    usuario TEXT NOT NULL,
    accion TEXT NOT NULL,
    detalles JSONB DEFAULT '{}',
    ip_address TEXT,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN
-- =====================================================
CREATE TABLE IF NOT EXISTS public.settings (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_estudiantes_maestro ON public.estudiantes(maestro_id);
CREATE INDEX IF NOT EXISTS idx_estudiantes_grado ON public.estudiantes(grado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_maestro ON public.asignaciones(maestro_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_grado ON public.asignaciones(grado);
CREATE INDEX IF NOT EXISTS idx_entregas_estudiante ON public.entregas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_entregas_asignacion ON public.entregas(asignacion_id);
CREATE INDEX IF NOT EXISTS idx_metacognicion_estudiante ON public.metacognicion(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_metacognicion_fecha ON public.metacognicion(fecha);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON public.logs(fecha);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON public.logs(usuario);

-- =====================================================
-- DATOS INICIALES
-- =====================================================
INSERT INTO public.settings (clave, valor) VALUES 
    ('site_name', 'EduCiencias IA'),
    ('welcome_message', 'Plataforma Inteligente de Ciencias Naturales'),
    ('maintenance_mode', 'false')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- FUNCIONES UTILITARIAS
-- =====================================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at automático
CREATE TRIGGER update_docentes_updated_at
    BEFORE UPDATE ON public.docentes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_estudiantes_updated_at
    BEFORE UPDATE ON public.estudiantes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_asignaciones_updated_at
    BEFORE UPDATE ON public.asignaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_entregas_updated_at
    BEFORE UPDATE ON public.entregas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_proyectos_updated_at
    BEFORE UPDATE ON public.proyectos_steam
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos_steam ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metacognicion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sugerencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foro_docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biodiversidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Perfiles son públicos para lectura"
    ON public.perfiles FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.perfiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para docentes
CREATE POLICY "Docentes son visibles para lectura"
    ON public.docentes FOR SELECT USING (true);

CREATE POLICY "Docentes pueden insertar su perfil"
    ON public.docentes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Docentes pueden actualizar su perfil"
    ON public.docentes FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para estudiantes
CREATE POLICY "Estudiantes son visibles"
    ON public.estudiantes FOR SELECT USING (true);

CREATE POLICY "Estudiantes pueden actualizar su perfil"
    ON public.estudiantes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Maestros ven sus estudiantes"
    ON public.estudiantes FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.docentes d 
            WHERE d.user_id = auth.uid() 
            AND d.id = estudiantes.maestro_id
        )
    );

-- Políticas para asignaciones
CREATE POLICY "Asignaciones visibles por grado"
    ON public.asignaciones FOR SELECT USING (true);

CREATE POLICY "Docentes crean asignaciones"
    ON public.asignaciones FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.docentes WHERE user_id = auth.uid())
    );

CREATE POLICY "Docentes actualizan sus asignaciones"
    ON public.asignaciones FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.docentes 
            WHERE user_id = auth.uid() AND id = asignaciones.maestro_id
        )
    );

-- Políticas para entregas
CREATE POLICY "Entregas visibles"
    ON public.entregas FOR SELECT USING (true);

CREATE POLICY "Estudiantes entregan tareas"
    ON public.entregas FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.estudiantes WHERE user_id = auth.uid())
    );

-- Políticas para metacognición
CREATE POLICY "Metacognición propia"
    ON public.metacognicion FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.estudiantes WHERE user_id = auth.uid() AND id = estudiante_id)
    );

CREATE POLICY "Estudiantes escriben metacognición"
    ON public.metacognicion FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.estudiantes WHERE user_id = auth.uid() AND id = estudiante_id)
    );

-- Políticas para logs (solo admin)
CREATE POLICY "Solo admin lee logs"
    ON public.logs FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.perfiles WHERE user_id = auth.uid() AND rol = 'admin')
    );

-- Políticas para settings (solo admin)
CREATE POLICY "Solo admin modifica settings"
    ON public.settings FOR ALL USING (
        EXISTS (SELECT 1 FROM public.perfiles WHERE user_id = auth.uid() AND rol = 'admin')
    );
