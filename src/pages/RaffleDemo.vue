<script setup>
import '~/css/raffle.css';
import NothingLayout from '@/layouts/NothingLayout.vue';
import CardComponent from '@/components/CardComponent.vue';
import card1 from '@/assets/card1.svg';
import { useAnimation } from '@/composables/animation.js';
import { useBroadcastRaffle } from '@/composables/broadcast.js';

const { arr, start, close, animState, showWinner } = useAnimation();

useBroadcastRaffle(start, showWinner, close);
</script>

<template>
  <nothing-layout :main-frame-blur="animState.mainFrameBlur">
    <div
      class="main-frame h-full min-h-screen w-full flex items-center justify-center overflow-hidden"
      :class="{ 'blur-lg': animState.mainFrameBlur }"
    >
      <TransitionGroup appear name="list" tag="ul">
        <li v-for="item in arr" :key="item">
          <card-component />
        </li>
      </TransitionGroup>
    </div>
    <transition name="fade">
      <div v-show="animState.winner" class="winner">
        <img class="winner__bg" :src="card1" alt="" />
        <div class="winner__code">KAriRafle76887</div>
      </div>
    </transition>
  </nothing-layout>
</template>
