<template>
  <main class="p-4 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">MBA BI Conversacional</h1>

    <ChatInput @send-question="handleQuestion" />

    <LoadingStatus v-if="loading" />

    <div v-if="resposta" class="mt-6">
      <h2 class="text-lg font-semibold mb-2">Resposta:</h2>
      <p class="bg-gray-100 p-4 rounded">{{ resposta }}</p>
    </div>

    <div v-if="dados.length" class="mt-6">
      <ExportButtons :dados="dados" />
      <ResultChart :dados="dados" />
      <ResultTable :dados="dados" />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { perguntar } from '@/services/api.js'
import ChatInput from '@/components/ChatInput.vue'
import LoadingStatus from '@/components/LoadingStatus.vue'
import ResultChart from '@/components/ResultChart.vue'
import ResultTable from '@/components/ResultTable.vue'
import ExportButtons from '@/components/ExportButtons.vue'

const resposta = ref('')
const dados = ref([])
const loading = ref(false)

const handleQuestion = async (pergunta) => {
  loading.value = true
  resposta.value = ''
  dados.value = []

  try {
    //const resultado = await perguntar(pergunta)

    //resposta.value = resultado.resposta || 'Nenhuma resposta gerada.'
    //dados.value = Array.isArray(resultado.tabela) ? resultado.tabela : []
    const resultado = await perguntar(pergunta);

    resposta.value = resultado?.resposta || 'Nenhuma resposta recebida.';
    dados.value = Array.isArray(resultado?.tabela) ? resultado.tabela : [];
  } catch (e) {
    resposta.value = 'Erro ao buscar resposta.'
  } finally {
    loading.value = false
  }
}
</script>

