const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'login_register'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar ao servidor MySQL', err.message);
    } else{
        console.log('Conectado ao banco de dados MySQL');
    }
});

module.exports = db;