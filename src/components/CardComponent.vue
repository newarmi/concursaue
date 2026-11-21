<script setup>
import card from '@/assets/card1.svg';
</script>

<template>
  <img class="card" :src="card" alt="card" />
</template>

<style scoped>
.card {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  /* скругление запечено в card1.svg (rx) и не меняется никогда:
     никаких CSS-переходов/наклонов на карте при старте анимации */
}
</style>
