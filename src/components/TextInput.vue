<script setup>
defineProps({
  modelValue: [String, Number],
});

defineEmits(['update:modelValue']);
</script>

<template>
  <input
    type="text"
    class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>
