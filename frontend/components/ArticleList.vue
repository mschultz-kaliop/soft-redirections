<script setup lang="ts">
  import type { Article } from '~/types/article'

  type Props = {
    articles: Article[]
  }
  defineProps<Props>()
</script>

<template>
  <section class="article-list">
    ARTICLE LIST
    <div v-for="article in articles" :key="article.id">
      {{ article.title }}
      {{ article.slug }}
    </div>
  </section>
</template>
