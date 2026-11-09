<script setup>
import InputLabel from '@/components/InputLabel.vue';
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { api } from '@/api.js';

const props = defineProps({
  location: Array,
});
const emit = defineEmits(['reload']);
const toast = useToast();

const isEdit = ref(false);
const editForm = reactive({ arr: null });
const submitting = reactive({ value: false });

const edit = () => {
  editForm.arr = props.location.map((l) => ({ ...l }));
  isEdit.value = true;
};

const editClose = () => {
  editForm.arr = null;
  isEdit.value = false;
};

const removeLocation = async (id) => {
  if (!confirm('Удалить локацию?')) return;
  try {
    await api.locationDestroy(id);
    toast.success('Удалено');
    emit('reload');
  } catch (e) {
    toast.error(e.message);
  }
};

const submit = async () => {
  submitting.value = true;
  try {
    await api.locationUpdateAll({ arr: editForm.arr });
    toast.success('Сохранено');
    editClose();
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
      <h1 class="text-2xl font-medium text-gray-900 mb-8">Созданные локации</h1>
      <template v-if="props.location.length">
        <ul v-if="!isEdit" class="mb-4">
          <li v-for="locationItem in props.location" :key="locationItem.id" class="mb-2">
            {{ locationItem.name }}
            <button
              @click="removeLocation(locationItem.id)"
              class="text-sm rounded-md px-3 py-1 bg-red-700 text-white"
            >
              Удалить
            </button>
          </li>
          <button
            @click="edit"
            class="flex my-6 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Редактировать
          </button>
        </ul>
        <div v-else>
          <div v-for="(item, idx) in editForm.arr" :key="idx">
            <input-label class="mb-4">
              <div class="inline-flex flex-col">
                <span class="mr-2">Название мероприятия</span>
                <input
                  type="text"
                  name="name"
                  class="border-gray-300 rounded-md shadow-sm"
                  v-model="item.name"
                >
              </div>
            </input-label>
            <input-label class="mb-4">
              <div class="inline-flex flex-col">
                <span class="mr-2">Временная зона проведения</span>
                <input
                  type="text"
                  name="name"
                  class="border-gray-300 rounded-md shadow-sm"
                  v-model="item.timeZ"
                >
              </div>
            </input-label>
          </div>
          <div class="flex items-center">
            <button
              class="flex justify-center mr-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click.prevent="submit"
              :disabled="submitting.value"
            >
              Cохранить
            </button>
            <button class="rounded-md px-3 py-1.5 bg-red-700 text-white" @click.prevent="editClose">
              Отмена
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
