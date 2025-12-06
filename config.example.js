// Пример конфигурации для разных сред
// Скопируйте этот файл в config.js и настройте под вашу среду

module.exports = {
    // Порт сервера
    port: process.env.PORT || 3000,
    
    // URL для WebSocket (для клиента)
    wsUrl: process.env.WS_URL || 'ws://localhost:3000',
    
    // Настройки CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },
    
    // Настройки чата
    chat: {
        maxMessageLength: 500,
        maxMessagesHistory: 100,
        rateLimit: {
            messagesPerMinute: 30
        }
    },
    
    // Настройки стриминга
    streaming: {
        maxStreams: 10,
        quality: {
            default: 'HD',
            options: ['SD', 'HD', 'FullHD']
        }
    },
    
    // Настройки безопасности
    security: {
        allowedOrigins: [
            'http://localhost:3000',
            'https://your-domain.com'
        ],
        requireAuth: false // В будущем можно добавить аутентификацию
    },
    
    // Логирование
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || null
    }
};



