<script setup>
import Btn from '@/components/Btn.vue';
import { useBroadcastDashboard } from '@/composables/broadcast.js';

const {
  reload,
  startRiffles,
  stopRiffles,
  defineWinner,
  winners,
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
    <h3 class="font-medium">Победители:</h3>
    <ul>
      <li v-for="(item, i) in winners" :key="i">Код купона: {{ item.code }}</li>
    </ul>
  </div>
</template>

<style scoped>
</style>
