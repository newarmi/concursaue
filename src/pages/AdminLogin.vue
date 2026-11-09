<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { setToken, api } from '@/api.js';

const route = useRoute();
const router = useRouter();

const code = ref('');
const error = ref(null);
const submitting = ref(false);

const submit = async () => {
  submitting.value = true;
  error.value = null;
  try {
    await api.verify(code.value);
    setToken(code.value);
    const redirect = route.query.redirect;
    router.push(redirect || { name: 'raffleAdmin' });
  } catch (e) {
    error.value = e.message;
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-6">
    <div class="w-full max-w-sm bg-white shadow-xl sm:rounded-lg p-8">
      <h1 class="text-2xl font-semibold text-gray-900">Вход в админку</h1>
      <p class="mt-2 text-sm text-gray-500">Введите код доступа</p>

      <form class="mt-6 space-y-6" @submit.prevent="submit">
        <div>
          <label for="code" class="block text-sm font-medium leading-6 text-gray-900">Код</label>
          <div class="mt-2">
            <input
              id="code"
              type="password"
              v-model.trim="code"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
          </div>
          <div class="text-red-600 mt-1 text-sm" v-show="error">{{ error }}</div>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
        >
          <span v-if="!submitting">Войти</span>
          <span v-else>Проверка…</span>
        </button>
      </form>
    </div>
  </div>
</template>
