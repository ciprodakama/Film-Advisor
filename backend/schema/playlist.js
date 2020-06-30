var mongoose = require('mongoose');

var model = mongoose.Schema({
    nome: {type: String, required: true},
    url: {type: String, required: true},
    numero_elementi: {type: Number, default: 0},
    elements: Array
});

module.exports = mongoose.model('Playlist', model);