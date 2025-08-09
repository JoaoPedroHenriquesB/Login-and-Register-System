// Detectar ambiente baseado na presença da variável DB_URL (PostgreSQL do Render)
const isProduction = !!process.env.DB_URL;

console.log('🔍 Detectando ambiente...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_URL presente:', !!process.env.DB_URL);
console.log('Ambiente detectado:', isProduction ? 'PRODUÇÃO (PostgreSQL)' : 'DESENVOLVIMENTO (MySQL)');

let db;

if (isProduction) {
    // ===== PRODUÇÃO: PostgreSQL (Render) =====
    console.log('🐘 Configurando PostgreSQL para produção...');
    
    const { Pool } = require('pg');
    
    db = new Pool({
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    // Teste de conexão PostgreSQL
    db.connect()
        .then(() => {
            console.log('✅ Conectado ao banco de dados PostgreSQL');
        })
        .catch((err) => {
            console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
        });
        
} else {
    // ===== DESENVOLVIMENTO: MySQL (Local) =====
    console.log('🐬 Configurando MySQL para desenvolvimento local...');
    
    const mysql = require('mysql2/promise'); // Usar versão promise
    
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'login_register'
    });

    // Teste de conexão MySQL
    db.connect()
        .then(() => {
            console.log('✅ Conectado ao banco de dados MySQL');
        })
        .catch((err) => {
            console.error('❌ Erro ao conectar ao MySQL:', err.message);
        });
}

module.exports = db;