<script setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import SelectStepRaffle from '@/components/SelectStepRaffle.vue';
import { api } from '@/api.js';

const props = defineProps({
  dateTimes: { type: Array, default: () => [] },
});

const router = useRouter();
const toast = useToast();

const form = reactive({
  raffle_time_id: null,
  card: '',
  name: '',
  phone: '',
});

const errors = reactive({
  card: null,
  name: null,
  phone: null,
});

const submitting = reactive({ value: false });

const classes = computed(() => ({
  card: {
    label: { 'text-red-600': errors.card, 'text-grey-900': !errors.card },
    input: { 'ring-red-600': errors.card, 'ring-gray-300': !errors.card },
    text: errors.card,
  },
  name: {
    label: { 'text-red-600': errors.name, 'text-grey-900': !errors.name },
    input: { 'ring-red-600': errors.name, 'ring-gray-300': !errors.name },
    text: errors.name,
  },
  phone: {
    label: { 'text-red-600': errors.phone, 'text-grey-900': !errors.phone },
    input: { 'ring-red-600': errors.phone, 'ring-gray-300': !errors.phone },
    text: errors.phone,
  },
}));

const submit = async () => {
  submitting.value = true;
  try {
    await api.leadStore({
      raffle_time_id: form.raffle_time_id,
      card: form.card,
      name: form.name || null,
      phone: form.phone || null,
    });
    errors.card = errors.name = errors.phone = null;
    router.push({ name: 'success' });
  } catch (e) {
    const msg = e.message || 'Произошла ошибка';
    if (/карт/i.test(msg)) errors.card = msg;
    toast.error(msg);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="submit">
        <select-step-raffle
          v-if="props.dateTimes.length"
          :date-times="props.dateTimes"
          v-model="form.raffle_time_id"
        />
        <div>
          <label for="code" class="block text-sm font-medium leading-6" :class="classes.card.label">
            Код карты
          </label>
          <div class="mt-2">
            <input
              v-model.trim="form.card"
              id="code"
              required
              :class="classes.card.input"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
          </div>
          <div class="text-red-600" v-show="classes.card.text">{{ classes.card.text }}</div>
        </div>

        <div>
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900" :class="classes.name.label">
            Имя Фамилия
          </label>
          <div class="mt-2">
            <input
              id="name"
              v-model.trim="form.name"
              :class="classes.name.input"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
          </div>
          <div class="text-red-600" v-show="classes.name.text">{{ classes.name.text }}</div>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900" :class="classes.phone.label">
            Телефон
          </label>
          <div class="mt-2">
            <input
              id="phone"
              :class="classes.phone.input"
              v-model.trim="form.phone"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
          </div>
          <div class="text-red-600" v-show="classes.phone.text">{{ classes.phone.text }}</div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="submitting.value"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span v-if="!submitting.value">Подать заявку</span>
            <span v-else>Загрузка</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
