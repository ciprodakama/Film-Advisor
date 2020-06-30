const redirect_url = 'http://localhost:3001/oauth2callback';

const credential = require('./credentials.json');

module.exports = {

    client_id : credential.web.client_id,
    client_secret : credential.web.client_secret,
    redirect_url : redirect_url,
    scopes : [
        'https://www.googleapis.com/auth/youtube'
    ]

};