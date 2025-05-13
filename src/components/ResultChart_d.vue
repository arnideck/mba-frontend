<template>
  <div v-if="chartData && chartLabels.length && isValidData" class="mt-6">
    <h2 class="font-semibold mb-2">📊 Gráfico</h2>
    <Bar
      :data="{
        labels: chartLabels,
        datasets: [
          {
            label: datasetLabel,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: chartData
          }
        ]
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }"
      height="300"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  data: Array,
  labelKey: String,
  valueKey: String,
  datasetLabel: {
    type: String,
    default: 'Valores'
  }
});

const isValidData = computed(() => {
  return Array.isArray(props.data) && props.data.length > 0 &&
         props.data.every(item => props.labelKey in item && props.valueKey in item);
});

const chartLabels = computed(() => props.data?.map(item => item[props.labelKey]) || []);
const chartData = computed(() => props.data?.map(item => Number(item[props.valueKey])) || []);
</script>