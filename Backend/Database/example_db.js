const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'host name',
    user: 'username',
    password: 'pass',
    database: 'database name'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar ao servidor MySQL', err.message);
    } else{
        console.log('Conectado ao banco de dados MySQL');
    }
});

module.exports = db;