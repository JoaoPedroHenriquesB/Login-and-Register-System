const db = require('./db');

const initDatabase = async () => {
    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DB_URL;
    
    console.log('🔧 Inicializando banco de dados...');
    console.log('Ambiente:', isProduction ? 'PRODUÇÃO (PostgreSQL)' : 'DESENVOLVIMENTO (MySQL)');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
        
        // Não parar o servidor se a tabela não puder ser criada
        console.log('⚠️ Continuando sem inicialização do banco...');
    }
};

module.exports = initDatabase;