const db = require('./db');

const initDatabase = async () => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_URL;
    
    try {
        if (isProduction) {
            // PostgreSQL - Criar tabela se não existir
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
            // MySQL - Criar tabela se não existir
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            
            await new Promise((resolve, reject) => {
                db.query(createTableQuery, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            console.log('✅ Tabela users criada/verificada no MySQL');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
    }
};

module.exports = initDatabase;