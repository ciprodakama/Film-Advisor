var mongoose = require('mongoose');

var model = mongoose.Schema({
    //dico a mongoos che voglio un id unico
    _id: mongoose.Schema.Types.ObjectId,
    mail: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    token: String, 
    playlist: Array
});

module.exports = mongoose.model('User', model);