const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const initDatabase = require('./Database/init');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: [
        'https://joaopedrohenriquesb.github.io',
        'https://joaopedrohenriquesb.github.io/Login-and-Register-System',
        'https://joaopedrohenriquesb.github.io/sistema-de-login',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'API do sistema de login está rodando!', 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: process.env.NODE_ENV === 'production' || process.env.DB_URL ? 'PostgreSQL' : 'MySQL'
    });
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Inicializar servidor
const startServer = async () => {
    try {
        console.log('🔧 Inicializando sistema...');
        await initDatabase();
        

        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR RODANDO EM: http://localhost:${PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💾 Banco: ${process.env.NODE_ENV === 'production' || process.env.DB_URL ? 'PostgreSQL' : 'MySQL'}`);
        });
    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error.message);
        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR RODANDO EM: http://localhost:${PORT} (sem banco)`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    }
};

startServer();