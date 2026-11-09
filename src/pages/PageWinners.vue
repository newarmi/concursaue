<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { api } from '@/api.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const winners = ref([]);

onMounted(async () => {
  try {
    const data = await api.winnersIndex();
    winners.value = data.winners || [];
  } catch (e) {
    toast.error(e.message);
  }
});
</script>

<template>
  <AppLayout title="Победители">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Победители</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <div class="p-6 lg:p-8">
            <ul>
              <li v-for="w in winners" :key="w.id" class="mb-2">
                <template v-if="w.lead">
                  {{ w.lead.name || w.lead.card }} — {{ w.lead.phone }}
                </template>
                <template v-else>Победитель #{{ w.id }}</template>
              </li>
              <li v-if="!winners.length" class="text-gray-500">Пока нет победителей</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
