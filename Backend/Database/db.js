const { Pool } = require('pg');

// Usar PostgreSQL em produção (Vercel) ou MySQL localmente
const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_URL;

let db;

if (isProduction && process.env.DB_URL) {
    // Configuração PostgreSQL para produção
    db = new Pool({
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    db.connect((err) => {
        if (err) {
            console.log('Erro ao conectar ao PostgreSQL:', err.message);
        } else {
            console.log('Conectado ao banco de dados PostgreSQL');
        }
    });
} else {
    // Configuração MySQL para desenvolvimento local
    const mysql = require('mysql2');
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'login_register'
    });

    db.connect((err) => {
        if (err) {
            console.log('Erro ao conectar ao MySQL:', err.message);
        } else {
            console.log('Conectado ao banco de dados MySQL');
        }
    });
}

module.exports = db;