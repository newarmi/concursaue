<script setup>
import logo from '@/assets/logo.svg';
import bg from '@/assets/bg.svg';

const { mainFrameBlur } = defineProps({
  mainFrameBlur: Boolean,
});
</script>

<template>
  <main class="bg h-full min-h-screen max-h-screen overflow-hidden w-full relative">
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
  </main>
</template>

<style>
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
