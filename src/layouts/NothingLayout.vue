<script setup>
import logo from '@/assets/logo.svg';

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
    </div>
    <!-- Белый «пол» экрана розыгрыша: живёт на уровне вьюпорта (примыкает
         к краям экрана на любых соотношениях сторон — сцена внутри 16:9
         летербоксится), размер — в контейнерных единицах. Инлайн-SVG с
         preserveAspectRatio="none" тянется ровно по блоку без кропа.
         Полупрозрачная волна над полом — мягкий «отблеск». -->
    <div :class="{ 'blur-lg': mainFrameBlur }" class="floor main-frame">
      <svg
        class="floor__svg"
        viewBox="0 0 1920 360"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 232 C 520 204, 1000 84, 1500 36 C 1700 18, 1840 26, 1920 60 L1920 360 H0 Z"
          fill="#fff"
          opacity="0.16"
        />
        <path
          d="M0 272 C 520 244, 1000 120, 1500 68 C 1720 46, 1850 56, 1920 92 L1920 360 H0 Z"
          fill="#fff"
        />
      </svg>
    </div>
  </main>
</template>

<style>
.raffle-viewport {
  position: relative;
  container: raffle-viewport / size;
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
  /* сцена занимает весь экран: карточки и победитель должны заполнять
     его целиком на любом соотношении сторон, без летербокса */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #991e66;
  container-type: size;
}

.HeaderBLogo__LogoImgWrp {
  position: absolute;
  top: 2.5cqw;
  left: 2.5cqw;
  width: 14cqw;
}

.main-frame {
  transition: filter 0.5s ease-in-out;
}

html,
body {
  background: #991e66;
}

/* Белый «пол» экрана розыгрыша */
.floor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 22cqh; /* от контейнера raffle-viewport */
  pointer-events: none;
}

.floor__svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
