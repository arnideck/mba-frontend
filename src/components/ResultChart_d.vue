<template>
  <div v-if="charts.length" class="space-y-10">
    <div
      v-for="(chart, index) in charts"
      :key="index"
      class="bg-white p-4 rounded-lg shadow-md"
    >
      <h3 class="text-lg font-semibold mb-2">{{ chart.title }}</h3>
      <canvas :ref="el => chartRefs[index] = el" height="300"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const charts = ref([]);
const chartRefs = [];
const chartInstances = [];

function isIntegerColumn(values) {
  return values.every(v => Number.isInteger(parseFloat(v)));
}

function detectNumericKeys(data) {
  if (!Array.isArray(data) || !data.length) return [];

  const keys = Object.keys(data[0]);
  return keys.filter(k => typeof data[0][k] === 'number' || !isNaN(Number(data[0][k])));
}

function detectLabelKey(data) {
  if (!Array.isArray(data) || !data.length) return 'label';

  const keys = Object.keys(data[0]);
  return keys.find(k => typeof data[0][k] === 'string') || keys[0];
}

function renderCharts() {
  destroyAllCharts();
  charts.value.forEach((chart, index) => {
    const ctx = chartRefs[index]?.getContext('2d');
    if (!ctx) return;

    const config = {
      type: chart.type,
      data: {
        labels: chart.labels,
        datasets: [{
          label: chart.title,
          data: chart.values,
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#22d3ee'
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: chart.type === 'pie'
          }
        },
        indexAxis: chart.type === 'bar' ? 'y' : 'x'
      }
    };

    const instance = new Chart(ctx, config);
    chartInstances.push(instance);
  });
}

function destroyAllCharts() {
  chartInstances.forEach(chart => chart.destroy());
  chartInstances.length = 0;
}

function prepareCharts(data) {
  if (!data?.length) {
    charts.value = [];
    return;
  }

  const numericKeys = detectNumericKeys(data);
  const labelKey = detectLabelKey(data);

  charts.value = numericKeys.map(key => {
    const values = data.map(item => parseFloat(item[key]));
    const labels = data.map(item => item[labelKey]);
    const isInteger = isIntegerColumn(values);

    return {
      key,
      labels,
      values,
      type: isInteger ? 'pie' : 'bar',
      title: formatLabel(key)
    };
  });
}

function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

watch(() => props.data, (newData) => {
  prepareCharts(newData);
  setTimeout(renderCharts, 0);
}, { immediate: true });

onMounted(() => {
  prepareCharts(props.data);
  renderCharts();
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
