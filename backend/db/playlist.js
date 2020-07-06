var exp = require('express');
var pl = exp.Router();

var playlist = require('../funzioni/playlist');
var element = require('./elements');

pl.use('/elements', element);

//ritorna sia una singola pl che tutte quelle di un utente se specific nome nel body
pl.get('/:userID', playlist.get_playlist);

pl.post('/:userID', playlist.create_playlist);

pl.put('/:userID', playlist.rename_playlist);

pl.delete('/:userID', playlist.delete_playlist);

module.exports = pl;