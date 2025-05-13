<template>
  <div class="w-full h-[400px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const dynamicLabelKey = computed(() => {
  const keys = props.data.length ? Object.keys(props.data[0]) : [];
  return keys.find(k => typeof props.data[0][k] === 'string') || keys[0];
});

const dynamicValueKey = computed(() => {
  const keys = props.data.length ? Object.keys(props.data[0]) : [];
  return keys.find(k => !isNaN(parseFloat(props.data[0][k]))) || keys[1];
});

const chartData = computed(() => {
  return {
    labels: props.data.map(item => item[dynamicLabelKey.value]),
    datasets: [
      {
        label: 'Resultado',
        data: props.data.map(item => parseFloat(item[dynamicValueKey.value])),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderRadius: 8,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>
