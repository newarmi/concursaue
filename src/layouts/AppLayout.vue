<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import NavLink from '@/components/NavLink.vue';
import logo from '@/assets/logo.svg';
import { hasToken, setToken } from '@/api.js';

defineProps({
  title: String,
});

const router = useRouter();
const open = ref(false);
const isAdmin = computed(() => hasToken());

const logout = () => {
  setToken('');
  open.value = false;
  router.push({ name: 'welcome' });
};
</script>

<template>
  <div>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Логотип + десктопное меню -->
            <div class="flex items-center min-w-0">
              <router-link :to="{ name: 'couponAdded' }" class="flex items-center gap-2 shrink-0">
                <img :src="logo" alt="Kari" class="h-8 w-auto" />
              </router-link>

              <nav class="hidden md:flex items-center ml-6 space-x-1">
                <NavLink :to="'/couponAdded'">Заявка на вступление</NavLink>
                <template v-if="isAdmin">
                  <NavLink :to="'/raffleConfig'">Конфигурация</NavLink>
                  <NavLink :to="'/organizer'">Организатор</NavLink>
                  <NavLink :to="'/raffleAdmin'">Панель розыгрыша</NavLink>
                  <NavLink href="#/raffle">Розыгрыш</NavLink>
                  <NavLink href="#/raffleDemo">Demo</NavLink>
                </template>
              </nav>
            </div>

            <!-- Вход / выход -->
            <div class="hidden md:flex items-center shrink-0">
              <button
                v-if="isAdmin"
                type="button"
                @click="logout"
                class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Выйти
              </button>
              <router-link
                v-else
                :to="{ name: 'adminLogin' }"
                class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Вход
              </router-link>
            </div>

            <!-- Гамбургер -->
            <div class="md:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                @click="open = !open"
              >
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    v-if="!open"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Мобильное меню -->
        <div v-if="open" class="md:hidden border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <NavLink :to="'/couponAdded'">Заявка на вступление</NavLink>
            <template v-if="isAdmin">
              <NavLink :to="'/raffleConfig'">Конфигурация</NavLink>
              <NavLink :to="'/organizer'">Организатор</NavLink>
              <NavLink :to="'/raffleAdmin'">Панель розыгрыша</NavLink>
              <NavLink href="#/raffle">Розыгрыш</NavLink>
              <NavLink href="#/raffleDemo">Demo</NavLink>
            </template>
            <div class="border-t border-gray-200 my-2"></div>
            <button
              v-if="isAdmin"
              type="button"
              @click="logout"
              class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Выйти
            </button>
            <router-link
              v-else
              :to="{ name: 'adminLogin' }"
              class="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Вход
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Page Heading -->
      <header v-if="$slots.header" class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <slot name="header" />
        </div>
      </header>

      <!-- Page Content -->
      <main class="h-full">
        <slot />
      </main>
    </div>
  </div>
</template>
