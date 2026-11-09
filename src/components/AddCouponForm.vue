<script setup>
import { computed, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { api } from '@/api.js';

const toast = useToast();

const form = reactive({
  code: '',
});

const submitting = reactive({ value: false });
const error = reactive({ value: null });

const classes = computed(() => ({
  coupon: {
    label: {
      'text-red-600': error.value,
      'text-grey-900': !error.value,
    },
    input: {
      'ring-red-600': error.value,
      'ring-gray-300': !error.value,
    },
    text: error.value,
  },
}));

const submit = async () => {
  submitting.value = true;
  try {
    await api.couponStore({ code: form.code });
    error.value = null;
    toast.success('Купон добавлен!');
    form.code = '';
  } catch (e) {
    console.error(e);
    error.value = e.message;
    toast.error(`Опаньки! Все сломалось :(`);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label for="code" class="block text-sm font-medium leading-6" :class="classes.coupon.label">
            Код купона
          </label>
          <div class="mt-2">
            <input
              v-model.trim="form.code"
              id="code"
              required
              :class="classes.coupon.input"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
          </div>
          <div class="text-red-600" v-show="classes.coupon.text">{{ classes.coupon.text }}</div>
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
