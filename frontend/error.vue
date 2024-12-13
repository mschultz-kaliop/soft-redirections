<script setup lang="ts">
defineProps({
  error: Object,
})
</script>

<template>
  <div>
    <NuxtLayout>
      <section
        class="error px-24 py-24"
      >
        <h1 class="text-5xl font-bold text-center mb-4">Error {{ error?.statusCode }}</h1>
        <h2 class="text-4xl font-semibold text-center">{{ error?.message }}</h2>
      </section>
    </NuxtLayout>
  </div>
</template>
