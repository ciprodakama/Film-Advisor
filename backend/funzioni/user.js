var mongoose = require('mongoose');

var User = require('../schema/user');
var Playlist = require('../schema/playlist');
var Element = require('../schema/elements');

exports.get_all_user = (req, res, next) => {
    var password = req.body.password;
    var pw = 'password';
    console.log(pw);
    if(!password || password !== pw )
    {
        res.status(500).json({
            message: 'Accesso alla funzione negato'
        })
    }
    else
    {
        User.find().select('_id mail playlist').exec()
            .then( fulfilled => {
                if(!fulfilled[0])
                {
                    res.status(200).json({ 
                        message: 'The List is Empty, creane uno con POST inserendo:',
                        mail:'mail'
                    })
                }
                res.status(200).json(fulfilled);
            })
            .catch(rejected => {
                res.status(500).json({Error: rejected})
            });
    }
};

exports.post_user = (req, res, next) => {
    var mail = req.body.mail;
    if(!mail)
    {
        res.status(500).json({
            message: 'Inserire dati corretti nel body',
            mail:'Inserisci una mail valida'
        })
    }
    else
    {    
        User.find({mail: mail}).exec()
            .then( fulfilled => {
                console
                if(fulfilled[0])
                {
                    return res.status(409).json({
                        Message: 'Utente già registrato; accedi alle tue playlist all\'url',
                        Url: 'http://localhost:8888/user/' + fulfilled[0]._id
                    });
                }
                else
                {
                    var usr = new User({
                        _id: mongoose.Types.ObjectId(),
                        mail: mail,
                    })
                    usr.save()
                    .then(result => {
                        res.status(201).json({
                            _id: result._id,
                            mail: result.mail,
                            playlist: result.playlist
                        })
                    }).catch(rejected => {
                        res.status(500).json({
                            Message: 'Errore con lo storage nel DB',
                            Error: rejected.message,
                        })
                    })
                }
            })
            .catch(rejected => {
                res.status(500).json({
                    Message: 'Errore nella find dell\'utente',
                    Error: rejected.message,
                })
            });
    }
};

exports.get_user = (req, res, next) => {
    var id = req.params.usrID;
    User.findById(id)
        //fetch the data from the db
        .then(fulfilled => {
            //se non è presente ritorna null
            if(!fulfilled)
                res.status(404).json({ message: 'nessun utente trovato con id: ' + id});
            res.status(200).json({
                _id: fulfilled._id,
                mail: fulfilled.mail,
                playlist: fulfilled.playlist,
                message: 'Crea conplaylist con POST all\'url: http://localhost:8888/user/playlist/' + id
            })
        }).catch(rejected => {
            res.status(500).json({
                Error: rejected
            })
        });
};

exports.delete_user = (req, res, next) => {
    var id = req.params.usrID;
    User.remove({_id: id}).exec()
        .then(fulfilled => {
            //se non è presente ritorna null
            if(!fulfilled)
                res.status(404).json({ message: 'Not Entry Found in GET request for user'});
            res.status(200).json({
                message: 'Utente cancellato correttamente',
            });
        }).catch(rejected => {
            res.status(500).json({
                Error: rejected
            })
        });
};