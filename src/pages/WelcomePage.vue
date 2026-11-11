<script setup>
import { hasToken } from '@/api.js';
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center px-6">
      <h1 class="text-4xl font-bold text-gray-900">Kari</h1>
      <p class="mt-3 text-gray-600">Розыгрыши и купоны</p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          :to="{ name: 'couponAdded' }"
          class="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Заявка на вступление
        </router-link>
        <router-link
          :to="{ name: 'adminLogin' }"
          class="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {{ hasToken() ? 'Админка' : 'Вход' }}
        </router-link>
      </div>
    </div>
  </div>
</template>
