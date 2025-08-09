const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../Database/db');
const router = express.Router();

const isPostgreSQL = process.env.NODE_ENV === 'production' || process.env.DB_URL;

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({message: 'Todos os campos são obrigatórios'});
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        if (isPostgreSQL) {
            // PostgreSQL query
            const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
            await db.query(query, [username, email, hashedPassword]);
        } else {
            // MySQL query
            const query = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
            await new Promise((resolve, reject) => {
                db.query(query, [username, email, hashedPassword], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        }
        res.status(201).json({message: 'usuário registrado com sucesso'});
    } catch (err) {
        console.error('Erro ao registrar:', err);
        res.status(400).json({message: 'erro ao registrar', error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    if (!username || !password) {
        return res.status(400).json({message: 'Username e senha são obrigatórios'});
    }

    try {
        let results;
        
        if (isPostgreSQL) {
            // PostgreSQL query
            const query = 'SELECT * FROM users WHERE username = $1';
            const result = await db.query(query, [username]);
            results = result.rows;
        } else {
            // MySQL query
            const query = 'SELECT * FROM users WHERE username = ?';
            results = await new Promise((resolve, reject) => {
                db.query(query, [username], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        }

        if (results.length === 0) {
            return res.status(400).json({message: 'usuário não encontrado'});
        }

        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return res.status(401).json({message: 'senha incorreta'});
        }

        res.status(200).json({message: 'login realizado com sucesso'});
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({message: 'erro interno do servidor'});
    }
});

module.exports = router;