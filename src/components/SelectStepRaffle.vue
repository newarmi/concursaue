<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';

const props = defineProps({
  modelValue: [null, Number],
  dateTimes: Array,
});
const emit = defineEmits(['update:modelValue']);

const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const now = dayjs(new Date());
const options = props.dateTimes
  .map((item) => {
    const start = dayjs(item.start);
    if (now.hour() >= start.hour()) {
      return null;
    }
    return {
      date: start,
      value: item.id,
      text: `${item.name} ${start.format('DD.MM.YYYY HH:mm')}`,
    };
  })
  .filter((el) => el);

if (!proxyValue.value && options.length) {
  const min = Math.min(...options.map((el) => el.date.hour()));
  proxyValue.value = options.find((el) => el.date.hour() === min)?.value;
}
</script>

<template>
  <div>
    <label for="code" class="block text-sm font-medium leading-6">Этап конкурса</label>
    <div class="mt-2">
      <select
        id="code"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        v-model="proxyValue"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
</style>
