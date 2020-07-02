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

var interaction = require('./bd_interaction/interaction');  //require the function for the interaction with the db

var trailers = {
    videoLink: [],
    embedLink: []
};

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
    
    /*var email = req.query.mail;

    login(email,function(status){
        if (status!=201){
            console.log('sei già resistrato');
        }
    })*/

    const url = googleOauth.generateAuthUrl({
        access_type: 'offline',
        scope : config.scopes[0]
    });

    //questo url viene mandato al client per farlo accedere al suo account
    res.send(url);
    //res.send("<br><br><button onclick='window.location.href=\""+url+"\"'>Login</button>");

});

//Getting the access_token

app.get('/oauth2callback',function(req,res){
    var code = req.query.code;
    googleOauth.getToken(code, (err, tokens) => {
        if (err) {
          console.error('Error getting oAuth tokens:');
          throw err;
        }
        googleOauth.credentials = tokens;
        /*
        res.send('Got the token = '+tokens.access_token+"<br><br><button onclick='window.location.href=\"/getVideo?name=Ready Player One\"'>Get Video</button>"+
        "<br><br><button onclick='window.location.href=\"/getPlaylist\"'>Get Playlist</button>"+
        "<br><br><button onclick='window.location.href=\"/createPlaylist?title=La_mia_nuova_playlist&description=Creata tramite restuful API\"'>Create Playlist</button>"+
        "<br><br><button onclick='window.location.href=\"/playlist/insertVideo\"'>Add Video</button>"+
        "<br><br><button onclick='window.location.href=\"/playlist/delete\"'>Delete Playlist</button>"+
        "<br><br><button onclick='window.location.href=\"/playlist/update\"'>Update Playlist</button>");
        */
    });
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
        maxResult: 2
    }).then((response)=>{
        //console.log(response);
        var url_video = 'https://www.youtube.com/watch?v='+response.data.items[0].id.videoId;
        var url_embed = 'https://www.youtube.com/embed/'+response.data.items[0].id.videoId;
        res.send({videoLink:url_video, embedLink:url_embed});
    }).catch((err)=>{
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
        console.log(response);
        var array = [];
        var num_playlist = response.data.pageInfo.totalResults;
        for(i=0;i<num_playlist;i++){
            var url_playlist = 'https://www.youtube.com/playlist?list='+response.data.items[i].id;
            var obj = {
                nome : response.data.items[i].snippet.title,
                url: url_playlist,
                url_id : response.data.items[i].id,
            };
            
            array.push(obj);
            
        };
        interaction.PlaylistDb('5eb6717f9fcdff2d983201c2',null,null,null,array);
        res.send(array);
    
    }).catch((err)=>{
        console.log(err);
        res.redirect('/login');
    });


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
        interaction.PlaylistDb('5eb6717f9fcdff2d983201c2',title,playlist_url,response.data.id,null); //updated
        res.send({
            'message':'Created a playlist successfully',
            playlist_url:playlist_url,
        });
    }).catch((err)=>{
        console.log(err);
        res.redirect('/login');
    });

})

//Try to add a video to a playlist

app.post('/playlist/insertVideo',function(req,res){

    var youtube = google.youtube('v3');
    
    //youtube video resource
    var resource = {
            "snippet": {
                "playlistId": "PLccv7pMO8il8o5drlMEygqi0l6MJb1hGa",
                "resourceId": {
                    "videoId": "",
                    "kind": "youtube#video"
                }
            }
    };

    var array = [];
    var id1 = req.body.video1;
    var id2 = req.body.video2;
    var id3 = req.body.video3;
    var id4 = req.body.video4;
    var id5 = req.body.video5;
    array.push(id1);
    array.push(id2);
    array.push(id3);
    array.push(id4);
    array.push(id5);

    //var array = ["CwXOrWvPBPk","2xvEUt8lVNg","zg23CSUm1qk"]  //here go the video_id of the videos selected by the client
    
    for(i=0;i<array.length;i++) {
        if (array[i]!=null) {
            resource.snippet.resourceId.videoId = array[i];
            youtube.playlistItems.insert({
                part : 'snippet',
                resource : resource,
            }).then((response)=>{
                console.log(response);
                interaction.VideoDb('5eb6717f9fcdff2d983201c2','La_mia_nuova_playlist',response.data.snippet.title,resource.snippet.resourceId.videoId);
                res.send({
                    message : 'added video to your playlist',
                    url : 'https://www.youtube.com/playlist?list='+resource.snippet.playlistId,
                });
            }).catch((err)=>{
                console.log(err);
                res.send('error in adding the video');
            });
        }
    }
})

//Try to update a playlist

app.put('/playlist/update',function(req,res){

    var youtube = google.youtube('v3');

    var vecchio_nome = req.body.vecchio_nome;
    var nuovo_nome = req.body.nuovo_nome;

    var resource = {
        id : 'PLccv7pMO8il8o5drlMEygqi0l6MJb1hGa',
        snippet : {
            title : nuovo_nome
        }
    }

    youtube.playlists.update({
        part : 'snippet',
        resource : resource
    }).then((response)=>{
        console.log(response);
        interaction.PlaylistUp('5eb6717f9fcdff2d983201c2',vecchio_nome,resource.snippet.title);
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

    youtube.playlists.delete({
        id : 'PLccv7pMO8il-YtkwGAUJEYSg0t9sTtFpT'
    }).then((response)=>{
        console.log(response);
        interaction.deletePL('5eb6717f9fcdff2d983201c2',"cavolo")
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
                body.results.slice(0,2).forEach(element => {
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

    //var videos = [];
    if (trailers.videoLink === undefined || trailers.videoLink.length == 0) {
        titles.forEach(element => {
            request(url+element, options, (error, res, body) => {
                if (error){
                    //reject(error);
                    return console.log(error)
                } else {
                    console.log(body.videoLink);
                    trailers.videoLink.push(body.videoLink);
                    trailers.embedLink.push(body.embedLink);
                    console.log(trailers);
                }   
            }) 
        });
    }
    else{
        trailers.videoLink.splice(0, trailers.videoLink.length);
        trailers.embedLink.splice(0, trailers.embedLink.length);
    }
}
    /*
    return new Promise(function(resolve, reject){
        
        resolve(videos);
    })
    */

app.post('/categories', async function(req,res){
    var user_cat = "";
    for (var i=0; i<req.body.categories.length; i++){
        if(i == req.body.categories.length -1){
            user_cat=user_cat+(req.body.categories[i]);
        }
        else{
            user_cat=user_cat+(req.body.categories[i])+"&";
        }
    }

    var titles = await getTitles(user_cat);
    getTrailer(titles);
    
    /*
    console.log("Those are the cat I sent\n")
    console.log(req.body);
    console.log("Those are the cat for sent\n")
    console.log(user_cat);
    console.log("Those are Titles I got\n")
    console.log(titles);
    console.log("Those are Trailers I got\n")
    console.log(trailers);
    */

    res.sendStatus(200);
});

app.get('/trailers', function(req,res){
    res.send({trailers: trailers});
})



module.exports = app;
