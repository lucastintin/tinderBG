const express       = require('express');
const bodyParser    = require('body-parser');
const authMid       = require('./middlewares/auth');

const config = require('./config/config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Controller
var userController = require('./controllers/userController');

app.use('/user', userController);

//Rotas Teste
app.get('/teste', (req, res) => {
    res.status(202).send('OK')
});

app.get('/testeAuth', authMid,  (req, res) => {
    res.status(200).send({ user: req.user });
});

app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`)
});

module.exports = app;
