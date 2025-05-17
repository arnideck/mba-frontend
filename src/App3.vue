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
        <ResultTable :data="tabela" />
      </div>
      <div v-else class="mt-6 text-gray-500 italic">
        Nenhum dado para exibir
      </div>
      <ResultChart v-if="tabela.length" :data="tabela" />
    </main>
  <div v-if="Array.isArray(raciocinio) && raciocinio.length" class="mt-8">
  <h2 class="text-lg font-semibold mb-4">🧠 Raciocínio do Assistente</h2>
  <div class="flex flex-col gap-4">
    <div
      v-for="(step, index) in raciocinio"
      :key="index"
      class="bg-white p-4 border rounded shadow"
    >
      <p class="text-blue-700 font-semibold mb-2">💭 Pensamento:</p>
      <p class="whitespace-pre-wrap text-gray-800">{{ step.action?.log || 'Sem log.' }}</p>

      <p class="text-gray-700 font-semibold mt-4">⚙️ Ação:</p>
      <p><strong>Ferramenta:</strong> {{ step.action?.tool || 'N/A' }}</p>
      <p><strong>Entrada:</strong></p>
      <pre class="bg-gray-50 text-sm p-2 rounded whitespace-pre-wrap overflow-auto">
{{ step.action?.toolInput || '---' }}
      </pre>

      <p class="text-green-700 font-semibold mt-4">✅ Observação:</p>
      <pre class="bg-green-50 p-2 rounded whitespace-pre-wrap text-gray-800 overflow-auto">
{{ step.observation || 'Sem observação.' }}
      </pre>
    </div>
  </div>
</div>

</div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ResultTable from './components/ResultTable.vue';
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
    console.log('Resposta completa da API:', resultado);
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