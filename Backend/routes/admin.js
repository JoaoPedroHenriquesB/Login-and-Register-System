const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../Database/db');
const router = express.Router();

const isPostgreSQL = process.env.NODE_ENV === 'production' || !!process.env.DB_URL;

console.log('🔧 Admin routes - Ambiente detectado:', isPostgreSQL ? 'PostgreSQL' : 'MySQL');

const adminAuth = (req, res, next) => {
    const adminKey = req.headers['admin-key'];
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'admin123') {
        return res.status(401).json({ message: 'Acesso negado - chave admin inválida' });
    }
    next();
};

router.get('/users', adminAuth, async (req, res) => {
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

        console.log(`📋 Listando ${results.length} usuários`);
        res.json({
            success: true,
            users: results,
            total: results.length
        });
    } catch (err) {
        console.error('❌ Erro ao listar usuários:', err.message);
        res.status(500).json({ message: 'Erro ao listar usuários', error: err.message });
    }
});

router.get('/users/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    
    try {
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
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        console.log(`👤 Usuário encontrado: ${results[0].username}`);
        res.json({
            success: true,
            user: results[0]
        });
    } catch (err) {
        console.error('❌ Erro ao buscar usuário:', err.message);
        res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
    }
});

router.post('/users', adminAuth, async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        if (isPostgreSQL) {
            const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
            const result = await db.query(query, [username, email, hashedPassword]);
            const newUser = result.rows[0];
            
            console.log('✅ Usuário criado pelo admin:', username);
            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                user: newUser
            });
        } else {
            const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            const result = await db.query(query, [username, email, hashedPassword]);
            const [userRows] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [result.insertId]);
            
            console.log('✅ Usuário criado pelo admin:', username);
            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                user: userRows[0]
            });
        }
    } catch (err) {
        console.error('❌ Erro ao criar usuário:', err.message);
        
        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Usuário ou email já existe' });
        }
        
        res.status(400).json({ message: 'Erro ao criar usuário', error: err.message });
    }
});

router.put('/users/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    
    if (!username || !email) {
        return res.status(400).json({ message: 'Username e email são obrigatórios' });
    }

    try {
        let query, params;
        
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            
            if (isPostgreSQL) {
                query = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email, created_at';
                params = [username, email, hashedPassword, id];
            } else {
                query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
                params = [username, email, hashedPassword, id];
            }
        } else {
            if (isPostgreSQL) {
                query = 'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at';
                params = [username, email, id];
            } else {
                query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
                params = [username, email, id];
            }
        }

        if (isPostgreSQL) {
            const result = await db.query(query, params);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            
            console.log('✅ Usuário atualizado:', username);
            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                user: result.rows[0]
            });
        } else {
            const result = await db.query(query, params);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            
            const [userRows] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
            
            console.log('✅ Usuário atualizado:', username);
            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                user: userRows[0]
            });
        }
    } catch (err) {
        console.error('❌ Erro ao atualizar usuário:', err.message);
        
        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username ou email já existe' });
        }
        
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
    }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    
    try {
        let result;
        
        if (isPostgreSQL) {
            const query = 'DELETE FROM users WHERE id = $1 RETURNING username';
            result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            
            console.log('🗑️ Usuário deletado:', result.rows[0].username);
        } else {
            const [userRows] = await db.query('SELECT username FROM users WHERE id = ?', [id]);
            
            const query = 'DELETE FROM users WHERE id = ?';
            result = await db.query(query, [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            
            console.log('🗑️ Usuário deletado:', userRows[0]?.username || `ID: ${id}`);
        }

        res.json({
            success: true,
            message: 'Usuário deletado com sucesso'
        });
    } catch (err) {
        console.error('❌ Erro ao deletar usuário:', err.message);
        res.status(500).json({ message: 'Erro ao deletar usuário', error: err.message });
    }
});

router.get('/stats', adminAuth, async (req, res) => {
    try {
        let totalUsers, recentUsers;
        
        if (isPostgreSQL) {

            const totalResult = await db.query('SELECT COUNT(*) as count FROM users');
            totalUsers = parseInt(totalResult.rows[0].count);

            const recentResult = await db.query(
                'SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\''
            );
            recentUsers = parseInt(recentResult.rows[0].count);
        } else {
            const [totalResult] = await db.query('SELECT COUNT(*) as count FROM users');
            totalUsers = totalResult[0].count;

            const [recentResult] = await db.query(
                'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
            );
            recentUsers = recentResult[0].count;
        }

        console.log('📊 Estatísticas solicitadas');
        res.json({
            success: true,
            stats: {
                totalUsers,
                recentUsers,
                database: isPostgreSQL ? 'PostgreSQL' : 'MySQL',
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error('❌ Erro ao buscar estatísticas:', err.message);
        res.status(500).json({ message: 'Erro ao buscar estatísticas', error: err.message });
    }
});

module.exports = router;