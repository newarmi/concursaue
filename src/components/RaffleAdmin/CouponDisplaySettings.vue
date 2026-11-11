<script setup>
import card from '@/assets/card1.svg';
import { useCouponDisplay } from '@/composables/couponDisplay.js';

const { settings, winnerStyle, updateSetting, resetSettings, minInset, maxSize, maxOffset } = useCouponDisplay();
</script>

<template>
  <section class="coupon-settings px-6 py-6 lg:px-8">
    <h3 class="font-medium mb-2">Область показа купона</h3>
    <p class="text-sm text-gray-600 mb-4">Макет 1920×1080 (16:9) масштабируется под экран. Купон целиком помещается в выбранную область. Изменения сразу видны в других вкладках этого браузера.</p>

    <div class="coupon-settings__content">
      <div class="coupon-settings__controls">
        <label class="coupon-settings__control">
          Размер: {{ settings.size }}%
          <input type="range" min="40" :max="maxSize" step="1" :value="settings.size" @input="updateSetting('size', $event.target.value)" />
        </label>
        <label class="coupon-settings__control">
          Отступ слева: {{ settings.left }}%
          <input type="range" :min="minInset" :max="maxOffset" step="1" :value="settings.left" @input="updateSetting('left', $event.target.value)" />
        </label>
        <label class="coupon-settings__control">
          Отступ сверху: {{ settings.top }}%
          <input type="range" :min="minInset" :max="maxOffset" step="1" :value="settings.top" @input="updateSetting('top', $event.target.value)" />
        </label>
        <button type="button" class="coupon-settings__reset" @click="resetSettings">Сбросить</button>
      </div>

      <div class="coupon-settings__preview" aria-label="Предпросмотр области показа купона">
        <div class="coupon-settings__coupon" :style="winnerStyle">
          <img :src="card" alt="Предпросмотр купона Kari" />
          <span>123456789</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.coupon-settings__content {
  display: grid;
  grid-template-columns: minmax(180px, 280px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.coupon-settings__controls {
  display: grid;
  gap: 16px;
}

.coupon-settings__control {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.coupon-settings__control input {
  width: 100%;
  accent-color: #a80b7a;
}

.coupon-settings__reset {
  justify-self: start;
  color: #a80b7a;
  text-decoration: underline;
}

.coupon-settings__preview {
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  background: #991e66;
}

.coupon-settings__coupon {
  position: absolute;
  aspect-ratio: 16 / 9;
  container-type: inline-size;
  overflow: hidden;
  border-radius: 2%;
}

.coupon-settings__coupon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.coupon-settings__coupon span {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  color: #a80b7a;
  font-size: 5.2cqw;
  font-weight: 900;
}

@media (max-width: 700px) {
  .coupon-settings__content { grid-template-columns: 1fr; }
}
</style>
