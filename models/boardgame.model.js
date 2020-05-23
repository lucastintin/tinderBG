const {mongoose} = require('../database/database');

var boardgameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
    },
    bggId: {
        type: String
    },
    bggThumbnail: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Boardgame = mongoose.model('Boardgame', boardgameSchema);

module.exports = { Boardgame };