<script setup lang="ts">
  import type { Article } from '~/types/article'

  const { $axios } = useNuxtApp()

  const { data } = await useAsyncData('articles', async () => {
    const response = await $axios.get<Article[]>('/articles')

    return response.data
  })

  const articles = computed(() => data.value ?? [])
</script>

<template>
  <div class="homepage">
    <ArticleList :articles="articles" />
  </div>
</template>
