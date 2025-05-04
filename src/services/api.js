import axios from 'axios';

// URL base da API - já considerando stage $default (sem sufixo adicional)
const API_URL = 'https://sylynh41y9.execute-api.us-east-1.amazonaws.com/';

// Token JWT para autenticação (não está ativo ainda, mas estrutura permanece)
const getToken = () => localStorage.getItem('jwt_token');

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Adiciona o token, se existir
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

// Envia uma pergunta para o backend (Lambda)
export default {
  sendQuestion(question) {
    return apiClient.post('/agent', { question });
  }
};
