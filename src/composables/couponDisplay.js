import { computed, onUnmounted, shallowRef } from 'vue';

const STORAGE_KEY = 'kari_coupon_display';
const MIN_INSET = 3;
const MAX_SIZE = 100 - MIN_INSET * 2;
const DEFAULT_SETTINGS = { size: 80, left: 17, top: 10 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function normalizeSettings(value) {
  const size = clamp(Number(value?.size) || DEFAULT_SETTINGS.size, 40, MAX_SIZE);
  const limit = 100 - size - MIN_INSET;

  return {
    size,
    left: clamp(Number(value?.left) || 0, MIN_INSET, limit),
    top: clamp(Number(value?.top) || 0, MIN_INSET, limit),
  };
}

function readSettings() {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SETTINGS);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function useCouponDisplay() {
  const settings = shallowRef(readSettings());
  const maxOffset = computed(() => 100 - settings.value.size - MIN_INSET);
  const winnerStyle = computed(() => ({
    width: `${settings.value.size}%`,
    left: `${settings.value.left}%`,
    top: `${settings.value.top}%`,
  }));

  function updateSetting(field, value) {
    settings.value = normalizeSettings({ ...settings.value, [field]: value });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
  }

  function resetSettings() {
    settings.value = { ...DEFAULT_SETTINGS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
  }

  function handleStorage(event) {
    if (event.key === STORAGE_KEY) settings.value = readSettings();
  }

  window.addEventListener('storage', handleStorage);
  onUnmounted(() => window.removeEventListener('storage', handleStorage));

  return { settings, winnerStyle, updateSetting, resetSettings, minInset: MIN_INSET, maxSize: MAX_SIZE, maxOffset };
}
