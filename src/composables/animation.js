import { reactive } from 'vue';
import { setTimoutAsync } from '@/utils';

const FILLING_COUNT = 50;
const FILLING_TIME = 50;
const SHUFFLE_DURATION = 400; // должно совпадать с CSS transition на transform
const SHUFFLE_PADDING = 20; // запас, чтобы не наслаивались шаги

export const useAnimation = () => {
  const arr = reactive([]);

  const animState = reactive({
    shuffle: false,
    mainFrameBlur: false,
    winner: false,
    code: null,
  });

  let intervalIdShuffle = null;
  let shufflingBusy = false; // защита от наложений

  // Равномерный и быстрый Fisher–Yates
  const shuffleCopy = (a) => {
    const out = a.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  // Перестановка содержимого reactive-массива без смены ссылки
  const applyOrder = (newOrder) => {
    arr.splice(0, arr.length, ...newOrder);
  };

  // Один «тик» перемешивания
  const tick = () => {
    if (shufflingBusy) return;
    shufflingBusy = true;

    const newOrder = shuffleCopy(arr);
    applyOrder(newOrder);

    setTimeout(() => {
      shufflingBusy = false;
    }, SHUFFLE_DURATION);
  };

  const shuffling = {
    on(timer = SHUFFLE_DURATION + SHUFFLE_PADDING) {
      if (intervalIdShuffle) return;
      intervalIdShuffle = setInterval(tick, timer);
      animState.shuffle = true;
    },
    off() {
      clearInterval(intervalIdShuffle);
      intervalIdShuffle = null;
      animState.shuffle = false;
    },
  };

  const filling = async (count = FILLING_COUNT, time = FILLING_TIME) => {
    if (arr.length) return;
    const asyncArr = [];
    for (let i = 1; i <= count; i++) {
      asyncArr.push(
        setTimoutAsync(() => {
          arr.push(i);
        }, time * i)
      );
    }
    return await Promise.all(asyncArr);
  };

  const closing = async (count = FILLING_COUNT, time = FILLING_TIME) => {
    if (!arr.length) return;
    const asyncArr = [];
    for (let i = 1; i <= count; i++) {
      asyncArr.push(
        setTimoutAsync(() => {
          arr.pop();
        }, time * i)
      );
    }
    return await Promise.all(asyncArr);
  };

  const showWinner = async (code) => {
    if (animState.winner) {
      animState.winner = false;
      await setTimoutAsync(() => {}, 900);
    }
    animState.code = code;
    animState.winner = true;
    return 0;
  };

  const start = async () => {
    if (arr.length) return;
    animState.start = true;
    await filling();
    shuffling.on();
  };

  const close = async () => {
    if (!arr.length) return;
    shuffling.off();
    await closing();
    animState.start = false;
  };

  return {
    arr,
    animState,
    showWinner,
    start,
    close,
  };
};
