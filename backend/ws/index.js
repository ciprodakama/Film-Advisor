var server = require('ws').Server;
var serv = new server({ port: 4000 });

var mongoose = require('mongoose');
var body_p = require('body-parser');
var require = require("request");

mongoose.connect('mongodb+srv://admin:admin@cluster0-hjbla.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true,useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

var entry = mongoose.Schema({
    nome: { type: String},
    found: {type: Number, default: 1}
});

serv.on('connection', function(ws) {
    var r;
    /* var body = {
        "password": "password"
    }; */
    require.get({
        url: "http://localhost:8888/user",
        header: {
            'Content-Type' : 'application/json; charset=utf-8'
        },
        //body: JSON.stringify(body)
    }, (err, res, body ) => {
        console.log("body \n"+ body);
        r = body;
    });
    console.log("r " + r);
    ws.on('message', function(msg) {
        var s = "**Server**";
        var col = s.fontcolor("blue");
        if( msg == "_AvgPlaylists")
        {
            var i = 0, sum = 0;
            for( var ob of r )
            {
                sum += r.playlist.length;
                i++;
            }
            sum = sum / i;
            ws.send(col + "Il numero di Playlist madio è: " + sum);
        }
        else if( msg == "_AvgElements")
        {
            var i = 0, sum = 0;
            for( var ob of r )
            {
                for(var e of r.playlist)
                sum += e.numero_elementi;
                i++;
            }
            sum = sum / i;
            ws.send(col + "Il numero di Elementi medio in una playist è: " + sum);
        }
        else if( msg == "_Categories")
        {
            //18 categorie
            var arr = [];
            for(var ob of r)
            {
                if (ob.cat1)
                {
                    var b = 0;
                    for(var e of arr)
                    {
                        if( e.nome == ob.cat1 )
                        {
                            e.found++;
                            b = 1;
                        }
                    }
                    if( !b )
                    {
                        var name = ob.cat1;
                        var entry = {
                            nome: name,
                            found: 1
                        };
                        arr.push(entry);
                    }
                }
                if (ob.cat2)
                {
                    var b = 0;
                    for(var e of arr)
                    {
                        if( e.nome == ob.cat2 )
                        {
                            e.found++;
                            b = 1;
                        }
                    }
                    if( !b )
                    {
                        var name = ob.cat2;
                        var entry = {
                            nome: name,
                            found: 1
                        };
                        arr.push(entry);
                    }
                }
                if (ob.cat3)
                {
                    var b = 0;
                    for(var e of arr)
                    {
                        if( e.nome == ob.cat3 )
                        {
                            e.found++;
                            b = 1;
                        }
                    }
                    if( !b )
                    {
                        var name = ob.cat3;
                        var entry = {
                            nome: name,
                            found: 1
                        };
                        arr.push(entry);
                    }
                }
                if (ob.cat4)
                {
                    var b = 0;
                    for(var e of arr)
                    {
                        if( e.nome == ob.cat4 )
                        {
                            e.found++;
                            b = 1;
                        }
                    }
                    if( !b )
                    {
                        var name = ob.cat4;
                        var entry = {
                            nome: name,
                            found: 1
                        };
                        arr.push(entry);
                    }
                }
                if (ob.cat5)
                {
                    var b = 0;
                    for(var e of arr)
                    {
                        if( e.nome == ob.cat5 )
                        {
                            e.found++;
                            b = 1;
                        }
                    }
                    if( !b )
                    {
                        var name = ob.cat5;
                        var entry = {
                            nome: name,
                            found: 1
                        };
                        arr.push(entry);
                    }
                }
            }
            ws.send(col + "");
        }
        else if( msg == "_Users")
        {
            ws.send(col + "Il numero di utenti nel db è: " + r.length );
        }
        else
        {
            ws.send(col + ": Prova con questi comandi: "+ "\n" +" - _AvgPlaylists"+ "\n" +" - _AvgElements"+ "\n" +" - _Categories"+ "\n" +" - _Users");
        }
    })
});