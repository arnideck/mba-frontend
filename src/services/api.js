import axios from 'axios';

const API_URL = 'https://sylynh41y9.execute-api.us-east-1.amazonaws.com/';
const getToken = () => localStorage.getItem('jwt_token');

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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

// Novo método: pergunta → resposta + tabela (se houver)
export async function perguntar(pergunta) {
  try {
    const response = await apiClient.post('/agent', { question: pergunta });

    const resposta = response?.data?.resposta || 'Sem resposta.';
    const raciocinio = response?.data?.raciocinio || [];

    // Tenta extrair tabela JSON do raciocínio (última observação com array)
    let tabela = [];
    if (Array.isArray(raciocinio)) {
      for (let i = raciocinio.length - 1; i >= 0; i--) {
        const obs = raciocinio[i].observation;
        try {
          const parsed = JSON.parse(obs);
          if (Array.isArray(parsed)) {
            tabela = parsed;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    return { resposta, tabela, raciocinio };
  } catch (error) {
    console.error('Erro ao perguntar:', error);
    return { resposta: 'Erro ao comunicar com a API.', tabela: [] };
  }
}
