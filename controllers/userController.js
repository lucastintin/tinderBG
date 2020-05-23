const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const https = require('https');
const xmlJS = require('xml2js').parseString;

const router = express.Router();
const config = require('./../config/config');
const auth   = require('./../middlewares/auth'); 

const { User } = require('../models/user.model');

router.post('/registrar', async (req, res) => {

    const {email, senha} = req.body;

    try {
        
        //Verifica se o email já está cadastrado
        if (await User.findOne({ email })) {
           throw "Usuário já cadastrado";
        }

        //Encripta a senha e cria o handle
        let novasenha   = await bcrypt.hash(senha, config.SALT_ROUND);
        let userHandle  = email.substring(0, email.lastIndexOf('@'));

        await User.create({
            email, 
            senha: novasenha,
            pago: "0",
            handle: userHandle
        });
        
        return res.status(200).send('Usuário criado com sucesso'); //redirect(para pagina de login [index] provavelmente)

    } catch (err) {
        res.status(400).send("ERRO: Cadastro de Usuário  - " + err);
    }
});

router.post('/login', async (req, res) => {
    const {email, senha} = req.body;

    try {
        let user = await User.findOne({ email });
        
        if (!user || user == '' ) {
            return res.status(400).send('Usuário não encontrado. Por favor verifique as credenciais');
        }
        
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch){
            return res.status(403).send('Senhas incorreta.');
        }

        const payload = {
            user: {
                email   
            }
        };

        jwt.sign(payload, 
            config.APIKey, 
            {expiresIn: "12h"}, 
            (err, token) => {
                if (err) throw (err);
                res.status(200).send({authToken: token, email : user.email, nome : user.nome});
            }
        );
        
    } catch (err) {
        res.status(400).send("ERRO: Cadastro de Usuário  - " + err);
    }    
});

router.get('/importar/', auth, async (req, res) =>{
    //buscar o usuario por email
    let { email } = req.user;

    let user = await User.findOne({ email });

    if (user.bggUsername == '' || user.bggUsername == undefined) {
        return res.send(400).send("Tag do BGG faltando, confira o cadastro do teu perfil e tente novamente.");
    }
    
    await https.get("https://www.boardgamegeek.com/xmlapi/collection/"+user.bggUsername+"?own=1", (resp) => {
        let data = '';

        if (resp.statusCode == 202)
            return res.status(200).send('Requisição feita ao servidor do BGG.')

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(JSON.parse(data));
            xmlJS(data, async function(error, result){
                if (error){
                    console.log("Erro ao converter XML em JSON: " + error);
                    return
                }
                //console.dir(JSON.stringify(result));
                //Fazer as funcoes de pegar a info do XML e salvar no Mongo

                let boardgames = [];
                let boardgame  = {}; 

                result.items.item.forEach(element => {    
                    boardgame.bggId     = element.$.objectid;   //console.log('BggID: '+ element.$.objectid);        
                    boardgame.name      = element.name[0]._;    //console.log('Name: ' + element.name[0]._);
                    boardgame.thumbnail = element.thumbnail[0]; //console.log('Thumb: ' + element.thumbnail[0]);
                    
                    boardgames.push(boardgame);
                    boardgame = {};
                });

                console.log(boardgames);

                await User.findOneAndUpdate({email}, {$set:{colecao: boardgames} });
                return res.status(200).send("Coleção importada com sucesso.");
            });  
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

//Caso o cara compre um jogo novo
//Tenho que fazer uma rota para ele adicionar esse jogo individualmente

router.get('/minhacolecao/', auth, async (req, res) =>{
    let { email } = req.user;

    try {
        let user = await User.findOne({ email });

        if (!user || user == '' ) {
            return res.status(400).send('Usuário não encontrado.');
        }
        
        return res.status(200).send({ colecao: user.colecao });
    } catch (error) {
        res.status(400).send("ERRO: Minha Colecao do Usuário - " + error);
    }
});

router.get('/ofertados/:handle', auth, async (req, res) =>{
    let handle = req.params.handle;
    try {
        let user = await User.findOne({ handle });

        if (!user || user == '' ) {
            return res.status(400).send('Usuário não encontrado.');
        }
        
        return res.status(200).send({ ofertados: user.ofertados });
    } catch (error) {
        res.status(400).send("ERRO: Ofertados do Usuário  - " + error);
    }
});

router.get('/desejados/:handle', auth,  async (req, res) =>{
    let handle = req.params.handle;
    try {
        let user = await User.findOne({ handle });
        
        if (!user || user == '' ) {
            return res.status(400).send('Usuário não encontrado.');
        }
        
        return res.status(200).send({ desejados: user.desejados });
    } catch (error) {
        res.status(400).send("ERRO: Desejados de Usuário  - " + error);
    }
});

//fazer uma rota para marcar se é o jogo é ofertado
//fazer uma rota para marcar se o jogo é desejado.

module.exports = router;