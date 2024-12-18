<script setup lang="ts">
  import type { Article } from '~/types/article'

  type Props = {
    articles: Article[]
  }
  defineProps<Props>()
</script>

<template>
  <section class="article-list container p-20">
    <h1 class="text-5xl font-bold lg:px-28">ARTICLE LIST</h1>

    <div class="flex flex-wrap justify-evenly gap-8 mt-20">
      <div
        v-for="article in articles"
        :key="article.id"
        class="card bg-neutral w-96 shadow-xl"
      >
        <div class="card-body">
          <h2 class="card-title">{{ article.title }}</h2>
          <p>Slug : {{ article.slug }}</p>
          <div class="card-actions justify-end">
            <NuxtLink :to="{ name: 'article-slug', params: { slug: article.slug } }">
              <button class="btn btn-accent">Read it</button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
