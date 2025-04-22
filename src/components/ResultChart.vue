<template>
  <div class="w-full">
    <div v-if="!chartData || !chartType" class="text-center py-8 text-gray-500">
      Nenhum gráfico para exibir
    </div>
    <div v-else class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ chartTitle }}</h3>
      <div class="h-80">
        <Bar v-if="chartType === 'bar'" :data="chartData" :options="chartOptions" />
        <Line v-else-if="chartType === 'line'" :data="chartData" :options="chartOptions" />
        <Pie v-else-if="chartType === 'pie'" :data="chartData" :options="chartOptions" />
        <Doughnut v-else-if="chartType === 'doughnut'" :data="chartData" :options="chartOptions" />
        <div v-else class="text-center py-8 text-gray-500">
          Tipo de gráfico não suportado
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  chartType: {
    type: String,
    default: 'bar',
    validator: (value) => ['bar', 'line', 'pie', 'doughnut'].includes(value)
  },
  labelField: {
    type: String,
    default: ''
  },
  valueField: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Visualização de Dados'
  }
});

const chartTitle = computed(() => props.title);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: chartTitle.value
    }
  }
};

const chartData = computed(() => {
  if (!props.data || props.data.length === 0 || !props.labelField || !props.valueField) {
    return null;
  }

  const labels = props.data.map(item => item[props.labelField]);
  const values = props.data.map(item => item[props.valueField]);
  
  // Gerar cores aleatórias para gráficos de pizza/doughnut
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
  };

  // Configuração diferente para gráficos de pizza/doughnut
  if (['pie', 'doughnut'].includes(props.chartType)) {
    return {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: generateColors(values.length)
        }
      ]
    };
  }

  // Configuração para gráficos de barra/linha
  return {
    labels: labels,
    datasets: [
      {
        label: props.valueField,
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
});
</script>
