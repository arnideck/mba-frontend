<template>
  <div class="w-full">
    <div class="flex items-center space-x-2 mb-4">
      <input 
        type="text" 
        v-model="question" 
        placeholder="Digite sua pergunta aqui..." 
        class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="sendQuestion"
      />
      <button 
        @click="sendQuestion" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading"
      >
        Enviar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const question = ref('');
const isLoading = ref(false);

const emit = defineEmits(['send-question']);

const sendQuestion = () => {
  if (question.value.trim() === '' || isLoading.value) return;
  
  isLoading.value = true;
  emit('send-question', question.value);
  
  // Resetar o campo após enviar
  setTimeout(() => {
    question.value = '';
    isLoading.value = false;
  }, 500);
};
</script>
