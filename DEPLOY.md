# 🚀 Инструкции по деплою

## Варианты деплоя

### 1. Статический хостинг (без сервера)

**Подходит для**: GitHub Pages, Netlify, Vercel (статический режим)

1. Загрузите файлы на хостинг:
   - `index.html`
   - `css/style.css`
   - `js/app.js`

2. Приложение будет работать в локальном режиме (без WebSocket)

**Ограничения**: Чат будет работать только локально для каждого пользователя

---

### 2. Node.js хостинг (с WebSocket сервером)

**Подходит для**: Heroku, Railway, Render, DigitalOcean, VPS

#### Heroku

```bash
# Установите Heroku CLI
heroku login
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Railway

1. Подключите GitHub репозиторий
2. Railway автоматически определит Node.js проект
3. Установите переменную окружения `PORT` (Railway делает это автоматически)

#### Render

1. Создайте новый Web Service
2. Подключите репозиторий
3. Укажите:
   - Build Command: `npm install`
   - Start Command: `node server.js`

---

### 3. VPS / Dedicated Server

#### Установка

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Клонируйте проект
git clone your-repo-url
cd neon-discord

# Установите зависимости
npm install

# Запустите через PM2
sudo npm install -g pm2
pm2 start server.js --name neon-discord
pm2 save
pm2 startup
```

#### Nginx конфигурация

Создайте `/etc/nginx/sites-available/neon-discord`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/neon-discord /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Docker деплой

Создайте `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Запуск:
```bash
docker build -t neon-discord .
docker run -p 3000:3000 neon-discord
```

---

## Настройка WebSocket URL

После деплоя обновите URL в `js/app.js`:

```javascript
const CONFIG = {
    wsUrl: "wss://your-domain.com",  // Для HTTPS используйте wss://
    // ...
};
```

Или через переменную окружения на сервере.

---

## SSL сертификат (для WSS)

Для безопасного WebSocket (wss://) нужен SSL сертификат:

### Let's Encrypt (бесплатно)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Мониторинг

### PM2 мониторинг

```bash
pm2 monit
pm2 logs neon-discord
```

### Логи

```bash
# PM2 логи
pm2 logs

# Системные логи
journalctl -u your-service -f
```

---

## Обновление

```bash
git pull origin main
npm install
pm2 restart neon-discord
```

---

## Troubleshooting

### Порт уже занят
```bash
# Найдите процесс
lsof -i :3000
# Убейте процесс
kill -9 PID
```

### WebSocket не подключается
- Проверьте, что сервер запущен
- Проверьте firewall правила
- Убедитесь, что используете правильный протокол (ws:// или wss://)

### Проблемы с правами
```bash
sudo chown -R $USER:$USER /path/to/project
```

---

## Переменные окружения

Создайте `.env` файл:

```
PORT=3000
NODE_ENV=production
WS_URL=wss://your-domain.com
```

Загрузите через `dotenv` пакет (добавьте в `package.json`).



