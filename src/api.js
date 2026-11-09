/**
 * API-клиент: JSONP-вызовы веб-приложения Apps Script.
 *
 * Почему не fetch(POST): Apps Script /exec отдаёт 302-редирект на
 * script.googleusercontent.com; при POST браузер следует за ним как GET
 * (теряя тело), а сам редирект часто блокируется CORS (Issue 554057761) →
 * «Failed to fetch». JSONP (<script>) обходит CORS и корректно следует
 * редиректам, поэтому работает надёжно.
 */

const WEBAPP_URL = import.meta.env.VITE_GAS_URL || '';

const TOKEN_KEY = 'vkuswill_admin_code';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(code) {
  if (code) localStorage.setItem(TOKEN_KEY, code);
  else localStorage.removeItem(TOKEN_KEY);
}

export function hasToken() {
  return !!getToken();
}

let seq = 0;

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = `__vw_cb_${Date.now()}_${++seq}`;
    const sep = url.includes('?') ? '&' : '?';
    const src = `${url}${sep}callback=${encodeURIComponent(cb)}`;
    const script = document.createElement('script');

    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      try { delete window[cb]; } catch (_) { window[cb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Таймаут запроса к серверу'));
    }, 30000);

    window[cb] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Не удалось связаться с сервером (CORS/сеть). Проверьте VITE_GAS_URL и доступ веб-приложения «Anyone».'));
    };

    script.src = src;
    document.head.appendChild(script);
  });
}

async function call(action, payload = {}, opts = {}) {
  if (!WEBAPP_URL) {
    throw new Error('Не задан VITE_GAS_URL (URL веб-приложения Apps Script)');
  }
  const body = { action, ...payload };
  if (opts.admin) body.token = opts.token || getToken();

  const base = WEBAPP_URL.replace(/[?#].*$/, '');
  // передаём тело целиком в data (JSON) — надёжно для вложенных структур
  const url = `${base}?action=${encodeURIComponent(action)}&data=${encodeURIComponent(JSON.stringify(body))}`;
  if (url.length > 7500) {
    throw new Error('Слишком большой запрос. Уменьшите объём данных или разбейте на части.');
  }

  const json = await jsonp(url);
  if (!json || json.ok === false) {
    throw new Error((json && json.error) || 'Ошибка сервера');
  }
  return json;
}

export const api = {
  verify: (token) => call('verify', {}, { admin: true, token }),
  getActiveRaffle: () => call('getActiveRaffle'),
  leadStore: (p) => call('leadStore', p),
  couponStore: (p) => call('couponStore', p),

  couponIndex: () => call('couponIndex', {}, { admin: true }),
  couponDefineWinner: () => call('couponDefineWinner', {}, { admin: true }),

  raffleConfig: () => call('raffleConfig', {}, { admin: true }),
  raffleStore: (p) => call('raffleStore', p, { admin: true }),
  raffleUpdateAll: (p) => call('raffleUpdateAll', p, { admin: true }),
  raffleDestroy: (id) => call('raffleDestroy', { id }, { admin: true }),

  locationStore: (p) => call('locationStore', p, { admin: true }),
  locationUpdateAll: (p) => call('locationUpdateAll', p, { admin: true }),
  locationDestroy: (id) => call('locationDestroy', { id }, { admin: true }),

  organizerIndex: () => call('organizerIndex', {}, { admin: true }),
  winnersIndex: () => call('winnersIndex', {}, { admin: true }),
};
