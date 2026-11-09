import { createApp } from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './css/app.css';
import App from './App.vue';
import { router } from './router.js';

const app = createApp(App);
app.use(router);
app.use(Toast, { timeout: 2000 });
app.mount('#app');
