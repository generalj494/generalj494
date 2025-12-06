const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Статические файлы
app.use(express.static(path.join(__dirname)));

// Хранение подключенных клиентов
const clients = new Map();
const users = new Set();

// WebSocket соединения
wss.on('connection', (ws, req) => {
    let userId = null;
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            
            switch (data.type) {
                case 'userJoin':
                    userId = data.user;
                    if (!users.has(userId)) {
                        users.add(userId);
                        clients.set(ws, userId);
                        
                        // Уведомляем всех о новом пользователе
                        broadcast({
                            type: 'userJoin',
                            user: userId
                        }, ws);
                        
                        // Отправляем список пользователей новому клиенту
                        ws.send(JSON.stringify({
                            type: 'userList',
                            users: Array.from(users)
                        }));
                    }
                    break;
                    
                case 'message':
                    if (userId) {
                        broadcast({
                            type: 'message',
                            user: userId,
                            message: data.message,
                            time: data.time || new Date().toLocaleTimeString()
                        }, ws);
                    }
                    break;
                    
                case 'streamStart':
                    if (userId) {
                        broadcast({
                            type: 'streamStart',
                            userId: userId,
                            quality: data.quality || 'HD'
                        }, ws);
                    }
                    break;
                    
                case 'streamStop':
                    if (userId) {
                        broadcast({
                            type: 'streamStop',
                            userId: userId
                        }, ws);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        if (userId) {
            users.delete(userId);
            clients.delete(ws);
            
            // Уведомляем всех об отключении
            broadcast({
                type: 'userLeave',
                user: userId
            }, ws);
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Функция для рассылки сообщений всем клиентам кроме отправителя
function broadcast(data, excludeWs = null) {
    const message = JSON.stringify(data);
    clients.forEach((userId, ws) => {
        if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });
}

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Получение списка пользователей
app.get('/api/users', (req, res) => {
    res.json({ users: Array.from(users) });
});

// Порт сервера
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📡 WebSocket сервер готов к подключениям`);
    console.log(`🌐 Откройте http://localhost:${PORT} в браузере`);
});



