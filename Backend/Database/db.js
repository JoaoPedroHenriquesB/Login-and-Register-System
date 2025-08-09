const { Pool } = require('pg');

// Detectar se está em produção (Render) ou desenvolvimento local
const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_URL;

let db;

if (isProduction && process.env.DB_URL) {
    // Configuração PostgreSQL para produção (Render)
    console.log('Configurando PostgreSQL para produção...');
    db = new Pool({
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    // Teste de conexão
    db.connect()
        .then(() => {
            console.log('✅ Conectado ao banco de dados PostgreSQL');
        })
        .catch((err) => {
            console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
        });
} else {
    // Configuração MySQL para desenvolvimento local
    console.log('Configurando MySQL para desenvolvimento local...');
    const mysql = require('mysql2');
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'login_register'
    });

    db.connect((err) => {
        if (err) {
            console.error('❌ Erro ao conectar ao MySQL:', err.message);
        } else {
            console.log('✅ Conectado ao banco de dados MySQL');
        }
    });
}

module.exports = db;