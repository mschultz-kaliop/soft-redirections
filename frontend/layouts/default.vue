<template>
<div class="layout-default">
  <div class="navbar bg-neutral text-neutral-content lg:px-64">
    <NuxtLink :to="{ name: 'index' }">
      <span class="text-2xl font-bold text-accent">Soft Redirection Project</span>
    </NuxtLink>
  </div>
  <slot />
</div>
</template>
