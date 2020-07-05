const express = require('express');

const config = require('./config.js');

const {google} = require('googleapis');

const body_parser = require('body-parser');

var mongoose = require('mongoose');

var morgan = require('morgan');

var Promise = require('promise');

const app = express();

var cors = require('cors');

app.use(cors());

app.use(body_parser.urlencoded({extended:false}));

var user = require('./db/user');

var interaction = require('./db_interaction/interaction');  //require the function for the interaction with the db

/*
var trailers = {
    videoLink: [],
    embedLink: []
};
*/

var id_us = ""   //parameter that indicates the user id inside the db

//Configurazion for the db

mongoose.connect('mongodb+srv://admin:admin@cluster0-hjbla.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true,useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));

app.use(body_parser.json());

/*app.use((req, res, next) => {
    err = new Error('Not Found')
    err.status = 404;
    next(err);
});

//se fallisce una chiamata al DB passa attraverso questo middleware poichè viene lanciato un errore
app.use((err, req, res, next) => {
    res.status(err.status||500).json({
        error: err.message
    });
});*/

app.use('/user', user );


//Creating the googeOauth object

const googleOauth = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_url
);

//Configure googleapis to use authentication credentials

google.options({auth: googleOauth});

//Getting the code

app.get('/login', function(req,res){
    console.log(req.query);
    var email = req.query.mail;
    if ( typeof email !== 'undefined' ){
        console.log("Sono nel controllo mail")
        
        console.log("La mail nella query è")
        console.log(email)
        
        interaction.login(email,function(status,body){
            console.log("Questo è il body dal DB")
            body=JSON.parse(status.body);
            console.log(body);
            if (status.statusCode != 500){
                console.log("Questo è l'id dal DB")
                console.log(body._id);
                id_us = body._id;
            }
            else if (status == 409) {  //user already in the db
                var obj = JSON.parse(body);
                var url = obj.Url;
                var ris = url.split('/');
                id_us = ris[ris.length-1];
                console.log('sei già registrato ---> ben tornato');
            }
            else{
                console.log('Errore da DB!');
                res.status(500);
            } 
        })
        const url = googleOauth.generateAuthUrl({
            access_type: 'offline',
            scope : config.scopes[0]
        });

        console.log(url)
    
        //questo url viene mandato al client per farlo accedere al suo account
        res.status(200).send(url);
    }
    else{
        console.log("Sono nel redirect di default")
        const url = googleOauth.generateAuthUrl({
            access_type: 'offline',
            scope : config.scopes[0]
        });
        console.log(url)
    
        //questo url viene mandato al client per farlo accedere al suo account
        res.status(200).send(url);
        //res.send("<br><br><button onclick='window.location.href=\""+url+"\"'>Login</button>");
    }
});

//Getting the access_token

app.get('/oauth2callback',function(req,res){
    console.log("Sono nella redirect di Google Login")
    var code = req.query.code;
    googleOauth.getToken(code, (err, tokens) => {
        if (err) {
          console.error('Error getting oAuth tokens:');
          throw err;
        }
        googleOauth.credentials = tokens;
        console.log("Token preso")
        /*
        res.send('Got the token = '+tokens.access_token+"<br><br><button onclick='window.location.href=\"/getVideo?name=Ready Player One\"'>Get Video</button>"+
        "<br><br><button onclick='window.location.href=\"/getPlaylist\"'>Get Playlist</button>"+
        "<br><br><button onclick='window.location.href=\"/createPlaylist?title=La_mia_nuova_playlist&description=Creata tramite restuful API\"'>Create Playlist</button>"+
        "<br><br><button onclick='window.location.href=\"/playlist/insertVideo\"'>Add Video</button>"+
        "<br><br><button onclick='window.location.href=\"/playlist/delete\"'>Delete Playlist</button>"+
        "<br><br><button onclick='window.location.href=\"/playlist/update\"'>Update Playlist</button>");
        */
    });
    console.log("Finito di usare getToken")
    res.redirect("http://localhost:5500/frontend/firstLogin.html");
})

//Try to get a film :)

app.get('/getVideo',function(req,res){

    var youtube = google.youtube('v3');

    var name = req.query.name;

    youtube.search.list({
        part: 'snippet',
        type: 'video',
        q : name+' Trailer',
        maxResult: 4
    }).then((response)=>{
        //console.log(response);
        var url_video = 'https://www.youtube.com/watch?v='+response.data.items[0].id.videoId;
        var url_embed = 'https://www.youtube.com/embed/'+response.data.items[0].id.videoId;
        console.log("Url del getVideo")
        console.log(url_video)
        res.send({videoLink:url_video, embedLink:url_embed});
    }).catch((err)=>{
        console.log("Errore nel getVideo")
        console.log(err);
        res.redirect('/login');
    });
})

//Try to get all client's playlists on youtube ---> maybe useless!!!!

app.get('/getPlaylist',function(req,res){

    var youtube = google.youtube('v3');

    //https://www.youtube.com/playlist?list=plylistid

    youtube.playlists.list({
        part : 'snippet',
        mine : 'true',
    }).then((response)=>{
        var array = [];
        var num_playlist = response.data.pageInfo.totalResults;
        for(i=0;i<num_playlist;i++){
            console.log(response.data.items[i].snippet);
            var url_playlist = 'https://www.youtube.com/playlist?list='+response.data.items[i].id;
            var obj = {
                nome : response.data.items[i].snippet.title,
                url: url_playlist,
                url_id : response.data.items[i].id,
            };
            
            array.push(obj);
            
        };
        interaction.PlaylistDb(id_us,null,null,null,array);
        res.status(200).send(array);
    
    }).catch((err)=>{
        console.log(err);
        res.redirect('/login');
    });


})

// Try to get videos of a specified playlist

app.get('/playlist/videos',function(req,res) {

    var youtube = google.youtube('v3');
    
    var title = req.query.title;  //playlist name useful for adding the video in the rigth playlist inside the db

    var pl_id = req.query.pl_id;  //youtube id of the playlist useful for getting its videos

    var elements = [];

    //var nVideo = 0;
    var finalNum;

    youtube.playlistItems.list({
        part:'snippet',
        playlistId:pl_id,
        maxResults:20
    }).then(async (response)=>{
        console.log(response);
        //res.send(response);
        var num = response.data.pageInfo.totalResults;
        finalNum = num;
        for(j=0; j<num; j++){
            var video_url = 'https://www.youtube.com/watch?v='+response.data.items[j].snippet.resourceId.videoId;
            var video_name = response.data.items[j].snippet.title;
            await sleep(300);
            interaction.VideoDb(id_us,title,video_name,video_url)
            var obj = {
                'video_name':video_name,
                'video_url':video_url,
            }
            elements.push(obj);
            //nVideo++;
        }
        elements.push(finalNum)
        res.send(elements)

    }).catch((err)=>{
        console.log(err);
        res.send(error);
    })   

})

//Try to create a playlist

app.post('/createPlaylist',function(req,res){

    var youtube = google.youtube('v3');

    var title = req.body.title;
    var description = req.body.description;


    // plylist resource that I want to create
    var resource = {
        snippet: {
            title: title,
            description: description
        },
        status: {
           privacyStatus: 'private'
        }
    };

    youtube.playlists.insert({
        part : 'snippet,status', //the part parameter identifies the properties that the write operation will set
        resource : resource,
    }).then((response)=>{
        console.log(response);
        var playlist_url='https://www.youtube.com/playlist?list='+response.data.id;
        interaction.PlaylistDb(id_us,title,playlist_url,response.data.id,null); //updated

        res.redirect('/')
        /*
        res.send({
            'message':'Created a playlist successfully',
            playlist_url:playlist_url,
        });*/
    }).catch((err)=>{
        console.log(err);
        res.redirect('/login');
    });

})

//Try to add a video to a playlist

app.post('/playlist/insertVideo',function(req,res){

    var youtube = google.youtube('v3');

    var pl_id = req.body.pl_id;
    
    //youtube video resource
    var resource = {
            "snippet": {
                "playlistId": pl_id,
                "resourceId": {
                    "videoId": req.body.videoId,
                    "kind": "youtube#video"
                }
            }
    };



    /*var array = [];
    var id1 = req.body.video1;
    var id2 = req.body.video2;
    var id3 = req.body.video3;
    var id4 = req.body.video4;
    var id5 = req.body.video5;
    array.push(id1);
    array.push(id2);
    array.push(id3);
    array.push(id4);
    array.push(id5);*/

    //var array = ["CwXOrWvPBPk","2xvEUt8lVNg","zg23CSUm1qk"]  //here go the video_id of the videos selected by the client

    var pl_name = req.body.pl_name;
    
    youtube.playlistItems.insert({
            part : 'snippet',
            resource : resource,
        }).then((response)=>{
            console.log(response);
            var video_url = 'https://www.youtube.com/watch?v='+resource.snippet.resourceId.videoId;
            interaction.VideoDb(id_us,pl_name,response.data.snippet.title,video_url);
            res.send({
                message : 'added video to your playlist',
                url : 'https://www.youtube.com/playlist?list='+resource.snippet.playlistId,
            });
        }).catch((err)=>{
            console.log(err);
            res.send('error in adding the video');
    });
    
    
})

//Try to update a playlist

app.put('/playlist/update',function(req,res){

    var youtube = google.youtube('v3');

    var vecchio_nome = req.body.vecchio_nome;
    var nuovo_nome = req.body.nuovo_nome;
    var pl_id = req.body.pl_id;

    var resource = {
        id : pl_id,
        snippet : {
            title : nuovo_nome
        }
    }

    youtube.playlists.update({
        part : 'snippet',
        resource : resource
    }).then((response)=>{
        console.log(response);
        interaction.PlaylistUp(id_us,vecchio_nome,resource.snippet.title);
        res.send({
            message : 'playlist updated successfully',
            link : 'https://www.youtube.com/playlist?list='+response.data.id
        });
    }).catch((err)=>{
        console.log(err);
        res.send('There was an error in updating the palylist');
    });


})

//Try delete a playlist

app.delete('/playlist/delete',function(req,res){

    var youtube = google.youtube('v3');

    var title = req.body.title;
    var pl_id = req.body.pl_id;

    youtube.playlists.delete({
        id : pl_id
    }).then((response)=>{
        console.log(response);
        interaction.deletePL(id_us,title);
        res.send('Playlist deleted successfully');
    }).catch((err)=>{
        console.log(err);
        res.send('error in deleting the playlist');
    });

})

function getTitles(cat){

    var request = require("request");
    let options = {json: true};

    //parameters
    var key = "27bfe195970e9f6efcfc1a9c0557ae5d";
    var lang = "en-US";
    var genres = cat;

    let url = "https://api.themoviedb.org/3/discover/movie?api_key="+key+"&language="+lang+"&sort_by=popularity.desc&include_adult=false&include_video=false&with_genres="+genres;

    var titles = [];
    return new Promise(function(resolve, reject){
        request(url, options, (error, res, body) => {
            if (error){
                reject(error);
                //return console.log(error)
            } else {
                body.results.slice(0,4).forEach(element => {
                    titles.push(element.title);
                });
                console.log(titles);
                resolve(titles);
            }
        })
    })
}

function getTrailer(titles){

    var request = require("request");
    let options = {json: true};

    //parameters
    let url = "http://localhost:3001/getVideo?name=";

    var videos = {
        videoLink: [],
        embedLink: []
    };
    
    return new Promise(function(resolve, reject){
        titles.forEach(element => {
            request(url+element, options, (error, res, body) => {
                if (error){
                    console.log(error);
                    reject(error);
                } else {
                    //console.log(body.videoLink);
                    videos.videoLink.push(body.videoLink);
                    videos.embedLink.push(body.embedLink);
                    //console.log(trailers);
                }   
            }) 
        });
    resolve(videos);    
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
    setTimeout(resolve, ms);
    });
} 

app.post('/categories', async function(req,res){

    var catDB = [];
    for (var j = 0; j<req.body.categories.length; j++){
        catDB.push(req.body.categories[j]);
    }

    var num_cat = catDB.length;
    var cat_toAdd = 5 - num_cat;
    for(var i=0; i<cat_toAdd; i++){
        catDB.push("0");
    }
    var user = id_us;
    var cat1 = catDB[0];
    var cat2 = catDB[1];
    var cat3 = catDB[2];
    var cat4 = catDB[3];
    var cat5 = catDB[4];
    console.log(catDB);
    console.log(req.body.categories);
    console.log(cat1,cat2,cat3,cat4,cat5);
    console.log(user);

    
    interaction.categories(user,cat1,cat2,cat3,cat4,cat5,function(status,body){
        if (status.statusCode == 200){
            console.log("Cat aggiunte al DB!");
        }
        else{
            console.log("Errore aggiunta Cat");
        }
    })

    
    var user_cat = "";
    for (var i=0; i<req.body.categories.length; i++){
        if(req.body.categories != "0"){
            if(i == req.body.categories.length -1){
                user_cat=user_cat+(req.body.categories[i]);
            }
            else{
                user_cat=user_cat+(req.body.categories[i])+"&";
            }
        }
    }

    var titles = await getTitles(user_cat);
    var trailers = await getTrailer(titles);
    console.log("Prima della sleep")
    await sleep(1500)
    console.log("Dopo la sleep")
    res.status(200).send(trailers);
});

/*
app.get('/trailers', function(req,res){
    res.send({trailers: trailers});
})
*/


module.exports = app;
