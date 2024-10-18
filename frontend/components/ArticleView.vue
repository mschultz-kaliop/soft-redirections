<script setup lang="ts">
  import type { Article } from '~/types/article'

  type Props = {
    article: Article;
  }
  const props = defineProps<Props>()
</script>

<template>
  <section
    class="article-list px-24 py-24"
  >
    <h1 class="text-5xl font-bold text-center">{{ article.title }}</h1>
    <div class="mt-24 px-24">
      <p>Slug : {{ article.slug }}</p>
    </div>
  </section>
</template>
