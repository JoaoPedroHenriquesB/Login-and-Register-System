const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../Database/db');
const router = express.Router();

const isPostgreSQL = process.env.NODE_ENV === 'production' || !!process.env.DB_URL;

console.log('🔍 Auth routes - Ambiente detectado:', isPostgreSQL ? 'PostgreSQL' : 'MySQL');

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    
    console.log('📝 Tentativa de registro:', { username, email });
    
    if (!username || !email || !password) {
        return res.status(400).json({message: 'Todos os campos são obrigatórios'});
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        if (isPostgreSQL) {
            // ===== POSTGRESQL =====
            console.log('🐘 Executando query PostgreSQL para registro...');
            const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
            await db.query(query, [username, email, hashedPassword]);
        } else {
            // ===== MYSQL =====
            console.log('🐬 Executando query MySQL para registro...');
            const query = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
            await db.query(query, [username, email, hashedPassword]);
        }
        
        console.log('✅ Usuário registrado com sucesso:', username);
        res.status(201).json({message: 'usuário registrado com sucesso'});
    } catch (err) {
        console.error('❌ Erro ao registrar:', err.message);
        
        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({message: 'Usuário ou email já existe'});
        }
        
        res.status(400).json({message: 'erro ao registrar', error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    console.log('🔐 Tentativa de login:', { username });
    
    if (!username || !password) {
        return res.status(400).json({message: 'Username e senha são obrigatórios'});
    }

    try {
        let results;
        
        if (isPostgreSQL) {
            // ===== POSTGRESQL =====
            console.log('🐘 Executando query PostgreSQL para login...');
            const query = 'SELECT * FROM users WHERE username = $1';
            const result = await db.query(query, [username]);
            results = result.rows;
        } else {
            // ===== MYSQL =====
            console.log('🐬 Executando query MySQL para login...');
            const query = 'SELECT * FROM users WHERE username = ?';
            const [rows] = await db.query(query, [username]);
            results = rows;
        }

        if (results.length === 0) {
            console.log('❌ Usuário não encontrado:', username);
            return res.status(400).json({message: 'usuário não encontrado'});
        }

        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            console.log('❌ Senha incorreta para usuário:', username);
            return res.status(401).json({message: 'senha incorreta'});
        }

        console.log('✅ Login realizado com sucesso:', username);
        res.status(200).json({message: 'login realizado com sucesso'});
    } catch (err) {
        console.error('❌ Erro ao fazer login:', err.message);
        res.status(500).json({message: 'erro interno do servidor'});
    }
});

module.exports = router;