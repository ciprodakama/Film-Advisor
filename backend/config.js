const redirect_url = 'http://localhost:3001/oauth2callback';

//url con fron end      --> http://localhost:5500/firstLogin.html
//url test no front end --> http://localhost:3001/oauth2callback

//const credential = require('./credentials.json');
const credential = require('./client_id.json');

module.exports = {
    port : '3001',
    client_id : credential.web.client_id,
    client_secret : credential.web.client_secret,
    redirect_url : redirect_url,
    scopes : [
        'https://www.googleapis.com/auth/youtube'
    ]

};
