<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold">MBA BI Conversacional</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <ChatInput @send-question="fazerPergunta" />

      <LoadingStatus :loading="carregando" />

      <div v-if="resposta" class="mt-4">
        <h2 class="font-semibold">Resposta:</h2>
        <p class="whitespace-pre-wrap text-gray-800">{{ resposta }}</p>
      </div>
      <div v-if="tabela.length" class="mt-6">
        <h2 class="font-semibold mb-2">Resultado:</h2>
        <table class="min-w-full border border-gray-300 text-left text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th v-for="(col, index) in Object.keys(tabela[0])" :key="index" class="border px-3 py-2">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tabela" :key="rowIndex" class="hover:bg-gray-50">
              <td v-for="(value, colIndex) in row" :key="colIndex" class="border px-3 py-1">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="mt-6 text-gray-500 italic">
        Nenhum dado para exibir
      </div>
      <ResultChart v-if="tabela.length" :data="tabela" />
    </main>
  </div>
  <div v-if="raciocinio.length" class="mt-8">
    <h2 class="text-lg font-semibold mb-4">🧠 Raciocínio do Assistente</h2>
      <div class="grid gap-4">
        <div
          v-for="(step, index) in raciocinio"
          :key="index"
          class="p-4 rounded-lg border shadow bg-white"
        >
          <div v-if="step.action?.log">
            <p class="font-bold text-blue-700 mb-1">💭 Pensamento:</p>
            <p class="text-gray-800 whitespace-pre-wrap mb-2">{{ step.action.log }}</p>
          </div>

          <div v-if="step.action?.tool || step.action?.toolInput">
            <p class="font-bold text-gray-700">⚙️ Ação:</p>
            <p v-if="step.action.tool"><strong>Ferramenta:</strong> {{ step.action.tool }}</p>
            <p v-if="step.action.toolInput"><strong>Consulta:</strong></p>
            <pre v-if="step.action.toolInput" class="bg-gray-100 text-sm p-2 rounded mb-2 overflow-auto whitespace-pre-wrap">
              {{ step.action.toolInput }}
            </pre>
          </div>

          <div v-if="step.observation">
            <p class="font-bold text-green-700">✅ Observação:</p>
            <p class="text-gray-800 whitespace-pre-wrap">{{ step.observation }}</p>
          </div>
        </div>
      </div>
  </div>

  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChatInput from './components/ChatInput.vue';
import LoadingStatus from './components/LoadingStatus.vue';
import ResultChart from './components/ResultChart_d.vue';
import { perguntar } from './services/api.js';


// Token JWT gerado manualmente (deve estar alinhado com o JWT_SECRET do backend)
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZnJvbnRlbmQtZGV2IiwiaWF0IjoxNzE0NzE3NzYyLCJleHAiOjE3MTUzMjI1NjJ9.WA0ZVxXLtdCrZs2nHkFzN1a_AuYdYwEOOt6wH4TnKx4';
localStorage.setItem('jwt_token', jwtToken);

const resposta = ref('');
const tabela = ref([]);
const carregando = ref(false);
const raciocinio = ref([]);

const fazerPergunta = async (pergunta) => {
  raciocinio.value = [];
  resposta.value = '';
  tabela.value = [];
  carregando.value = true;
  try {
    const resultado = await perguntar(pergunta);
    resposta.value = resultado?.resposta || 'Sem resposta.';
    tabela.value = Array.isArray(resultado?.tabela) ? resultado.tabela : [];
    raciocinio.value = Array.isArray(resultado?.raciocinio) ? resultado.raciocinio : [];
    } catch (err) {
    console.error('Erro ao perguntar:', err);
    resposta.value = 'Erro ao processar a requisição.';
    tabela.value = [];
    raciocinio.value = [];
  } finally {
    carregando.value = false;
  }
};
</script>