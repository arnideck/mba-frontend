<template>
  <div v-if="loading" class="flex items-center justify-center py-4">
    <div class="flex flex-col items-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
      <p class="text-gray-600">{{ message || 'Carregando...' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
});
</script>
