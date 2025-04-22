<template>
  <div class="flex space-x-2 mt-4">
    <button 
      @click="exportPDF" 
      class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
      :disabled="!hasData || isExporting"
    >
      <span v-if="isExporting && exportType === 'pdf'" class="mr-2">
        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      <span>⬇ PDF</span>
    </button>
    <button 
      @click="exportExcel" 
      class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
      :disabled="!hasData || isExporting"
    >
      <span v-if="isExporting && exportType === 'excel'" class="mr-2">
        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      <span>⬇ Excel</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  filename: {
    type: String,
    default: 'relatorio'
  }
});

const isExporting = ref(false);
const exportType = ref(null);

const hasData = computed(() => props.data && props.data.length > 0);

const exportExcel = async () => {
  if (!hasData.value || isExporting.value) return;
  
  isExporting.value = true;
  exportType.value = 'excel';
  
  try {
    const worksheet = XLSX.utils.json_to_sheet(props.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    
    // Gerar arquivo e fazer download
    XLSX.writeFile(workbook, `${props.filename}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
  } finally {
    setTimeout(() => {
      isExporting.value = false;
      exportType.value = null;
    }, 1000);
  }
};

const exportPDF = async () => {
  if (!hasData.value || isExporting.value) return;
  
  isExporting.value = true;
  exportType.value = 'pdf';
  
  try {
    const doc = new jsPDF();
    
    // Adicionar título
    doc.setFontSize(16);
    doc.text(props.filename, 14, 15);
    
    // Preparar dados para tabela
    const headers = Object.keys(props.data[0]);
    const rows = props.data.map(item => headers.map(key => item[key]));
    
    // Adicionar tabela
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 25,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255
      }
    });
    
    // Salvar PDF
    doc.save(`${props.filename}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
  } finally {
    setTimeout(() => {
      isExporting.value = false;
      exportType.value = null;
    }, 1000);
  }
};
</script>
