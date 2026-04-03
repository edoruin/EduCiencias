// ============================================
// ROUTER
// ============================================
const ROUTES = {
    '': 'landing', '#landing': 'landing', '#registro': 'registro', '#login': 'login',
    '#dashboard': 'dashboard', '#admin': 'admin', '#docente': 'docente', '#estudiante': 'estudiante'
};
function router() { return ROUTES[window.location.hash] || 'landing'; }

// ============================================
// API CLIENT
// ============================================
const API = {
    url: window.EDUCIENCIAS_CONFIG.d1ApiUrl,
    key: window.EDUCIENCIAS_CONFIG.d1ApiKey,
    async request(endpoint, options = {}) {
        const headers = { 'Authorization': `Bearer ${this.key}`, 'Content-Type': 'application/json' };
        const url = `${this.url}${endpoint}`;
        let resp;
        if (options.method === 'POST') resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(options.body) });
        else if (options.method === 'PATCH') resp = await fetch(url + '/' + options.id, { method: 'PATCH', headers, body: JSON.stringify(options.body) });
        else if (options.method === 'DELETE') resp = await fetch(url + '/' + options.id, { method: 'DELETE', headers });
        else resp = await fetch(url, { headers });
        if (!resp.ok) { console.error('API Error:', await resp.text()); return options.isArray !== false ? [] : null; }
        return await resp.json();
    },
    async get(table) { return this.request(`/${table}`); },
    async post(table, data) { return this.request(`/${table}`, { method: 'POST', body: data }); },
    async patch(table, id, data) { return this.request(`/${table}`, { method: 'PATCH', id, body: data }); },
    async delete(table, id) { return this.request(`/${table}`, { method: 'DELETE', id }); }
};

// ============================================
// AUTH
// ============================================
const AUTH = {
    async login(username, password) {
        const result = await API.request('/auth/login', { method: 'POST', body: { email: username, password } });
        return result?.user || null;
    },
    async register(email, password, nombre, rol, extras = {}) {
        const result = await API.request('/auth/register', { method: 'POST', body: { email, password, nombre, rol, ...extras } });
        return result?.user;
    },
    save(user) { localStorage.setItem('edu_user', JSON.stringify(user)); },
    get() { const s = localStorage.getItem('edu_user'); return s ? JSON.parse(s) : null; },
    clear() { localStorage.removeItem('edu_user'); }
};

// ============================================
// STATE & CONSTANTS
// ============================================
let state = { user: null, view: 'landing', data: {} };
const TODOS_LOS_GRADOS = ['1ro de Primaria','2do de Primaria','3ro de Primaria','4to de Primaria','5to de Primaria','6to de Primaria','1ro de Secundaria','2do de Secundaria','3ro de Secundaria','4to de Secundaria','5to de Secundaria','6to de Secundaria'];
const ESCUELAS = ['Politécnico Lilia Bayona','Politécnico Escuela Hogar del Niño','Politécnico Evangelico Shalom','Polécnico María Auxiliadora','Politécnico Max Simón','Politécnico Prof. Miguel Infante Santana','Politécnico Luis Heriberto Payán','Polécnico Prof. Mercedes María Lazala Mejía','Fundación MIR Campo Verde','Fundación MIR Esperanza','Politécnico San José de Calasanz','Colegio Saint Nicolas','Escuela Calasanz-San Pedro'];
const FRASES = [{f:"La educación es el arma más poderosa para cambiar el mundo.",a:"Nelson Mandela"},{f:"La curiosidad es la fuerza impulsora de la ciencia.",a:"Albert Einstein"},{f:"La ciencia es más que un cuerpo de conocimientos.",a:"Carl Sagan"}];

// ============================================
// SCROLL OBSERVER
// ============================================
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-section').forEach(el => observer.observe(el));
}

// ============================================
// LANDING PAGE
// ============================================
function renderLanding() {
    return `<div class="min-h-screen">
        <nav class="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2"><i class="fas fa-flask text-green-600 text-2xl"></i><span class="text-xl font-black">EduCiencias</span></div>
                <div class="flex gap-4">
                    <button onclick="location.hash='#login'" class="px-4 py-2 font-bold text-slate-600 hover:text-slate-800">Iniciar Sesión</button>
                    <button onclick="location.hash='#registro'" class="px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">Registrarse</button>
                </div>
            </div>
        </nav>
        <section class="pt-32 pb-20 px-4 bg-gradient-to-br from-green-400 via-blue-500 to-indigo-600">
            <div class="max-w-4xl mx-auto text-center text-white">
                <h1 class="text-5xl md:text-7xl font-black mb-6 fade-in">EduCiencias IA</h1>
                <p class="text-xl md:text-2xl mb-8 opacity-90 fade-in">Plataforma inteligente de ciencias naturales con tutor de IA</p>
                <button onclick="location.hash='#registro'" class="px-8 py-4 bg-white text-green-600 font-bold text-xl rounded-full hover:scale-105 transition-transform fade-in">¡Comienza Ahora!</button>
            </div>
        </section>
        <section class="py-20 px-4 scroll-section">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl font-black text-center mb-12 gradient-text">¿Por qué usar EduCiencias?</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-8 rounded-3xl shadow-lg text-center"><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-robot text-green-600 text-2xl"></i></div><h3 class="text-xl font-bold mb-2">Tutor IA</h3><p class="text-slate-600">Aprende con un tutor inteligente</p></div>
                    <div class="bg-white p-8 rounded-3xl shadow-lg text-center"><div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-flask text-blue-600 text-2xl"></i></div><h3 class="text-xl font-bold mb-2">Laboratorio Virtual</h3><p class="text-slate-600">Experimenta con hipótesis</p></div>
                    <div class="bg-white p-8 rounded-3xl shadow-lg text-center"><div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-lightbulb text-purple-600 text-2xl"></i></div><h3 class="text-xl font-bold mb-2">Proyectos STEAM</h3><p class="text-slate-600">Crea proyectos con IA</p></div>
                </div>
            </div>
        </section>
        <section class="py-20 px-4 bg-slate-100 scroll-section">
            <div class="max-w-6xl mx-auto text-center">
                <h2 class="text-4xl font-black mb-12">¡Únete a la revolución educativa!</h2>
                <button onclick="location.hash='#registro'" class="px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-full">Crear Cuenta Gratis</button>
            </div>
        </section>
        <footer class="bg-slate-900 text-white py-8 text-center"><p>© 2026 EduCiencias IA</p></footer>
    </div>`;
}

// ============================================
// REGISTRO
// ============================================
function renderRegistro() {
    return `<div class="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
            <div class="text-center mb-6">
                <button onclick="location.hash='#landing'" class="text-green-600 font-bold mb-4"><i class="fas fa-arrow-left"></i> Volver</button>
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-chalkboard-teacher text-green-600 text-2xl"></i></div>
                <h1 class="text-3xl font-black">Registro de Docente</h1>
            </div>
            <div id="re-mensaje" class="hidden bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center"></div>
            <form onsubmit="event.preventDefault(); registrarDocente();" class="space-y-4">
                <div><label class="block text-sm font-bold mb-1">Nombre Completo</label><input type="text" id="rn" required class="w-full px-4 py-3 rounded-xl border"></div>
                <div><label class="block text-sm font-bold mb-1">Email</label><input type="email" id="re" required class="w-full px-4 py-3 rounded-xl border"></div>
                <div><label class="block text-sm font-bold mb-1">Contraseña</label><input type="password" id="rpw" required class="w-full px-4 py-3 rounded-xl border"></div>
                <div><label class="block text-sm font-bold mb-1">Escuela</label><select id="resc" required class="w-full px-4 py-3 rounded-xl border"><option value="">Selecciona</option>${ESCUELAS.map(e=>`<option value="${e}">${e}</option>`).join('')}</select></div>
                <div><label class="block text-sm font-bold mb-1">Grados</label><div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg border">${TODOS_LOS_GRADOS.map(g=>`<label class="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" value="${g}" class="rgc"> ${g}</label>`).join('')}</div></div>
                <div><label class="block text-sm font-bold mb-1">¿Por qué usas esta página?</label><textarea id="rrazon" rows="2" class="w-full px-4 py-3 rounded-xl border"></textarea></div>
                <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 rounded-xl">Crear Cuenta</button>
            </form>
            <p class="text-center mt-4 text-slate-500">¿Ya tienes cuenta? <button onclick="location.hash='#login'" class="text-green-600 font-bold">Iniciar Sesión</button></p>
        </div></div>`;
}

async function registrarDocente() {
    const n = document.getElementById('rn').value, e = document.getElementById('re').value, pw = document.getElementById('rpw').value;
    const esc = document.getElementById('resc').value, gs = Array.from(document.querySelectorAll('.rgc:checked')).map(c=>c.value);
    const raz = document.getElementById('rrazon').value;
    if (!n || !e || !pw || !esc || !gs.length) { document.getElementById('re-mensaje').textContent = 'Completa todos los campos'; document.getElementById('re-mensaje').classList.remove('hidden'); return; }
    const r = await AUTH.register(e, pw, n, 'docente', {escuela: esc, grados: gs, razon: raz});
    if (r) { alert('¡Registro exitoso!'); location.hash = '#login'; }
    else { document.getElementById('re-mensaje').textContent = 'Error al registrar'; document.getElementById('re-mensaje').classList.remove('hidden'); }
}

// ============================================
// LOGIN
// ============================================
function renderLogin() {
    return `<div class="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <button onclick="location.hash='#landing'" class="text-green-600 font-bold mb-4"><i class="fas fa-arrow-left"></i> Volver</button>
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-flask text-green-600 text-2xl"></i></div>
                <h1 class="text-3xl font-black">EduCiencias</h1>
                <p class="text-slate-500">Inicia sesión</p>
            </div>
            <div id="le-mensaje" class="hidden bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center"></div>
            <form onsubmit="event.preventDefault();" class="space-y-4">
                <div><label class="block text-sm font-bold mb-1">Usuario</label><input type="text" id="lem" required class="w-full px-4 py-3 rounded-xl border" placeholder="admin, profe@demo.com, etc."></div>
                <div><label class="block text-sm font-bold mb-1">Contraseña</label><input type="password" id="lpw" required class="w-full px-4 py-3 rounded-xl border"></div>
                <button onclick="login()" class="w-full bg-green-600 text-white font-bold py-3 rounded-xl">Ingresar</button>
            </form>
            <div class="mt-4 text-center text-sm text-slate-500">
                <p>¿Nuevo docente? <button onclick="location.hash='#registro'" class="text-green-600 font-bold">Registrarse</button></p>
            </div>
        </div></div>`;
}

async function login() {
    const u = document.getElementById('lem').value, p = document.getElementById('lpw').value;
    const user = await AUTH.login(u, p);
    if (user) { state.user = user; AUTH.save(user); goToDashboard(); }
    else { document.getElementById('le-mensaje').textContent = 'Credenciales incorrectas'; document.getElementById('le-mensaje').classList.remove('hidden'); }
}

function goToDashboard() {
    if (state.user?.rol === 'admin') location.hash = '#admin';
    else if (state.user?.rol === 'docente') location.hash = '#docente';
    else location.hash = '#estudiante';
}

function logout() { AUTH.clear(); state.user = null; location.hash = '#landing'; }

// ============================================
// ADMIN DASHBOARD
// ============================================
async function renderAdmin() {
    const est = await API.get('estudiantes');
    const doc = await API.get('docentes');
    const asig = await API.get('asignaciones');
    const ent = await API.get('entregas');
    const sug = await API.get('sugerencias');
    const logs = await API.get('logs');
    const sets = await API.get('settings');
    const maintMode = sets.find(s => s.clave === 'maintenance_mode')?.valor === 'true';
    
    const totalEst = est.length;
    const totalDoc = doc.length;
    const totalAsig = asig.length;
    const totalEnt = ent.length;
    const asigCompletadas = ent.filter(e => e.calificacion && e.calificacion > 0).length;
    const tasaCompletacion = totalAsig > 0 ? Math.round((asigCompletadas / totalAsig) * 100) : 0;
    
    const estPorGrado = {};
    est.forEach(e => { const g = e.grado || 'Sin grado'; estPorGrado[g] = (estPorGrado[g] || 0) + 1; });
    const asigPorTipo = { tarea: asig.filter(a => a.tipo === 'tarea').length, laboratorio: asig.filter(a => a.tipo === 'laboratorio').length };
    const entPorMes = {}; 
    ent.forEach(e => { const m = e.fecha?.slice(0,7) || 'Sin fecha'; entPorMes[m] = (entPorMes[m] || 0) + 1; });
    
    return `<div class="min-h-screen bg-slate-50">
        <nav class="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2"><i class="fas fa-rocket text-green-400"></i><span class="font-black">Centro de Mando - EduCiencias</span></div>
            <div class="flex items-center gap-4">
                <span class="font-bold">${state.user?.nombre}</span>
                <button onclick="logout()" class="text-red-400 font-bold">Salir</button>
            </div>
        </nav>
        <div class="p-8">
            <h1 class="text-3xl font-black mb-2">Panel de Administración Centralizado</h1>
            <p class="text-slate-500 mb-8">Centro de Mando Analítico con Visualizaciones</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                    <div class="text-4xl font-black">${totalEst}</div>
                    <div class="text-blue-100">Estudiantes Activos</div>
                </div>
                <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
                    <div class="text-4xl font-black">${totalDoc}</div>
                    <div class="text-green-100">Maestros Registrados</div>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
                    <div class="text-4xl font-black">${totalAsig}</div>
                    <div class="text-purple-100">Objetivos Creados</div>
                </div>
                <div class="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white">
                    <div class="text-4xl font-black">${tasaCompletacion}%</div>
                    <div class="text-orange-100">Tasa de Completación</div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow">
                    <h3 class="text-lg font-bold mb-4"><i class="fas fa-chart-pie mr-2"></i>Estudiantes por Grado</h3>
                    <canvas id="chartEstGrado" class="w-full h-48"></canvas>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow">
                    <h3 class="text-lg font-bold mb-4"><i class="fas fa-chart-bar mr-2"></i>Objetivos por Tipo</h3>
                    <canvas id="chartAsigTipo" class="w-full h-48"></canvas>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow">
                    <h3 class="text-lg font-bold mb-4"><i class="fas fa-chart-line mr-2"></i>Entregas Recientes</h3>
                    <canvas id="chartEntregas" class="w-full h-48"></canvas>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-500">
                    <div class="text-2xl font-black text-blue-600">${totalEnt}</div>
                    <div class="text-slate-500 text-sm">Total Entregas</div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow border-l-4 border-green-500">
                    <div class="text-2xl font-black text-green-600">${asigCompletadas}</div>
                    <div class="text-slate-500 text-sm">Objetivos Completados</div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow border-l-4 border-red-500">
                    <div class="text-2xl font-black text-red-600">${sug.filter(s => !s.procesada).length}</div>
                    <div class="text-slate-500 text-sm">Sugerencias Pendientes</div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow border-l-4 border-purple-500">
                    <div class="text-2xl font-black text-purple-600">${logs.length}</div>
                    <div class="text-slate-500 text-sm">Registros del Sistema</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-user-shield mr-2"></i>Gestión de Maestros</h2>
                <div class="space-y-2 max-h-80 overflow-y-auto">
                    ${doc.filter(d => d.estado !== 'deleted').length ? doc.filter(d => d.estado !== 'deleted').map(d => {
                        const estado = d.estado || 'active';
                        const estadoColor = estado === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
                        const estadoLabel = estado === 'active' ? 'Activo' : 'En revisión';
                        return `<div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <span class="px-2 py-1 rounded text-xs font-bold ${estadoColor}">${estadoLabel}</span>
                                <div>
                                    <div class="font-bold">${d.nombre}</div>
                                    <div class="text-xs text-slate-500">${d.escuela || 'Sin escuela'}</div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="setUserStatus('${d.id}', 'revision')" class="bg-yellow-500 text-white px-3 py-1 rounded text-xs" title="Poner en revisión">⚠️</button>
                                <button onclick="confirmarEliminarMaestro('${d.id}', '${d.nombre}')" class="bg-red-600 text-white px-3 py-1 rounded text-xs" title="Eliminar cuenta">🗑️</button>
                                <button onclick="setUserStatus('${d.id}', 'active')" class="bg-green-600 text-white px-3 py-1 rounded text-xs" title="Activar">✓</button>
                            </div>
                        </div>`;
                    }).join('') : '<p class="text-slate-500">No hay maestros</p>'}
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-download mr-2"></i>Exportación CSV</h2>
                <div class="flex gap-4 flex-wrap">
                    <button onclick="exportCSV('estudiantes')" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><i class="fas fa-users mr-2"></i>Estudiantes</button>
                    <button onclick="exportCSV('docentes')" class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><i class="fas fa-chalkboard-teacher mr-2"></i>Docentes</button>
                    <button onclick="exportCSV('asignaciones')" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><i class="fas fa-tasks mr-2"></i>Asignaciones</button>
                    <button onclick="exportCSV('entregas')" class="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><i class="fas fa-check-circle mr-2"></i>Entregas</button>
                    <button onclick="exportCSV('logs')" class="bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><i class="fas fa-history mr-2"></i>Logs</button>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold"><i class="fas fa-envelope-open-text mr-2"></i>Sistema de Retroalimentación</h2>
                        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">${sug.length} mensajes</span>
                    </div>
                    <div class="space-y-3 max-h-80 overflow-y-auto">
                        ${sug.length ? sug.map(s => `<div class="p-4 bg-slate-50 rounded-lg border-l-4 ${s.procesada ? 'border-green-500' : 'border-orange-500'}">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-bold text-sm">${s.maestro_id}</span>
                                <span class="text-xs text-slate-400">${s.fecha?.slice(0,10)}</span>
                            </div>
                            <p class="text-sm mb-2">${s.texto}</p>
                            ${s.procesada ? 
                                `<div class="bg-green-50 p-2 rounded text-green-700 text-sm"><i class="fas fa-check-circle mr-1"></i>${s.respuesta}</div>` : 
                                `<div class="mt-2"><div class="flex gap-2"><input type="text" id="rs-${s.id}" placeholder="Responder..." class="flex-1 p-2 text-sm border rounded"><button onclick="respS('${s.id}')" class="bg-green-600 text-white px-3 py-1 rounded text-sm">Responder</button></div></div>`
                            }
                        </div>`).join('') : '<p class="text-slate-500 text-center py-8">No hay sugerencias</p>'}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold"><i class="fas fa-shield-alt mr-2"></i>Auditoría del Sistema</h2>
                        <input type="text" id="logSearch" placeholder="Buscar..." class="border rounded-lg px-3 py-1 text-sm" onkeyup="filterLogs()">
                    </div>
                    <div class="overflow-x-auto max-h-80 overflow-y-auto">
                        <table class="w-full text-xs">
                            <thead class="bg-slate-100 sticky top-0">
                                <tr>
                                    <th class="p-2 text-left">Fecha/Hora</th>
                                    <th class="p-2 text-left">Usuario</th>
                                    <th class="p-2 text-left">Rol</th>
                                    <th class="p-2 text-left">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="logsTable">
                                ${logs.slice(0, 100).map(l => `<tr class="border-b hover:bg-slate-50">
                                    <td class="p-2 text-slate-500">${l.fecha?.slice(0,16)}</td>
                                    <td class="p-2 font-bold">${l.usuario}</td>
                                    <td class="p-2"><span class="bg-slate-200 px-2 py-1 rounded text-xs">${l.rol}</span></td>
                                    <td class="p-2 text-slate-600">${l.accion}</td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-tools mr-2"></i>Control de Despliegue</h2>
                <div class="flex items-center justify-between p-6 bg-slate-50 rounded-xl">
                    <div>
                        <span class="font-bold text-lg">Modo Mantenimiento</span>
                        <p class="text-sm text-slate-500">${maintMode ? '🔴 La plataforma está bloqueada para maestros y estudiantes' : '🟢 La plataforma funciona normalmente'}</p>
                        <p class="text-xs text-slate-400 mt-1">Solo el administrador puede acceder durante el mantenimiento</p>
                    </div>
                    <button onclick="toggleM()" class="${maintMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-8 py-3 rounded-xl font-bold transition-colors">
                        <i class="fas fa-power-off mr-2"></i>${maintMode ? 'Reactivar Plataforma' : 'Activar Mantenimiento'}
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

function initAdminCharts(estPorGrado, asigPorTipo, entPorMes) {
    setTimeout(() => {
        const ctx1 = document.getElementById('chartEstGrado');
        if (ctx1) new Chart(ctx1, { type: 'doughnut', data: { labels: Object.keys(estPorGrado), datasets: [{ data: Object.values(estPorGrado), backgroundColor: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'] }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } });
        
        const ctx2 = document.getElementById('chartAsigTipo');
        if (ctx2) new Chart(ctx2, { type: 'bar', data: { labels: ['Tareas','Laboratorios'], datasets: [{ label: 'Cantidad', data: [asigPorTipo.tarea, asigPorTipo.laboratorio], backgroundColor: ['#3b82f6','#10b981'] }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
        
        const ctx3 = document.getElementById('chartEntregas');
        if (ctx3) new Chart(ctx3, { type: 'line', data: { labels: Object.keys(entPorMes), datasets: [{ label: 'Entregas', data: Object.values(entPorMes), borderColor: '#8b5cf6', tension: 0.4 }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
    }, 100);
}

async function setUserStatus(userId, status) {
    await API.patch('docentes', userId, { estado: status });
    alert('Estado actualizado: ' + status);
    render();
}

function confirmarEliminarMaestro(id, nombre) {
    if (confirm(`¿Estás seguro de eliminar la cuenta de "${nombre}"?\n\nSus tareas y datos históricos se mantendrán.`)) {
        eliminarMaestro(id);
    }
}

async function eliminarMaestro(id) {
    await API.patch('docentes', id, { estado: 'deleted' });
    alert('Cuenta eliminada. Los datos históricos se preservan.');
    render();
}

async function respS(id) {
    const respuesta = document.getElementById('rs-' + id).value;
    if (!respuesta) return alert('Escribe una respuesta');
    await API.post('sugerencias', { id, respuesta, procesada: 1 });
    render();
}

async function toggleM() {
    const sets = await API.get('settings');
    const maint = sets.find(s => s.clave === 'maintenance_mode')?.valor === 'true';
    await API.patch('settings', 's3', { valor: !maint ? 'true' : 'false' });
    render();
}

function filterLogs() {
    const search = document.getElementById('logSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#logsTable tr');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(search) ? '' : 'none';
    });
}

async function exportCSV(type) {
    let data = [];
    let filename = '';
    
    if (type === 'estudiantes') { data = await API.get('estudiantes'); filename = 'estudiantes.csv'; }
    else if (type === 'docentes') { data = await API.get('docentes'); filename = 'docentes.csv'; }
    else if (type === 'asignaciones') { data = await API.get('asignaciones'); filename = 'asignaciones.csv'; }
    else if (type === 'entregas') { data = await API.get('entregas'); filename = 'entregas.csv'; }
    else if (type === 'logs') { data = await API.get('logs'); filename = 'logs.csv'; }
    
    if (data.length === 0) return alert('No hay datos para exportar');
    
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

// ============================================
// DOCENTE DASHBOARD
// ============================================
async function renderDocente() {
    const est = await API.get('estudiantes');
    const asig = await API.get('asignaciones');
    const sug = await API.get('sugerencias');
    const misEst = est.filter(e => e.maestro_id === state.user?.docenteId);
    const misAsig = asig.filter(a => a.maestro_id === state.user?.docenteId);
    
    return `<div class="min-h-screen bg-slate-50">
        <nav class="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2"><i class="fas fa-flask text-green-400"></i><span class="font-black">EduCiencias</span></div>
            <div class="flex items-center gap-4">
                <button onclick="navD('panel')" class="text-white hover:text-green-400">Panel</button>
                <button onclick="navD('estudiantes')" class="text-white hover:text-green-400">Estudiantes</button>
                <button onclick="navD('asignaciones')" class="text-white hover:text-green-400">Tareas</button>
                <button onclick="navD('sugerencias')" class="text-white hover:text-green-400">Sugerencias</button>
                <button onclick="navD('perfil')" class="text-white hover:text-green-400">Perfil</button>
                <button onclick="logout()" class="text-red-400 font-bold">Salir</button>
            </div>
        </nav>
        <div class="p-8">
            <div class="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white mb-8">
                <h1 class="text-3xl font-black">¡Bienvenido, ${state.user?.nombre}!</h1>
                <p class="opacity-80">${state.user?.escuela}</p>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow text-center"><div class="text-4xl font-black text-blue-600">${misEst.length}</div><div class="text-slate-500">Estudiantes</div></div>
                <div class="bg-white p-6 rounded-2xl shadow text-center"><div class="text-4xl font-black text-green-600">${misAsig.length}</div><div class="text-slate-500">Tareas Creadas</div></div>
                <div class="bg-white p-6 rounded-2xl shadow text-center"><div class="text-4xl font-black text-purple-600">${sug.length}</div><div class="text-slate-500">Sugerencias Enviadas</div></div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-users mr-2"></i>Mis Estudiantes</h2>
                <div class="grid md:grid-cols-3 gap-4 mb-4">
                    <input type="text" id="nsn" placeholder="Nombre del estudiante" class="p-3 border rounded-xl">
                    <select id="nsg" class="p-3 border rounded-xl">${TODOS_LOS_GRADOS.map(g=>`<option value="${g}">${g}</option>`).join('')}</select>
                    <button onclick="crearEstudiante()" class="bg-blue-600 text-white font-bold py-3 rounded-xl">Agregar</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left"><thead class="bg-slate-50"><tr><th class="p-3">Nombre</th><th class="p-3">Grado</th><th class="p-3">Acciones</th></tr></thead>
                    <tbody>${misEst.length ? misEst.map(e => `<tr class="border-b"><td class="p-3 font-bold">${e.nombre}</td><td class="p-3">${e.grado}</td><td class="p-3"><button onclick="elimEst('${e.id}')" class="text-red-600"><i class="fas fa-trash"></i></button></td></tr>`).join('') : '<tr><td colspan="3" class="p-4 text-center">Sin estudiantes</td></tr>'}</tbody></table>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-tasks mr-2"></i>Crear Tarea</h2>
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="text" id="at" placeholder="Título de la tarea" class="p-3 border rounded-xl">
                    <select id="ag" class="p-3 border rounded-xl">${TODOS_LOS_GRADOS.map(g=>`<option value="${g}">${g}</option>`).join('')}</select>
                    <select id="atp" class="p-3 border rounded-xl"><option value="tarea">Tarea Clásica</option><option value="laboratorio">Laboratorio</option></select>
                    <input type="number" id="ap" value="100" placeholder="Puntos" class="p-3 border rounded-xl">
                    <input type="date" id="av" class="p-3 border rounded-xl">
                    <input type="text" id="afase" placeholder="Fase 5E (opcional)" class="p-3 border rounded-xl">
                </div>
                <textarea id="ad" placeholder="Descripción de la tarea" rows="2" class="w-full p-3 border rounded-xl mb-4"></textarea>
                <button onclick="crearTarea()" class="bg-green-600 text-white font-bold py-3 px-8 rounded-xl">Crear Tarea</button>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-envelope mr-2"></i>Enviar Sugerencia al Admin</h2>
                <div class="flex gap-4">
                    <input type="text" id="si" placeholder="Tu sugerencia..." class="flex-1 p-3 border rounded-xl">
                    <button onclick="enviarSugerencia()" class="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl">Enviar</button>
                </div>
            </div>
        </div>
    </div>`;
}

async function crearEstudiante() {
    const n = document.getElementById('nsn').value, g = document.getElementById('nsg').value;
    if (!n) return alert('Ingresa el nombre');
    const uid = 'est_' + Date.now();
    const pw = Math.random().toString(36).slice(2, 8);
    await API.post('perfiles', { id: uid, email: `${n.toLowerCase().replace(/[^a-z]/g, '')}@est.educiencias.com`, password: pw, rol: 'estudiante', nombre: n });
    await API.post('estudiantes', { id: uid, user_id: uid, nombre: n, grado: g, maestro_id: state.user?.docenteId });
    alert(`Estudiante creado!\nPassword: ${pw}`); render();
}

async function elimEst(id) { if(confirm('¿Eliminar estudiante?')) { await API.delete('estudiantes', id); render(); } }

async function crearTarea() {
    await API.post('asignaciones', { id: 'asig_' + Date.now(), maestro_id: state.user?.docenteId, titulo: document.getElementById('at').value, grado: document.getElementById('ag').value, tipo: document.getElementById('atp').value, descripcion: document.getElementById('ad').value, valor_puntos: parseInt(document.getElementById('ap').value), fecha_vencimiento: document.getElementById('av').value, fase5e: document.getElementById('afase').value, activa: 1 });
    alert('Tarea creada!'); render();
}

async function enviarSugerencia() {
    await API.post('sugerencias', { id: 'sug_' + Date.now(), maestro_id: state.user?.docenteId, texto: document.getElementById('si').value, fecha: new Date().toISOString() });
    alert('Sugerencia enviada!'); render();
}

function navD(view) { state.data.view = view; render(); }

// ============================================
// ESTUDIANTE DASHBOARD
// ============================================
async function renderEstudiante() {
    const f = FRASES[Math.floor(Math.random() * FRASES.length)];
    const asig = await API.get('asignaciones');
    const ent = await API.get('entregas');
    const misAsig = asig.filter(a => a.grado === state.user?.grado && a.activa);
    const misEnt = ent.filter(e => e.estudiante_id === state.user?.estudianteId);
    const prom = misEnt.filter(e => e.calificacion).length ? Math.round(misEnt.filter(e => e.calificacion).reduce((a,b) => a + (b.calificacion || 0), 0) / misEnt.filter(e => e.calificacion).length) : 0;
    
    return `<div class="min-h-screen bg-slate-50">
        <nav class="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2"><i class="fas fa-flask"></i><span class="font-black">EduCiencias</span></div>
            <div class="flex items-center gap-4">
                <button onclick="navE('inicio')" class="text-white hover:text-green-200">Inicio</button>
                <button onclick="navE('tareas')" class="text-white hover:text-green-200">Tareas</button>
                <button onclick="navE('tutor')" class="text-white hover:text-green-200">Tutor IA</button>
                <button onclick="navE('diario')" class="text-white hover:text-green-200">Diario</button>
                <button onclick="navE('hipotesis')" class="text-white hover:text-green-200">Hipótesis</button>
                <button onclick="navE('biodiversidad')" class="text-white hover:text-green-200">Biodiversidad</button>
                <button onclick="logout()" class="text-red-200 font-bold">Salir</button>
            </div>
        </nav>
        <div class="p-8">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white mb-8">
                <h1 class="text-4xl font-black">¡Hola, ${state.user?.nombre}!</h1>
                <p class="opacity-90">Estudiando en ${state.user?.grado}</p>
                <div class="mt-4 bg-white/20 rounded-xl p-4"><p class="text-lg italic">"${f.f}"</p><p class="text-sm text-right">- ${f.a}</p></div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4">Mi Progreso: ${prom}%</h2>
                <div class="w-full bg-slate-200 rounded-full h-4 mb-4"><div class="bg-emerald-500 h-4 rounded-full" style="width:${prom}%"></div></div>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="bg-amber-50 p-4 rounded-xl"><div class="text-2xl font-black text-amber-600">${misEnt.length}</div><div class="text-xs">Entregas</div></div>
                    <div class="bg-purple-50 p-4 rounded-xl"><div class="text-2xl font-black text-purple-600">${misAsig.length}</div><div class="text-xs">Tareas</div></div>
                    <div class="bg-blue-50 p-4 rounded-xl"><div class="text-2xl font-black text-blue-600">${misEnt.filter(e => e.calificacion).length}</div><div class="text-xs">Calificadas</div></div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4">Mis Tareas</h2>
                ${misAsig.length ? misAsig.map(a => `<div class="p-4 bg-slate-50 rounded-xl mb-2 flex justify-between items-center"><div><div class="font-bold">${a.titulo}</div><div class="text-sm text-slate-500">${a.grado} • ${a.tipo === 'laboratorio' ? '🧪 Laboratorio' : '📝 Tarea'}</div></div><button onclick="entregarTarea('${a.id}', '${a.titulo}')" class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Entregar</button></div>`).join('') : '<p class="text-slate-500">No hay tareas disponibles</p>'}
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-robot mr-2"></i>Tutor IA</h2>
                <div id="tc" class="h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl mb-4 space-y-2"><div class="flex"><div class="bg-blue-100 p-3 rounded-xl max-w-md">¡Hola! ¿Qué quieres aprender hoy?</div></div></div>
                <div class="flex gap-2"><input type="text" id="ti" placeholder="Pregunta..." class="flex-1 p-3 border rounded-xl" onkeypress="if(event.key==='Enter')preguntarTutor()"><button onclick="preguntarTutor()" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Enviar</button></div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-book-open mr-2"></i>Diario Científico</h2>
                <div class="space-y-4">
                    <div><label class="block font-bold mb-1">¿Qué aprendiste hoy?</label><textarea id="ma" rows="2" class="w-full p-3 border rounded-xl"></textarea></div>
                    <div><label class="block font-bold mb-1">¿Qué te dio dificultad?</label><textarea id="md" rows="2" class="w-full p-3 border rounded-xl"></textarea></div>
                    <div><label class="block font-bold mb-1">Nueva pregunta</label><textarea id="mp" rows="2" class="w-full p-3 border rounded-xl"></textarea></div>
                    <button onclick="guardarDiario()" class="bg-teal-600 text-white font-bold py-3 px-8 rounded-xl">Guardar</button>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-flask mr-2"></i>Laboratorio de Hipótesis</h2>
                <textarea id="hi" rows="3" class="w-full p-3 border rounded-xl mb-4" placeholder="¿Qué crees que pasaría si...?"></textarea>
                <button onclick="analizarHipotesis()" class="bg-purple-600 text-white font-bold py-3 px-8 rounded-xl">Analizar</button>
                <div id="hr" class="hidden mt-4 p-4 bg-slate-50 rounded-xl"></div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow">
                <h2 class="text-xl font-bold mb-4"><i class="fas fa-leaf mr-2"></i>Biodiversidad RD</h2>
                <div class="flex gap-2 mb-4"><input type="text" id="bs" placeholder="Buscar especie..." class="flex-1 p-3 border rounded-xl"><button onclick="buscarBio()" class="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">Buscar</button></div>
                <div id="br" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            </div>
        </div>
    </div>`;
}

async function entregarTarea(id, tit) {
    const c = prompt('Tu respuesta:');
    if (!c) return;
    await API.post('entregas', { id: 'ent_' + Date.now(), estudiante_id: state.user?.estudianteId, asignacion_id: id, titulo_asignacion: tit, contenido: c, fecha: new Date().toISOString() });
    alert('¡Entregada!'); render();
}

async function preguntarTutor() {
    const p = document.getElementById('ti').value;
    if (!p) return;
    const c = document.getElementById('tc');
    c.innerHTML += `<div class="flex justify-end"><div class="bg-green-100 p-3 rounded-xl max-w-md">${p}</div></div>`;
    document.getElementById('ti').value = '';
    c.innerHTML += `<div class="flex"><div class="bg-blue-100 p-3 rounded-xl max-w-md">¡Hola! Soy tu tutor de ciencias. Pregunta lo que quieras sobre el tema.</div></div>`;
    c.scrollTop = c.scrollHeight;
}

async function guardarDiario() {
    const a = document.getElementById('ma').value, d = document.getElementById('md').value, p = document.getElementById('mp').value;
    if (!a || !d) return alert('Completa los campos');
    await API.post('metacognicion', { id: 'meta_' + Date.now(), estudiante_id: state.user?.estudianteId, aprendi: a, dio_brega: d, nueva_pregunta: p, fecha: new Date().toISOString() });
    alert('¡Guardado en tu diario!'); render();
}

async function analizarHipotesis() {
    const h = document.getElementById('hi').value;
    if (!h) return;
    document.getElementById('hr').classList.remove('hidden');
    document.getElementById('hr').innerHTML = '<p class="text-center">🔬 Analizando tu hipótesis...</p>';
    setTimeout(() => {
        document.getElementById('hr').innerHTML = `<p><strong>Análisis:</strong> "${h}" es una hipótesis interesante. Para validarla necesitarías:<br>1. Diseñar un experimento controlado<br>2. Recolectar datos<br>3. Analizar resultados</p>`;
    }, 1500);
}

async function buscarBio() {
    const q = document.getElementById('bs').value;
    if (!q) return;
    document.getElementById('br').innerHTML = '<p>🔍 Buscando en la base de datos...</p>';
    const res = await API.get('biodiversidad');
    const filtered = res.filter(b => b.nombre?.toLowerCase().includes(q.toLowerCase()));
    document.getElementById('br').innerHTML = filtered.length ? filtered.map(b => `<div class="p-4 bg-green-50 rounded-xl border border-green-100"><h4 class="font-bold text-green-800">${b.nombre}</h4><p class="text-sm">${b.descripcion}</p></div>`).join('') : '<p>No se encontraron resultados. ¡Pronto tendrás acceso a más especies!</p>';
}

function navE(view) { state.data.view = view; render(); }

// ============================================
// MAIN RENDER
// ============================================
async function render() {
    const app = document.getElementById('app');
    const view = router();
    
    if (!state.user && view !== 'landing' && view !== 'registro' && view !== 'login') { location.hash = '#landing'; return; }
    
    if (view === 'landing') app.innerHTML = renderLanding();
    else if (view === 'registro') app.innerHTML = renderRegistro();
    else if (view === 'login') app.innerHTML = renderLogin();
    else if (view === 'admin') app.innerHTML = await renderAdmin();
    else if (view === 'docente') app.innerHTML = await renderDocente();
    else if (view === 'estudiante') app.innerHTML = await renderEstudiante();
    
    initScrollObserver();
}

// ============================================
// INIT
// ============================================
window.addEventListener('hashchange', render);
const saved = AUTH.get();
if (saved) { state.user = saved; goToDashboard(); }
render();
