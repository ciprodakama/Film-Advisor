var http = require('http');
var app = require('./app');

var serv = http.createServer(app);

serv.listen(3001,()=>{
    console.log('Server listening on http://localhost:3001.....');
});