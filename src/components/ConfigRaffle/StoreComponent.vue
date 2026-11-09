<script setup>
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { api } from '@/api.js';
dayjs.extend(utc);

const emit = defineEmits(['reload']);
const toast = useToast();

const imgForm = () => ({ name: '', start: new Date(), winners: 1 });

const form = reactive({
  name: '',
  dateTimes: [imgForm()],
});

const submitting = reactive({ value: false });

const deleteFiled = (index) => {
  form.dateTimes.splice(index, 1);
};

const addFiled = () => {
  form.dateTimes.push(imgForm());
};

const submit = async () => {
  submitting.value = true;
  try {
    await api.raffleStore({
      name: form.name,
      dateTimes: form.dateTimes.map((el) => ({
        ...el,
        start: dayjs(el.start).toISOString(),
      })),
    });
    form.name = '';
    form.dateTimes = [imgForm()];
    toast.success('Розыгрыш сохранён');
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
      <h1 class="text-2xl font-medium text-gray-900 mb-8">Создание розыгрыша</h1>
      <div>
        <input-label class="mb-4">
          <div class="inline-flex flex-col">
            <span class="mr-2">Название мероприятия</span>
            <input
              type="text"
              name="name"
              class="border-gray-300 rounded-md shadow-sm"
              v-model="form.name"
            >
          </div>
        </input-label>
        <div>
          <div
            class="ml-3 inline-flex items-start flex-col mb-6 w-full"
            v-for="(item, i) in form.dateTimes"
            :key="i"
          >
            <input-label class="mr-2">
              <div class="inline-flex mb-2 flex-col">
                <span class="mr-2">Название</span>
                <text-input v-model="item.name" />
              </div>
            </input-label>
            <input-label>
              <div class="inline-flex mb-2 flex-col">
                <span class="mr-2">Время</span>
                <vue-date-picker
                  :teleport="true"
                  format="dd.MM.yyyy HH:mm"
                  locale="ru"
                  v-model="item.start"
                  class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                />
              </div>
            </input-label>
            <input-label class="mr-2">
              <div class="inline-flex flex-col">
                <span class="mr-2">Колличество проводимых розыгрышей</span>
                <text-input type="number" v-model.number="item.winners" />
              </div>
            </input-label>
            <button
              class="mt-2 rounded-md px-3 py-1.5 bg-red-700 text-white"
              @click="deleteFiled(i)"
            >
              x
            </button>
          </div>
        </div>
        <button
          type="button"
          class="flex my-6 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click.prevent="addFiled"
        >
          Добавить этап
        </button>
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
