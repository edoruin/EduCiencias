// CONFIGURACIÓN - EduCiencias
// Reemplaza la URL del worker después de desplegar en Cloudflare
window.EDUCIENCIAS_CONFIG = {
    // URL del Worker desplegado en Cloudflare (ej: https://educiencias-api.tu-cuenta.workers.dev)
    d1ApiUrl: window.D1_API_URL || 'PON_TU_URL_DEL_WORKER_AQUI',
    d1ApiKey: window.D1_API_KEY || 'dev-token',
    
    // Token de HuggingFace (opcional)
    hfToken: window.HF_TOKEN || '',
    hfModel: 'meta-llama/Llama-3.1-8B-Instruct'
};
