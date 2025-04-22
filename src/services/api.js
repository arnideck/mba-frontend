import axios from 'axios';

// URL base da API - substitua pela URL real da sua API
const API_URL = process.env.VUE_APP_API_URL || 'https://api.exemplo.com';

// Token JWT para autenticação
const getToken = () => localStorage.getItem('jwt_token');

// Instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação em cada requisição
apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Serviço de API
export default {
  // Autenticação
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  
  logout() {
    localStorage.removeItem('jwt_token');
    return Promise.resolve();
  },
  
  // Enviar pergunta para o agente de BI conversacional
  sendQuestion(question) {
    return apiClient.post('/agent/query', { question });
  },
  
  // Obter histórico de consultas
  getQueryHistory() {
    return apiClient.get('/agent/history');
  },
  
  // Verificar status da API
  checkStatus() {
    return apiClient.get('/status');
  }
};
