// CONFIGURACIÓN - EduCiencias
window.EDUCIENCIAS_CONFIG = {
    // URL del Worker desplegado en Cloudflare
    d1ApiUrl: 'https://educiencias.edwinjeremiasagustinyack.workers.dev',
    d1ApiKey: window.D1_API_KEY || 'dev-token',
    
    // Token de HuggingFace (opcional)
    hfToken: window.HF_TOKEN || '',
    hfModel: 'meta-llama/Llama-3.1-8B-Instruct'
};
