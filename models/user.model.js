const {mongoose} = require('../database/database');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        lowercase: true,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    nome: {
        type: String
    },
    handle: {
        type: String
    },
    bggUsername: {
        type: String
    },
    colecao: [mongoose.Schema.Types.Mixed],
    ofertados: [mongoose.Schema.Types.Mixed],
    desejados: [mongoose.Schema.Types.Mixed],
    trocados: [mongoose.Schema.Types.Mixed],
    pago: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('User', userSchema);

module.exports = { User };