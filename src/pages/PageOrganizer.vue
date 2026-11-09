<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import LeadsCountList from '@/components/PageOrganizerComponets/LeadsCountList.vue';
import { api } from '@/api.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const raffle = ref([]);

onMounted(async () => {
  try {
    const data = await api.organizerIndex();
    raffle.value = data.raffle || [];
  } catch (e) {
    toast.error(e.message);
  }
});
</script>

<template>
  <AppLayout title="Информация о розыгрыше">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Информация о розыгрыше</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <leads-count-list :raffle="raffle" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
