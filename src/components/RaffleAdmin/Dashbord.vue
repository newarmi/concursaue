<script setup>
import Btn from '@/components/Btn.vue';
import CouponDisplaySettings from './CouponDisplaySettings.vue';
import { useBroadcastDashboard } from '@/composables/broadcast.js';

const {
  reload,
  startRiffles,
  stopRiffles,
  defineWinner,
  coupons,
  updateCoupons,
  deleteCoupon,
  deletingCouponId,
  disabledDefineWinners,
} = useBroadcastDashboard();
</script>

<template>
  <div class="flex min-h-full px-6 py-6 lg:px-8 gap-2">
    <Btn class="bg-indigo-600" @click="startRiffles">Запустить розыгрыш</Btn>
    <Btn class="bg-green-600" @click="defineWinner" :disabled="disabledDefineWinners">
      Определить победителя
    </Btn>
    <Btn class="bg-red-500" @click="stopRiffles">Завершить розыгрыш</Btn>
    <Btn class="bg-red-700" @click="reload">Принудительная перезагрузка</Btn>
  </div>
  <div class="flex flex-col min-h-full px-6 py-6 lg:px-8 gap-2">
    <div class="flex items-center gap-4">
      <h3 class="font-medium">Купоны:</h3>
      <button type="button" class="text-sm text-indigo-600 hover:underline" @click="updateCoupons">Обновить список</button>
    </div>
    <ul class="divide-y divide-gray-200">
      <li v-for="item in coupons" :key="item.id" class="flex items-center gap-3 py-2">
        <span>Код купона: {{ item.code }}</span>
        <span v-if="item.win" class="text-sm text-green-700">Победитель</span>
        <button
          type="button"
          class="ml-auto text-sm text-red-600 hover:underline disabled:opacity-50"
          :disabled="deletingCouponId !== null"
          @click="deleteCoupon(item)"
        >Удалить</button>
      </li>
    </ul>
    <p v-if="!coupons.length" class="text-sm text-gray-500">Купонов пока нет</p>
  </div>
  <CouponDisplaySettings />
</template>

<style scoped>
</style>
