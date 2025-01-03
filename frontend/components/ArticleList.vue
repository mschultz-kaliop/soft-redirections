<script setup lang="ts">
  import type { Article } from '~/types/article'

  type Props = {
    articles: Article[]
  }
  defineProps<Props>()

  const getBentoPropsByIndex = (index: number) => {
    switch (index) {
      case 0:
        return 'lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-12'
      case 1:
        return 'lg:col-start-6 lg:col-span-5 lg:row-start-1 lg:row-span-8'
      case 2:
        return 'lg:col-start-6 lg:col-span-4 lg:row-start-9 lg:row-span-4'
      case 3:
        return 'lg:col-start-11 lg:col-span-2 lg:row-start-1 lg:row-span-8'
      case 4:
        return 'lg:col-start-10 lg:col-span-3 lg:row-start-9 lg:row-span-4'
    }
  }
</script>

<template>
  <section class="article-list container mx-auto p-16">
    <div class="grid gap-4 lg:grid-cols-12 lg:grid-rows-12 lg:px-28">
      <div
        v-for="(article, index) in articles.slice(0, 5)"
        :key="article.id"
        class="flex flex-col justify-between rounded-lg bg-neutral p-8"
        :class="getBentoPropsByIndex(index)"
      >
        <h2 class="font-semibold size-6 mb-4 w-auto">{{ article.title }}</h2>
        <div class="card-actions justify-end">
          <NuxtLink :to="{ name: 'article-slug', params: { slug: article.slug } }">
            <button class="btn btn-accent">Read it</button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

