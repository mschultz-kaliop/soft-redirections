<script setup lang="ts">
  import type { Article } from '~/types/article'

  const { $axios } = useNuxtApp()

  const { data } = await useAsyncData('articles', async () => {
    const response = await $axios.get<{ data: Article[] }>('/articles')

    return response.data.data
  })

  const articles = computed(() => data.value ?? [])
</script>

<template>
  <div class="homepage">
    HOME
    <ArticleList :articles="articles" />
  </div>
</template>
