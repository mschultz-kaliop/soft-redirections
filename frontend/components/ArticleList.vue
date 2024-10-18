<script setup lang="ts">
  import type { Article } from '~/types/article'

  type Props = {
    articles: Article[]
  }
  defineProps<Props>()
</script>

<template>
  <section class="article-list text-center px-24 py-24">
    <h1 class="text-5xl font-bold">ARTICLE LIST</h1>

    <div class="flex justify-evenly mt-24">
      <div
        v-for="article in articles"
        :key="article.id"
        class="card bg-neutral w-96 shadow-xl"
      >
        <div class="card-body">
          <h2 class="card-title">{{ article.title }}</h2>
          <p>Slug : {{ article.slug }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
