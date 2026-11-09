<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  // внутренний маршрут (hash) — рендерит router-link
  to: { type: String, default: null },
  // внешняя ссылка / ссылка в новой вкладке — рендерит <a target="_blank">
  href: { type: String, default: null },
});

const route = useRoute();
const isActive = computed(() => !!props.to && route.path === props.to);
</script>

<template>
  <component
    :is="href ? 'a' : 'router-link'"
    :to="href ? undefined : to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
    :class="isActive
      ? 'text-white bg-indigo-600'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
  >
    <slot />
  </component>
</template>
