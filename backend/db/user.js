var exp = require('express');
var user = exp.Router();

var pl = require('./playlist')
var usr = require('../funzioni/user')


user.use('/playlist', pl);


user.get('/', usr.get_all_user );

user.post('/', usr.post_user );

user.get('/:usrID', usr.get_user );

user.delete('/:usrID', usr.delete_user );


module.exports = user;