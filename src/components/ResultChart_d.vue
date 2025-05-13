<template>
  <div style="height: 400px;">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const canvasRef = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = canvasRef.value?.getContext('2d');
  if (!ctx) {
    console.warn('Canvas context not available yet.');
    return;
  }

  const labels = props.data.map(item => item.produtor_nome || item.producer_name);
  const values = props.data.map(item => parseFloat(item.total_premium));

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Premium',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

watch(() => props.data, async () => {
  if (props.data?.length) {
    await nextTick(); // Aguarda canvas ser renderizado no DOM
    renderChart();
  }
}, { immediate: true });

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>