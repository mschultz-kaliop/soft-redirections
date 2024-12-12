<script setup lang="ts">
  import type { Article } from '~/types/article'

  const { $axios } = useNuxtApp()
  const route = useRoute()
  const articleSlug = computed(() => route.params.slug)

  const { data: article } = await useAsyncData(`article-${articleSlug.value}`, async () => {
    const response = await $axios.get<Article>(`/articleBySlug/${articleSlug.value}`)

    return response.data
  })

  if (!article.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  }
</script>

<template>
  <ArticleView v-if="article" :article="article" />
</template>
