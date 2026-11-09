<script setup>
</script>

<template>
  <button
    v-bind="$attrs"
    class="flex justify-center rounded-md px-10 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-white disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>

<style scoped>
</style>
