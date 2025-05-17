<template>
  <main class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">💬 Chat com Assistente Comercial</h1>

    <ChatInput @send-question="fazerPergunta" />

    <div v-if="resposta" class="mt-6 bg-green-50 border border-green-200 p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">📌 Resposta:</h2>
      <p class="whitespace-pre-wrap text-gray-800">{{ resposta }}</p>
    </div>

    <ResultChart
      v-if="tabela.length && valueKey"
      :data="tabela"
      :labelKey="labelKey"
      :valueKey="valueKey"
      :datasetLabel="valueKey"
      class="mt-6"
    />

    <ResultTable v-if="tabela.length" :data="tabela" class="mt-6" />

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
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ChatInput from './components/ChatInput.vue'
import ResultTable from './components/ResultTable.vue'
import ResultChart from './components/ResultChart.vue'
import { perguntar } from './services/api.js'

const resposta = ref('')
const raciocinio = ref([])
const tabela = ref([])
const labelKey = ref('')
const valueKey = ref('')

const fazerPergunta = async (texto) => {
  resposta.value = ''
  raciocinio.value = []
  tabela.value = []
  labelKey.value = ''
  valueKey.value = ''

  try {
    const { data } = await perguntar(texto)
    console.log('📦 Resposta completa da API:', data)

    resposta.value = data.resposta || 'Sem resposta.'
    tabela.value = data.tabela || []
    raciocinio.value = data.raciocinio || []
    console.log('🧠 Raciocínio recebido:', raciocinio.value)

    if (tabela.value.length > 0) {
      const keys = Object.keys(tabela.value[0])
      labelKey.value = keys[0] || ''
      valueKey.value = keys[1] || ''
    }
  } catch (error) {
    console.error('Erro ao buscar resposta:', error)
    resposta.value = 'Erro ao buscar resposta.'
  }
}
</script>
