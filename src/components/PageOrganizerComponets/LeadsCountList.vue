<script setup>
defineProps({
  raffle: Array,
});
</script>

<template>
  <div>
    <div class="p-6 lg:p-8 bg-white border-b border-gray-200">
      <h1 class="text-2xl font-medium text-gray-900 mb-8">Список с количеством участников</h1>
      <ul>
        <li v-for="item in raffle" :key="item.id" class="mb-3">
          <p>Розыгрыш: {{ item.name }}</p>
          <ul class="ml-3">
            <li v-for="date_time in item.date_times" :key="date_time.id">
              <p>Этап: {{ date_time.name }}</p>
              <p class="font-bold">Зрг. участников: {{ date_time.leads_count }}</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>
