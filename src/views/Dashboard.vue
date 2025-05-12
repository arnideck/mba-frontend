<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Consultas BI</h1>

    <ChatInput @send-question="fazerPergunta" />

    <LoadingStatus :loading="carregando" />

    <div v-if="resposta" class="mt-4">
      <h2 class="font-semibold">Resposta:</h2>
      <p class="whitespace-pre-wrap text-gray-800">{{ resposta }}</p>
    </div>

    <div v-if="tabela.length" class="mt-6">
      <h2 class="font-semibold mb-2">Resultado:</h2>
      <ResultTable :dados="tabela" />
      <ResultChart :dados="tabela" />
      <ExportButtons :dados="tabela" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatInput from '@/components/ChatInput.vue';
import LoadingStatus from '@/components/LoadingStatus.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';
import ExportButtons from '@/components/ExportButtons.vue';
import { perguntar } from '@/services/api.js';

const resposta = ref('');
const tabela = ref([]);
const carregando = ref(false);

const fazerPergunta = async (pergunta) => {
  resposta.value = '';
  tabela.value = [];
  carregando.value = true;

  try {
    const resultado = await perguntar(pergunta);
    resposta.value = resultado?.resposta || 'Sem resposta.';
    tabela.value = Array.isArray(resultado?.tabela) ? resultado.tabela : [];
  } catch (err) {
    console.error('Erro ao perguntar:', err);
    resposta.value = 'Erro ao processar a requisição.';
    tabela.value = [];
  } finally {
    carregando.value = false;
  }
};
</script>
