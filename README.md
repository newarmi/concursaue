# VkusWill — фронт

Vue 3 SPA (Vite + vue-router + Tailwind). Хостится на GitHub Pages. Бэкенд —
Google Apps Script (живёт в репозитории `vkuswill`, папка `backend/`).

## Локальный запуск

```bash
cp .env.example .env   # впиши VITE_GAS_URL (URL веб-приложения Apps Script …/exec)
npm install
npm run dev            # http://localhost:5173
npm run build          # сборка в dist/
```

## Развёртывание (GitHub Pages)

1. В репозитории: **Settings → Secrets and variables → Actions → New secret**:
   - `VITE_GAS_URL` = URL веб-приложения Apps Script (`…/exec`).
2. **Settings → Pages** → Source: **GitHub Actions**.
3. Пуш в `main` — workflow `.github/workflows/deploy.yml` соберёт и задеплоит.

Сайт: `https://newarmi.github.io/concursaue/`.

## Структура

```
src/
  api.js            # клиент к Apps Script (POST text/plain, обход CORS)
  router.js         # hash-роутер
  composables/      # animation, broadcast (BroadcastChannel)
  layouts/          # AppLayout, NothingLayout
  components/       # формы и виджеты
  pages/            # страницы (маршруты)
  assets/           # SVG (импортируются, не по прямым путям)
```

## Как это работает

- Все запросы к бэкенду — `POST` c `Content-Type: text/plain;charset=utf-8`
  и телом JSON `{ action, token?, ...payload }` (простой запрос без CORS-preflight).
- Админ-действия защищены кодом-паролем (хранится в `localStorage` после входа
  на `#/admin`), проверяется на стороне Apps Script.
- Анимация розыгрыша (`#/raffle`) управляется с панели (`#/raffleAdmin`) через
  `BroadcastChannel` — серверного push нет.
