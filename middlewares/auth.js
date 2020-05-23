const jwt = require("jsonwebtoken");
const config = require('../config/config');


module.exports = function(req, res, next){
    var token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'Token de acesso faltando.' });

    jwt.verify(token, config.APIKey, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Falha ao autenticar token.' });
        // se tudo estiver ok, salva no request para uso posterior
        req.user = decoded.user;
        next();
    });
}