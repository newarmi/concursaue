<script setup>
import dayjs from 'dayjs';
import { reactive, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import InputLabel from '@/components/InputLabel.vue';
import TextInput from '@/components/TextInput.vue';
import { useToast } from 'vue-toastification';
import { api } from '@/api.js';

const props = defineProps({
  raffle: Array,
});
const emit = defineEmits(['reload']);
const toast = useToast();

const isEdit = ref(false);
const editForm = reactive({ arr: null });
const submitting = reactive({ value: false });

const edit = () => {
  editForm.arr = props.raffle.map((r) => ({
    ...r,
    date_times: (r.date_times || []).map((t) => ({ ...t, start: new Date(t.start) })),
  }));
  isEdit.value = true;
};

const editClose = () => {
  editForm.arr = null;
  isEdit.value = false;
};

const addFiled = (item) => {
  item.date_times.push({ name: '', start: new Date(), winners: 1 });
};

const deleteFiled = (form, index) => {
  form.date_times.splice(index, 1);
};

const removeRaffle = async (id) => {
  if (!confirm('Удалить розыгрыш?')) return;
  try {
    await api.raffleDestroy(id);
    toast.success('Удалено');
    emit('reload');
  } catch (e) {
    toast.error(e.message);
  }
};

const submit = async () => {
  submitting.value = true;
  try {
    await api.raffleUpdateAll({
      arr: editForm.arr.map((item) => ({
        ...item,
        date_times: (item.date_times || []).map((el) => ({
          ...el,
          start: dayjs(el.start).toISOString(),
        })),
      })),
    });
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
      <h1 class="text-2xl font-medium text-gray-900 mb-8">Созданные мероприятия</h1>
      <template v-if="props.raffle.length">
        <ul v-if="!isEdit" class="mb-4">
          <li v-for="raffleItem in props.raffle" :key="raffleItem.id" class="mb-2">
            <p>{{ raffleItem.name }}</p>
            <p>{{ raffleItem.active ? 'Активирован' : 'Не активирован' }}</p>
            <button
              @click="removeRaffle(raffleItem.id)"
              class="text-sm rounded-md px-3 py-1 bg-red-700 text-white"
            >
              Удалить
            </button>
            <ul class="ml-2">
              <li
                class="mb-2"
                v-for="dateTimesItem in raffleItem.date_times"
                :key="dateTimesItem.id || Math.random()"
              >
                <p class="mr-1">Название розыгрыша: {{ dateTimesItem.name }}</p>
                <p>Время проведения: {{ dayjs(dateTimesItem.start).format('DD.MM.YYYY HH:mm') }}</p>
                <p>Колличество: {{ dateTimesItem.winners }}</p>
              </li>
            </ul>
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
                <span class="mr-2">Активен</span>
                <input
                  type="checkbox"
                  name="name"
                  class="border-gray-300 rounded-md shadow-sm"
                  v-model="item.active"
                >
              </div>
            </input-label>
            <div>
              <div
                class="ml-3 inline-flex items-start flex-col mb-6 w-full"
                v-for="(innerItem, i) in item.date_times"
                :key="i"
              >
                <input-label class="mr-2">
                  <div class="inline-flex mb-2 flex-col">
                    <span class="mr-2">Название</span>
                    <text-input v-model="innerItem.name" />
                  </div>
                </input-label>
                <input-label>
                  <div class="inline-flex mb-2 flex-col">
                    <span class="mr-2">Время</span>
                    <vue-date-picker
                      :teleport="true"
                      format="dd.MM.yyyy HH:mm"
                      locale="ru"
                      v-model="innerItem.start"
                      class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    />
                  </div>
                </input-label>
                <input-label class="mr-2">
                  <div class="inline-flex flex-col">
                    <span class="mr-2">Колличество проводимых розыгрышей</span>
                    <text-input type="number" v-model.number="innerItem.winners" />
                  </div>
                </input-label>
                <button
                  class="mt-2 rounded-md px-3 py-1.5 bg-red-700 text-white"
                  @click.prevent="deleteFiled(item, i)"
                >
                  x
                </button>
              </div>
            </div>
            <button
              class="flex my-6 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click.prevent="addFiled(item)"
            >
              Добавить этап
            </button>
          </div>
          <div class="flex items-center">
            <button
              class="flex justify-center mr-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click.prevent="submit"
              :disabled="submitting.value"
            >
              Cохранить
            </button>
            <button
              class="rounded-md px-3 py-1.5 bg-red-700 text-white"
              @click.prevent="editClose"
            >
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
