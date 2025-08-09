// Teste rápido da configuração do banco de dados
console.log('🧪 Testando configuração do banco de dados...');

// Simular variáveis de ambiente
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_URL presente:', !!process.env.DB_URL);

const isProduction = !!process.env.DB_URL;
console.log('Ambiente detectado:', isProduction ? 'PRODUÇÃO (PostgreSQL)' : 'DESENVOLVIMENTO (MySQL)');

if (isProduction) {
    console.log('✅ Configuração PostgreSQL será usada');
} else {
    console.log('✅ Configuração MySQL será usada');
}

// Testar importação do módulo de banco
try {
    const db = require('./Backend/Database/db');
    console.log('✅ Módulo de banco importado com sucesso');
} catch (error) {
    console.error('❌ Erro ao importar módulo de banco:', error.message);
}