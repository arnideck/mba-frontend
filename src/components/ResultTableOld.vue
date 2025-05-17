<template>
  <div class="w-full overflow-x-auto">
    <div v-if="!data || data.length === 0" class="text-center py-8 text-gray-500">
      Nenhum dado para exibir
    </div>
    <div v-else>
      <vue-good-table
        :columns="columns"
        :rows="data"
        :search-options="{
          enabled: true,
          placeholder: 'Pesquisar...',
        }"
        :pagination-options="{
          enabled: true,
          perPage: 10,
          perPageDropdown: [5, 10, 20, 50],
          dropdownAllowAll: false,
          nextLabel: 'Próximo',
          prevLabel: 'Anterior',
          rowsPerPageLabel: 'Linhas por página',
          ofLabel: 'de',
          pageLabel: 'Página',
          allLabel: 'Todos',
        }"
        styleClass="vgt-table striped bordered condensed"
      >
        <template #emptystate>
          <div class="text-center py-8 text-gray-500">
            Nenhum resultado encontrado
          </div>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const columns = ref([]);

// Gerar colunas dinamicamente com base nos dados
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    columns.value = Object.keys(newData[0]).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      field: key,
      sortable: true
    }));
  } else {
    columns.value = [];
  }
}, { immediate: true });
</script>

<style>
.vgt-table {
  @apply rounded-lg shadow;
}
.vgt-table th {
  @apply bg-gray-100 text-gray-700 font-semibold;
}
.vgt-table td {
  @apply border-t border-gray-200;
}
.vgt-table.striped tbody tr:nth-of-type(odd) {
  @apply bg-gray-50;
}
</style>
