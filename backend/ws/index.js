var server = require('ws').Server;
var serv = new server({ port: 4000 });

var mongoose = require('mongoose');
var require = require("request");

mongoose.connect('mongodb+srv://admin:admin@cluster0-hjbla.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true,useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

let translate = (arr) => {
    if( !arr )
        return null
    for (ob of arr)
    {
        if( ob.nome == 28)
            ob.nome = "Azione";
        if( ob.nome == 12)
            ob.nome = "Avventura";
        if( ob.nome == 16)
            ob.nome = "Animazione";
        if( ob.nome == 35)
            ob.nome = "Commedia";
        if( ob.nome == 80)
            ob.nome = "Crime";
        if( ob.nome == 99)
            ob.nome = "Documentario";
        if( ob.nome == 10751)
            ob.nome = "Famiglia";
        if( ob.nome == 14)
            ob.nome = "Fantasy";
        if( ob.nome == 36)
            ob.nome = "Storia";
        if( ob.nome == 27)
            ob.nome = "Horror";
        if( ob.nome == 10402)
            ob.nome = "Musica";
        if( ob.nome == 9648)
            ob.nome = "Mistero";
        if( ob.nome == 10749)
            ob.nome = "Romance";
        if( ob.nome == 878)
            ob.nome = "Fantascienza";
        if( ob.nome == 10770)
            ob.nome = "televisione film";
        if( ob.nome == 53)
            ob.nome = "Thriller";
        if( ob.nome == 10752)
            ob.nome = "Guerra";
        if( ob.nome == 37)
            ob.nome = "Western";
    }
    return arr;
}


let insertionSort = (inputArr) => {
    let length = inputArr.length;
    for (let i = 1; i < length; i++) {
        var key = {
            nome: inputArr[i].nome,
            trovata: inputArr[i].trovata
        }
        let j = i - 1;
        while (j >= 0 && inputArr[j].trovata < key.trovata) {
            inputArr[j + 1] = inputArr[j];
            j = j - 1;
        }
        inputArr[j + 1] = key;
    }
    return inputArr;
};

serv.on('connection', function(ws) {

    var s = "**Server**: ";
    var col = s.fontcolor("blue");
    ws.send(col + "Benvenuto. Prova a scrivere Ciao");
    ws.send("");
    ws.on('message', function(msg) {
        if( msg == "_AvgPlaylists")
        {
            require.get({
                url: "http://localhost:3001/user",
                header: {
                    'Content-Type' : 'application/json; charset=utf-8'
                },
            }, (err, res, body ) => {

                if(err)
                    console.log(err)

                var i = 0, sum = 0;
                for( var ob of JSON.parse(body) )
                {
                    sum += ob.playlist.length;
                    i++;
                }
                sum = sum / i;
                ws.send(col + "Il numero di Playlist madio è: " + sum);
                ws.send("");
            });
        }
        else if( msg == "_AvgElements")
        {
            require.get({
                url: "http://localhost:3001/user",
                header: {
                    'Content-Type' : 'application/json; charset=utf-8'
                },
            }, (err, res, body ) => {

                if(err)
                    console.log(err)

                var i = 0, sum = 0;
                for( var ob of JSON.parse(body) )
                {
                    for(var e of ob.playlist)
                    {
                        sum += e.numero_elementi;
                        i++;
                    }
                }
                sum = sum / i;
                ws.send(col + "Il numero medio di Elementi in una Playlist è: " + sum);
                ws.send("");
            });
        }
        else if( msg == "_Categories")
        {
            require.get({
                url: "http://localhost:3001/user",
                header: {
                    'Content-Type' : 'application/json; charset=utf-8'
                },
            }, (err, res, body ) => {

                if(err)
                    console.log(err)

                var arr = [];
                for(var ob of JSON.parse(body))
                {
                    if (ob.cat1 && ob.cat1 != 0 )
                    {
                        var b = 0;
                        for(var e of arr)
                        {
                            if( e.nome == ob.cat1 )
                            {
                                e.trovata++;
                                b = 1;
                            }
                        }
                        if( !b )
                        {
                            var name = ob.cat1;
                            var entry = {
                                nome: name,
                                trovata: 1
                            };
                            arr.push(entry);
                        }
                    }
                    if (ob.cat2 && ob.cat2 != 0 )
                    {
                        var b = 0;
                        for(var e of arr)
                        {
                            if( e.nome == ob.cat2 )
                            {
                                e.trovata++;
                                b = 1;
                            }
                        }
                        if( !b )
                        {
                            var name = ob.cat2;
                            var entry = {
                                nome: name,
                                trovata: 1
                            };
                            arr.push(entry);
                        }
                    }
                    if (ob.cat3 && ob.cat3 != 0 )
                    {
                        var b = 0;
                        for(var e of arr)
                        {
                            if( e.nome == ob.cat3 )
                            {
                                e.trovata++;
                                b = 1;
                            }
                        }
                        if( !b )
                        {
                            var name = ob.cat3;
                            var entry = {
                                nome: name,
                                trovata: 1
                            };
                            arr.push(entry);
                        }
                    }
                    if (ob.cat4 && ob.cat4 != 0 )
                    {
                        var b = 0;
                        for(var e of arr)
                        {
                            if( e.nome == ob.cat4 )
                            {
                                e.trovata++;
                                b = 1;
                            }
                        }
                        if( !b )
                        {
                            var name = ob.cat4;
                            var entry = {
                                nome: name,
                                trovata: 1
                            };
                            arr.push(entry);
                        }
                    }
                    if (ob.cat5 && ob.cat5 != 0 )
                    {
                        var b = 0;
                        for(var e of arr)
                        {
                            if( e.nome == ob.cat5 )
                            {
                                e.trovata++;
                                b = 1;
                            }
                        }
                        if( !b )
                        {
                            var name = ob.cat5;
                            var entry = {
                                nome: name,
                                trovata: 1
                            };
                            arr.push(entry);
                        }
                    }
                }
                var sorted_array = insertionSort(arr);
                var return_array = [];
                if( sorted_array.length >= 5 )
                {
                    for(var i = 0; i < 5; i++)
                    {
                        return_array.unshift(sorted_array[i]);
                    }
                }
                else
                {
                    for(var i = 0; i < sorted_array.length; i++)
                    {
                        return_array.unshift(sorted_array[i]);
                    }
                }
                var return_array = translate(return_array);
                ws.send(col + JSON.stringify(return_array));
                ws.send("");
            });
        }
        else if( msg == "_Users")
        {
            require.get({
                url: "http://localhost:3001/user",
                header: {
                    'Content-Type' : 'application/json; charset=utf-8'
                },
            }, (err, res, body ) => {

                if(err)
                    console.log(err)

                var i = 0;
                for( var ob of JSON.parse(body) )
                {
                    i++;
                }
                ws.send(col + "Il numero di utenti nel db è: " + i);
                ws.send("");
            });
        }
        else if( msg == "Ciao")
        {
            ws.send(col + "Benvenuto nel Server WS. Prova ad usare uno di questi comandi:");
            ws.send("-> _AvgPlaylists");
            ws.send("-> _AvgElements");
            ws.send("-> _Categories");
            ws.send("-> _Users");
            ws.send("");
        }
        else
        {
            ws.send(col + " Comando non esistente. Prova con questi comandi:");
            ws.send("-> _AvgPlaylists");
            ws.send("-> _AvgElements");
            ws.send("-> _Categories");
            ws.send("-> _Users");
            ws.send("");
        }
    })
});
