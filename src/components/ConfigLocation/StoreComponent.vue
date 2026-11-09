<script setup>
import InputLabel from '@/components/InputLabel.vue';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { api } from '@/api.js';

const emit = defineEmits(['reload']);
const toast = useToast();

const form = reactive({
  name: '',
  timeZ: '',
});

const submitting = reactive({ value: false });

const submit = async () => {
  submitting.value = true;
  try {
    await api.locationStore({ name: form.name, timeZ: form.timeZ });
    form.name = '';
    form.timeZ = '';
    toast.success('Локация сохранена');
    emit('reload');
  } catch (e) {
    toast.error(e.message);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div>
    <div class="p-6 lg:p-8 bg-white border-b border-gray-200">
      <h1 class="text-2xl font-medium text-gray-900 mb-8">Создание локации</h1>
      <div>
        <input-label class="mb-4">
          <div class="inline-flex flex-col">
            <span class="mr-2">имя или адресс</span>
            <input
              type="text"
              name="name"
              class="border-gray-300 rounded-md shadow-sm"
              v-model="form.name"
            >
          </div>
        </input-label>
        <input-label class="mb-4">
          <div class="inline-flex flex-col">
            <span class="mr-2">часовой пояс</span>
            <input
              type="number"
              name="name"
              class="border-gray-300 rounded-md shadow-sm"
              v-model.number="form.timeZ"
            >
          </div>
        </input-label>
      </div>

      <button
        @click="submit"
        type="button"
        :disabled="submitting.value"
        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
