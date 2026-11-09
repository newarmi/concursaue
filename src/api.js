/**
 * API-клиент: шлёт POST в веб-приложение Apps Script.
 * Content-Type text/plain;charset=utf-8 — «простой запрос» без CORS-preflight.
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

async function call(action, payload = {}, opts = {}) {
  if (!WEBAPP_URL) {
    throw new Error('Не задан VITE_GAS_URL (URL веб-приложения Apps Script)');
  }
  const body = { action, ...payload };
  if (opts.admin) body.token = opts.token || getToken();

  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow',
  });

  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error(`Ошибка ответа сервера (HTTP ${res.status})`);
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
