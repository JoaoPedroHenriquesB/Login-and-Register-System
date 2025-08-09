#!/usr/bin/env node

const readline = require('readline');
const bcrypt = require('bcryptjs');
const db = require('../Database/db');

const isPostgreSQL = process.env.NODE_ENV === 'production' || !!process.env.DB_URL;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Gerenciador de Usuários - Sistema de Login');
console.log('='.repeat(50));
console.log(`💾 Banco: ${isPostgreSQL ? 'PostgreSQL' : 'MySQL'}`);
console.log('='.repeat(50));

function showMenu() {
    console.log('\n📋 MENU PRINCIPAL:');
    console.log('1. Listar todos os usuários');
    console.log('2. Buscar usuário por ID');
    console.log('3. Buscar usuário por username');
    console.log('4. Criar novo usuário');
    console.log('5. Atualizar usuário');
    console.log('6. Deletar usuário');
    console.log('7. Estatísticas do sistema');
    console.log('8. Sair');
    console.log('-'.repeat(30));
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function listUsers() {
    try {
        let results;
        
        if (isPostgreSQL) {
            const query = 'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC';
            const result = await db.query(query);
            results = result.rows;
        } else {
            const query = 'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC';
            const [rows] = await db.query(query);
            results = rows;
        }

        console.log('\n👥 USUÁRIOS CADASTRADOS:');
        console.log('='.repeat(80));
        console.log('ID\tUsername\t\tEmail\t\t\tData de Criação');
        console.log('-'.repeat(80));
        
        if (results.length === 0) {
            console.log('Nenhum usuário encontrado.');
        } else {
            results.forEach(user => {
                const createdAt = new Date(user.created_at).toLocaleString('pt-BR');
                console.log(`${user.id}\t${user.username.padEnd(15)}\t${user.email.padEnd(25)}\t${createdAt}`);
            });
        }
        console.log('='.repeat(80));
        console.log(`Total: ${results.length} usuários`);
    } catch (err) {
        console.error('❌ Erro ao listar usuários:', err.message);
    }
}

async function findUserById() {
    try {
        const id = await askQuestion('Digite o ID do usuário: ');
        
        let results;
        
        if (isPostgreSQL) {
            const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
            const result = await db.query(query, [id]);
            results = result.rows;
        } else {
            const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
            const [rows] = await db.query(query, [id]);
            results = rows;
        }

        if (results.length === 0) {
            console.log('❌ Usuário não encontrado.');
        } else {
            const user = results[0];
            console.log('\n👤 USUÁRIO ENCONTRADO:');
            console.log('-'.repeat(40));
            console.log(`ID: ${user.id}`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
            console.log('-'.repeat(40));
        }
    } catch (err) {
        console.error('❌ Erro ao buscar usuário:', err.message);
    }
}

async function findUserByUsername() {
    try {
        const username = await askQuestion('Digite o username: ');
        
        let results;
        
        if (isPostgreSQL) {
            const query = 'SELECT id, username, email, created_at FROM users WHERE username = $1';
            const result = await db.query(query, [username]);
            results = result.rows;
        } else {
            const query = 'SELECT id, username, email, created_at FROM users WHERE username = ?';
            const [rows] = await db.query(query, [username]);
            results = rows;
        }

        if (results.length === 0) {
            console.log('❌ Usuário não encontrado.');
        } else {
            const user = results[0];
            console.log('\n👤 USUÁRIO ENCONTRADO:');
            console.log('-'.repeat(40));
            console.log(`ID: ${user.id}`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
            console.log('-'.repeat(40));
        }
    } catch (err) {
        console.error('❌ Erro ao buscar usuário:', err.message);
    }
}

async function createUser() {
    try {
        console.log('\n➕ CRIAR NOVO USUÁRIO:');
        const username = await askQuestion('Username: ');
        const email = await askQuestion('Email: ');
        const password = await askQuestion('Senha: ');
        
        if (!username || !email || !password) {
            console.log('❌ Todos os campos são obrigatórios.');
            return;
        }
        
        const hashedPassword = bcrypt.hashSync(password, 10);

        if (isPostgreSQL) {
            const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
            const result = await db.query(query, [username, email, hashedPassword]);
            const newUser = result.rows[0];
            
            console.log('✅ Usuário criado com sucesso!');
            console.log(`ID: ${newUser.id}`);
            console.log(`Username: ${newUser.username}`);
            console.log(`Email: ${newUser.email}`);
        } else {
            const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            const result = await db.query(query, [username, email, hashedPassword]);
            
            console.log('✅ Usuário criado com sucesso!');
            console.log(`ID: ${result.insertId}`);
            console.log(`Username: ${username}`);
            console.log(`Email: ${email}`);
        }
    } catch (err) {
        console.error('❌ Erro ao criar usuário:', err.message);
        
        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
            console.log('❌ Username ou email já existe.');
        }
    }
}

async function updateUser() {
    try {
        const id = await askQuestion('Digite o ID do usuário para atualizar: ');
        
        // Primeiro, verificar se o usuário existe
        let userResults;
        
        if (isPostgreSQL) {
            const query = 'SELECT id, username, email FROM users WHERE id = $1';
            const result = await db.query(query, [id]);
            userResults = result.rows;
        } else {
            const query = 'SELECT id, username, email FROM users WHERE id = ?';
            const [rows] = await db.query(query, [id]);
            userResults = rows;
        }

        if (userResults.length === 0) {
            console.log('❌ Usuário não encontrado.');
            return;
        }

        const currentUser = userResults[0];
        console.log(`\n✏️ ATUALIZANDO USUÁRIO: ${currentUser.username}`);
        console.log('(Deixe vazio para manter o valor atual)');
        
        const newUsername = await askQuestion(`Username (${currentUser.username}): `);
        const newEmail = await askQuestion(`Email (${currentUser.email}): `);
        const newPassword = await askQuestion('Nova senha (deixe vazio para não alterar): ');
        
        const username = newUsername || currentUser.username;
        const email = newEmail || currentUser.email;
        
        let query, params;
        
        if (newPassword) {
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            
            if (isPostgreSQL) {
                query = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email';
                params = [username, email, hashedPassword, id];
            } else {
                query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
                params = [username, email, hashedPassword, id];
            }
        } else {
            if (isPostgreSQL) {
                query = 'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email';
                params = [username, email, id];
            } else {
                query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
                params = [username, email, id];
            }
        }

        await db.query(query, params);
        
        console.log('✅ Usuário atualizado com sucesso!');
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        if (newPassword) {
            console.log('Senha: Atualizada');
        }
    } catch (err) {
        console.error('❌ Erro ao atualizar usuário:', err.message);
        
        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
            console.log('❌ Username ou email já existe.');
        }
    }
}

async function deleteUser() {
    try {
        const id = await askQuestion('Digite o ID do usuário para deletar: ');
        
        // Primeiro, buscar o usuário para confirmação
        let userResults;
        
        if (isPostgreSQL) {
            const query = 'SELECT username FROM users WHERE id = $1';
            const result = await db.query(query, [id]);
            userResults = result.rows;
        } else {
            const query = 'SELECT username FROM users WHERE id = ?';
            const [rows] = await db.query(query, [id]);
            userResults = rows;
        }

        if (userResults.length === 0) {
            console.log('❌ Usuário não encontrado.');
            return;
        }

        const username = userResults[0].username;
        const confirmation = await askQuestion(`⚠️ Tem certeza que deseja deletar o usuário "${username}"? (sim/não): `);
        
        if (confirmation.toLowerCase() !== 'sim') {
            console.log('❌ Operação cancelada.');
            return;
        }

        if (isPostgreSQL) {
            const query = 'DELETE FROM users WHERE id = $1';
            await db.query(query, [id]);
        } else {
            const query = 'DELETE FROM users WHERE id = ?';
            await db.query(query, [id]);
        }

        console.log(`🗑️ Usuário "${username}" deletado com sucesso!`);
    } catch (err) {
        console.error('❌ Erro ao deletar usuário:', err.message);
    }
}

async function showStats() {
    try {
        let totalUsers, recentUsers;
        
        if (isPostgreSQL) {
            // Total de usuários
            const totalResult = await db.query('SELECT COUNT(*) as count FROM users');
            totalUsers = parseInt(totalResult.rows[0].count);
            
            // Usuários dos últimos 7 dias
            const recentResult = await db.query(
                'SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\''
            );
            recentUsers = parseInt(recentResult.rows[0].count);
        } else {
            // Total de usuários
            const [totalResult] = await db.query('SELECT COUNT(*) as count FROM users');
            totalUsers = totalResult[0].count;
            
            // Usuários dos últimos 7 dias
            const [recentResult] = await db.query(
                'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
            );
            recentUsers = recentResult[0].count;
        }

        console.log('\n📊 ESTATÍSTICAS DO SISTEMA:');
        console.log('='.repeat(40));
        console.log(`Total de usuários: ${totalUsers}`);
        console.log(`Novos usuários (7 dias): ${recentUsers}`);
        console.log(`Banco de dados: ${isPostgreSQL ? 'PostgreSQL' : 'MySQL'}`);
        console.log(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
        console.log('='.repeat(40));
    } catch (err) {
        console.error('❌ Erro ao buscar estatísticas:', err.message);
    }
}

async function main() {
    try {
        while (true) {
            showMenu();
            const choice = await askQuestion('Escolha uma opção (1-8): ');
            
            switch (choice) {
                case '1':
                    await listUsers();
                    break;
                case '2':
                    await findUserById();
                    break;
                case '3':
                    await findUserByUsername();
                    break;
                case '4':
                    await createUser();
                    break;
                case '5':
                    await updateUser();
                    break;
                case '6':
                    await deleteUser();
                    break;
                case '7':
                    await showStats();
                    break;
                case '8':
                    console.log('👋 Saindo do gerenciador de usuários...');
                    rl.close();
                    process.exit(0);
                    break;
                default:
                    console.log('❌ Opção inválida. Tente novamente.');
            }
            
            await askQuestion('\nPressione Enter para continuar...');
        }
    } catch (err) {
        console.error('❌ Erro fatal:', err.message);
        rl.close();
        process.exit(1);
    }
}

// Iniciar o programa
main();