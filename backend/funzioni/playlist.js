var mongoose = require('mongoose');

var User = require('../schema/user');
var Playlist = require('../schema/playlist');
var Element = require('../schema/elements');

exports.get_playlist = (req, res, next) => {
    var id = req.params.userID;
    var nome = req.body.nome;
    User.findById(id)
        .then(fulfilled => {
            if (!fulfilled)
            {
                res.status(404).json({
                    message: 'Utente non trovato, impossibile fare il fetch delle playlist'
                });
            }
            var usr_pl = fulfilled.playlist;
            if( !nome )
            {
                res.status(200).json({
                    _id: fulfilled._id,
                    mail: fulfilled.mail,
                    numero_elem: fulfilled.numero_elem,
                    playlist: fulfilled.playlist
                });
            }
            else
            {
                var b = 0;
                for( var ob of usr_pl )
                {
                    if( ob.nome === nome)
                    {
                        res.status(200).json({
                            nome: ob.nome,
                            _id : ob._id,
                            url: ob.url,
                            url_id: ob.url_id,
                            numero_elem: ob.numero_elem,
                            elements: ob.elements,
                            message: 'Per modificare gli elementi riferirsi all\'url',
                            url: 'http://localhost:8888/user/playlist/elements/' + id + '/' + nome
                        });
                        b = 1;
                    }
                }
                if( !b )
                {
                    res.status(500).json({
                        message:'playlist non trovata nel profilo dell\' utente: ' + fulfilled.mail,
                        get_all_playlist: 'Per avere tutte le playlist dell\'utente non specificare il body',
                        get_playlist: 'Se vuoi una playlist specifica inserisci il nome corretto senza spazi'
                    })
                }
            }
        })
        .catch(rejected => {
            res.status(500).json({
                Message: 'Errore nella fetch delle playlist di: ' + id,
                Error: rejected.message,
            })
        });
};

exports.create_playlist = (req, res, next) => {
    var id = req.params.userID;
    var nome = req.body.nome;
    var url = req.body.pl_url;
    var url_id = req.body.url_id;
    var array = req.body.array;
    if ( array )
    {
        var ob_split, i = 0, newA = [];
        for( var ob of array )
        {   
            if( !ob.nome || !ob.url || !ob.url_id )
            {
                return res.status(500).json({
                    message: 'almeno uno degli elementi in input non rispetta i requisti delle playlist',
                    nome: 'controllare il nome (può contenere spazi)',
                    url: 'controllare url',
                    url_id: 'controllare url_id'
                })
            }
            ob_split = ob.nome.split(' ');
            if( ob_split.length != 1)
            {
                for ( var i = 1; i <= ob_split.length - 1; i++ )
                    ob.nome = ob_split[i-1].concat('_',ob_split[i]);
            }
            var pl = new Playlist({
                nome: ob.nome,
                url: ob.url,
                url_id: ob.url_id
            });
            newA.push(pl);
            i++;
        }
        User.findById(id)
            .then( fulfilled => {
                var newArray = fulfilled.playlist;
                for ( var e of newA )
                {
                    var b = 1, i = 0;
                    for( var o of newArray )
                    {
                        if( e.nome === o.nome)
                        {
                            newArray[i] = e;
                            b = 0;
                        }
                        i++;
                    }
                    if( b )
                        newArray.push(e);
                }
                fulfilled.playlist = newArray;
                User.update({_id: id}, { $set: fulfilled}).exec()
                    .then( result => {
                        res.status(200).json({
                            Message: 'Aggiunto tutte le playlist correttamente'
                        })
                    })
                    .catch(rejected => {
                        res.status(500).json({
                            Message: 'Errore nella creazione della pl',
                            Error: rejected.message,
                        })
                    });
            })
            .catch(rejected => {
                res.status(500).json({
                    Message: 'Errore nella creazione della pl',
                    Error: rejected.message
                })
            });

    }
    else if( !url || !nome || !url_id )
    {
        res.status(500).json({
            message: 'Passa i Parametri corretti',
            pl_url: 'url valido',
            url_id: 'id valido per un url',
            nome: 'nome senza spazi'
        })
    }
    
    else
    { 
        nome_split = nome.split(' ');
        var  len = nome_split.length; 
        if( len > 1 )
            res.status(500).json({
                message: 'nome playlist non valido, non inserire spazi'
            });
        else
        {
            User.findById(id)
                .then(fulfilled => {
                    if (!fulfilled)
                    {
                        res.status(404).json({
                            message: 'Utente non trovato, impossibile creare playlist'
                        });
                    }
                    var num_pl = fulfilled.playlist.length;
                    var b = 0;
                    for( var ob of fulfilled.playlist )
                    {
                        if( ob.nome === nome)
                            b = 1;
                    }
                    if( b )
                    {
                        res.status(500).json({
                            message: 'Playlist esistente, cambiare url'
                        })
                    }
                    else
                    {
                        var pl = new Playlist({
                            nome: nome,
                            url: url,
                            url_id: url_id
                        })
                        fulfilled.playlist.push(pl);
                        if( fulfilled.playlist.length - 1 !== num_pl )
                            res.status(500).json({
                                message: 'Errore nella creazione della playlist: ' + pl.nome,
                                type: 'si è aggiunta una pl in piu\' non desiderata'
                            })
                        User.update({_id: id}, {$set: fulfilled}).exec()
                            .then(result => {
                                res.status(201).json({
                                    pl
                                });
                            }) 
                            .catch(rejected => {
                                res.status(500).json({
                                    Message: 'Errore nella creazione della pl',
                                    Error: rejected.message,
                                })
                            });
                    }
                })
                .catch(rejected => {
                    res.status(500).json({
                        Message: 'Errore nella creazione della pl',
                        Error: rejected.message
                    })
                });
            }
    }
};

exports.rename_playlist = (req, res, next) => {
    var name = req.body.nuovo_nome;
    var old = req.body.vecchio_nome;
    if( !name || !old )
    {
        res.status(500).json({
            message: 'Passa i Parametri corretti',
            nuovo_nome: 'nuovo nome senza spazi',
            vecchio_nome: 'vecchio nome senza spazi'
        })
    }
    else
    {
        var id = req.params.userID;
        var name_split = name.split(' ');
        if( name_split.length > 1 )
            res.status(500).json({
                message: 'nome playlist non valido, non inserire spazi'
            });
        else
        {
            User.findById(id)
                .then(fulfilled => {
                    if (!fulfilled)
                    {
                        res.status(404).json({
                            message: 'Utente non trovato, impossibile fare il fetch delle playlist'
                        });
                    }
                    else
                    {
                        var usr_pl = fulfilled.playlist;
                        var newObj = {};
                        var i = 0;
                        for( var ob of usr_pl)
                        {
                            if( ob.nome === old)
                            {
                                newObj = ob;
                                newObj.nome = name;
                                fulfilled.playlist.splice(i, 1);
                                break;
                            }
                            i = i +1;
                        }
                        fulfilled.playlist.unshift(newObj);
                        User.update({_id: id}, { $set: fulfilled}).exec()
                            .then(r => {
                                res.status(200).json({
                                    message: 'Nome Playlist Modificato',
                                    nome: name
                                });
                            })
                            .catch(rejected => {
                            res.status(500).json({
                                Message: 'Errore nella fetch delle playlist di: ' + id,
                                Error: rejected.message
                            })
                        })
                    }
                }) 
                .catch(rejected => {
                    res.status(500).json({
                        Message: 'Errore nella fetch delle playlist di: ' + id,
                        Error: rejected.message,
                    })
                });
            }
    }
};

exports.delete_playlist = (req, res, next) => {
    var name = req.body.nome;
    var id = req.params.userID;
    User.findById(id)
        .then(fulfilled => {
            if (!fulfilled)
            {
                res.status(404).json({
                    message: 'Utente non trovato, impossibile eliminare playlist'
                });
            } 
            else if( !fulfilled.playlist[0] )
            {
                res.status(404).json({
                    message: 'Playlist non trovata, impossibile eliminare: ' + name
                })
            }
            else if ( fulfilled.playlist[0].nome === name )
            {
                fulfilled.playlist.shift();
            }
            else
            {
                var new_pl = fulfilled.playlist;
                var i = 0, len = new_pl.length;
                for( var ob of new_pl )
                {
                    if ( ob.nome === name )
                    {
                        if( i === 0)
                            new_pl.shift();
                        else
                            new_pl.splice(i, 1);
                        break;
                    }
                    i++;
                }
                if(i === len )
                {
                    res.status(404).json({
                        message: 'Playlist non trovata'
                    });
                }
                fulfilled.playlist = new_pl;
            }
            User.update({_id: id}, { $set: fulfilled}).exec()
                .then( result => {
                    res.status(200).json({
                        message: 'Playlist eliminata correttamente'
                    })
                })
                .catch(rejected => {
                    res.status(500).json({
                        Message: 'Errore nella rimozione della playlist',
                        Error: rejected.message
                    })
                });
        })
        .catch(rejected => {
                res.status(500).json({
                    Message: 'Errore nella fetch delle playlist di: ' + id,
                    Error: rejected.message
                })
            });
};
