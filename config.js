// CONFIGURACIÓN - EduCiencias
// La URL del worker se injecta desde secrets en el deployment
window.EDUCIENCIAS_CONFIG = {
    d1ApiUrl: 'PON_TU_URL_DEL_WORKER_AQUI',
    d1ApiKey: window.D1_API_KEY || 'dev-token',
    hfToken: window.HF_TOKEN || '',
    hfModel: 'meta-llama/Llama-3.1-8B-Instruct'
};
