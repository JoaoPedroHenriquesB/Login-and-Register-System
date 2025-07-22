const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../Database/db');
const router = express.Router();

router.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(400).json({message: 'erro ao registrar', error: err});
        res.status(201).json({message: 'usuário registrado'});
    });
})

router.post('/login', (req, res) => {
    const {username, password} = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({message: 'usuário não encontrado'})
        }

        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid){
            return res.status(401).json({message: 'senha incorreta'});
        }

        res.status(200).json({message: 'login realizado com sucesso'});
    });
});

module.exports = router