const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const cors = require('cors')

const app = express()
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API do sistema de login está rodando!');
});

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO EM: http://localhost:${PORT}`)
});
