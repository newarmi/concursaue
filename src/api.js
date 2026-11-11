/**
 * API-клиент веб-приложения Apps Script.
 *
 * Основной транспорт: POST fetch с Content-Type text/plain (простой запрос, без preflight).
 * Fallback JSONP GET используется только для безопасных read-only действий, если POST
 * недоступен из-за особенностей редиректов/окружения.
 */

const WEBAPP_URL = import.meta.env.VITE_GAS_URL || '';
const TOKEN_KEY = 'vkuswill_admin_code';
const TIMEOUT_MS = 30000;

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

const READ_ONLY_FALLBACK = {
  getActiveRaffle: true,
};

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
    }, TIMEOUT_MS);

    window[cb] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Не удалось связаться с сервером'));
    };

    script.src = src;
    document.head.appendChild(script);
  });
}

async function postJson(base, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(base, {
      method: 'POST',
      // text/plain — простой CORS-запрос (без preflight); тело — JSON.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
      signal: controller.signal,
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      throw new Error('Сервер вернул некорректный ответ');
    }
  } finally {
    clearTimeout(timer);
  }
}

async function call(action, payload = {}, opts = {}) {
  if (!WEBAPP_URL) {
    throw new Error('Не задан VITE_GAS_URL (URL веб-приложения Apps Script)');
  }
  const body = { action, ...payload };
  if (opts.admin) body.token = opts.token || getToken();

  const base = WEBAPP_URL.replace(/[?#].*$/, '');

  let json;
  try {
    json = await postJson(base, body);
  } catch (e) {
    if (!READ_ONLY_FALLBACK[action]) {
      const msg = e && e.name === 'AbortError'
        ? 'Таймаут запроса к серверу'
        : 'Не удалось выполнить запрос. Проверьте подключение и развёртывание Apps Script.';
      throw new Error(msg);
    }
    // Fallback: JSONP GET без передачи токена.
    const url = `${base}?action=${encodeURIComponent(action)}`;
    json = await jsonp(url);
  }

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

  couponIndex: (p = {}) => call('couponIndex', p, { admin: true }),
  couponDestroy: (id) => call('couponDestroy', { id }, { admin: true }),
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
