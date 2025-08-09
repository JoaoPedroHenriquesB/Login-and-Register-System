const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001;

// Configuração CORS para GitHub Pages e desenvolvimento local
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

app.get('/', (req, res) => {
    res.json({ message: 'API do sistema de login está rodando!', status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO EM: http://localhost:${PORT}`)
});