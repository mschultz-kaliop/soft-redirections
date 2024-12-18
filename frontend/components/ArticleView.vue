<script setup lang="ts">
  import type { Article } from '~/types/article'

  type Props = {
    article: Article;
  }
  const props = defineProps<Props>()
</script>

<template>
  <section
    class="article-view p-20"
  >
    <h1 class="text-5xl font-bold lg:px-28">{{ article.title }}</h1>
    <div class="mt-20 lg:px-28">
      <p>Slug : {{ article.slug }}</p>
    </div>
  </section>
</template>
