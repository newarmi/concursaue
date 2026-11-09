import { useToast } from 'vue-toastification';
import { onUnmounted, ref } from 'vue';
import { api } from '@/api.js';

const CHANNEL = 'RafflesChannel';

const types = ['START_RAFFLE', 'DEFINE_WINNER', 'STOP_RAFFLE', 'RESPONSE', 'RELOAD'];

const destroyBroadcast = (channel) => {
  const close = () => channel.close();
  window.addEventListener('beforeunload', close);
  onUnmounted(close);
};

const doReload = () => {
  window.location.reload(true);
};

const creatMessages = (type, data) => ({ type, data });

const createSuccessMessage = () => creatMessages(types[3], { success: true });
const createErrorMessage = (message) => creatMessages(types[3], { success: false, message });

const getWinner = async () => {
  const data = await api.couponDefineWinner();
  return data.data.code;
};

export const useBroadcastDashboard = () => {
  const toast = useToast();
  const channel = new BroadcastChannel(CHANNEL);

  const winners = ref(null);
  const disabledDefineWinners = ref(false);

  const defineWinner = async () => {
    try {
      disabledDefineWinners.value = true;
      const code = await getWinner();
      channel.postMessage(creatMessages(types[1], { code }));
      updateWiners();
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const updateWiners = () => {
    api
      .couponIndex()
      .then((json) => (winners.value = json.data))
      .catch((e) => toast.error(e.message));
  };
  updateWiners();

  destroyBroadcast(channel);

  const startRiffles = () => {
    channel.postMessage(creatMessages(types[0]));
  };

  const stopRiffles = () => {
    channel.postMessage(creatMessages(types[2]));
  };

  channel.onmessage = (event) => {
    const { type, data } = event.data;
    switch (type) {
      case types[3]:
        if (data.code === 0) {
          disabledDefineWinners.value = false;
        } else if (!data.success) {
          return toast.error('Произошла ошибка');
        }
        toast.success('Все хорошо');
        return 0;
      case types[4]:
        doReload();
        return 0;
      default:
        return 0;
    }
  };

  channel.onmessageerror = (c, e) => {
    return toast.error('Произошла ошибка' + e);
  };

  const reload = () => {
    channel.postMessage(creatMessages(types[4]));
  };

  return {
    startRiffles,
    stopRiffles,
    defineWinner,
    winners,
    disabledDefineWinners,
    reload,
  };
};

export const useBroadcastRaffle = (startAnimation, defineWinner, stopAnimation) => {
  const channel = new BroadcastChannel(CHANNEL);

  destroyBroadcast(channel);

  channel.onmessage = (event) => {
    const { type, data } = event.data;
    switch (type) {
      case types[0]:
        try {
          startAnimation();
          channel.postMessage(createSuccessMessage());
        } catch (e) {
          console.error(e);
          channel.postMessage(createErrorMessage(e.message));
        }
        return 0;
      case types[1]:
        try {
          defineWinner(data.code).then((code) => {
            channel.postMessage(creatMessages(types[3], { code }));
          });
        } catch (e) {
          console.error(e);
          channel.postMessage(createErrorMessage(e.message));
        }
        return 0;
      case types[2]:
        try {
          stopAnimation();
          channel.postMessage(createSuccessMessage());
        } catch (e) {
          console.error(e);
          channel.postMessage(createErrorMessage(e.message));
        }
        return 0;
      case types[4]:
        channel.postMessage(creatMessages(types[4]));
        doReload();
        return 0;
      default:
        return 0;
    }
  };
};
