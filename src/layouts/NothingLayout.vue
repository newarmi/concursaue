<script setup>
import logo from '@/assets/logo.svg';
import bg from '@/assets/bg.svg';

const { mainFrameBlur } = defineProps({
  mainFrameBlur: Boolean,
});
</script>

<template>
  <main class="raffle-viewport">
    <div class="raffle-stage">
      <div
        class="HeaderBLogo__LogoImgWrp _mango"
        :class="{ 'blur-lg': mainFrameBlur }"
      >
        <img :src="logo" alt="" />
      </div>
      <slot />
      <div
        :class="{ 'blur-lg': mainFrameBlur }"
        class="yellow-block main-frame"
        :style="{ backgroundImage: `url(${bg})` }"
      ></div>
    </div>
  </main>
</template>

<style>
.raffle-viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #991e66;
}

.raffle-stage {
  position: relative;
  width: min(100vw, calc(100vh * 16 / 9));
  width: min(100vw, calc(100dvh * 16 / 9));
  aspect-ratio: 16 / 9;
  max-height: 100vh;
  overflow: hidden;
  background: #991e66;
  container-type: inline-size;
}

.HeaderBLogo__LogoImgWrp {
  position: absolute;
  top: 3%;
  left: 20px;
  width: 15%;
}

.main-frame {
  transition: filter 0.5s ease-in-out;
}

html,
body {
  background: #991e66;
}

.yellow-block {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
