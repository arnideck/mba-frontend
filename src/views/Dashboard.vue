<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">BI Conversacional 🔍</h1>
    
    <!-- Input de pergunta -->
    <ChatInput 
      @send-question="handleQuestion" 
    />
    
    <!-- Status de carregamento -->
    <LoadingStatus 
      :loading="loading" 
      :message="loadingMessage" 
    />
    
    <!-- Resultados -->
    <div v-if="resultData.length > 0" class="mt-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div v-if="sqlQuery" class="mb-4 p-4 bg-gray-100 rounded-md">
          <h3 class="text-sm font-medium text-gray-700 mb-2">SQL Gerado:</h3>
          <pre class="text-xs text-gray-600 overflow-x-auto">{{ sqlQuery }}</pre>
        </div>
        
        <h2 class="text-xl font-semibold mb-4">Resultado:</h2>
        
        <!-- Tabela de resultados -->
        <ResultTable :data="resultData" />
        
        <!-- Botões de exportação -->
        <ExportButtons 
          :data="resultData" 
          :filename="'relatorio_' + new Date().toISOString().split('T')[0]" 
        />
        
        <!-- Botão para mostrar/esconder gráfico -->
        <div class="mt-4">
          <button 
            @click="showChart = !showChart" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{ showChart ? 'Esconder Gráfico' : '📊 Ver Gráfico' }}
          </button>
        </div>
        
        <!-- Gráfico de resultados -->
        <div v-if="showChart" class="mt-4">
          <ResultChart 
            :data="resultData" 
            :chart-type="chartType" 
            :label-field="chartLabelField" 
            :value-field="chartValueField" 
            :title="chartTitle" 
          />
        </div>
      </div>
    </div>
    
    <!-- Mensagem quando não há resultados -->
    <div v-else-if="questionSent && !loading" class="mt-6 p-6 bg-white rounded-lg shadow">
      <p class="text-gray-600 text-center">Nenhum resultado encontrado. Tente reformular sua pergunta.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatInput from '../components/ChatInput.vue';
import ResultTable from '../components/ResultTable.vue';
import ResultChart from '../components/ResultChart.vue';
import ExportButtons from '../components/ExportButtons.vue';
import LoadingStatus from '../components/LoadingStatus.vue';
import api from '../services/api.js';

// Estado da aplicação
const loading = ref(false);
const loadingMessage = ref('');
const questionSent = ref(false);
const resultData = ref([]);
const sqlQuery = ref('');
const showChart = ref(false);
const chartType = ref('bar');
const chartLabelField = ref('');
const chartValueField = ref('');
const chartTitle = ref('Visualização de Dados');

// Função para lidar com a pergunta enviada
const handleQuestion = async (question) => {
  loading.value = true;
  loadingMessage.value = 'Processando sua pergunta...';
  questionSent.value = true;
  showChart.value = false;
  
  try {
    // Chamada para a API
    const response = await api.sendQuestion(question);
    
    // Processar resposta
    if (response.data) {
      resultData.value = response.data.data || [];
      sqlQuery.value = response.data.sql || '';
      
      // Configurar gráfico com base na sugestão da API
      if (response.data.chart) {
        chartType.value = response.data.chart.type || 'bar';
        chartLabelField.value = response.data.chart.labelField || '';
        chartValueField.value = response.data.chart.valueField || '';
        chartTitle.value = response.data.chart.title || 'Visualização de Dados';
        
        // Mostrar gráfico automaticamente se houver sugestão
        showChart.value = true;
      } else {
        // Configuração padrão se não houver sugestão
        const keys = resultData.value.length > 0 ? Object.keys(resultData.value[0]) : [];
        chartLabelField.value = keys[0] || '';
        chartValueField.value = keys[1] || '';
      }
    }
  } catch (error) {
    console.error('Erro ao processar pergunta:', error);
    resultData.value = [];
    sqlQuery.value = '';
  } finally {
    loading.value = false;
    loadingMessage.value = '';
  }
};
</script>
