# 🚀 Деплой на Netlify с WebSocket

Полная инструкция по деплою проекта на Netlify с готовыми настройками WebSocket.

## ⚡ Быстрый деплой (5 минут)

### Шаг 1: Подготовка репозитория

1. **Создайте GitHub репозиторий** (если еще нет)
2. **Загрузите все файлы** в репозиторий
3. **Убедитесь**, что есть файл `netlify.toml`

### Шаг 2: Деплой на Netlify

#### Вариант A: Через веб-интерфейс (рекомендуется)

1. Зайдите на [netlify.com](https://netlify.com)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите **GitHub** и авторизуйтесь
4. Выберите ваш репозиторий
5. Настройки деплоя:
   - **Build command:** (оставьте пустым)
   - **Publish directory:** `.` (точка)
6. Нажмите **"Deploy site"**

#### Вариант B: Через Netlify CLI

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Войдите в Netlify
netlify login

# Инициализируйте сайт
netlify init

# Деплой
netlify deploy --prod
```

### Шаг 3: Настройка WebSocket

После деплоя у вас будет URL вида: `https://your-site.netlify.app`

#### Вариант 1: Использовать готовый WebSocket сервер

**A) Glitch.com (бесплатно и просто)**

1. Зайдите на [glitch.com](https://glitch.com)
2. Создайте новый проект
3. Загрузите `server.js` и `package.json`
4. Glitch автоматически запустит сервер
5. Получите URL вида: `https://your-project.glitch.me`
6. В настройках Netlify добавьте переменную окружения:
   - **Key:** `WS_URL`
   - **Value:** `wss://your-project.glitch.me`

**B) Railway.app (рекомендуется)**

1. Зайдите на [railway.app](https://railway.app)
2. Создайте новый проект из GitHub
3. Railway автоматически определит Node.js проект
4. Получите URL вашего сервера
5. В Netlify добавьте переменную окружения:
   - **Key:** `WS_URL`
   - **Value:** `wss://your-railway-app.up.railway.app`

**C) Render.com**

1. Зайдите на [render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите репозиторий
4. Укажите:
   - Build: `npm install`
   - Start: `node server.js`
5. Получите URL и добавьте в Netlify переменную `WS_URL`

#### Вариант 2: Настроить вручную

1. В Netlify перейдите в **Site settings** → **Environment variables**
2. Добавьте переменную:
   - **Key:** `WS_URL`
   - **Value:** `wss://ваш-websocket-сервер.com`
3. Передеплойте сайт

### Шаг 4: Проверка

1. Откройте ваш сайт на Netlify
2. Откройте консоль браузера (F12)
3. Должно появиться: `✅ WebSocket URL загружен из Netlify: wss://...`
4. Войдите в чат и проверьте работу

---

## 🔧 Настройка переменных окружения в Netlify

### Через веб-интерфейс:

1. Зайдите в ваш проект на Netlify
2. **Site settings** → **Environment variables**
3. Нажмите **"Add a variable"**
4. Добавьте:
   ```
   Key: WS_URL
   Value: wss://your-websocket-server.com
   ```
5. Нажмите **"Save"**
6. Передеплойте сайт

### Через Netlify CLI:

```bash
netlify env:set WS_URL "wss://your-websocket-server.com"
netlify deploy --prod
```

---

## 📝 Структура файлов для Netlify

```
your-project/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── netlify.toml          ← Конфигурация Netlify
├── netlify/
│   └── functions/
│       └── websocket-config.js  ← Netlify Function
├── server.js             ← Для отдельного WebSocket сервера
└── package.json
```

---

## 🌐 Настройка домена

### Подключение кастомного домена:

1. В Netlify: **Site settings** → **Domain management**
2. Нажмите **"Add custom domain"**
3. Введите ваш домен
4. Следуйте инструкциям по настройке DNS

### Автоматический SSL:

Netlify автоматически предоставляет SSL сертификат (HTTPS) для всех сайтов.

---

## 🔄 Автоматический деплой

Netlify автоматически деплоит при каждом push в GitHub:

1. **Push в main/master** → автоматический деплой
2. **Pull Request** → preview деплой
3. Все настройки сохраняются

---

## 🧪 Тестирование

### Локальный тест с Netlify:

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Запустите локальный сервер
netlify dev
```

Откроется локальный сервер с поддержкой Netlify Functions.

---

## 🐛 Решение проблем

### WebSocket не подключается

1. **Проверьте переменную окружения:**
   - Убедитесь, что `WS_URL` установлена в Netlify
   - Проверьте формат: `wss://` для HTTPS, `ws://` для HTTP

2. **Проверьте консоль браузера:**
   - Откройте F12 → Console
   - Ищите ошибки подключения

3. **Проверьте CORS:**
   - WebSocket сервер должен разрешать подключения с вашего домена

### Netlify Function не работает

1. **Проверьте путь:**
   - Должен быть: `/.netlify/functions/websocket-config`
   - Файл должен быть в: `netlify/functions/websocket-config.js`

2. **Проверьте логи:**
   - Netlify → Functions → Logs

### Переменные окружения не применяются

1. **Передеплойте сайт** после изменения переменных
2. **Очистите кэш браузера**
3. **Проверьте**, что переменная сохранена в Netlify

---

## 💡 Рекомендации

### Для продакшена:

1. **Используйте HTTPS** (Netlify делает это автоматически)
2. **Настройте кастомный домен**
3. **Используйте надежный WebSocket сервер** (Railway, Render)
4. **Настройте мониторинг** (Netlify Analytics)

### Для разработки:

1. Используйте **Netlify Dev** для локальной разработки
2. Используйте **Preview Deploys** для тестирования
3. Настройте **Branch Deploys** для разных окружений

---

## 📊 Мониторинг

### Netlify Analytics:

1. **Site settings** → **Analytics**
2. Включите **Netlify Analytics**
3. Смотрите статистику посещений

### Логи:

1. **Functions** → **Logs** - логи Netlify Functions
2. **Deploys** → выберите деплой → **Deploy log** - логи сборки

---

## ✅ Чеклист деплоя

- [ ] Репозиторий создан и файлы загружены
- [ ] `netlify.toml` настроен
- [ ] Netlify Function создана
- [ ] Сайт задеплоен на Netlify
- [ ] WebSocket сервер запущен (Glitch/Railway/Render)
- [ ] Переменная `WS_URL` установлена в Netlify
- [ ] Сайт передеплоен после настройки переменных
- [ ] Проверена работа чата в нескольких браузерах
- [ ] Настроен кастомный домен (опционально)

---

## 🎉 Готово!

После выполнения всех шагов ваш сайт будет работать на Netlify с полнофункциональным WebSocket чатом!

**URL вашего сайта:** `https://your-site.netlify.app`

---

## 📞 Дополнительная помощь

- [Документация Netlify](https://docs.netlify.com)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)



