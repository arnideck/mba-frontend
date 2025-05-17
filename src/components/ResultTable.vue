<template>
  <div class="overflow-x-auto rounded shadow border bg-white">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="(coluna, index) in colunas"
            :key="index"
            @click="ordenarPor(coluna)"
            class="text-left px-4 py-2 cursor-pointer select-none text-sm font-semibold text-gray-700 hover:text-blue-600"
          >
            {{ traduzirColuna(coluna) }}
            <span v-if="coluna === ordenacao.coluna">
              {{ ordenacao.crescente ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(linha, i) in dadosPaginados"
          :key="i"
          :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          class="text-sm text-gray-800"
        >
          <td
            v-for="(coluna, j) in colunas"
            :key="j"
            class="px-4 py-2 whitespace-nowrap"
          >
            {{ formatarValor(linha[coluna]) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalPaginas > 1" class="flex justify-center items-center space-x-2 mt-4 p-2">
      <button
        @click="paginaAtual--"
        :disabled="paginaAtual === 1"
        class="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span class="text-sm">Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button
        @click="paginaAtual++"
        :disabled="paginaAtual === totalPaginas"
        class="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const colunas = computed(() => (props.data.length ? Object.keys(props.data[0]) : []));

const ordenacao = ref({
  coluna: null,
  crescente: true,
});

const paginaAtual = ref(1);
const itensPorPagina = 5;

const ordenarPor = (coluna) => {
  if (ordenacao.value.coluna === coluna) {
    ordenacao.value.crescente = !ordenacao.value.crescente;
  } else {
    ordenacao.value.coluna = coluna;
    ordenacao.value.crescente = true;
  }
};

const dadosOrdenados = computed(() => {
  if (!ordenacao.value.coluna) return props.data;
  return [...props.data].sort((a, b) => {
    const valorA = a[ordenacao.value.coluna];
    const valorB = b[ordenacao.value.coluna];
    if (!isNaN(parseFloat(valorA)) && !isNaN(parseFloat(valorB))) {
      return ordenacao.value.crescente
        ? parseFloat(valorA) - parseFloat(valorB)
        : parseFloat(valorB) - parseFloat(valorA);
    }
    return ordenacao.value.crescente
      ? String(valorA).localeCompare(String(valorB))
      : String(valorB).localeCompare(String(valorA));
  });
});

const totalPaginas = computed(() =>
  Math.ceil(dadosOrdenados.value.length / itensPorPagina)
);

const dadosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina;
  return dadosOrdenados.value.slice(inicio, inicio + itensPorPagina);
});

const traduzirColuna = (coluna) => {
  const mapa = {
    producer_name: 'Produtor',
    total_premium: 'Prêmio Total',
    average_commission: 'Comissão Média',
    insurance_company: 'Seguradora',
    produto: 'Produto',
  };
  return mapa[coluna] || coluna;
};

const formatarValor = (valor) => {
  if (typeof valor === 'number' || (!isNaN(valor) && valor !== '')) {
    return parseFloat(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return valor;
};
</script>

<style scoped>
th {
  user-select: none;
}
</style>
