<template>
  <main class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">MBA - Assistente Comercial</h1>

    <ChatInput @send-question="fazerPergunta" />

    <LoadingStatus :loading="carregando" />

    <div v-if="resposta" class="mt-6 bg-green-50 border border-green-200 p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">Resposta:</h2>
      <p class="whitespace-pre-wrap text-gray-800">{{ resposta }}</p>
    </div>

    <ResultTable v-if="tabela.length" :data="tabela" class="mt-6" />

    <ResultChart
      v-if="tabela.length"
      :data="tabela"
      :labelKey="labelKey"
      :valueKey="valueKey"
      :datasetLabel="valueKey"
      class="mt-6"
    />

    <div v-if="Array.isArray(raciocinio) && raciocinio.length" class="mt-8">
      <h2 class="text-lg font-semibold mb-4">Raciocínio do Assistente</h2>
      <div class="flex flex-col gap-4">
        <div
          v-for="(step, index) in raciocinio"
          :key="index"
          class="bg-white p-4 border rounded shadow"
        >
          <p class="text-blue-700 font-semibold mb-2">Pensamento:</p>
          <p class="whitespace-pre-wrap text-gray-800">{{ step.action?.log || 'Sem log.' }}</p>

          <p class="text-gray-700 font-semibold mt-4">Ação:</p>
          <p><strong>Ferramenta:</strong> {{ step.action?.tool || 'N/A' }}</p>
          <p><strong>Entrada:</strong></p>
          <pre class="bg-gray-50 text-sm p-2 rounded whitespace-pre-wrap overflow-auto">
            {{ step.action?.toolInput || '---' }}
          </pre>

          <p class="text-green-700 font-semibold mt-4">Observação:</p>
          <pre class="bg-green-50 p-2 rounded whitespace-pre-wrap text-gray-800 overflow-auto">
            {{ step.observation || 'Sem observação.' }}
          </pre>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import LoadingStatus from './components/LoadingStatus.vue';
import ChatInput from './components/ChatInput.vue'
import ResultTable from './components/ResultTable.vue'
import ResultChart from './components/ResultChart_d.vue'
import { perguntar } from './services/api.js'

// Token JWT gerado manualmente (deve estar alinhado com o JWT_SECRET do backend)
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZnJvbnRlbmQtZGV2IiwiaWF0IjoxNzE0NzE3NzYyLCJleHAiOjE3MTUzMjI1NjJ9.WA0ZVxXLtdCrZs2nHkFzN1a_AuYdYwEOOt6wH4TnKx4';
localStorage.setItem('jwt_token', jwtToken);

const resposta = ref('')
const raciocinio = ref([])
const tabela = ref([])
const labelKey = ref('')
const valueKey = ref('')
const carregando = ref(false);

const fazerPergunta = async (texto) => {
  resposta.value = ''
  raciocinio.value = []
  tabela.value = []
  labelKey.value = ''
  valueKey.value = ''
  carregando.value = true;

  try {
    const resultado = await perguntar(texto)
    console.log('📦 Resposta completa da API:', resultado)
    console.log('💬 resultado:', resultado);
    console.log('🔎 resposta:', resultado.resposta);

    const ehRespostaAutomatica = resultado?.resposta?.includes('Final Answer');

      if (ehRespostaAutomatica && Array.isArray(resultado?.tabela) && resultado.tabela.length > 0) {
        resposta.value = '📊 Aqui estão os dados solicitados:';
      } else if (ehRespostaAutomatica && resultado?.raciocinio?.length > 0) {
        resposta.value = '🧠 Veja como o assistente chegou à conclusão abaixo:';
      } else {
        resposta.value = resultado?.resposta || 'Nenhuma informação retornada.';
      }

    tabela.value = resultado.tabela || []
    raciocinio.value = resultado.raciocinio || []
    console.log('🧠 Raciocínio recebido:', raciocinio.value)

    if (tabela.value.length > 0) {
      const keys = Object.keys(tabela.value[0])
      labelKey.value = keys[0] || ''
      valueKey.value = keys[1] || ''
    }
  } catch (error) {
    console.error('Erro ao buscar resposta:', error)
    resposta.value = 'Erro ao buscar resposta.'
  }finally {
    carregando.value = false;
  }
}
</script>
