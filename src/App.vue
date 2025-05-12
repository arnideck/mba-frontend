<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold">MBA BI Conversacional</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <ChatInput @send-question="fazerPergunta" />

      <div v-if="resposta" class="mt-6 p-4 bg-white shadow rounded border border-gray-200">
        <p class="text-lg font-semibold mb-2">Resposta:</p>
        <p class="text-gray-800">{{ resposta }}</p>
        <p class="text-lg font-semibold mb-2">Raciocínio:</p>
        <p class="text-gray-800">{{ raciocinio }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChatInput from './components/ChatInput.vue';
import { perguntar } from './services/api.js';

// Token JWT gerado manualmente (deve estar alinhado com o JWT_SECRET do backend)
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZnJvbnRlbmQtZGV2IiwiaWF0IjoxNzE0NzE3NzYyLCJleHAiOjE3MTUzMjI1NjJ9.WA0ZVxXLtdCrZs2nHkFzN1a_AuYdYwEOOt6wH4TnKx4';
localStorage.setItem('jwt_token', jwtToken);

const resposta = ref('');
const raciocinio = ref('');

const fazerPergunta = async (pergunta) => {
  resposta.value = 'Carregando...';
  raciocinio.value = '';
  try {
    const { data } = await perguntar(pergunta);
    resposta.value = data.resposta || 'Nenhuma resposta retornada.';
    raciocinio.value = data.raciocinio || 'Nenhum raciocínio retornado.';
    } catch (err) {
    resposta.value = 'Erro ao buscar resposta.';
    raciocinio.value = '';
    console.error('Erro:', err);
  }
};
</script>

