var exp = require('express');
var element = exp.Router();

var f_element = require('../funzioni/elements');


element.get('/:usrID/:plName', f_element.get_element);

element.post('/:usrID/:plName', f_element.add_element);

element.delete('/:usrID/:plName', f_element.remove_element);

module.exports = element;