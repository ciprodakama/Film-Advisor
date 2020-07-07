var mongoose = require('mongoose');
var User = require('../schema/user');
var Playlist = require('../schema/playlist');
var Element = require('../schema/elements');

exports.get_element = (req, res, next ) => {
    var id = req.params.usrID;
    var pl = req.params.plName;
    var elem = req.body.nome;
    if( !elem )
    {
        return res.status(500).json({
            message:'inserisci il parametro corretto',
            nome: 'inserisci un nome corretto'
        });
    }
    User.findById(id)
        .then( fulfilled => {
            //cerco l'elemento nella playlist
            for ( var ob of fulfilled.playlist )
            {
                if ( ob.nome === pl )
                {
                    for( var e of ob.elements )
                    {
                        if ( e.nome === elem )
                        {
                            return res.status(200).json({
                                nome: e.nome,
                                url: e.url_film
                            })
                        }
                    }
                    res.status(404).json({
                        message: 'Elemento non trovato nella playlist: '+ pl
                    })
                }
            }
            res.status(404).json({
                message: 'Playlist non trovata nell\'utente: ' + id
            })
        })
        .catch( reject  => {
            res.status(500).json({
                message: 'Impossibile trovare lo User: ' + id,
                Error: reject.message
            })
        });
};

exports.add_element = (req, res, next ) => {
    var id = req.params.usrID;
    var pl = req.params.plName;
    var elem = req.body.nome;
    var id_elem = req.body.id_elem;
    var url = req.body.url;
    if( !url || ! elem )
    {
        return res.status(500).json({
            message: 'Inserire parametri corretti',
            url: 'inserisci un url corretto',
            nome: 'inserisci un nome corretto'
        })
    }
    User.findById(id)
        .then( fulfilled => {
            var e = new Element({
                _id: mongoose.Types.ObjectId,
                nome: elem,
                id_elem: id_elem,
                url_film: url
            })
            var i = 0, len = fulfilled.playlist.length;
            for( var op of fulfilled.playlist )
            {
                if( op.nome === pl )
                {   
                    console.log("Sto aggiungendo l'elemento\n")
                    console.log(e)
                    fulfilled.playlist[i].elements.push(e);
                    fulfilled.playlist[i].numero_elementi ++;
                    break;
                }
                i++;
            }
            if ( i === len )
            {
                return res.status(404).json({
                    message:'Playlist non trovata'
                });
            }
            User.update({ _id: id}, { $set: fulfilled }).exec()
            .then( result => {
                res.status(201).json({
                    message: 'Elemento aggiunto correttamente alla playlist: ' + '"' + pl,
                });
            })
            .catch( rejected => {
                res.status(500).json({
                    message: 'Errore nell\'aggiunta dell\'elemento alla playlist',
                    Error: rejected.message
                });
            })
        })
        .catch( reject  => {
            res.status(500).json({
                message: 'Impossibile trovare lo User: ' + id,
                Error: reject.message
            })
        });
};

exports.remove_element = (req, res, next ) => {
    var id = req.params.usrID;
    var pl = req.params.plName;
    var elem = req.body.nome;
    if( !elem )
    {
        return res.status(500).json({
            message:'inserisci il parametro corretto',
            nome: 'inserisci un nome corretto'
        });
    }    
    User.findById(id)
        .then( fulfilled => {
            // i indice di playlist, b = boolean
            var i = 0, b = 0, a = 0;
            for ( var ob of fulfilled.playlist )
            {
                //playlist trovata
                if ( ob.nome === pl )
                {
                    // j indice di elemento nella playlist
                    var j = 0;
                    a = 1;
                    for( var e of ob.elements )
                    {
                        //elemento trovato
                        if ( e.nome === elem )
                        {
                            if ( j === 0)
                            {
                                ob.elements.shift();
                                fulfilled.playlist[i] = ob;
                                fulfilled.playlist[i].numero_elementi --;
                                b = 1;
                                break;
                            }
                            else
                            {
                                ob.elements.splice(j, 1);
                                fulfilled.playlist[i] = ob;
                                fulfilled.playlist[i].numero_elementi --;
                                b = 1;
                                break;
                            }
                        }
                        j++;
                    }
                    if(!b)
                        return res.status(404).json({
                            message: 'Elemento non trovato nella playlist: '+ pl
                        })
                    break;
                }
                i++;
            }
            if(!a)
                return res.status(404).json({
                    message: 'Playlist non trovata nell\'utente: ' + id
                })
            User.update({_id: id}, { $set: fulfilled}).exec()
                .then( result => {
                    res.status(200).json({
                        message: 'Elemento eliminato correttamente dalla playlist: ' + pl
                    })
                })
                .catch( reject  => {
                    res.status(500).json({
                        message: 'Errore nel fare update dello user: ' + id,
                        Error: reject.message
                    })
                });
        })
        .catch( reject  => {
            res.status(500).json({
                message: 'Impossibile trovare lo User: ' + id,
                Error: reject.message
            })
        });
};
