<template>
<div class="layout-default">
  <div class="navbar bg-neutral text-neutral-content px-24">
    <NuxtLink :to="{ name: 'index' }">
      <span class="text-2xl font-bold">Soft Redirection Project</span>
    </NuxtLink>
  </div>
  <slot />
</div>
</template>
