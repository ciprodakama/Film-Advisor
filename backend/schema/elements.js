var mongoose = require('mongoose');

var model = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: {type: String, required: true},
    url_film: {type: String, required: true}
})

module.exports = mongoose.model('Element', model);