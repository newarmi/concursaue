<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import RaffleStoreComponent from '@/components/ConfigRaffle/StoreComponent.vue';
import RaffleIndexComponent from '@/components/ConfigRaffle/indexComponent.vue';
import LocationStoreComponent from '@/components/ConfigLocation/StoreComponent.vue';
import LocationIndexComponent from '@/components/ConfigLocation/indexComponent.vue';
import { api } from '@/api.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const raffle = ref([]);
const location = ref([]);

const load = async () => {
  try {
    const data = await api.raffleConfig();
    raffle.value = data.raffle || [];
    location.value = data.location || [];
  } catch (e) {
    toast.error(e.message);
  }
};

onMounted(load);
</script>

<template>
  <AppLayout title="Конфигурация розыгрыша">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Настройки розыгрыша</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white shadow-xl sm:rounded-lg">
          <raffle-index-component :raffle="raffle" @reload="load" />
          <raffle-store-component @reload="load" />
        </div>
      </div>
    </div>
    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white shadow-xl sm:rounded-lg">
          <location-index-component :location="location" @reload="load" />
          <location-store-component @reload="load" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
