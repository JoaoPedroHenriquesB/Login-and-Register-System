const db = require('./db');

const initDatabase = async () => {
    // Usar a mesma lógica de detecção do db.js
    const isProduction = !!process.env.DB_URL;
    
    console.log('🔧 Inicializando banco de dados...');
    console.log('Ambiente:', isProduction ? 'PRODUÇÃO (PostgreSQL)' : 'DESENVOLVIMENTO (MySQL)');
    
    try {
        if (isProduction) {
            // ===== POSTGRESQL (PRODUÇÃO) =====
            console.log('🐘 Criando tabela no PostgreSQL...');
            
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            
            await db.query(createTableQuery);
            console.log('✅ Tabela users criada/verificada no PostgreSQL');
            
        } else {
            // ===== MYSQL (DESENVOLVIMENTO) =====
            console.log('🐬 Criando tabela no MySQL...');
            
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            
            // MySQL com mysql2/promise
            await db.query(createTableQuery);
            console.log('✅ Tabela users criada/verificada no MySQL');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error.message);
        console.error('Stack trace:', error.stack);
    }
};

module.exports = initDatabase;