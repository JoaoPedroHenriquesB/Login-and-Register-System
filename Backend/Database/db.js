
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DB_URL;

console.log('🔍 Detectando ambiente...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_URL presente:', !!process.env.DB_URL);
console.log('DB_URL valor:', process.env.DB_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO');
console.log('Ambiente detectado:', isProduction ? 'PRODUÇÃO (PostgreSQL)' : 'DESENVOLVIMENTO (MySQL)');

let db;

if (isProduction) {
    console.log('🐘 Configurando PostgreSQL para produção...');
    
    if (!process.env.DB_URL) {
        console.error('❌ ERRO: DB_URL não configurado no ambiente de produção!');
        console.error('Configure a variável DB_URL no Render com a URL do PostgreSQL');
        process.exit(1);
    }
    
    const { Pool } = require('pg');
    
    db = new Pool({
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    db.query('SELECT NOW()')
        .then(() => {
            console.log('✅ Conectado ao banco de dados PostgreSQL');
        })
        .catch((err) => {
            console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
        });
        
} else {
    console.log('🐬 Configurando MySQL para desenvolvimento local...');
    
    const mysql = require('mysql2/promise');
    
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'login_register'
    });

    db.connect()
        .then(() => {
            console.log('✅ Conectado ao banco de dados MySQL');
        })
        .catch((err) => {
            console.error('❌ Erro ao conectar ao MySQL:', err.message);
        });
}

module.exports = db;