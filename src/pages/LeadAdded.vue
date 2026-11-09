<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AddLeadForm from '@/components/AddLeadForm.vue';
import { api } from '@/api.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const dateTimes = ref([]);

onMounted(async () => {
  try {
    const data = await api.getActiveRaffle();
    dateTimes.value = data.dateTimes || [];
  } catch (e) {
    toast.error(e.message);
  }
});
</script>

<template>
  <AppLayout title="Заявка на вступление">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Заявка на вступление</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <AddLeadForm :date-times="dateTimes" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
