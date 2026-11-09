<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import Dashboard from '@/components/RaffleAdmin/Dashbord.vue';
</script>

<template>
  <AppLayout title="Панель управления розыгрышем">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Панель управления розыгрышем</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <Dashboard />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
</style>
