const express = require('express');

const config = require('./config.js');

const {google} = require('googleapis');

const body_parser = require('body-parser');

var mongoose = require('mongoose');

var morgan = require('morgan');

var Promise = require('promise');

const app = express();

app.use(body_parser.urlencoded({extended:false}));

var user = require('./db/user');

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

    res.send("<br><br><button onclick='window.location.href=\""+url+"\"'>Login</button>");

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
        res.send('Got the token = '+tokens.access_token+"<br><br><button onclick='window.location.href=\"/getVideo?name=Ready Player One\"'>Get Video</button>"+
    "<br><br><button onclick='window.location.href=\"/getPlaylist\"'>Get Playlist</button>"+
    "<br><br><button onclick='window.location.href=\"/createPlaylist?title=La_mia_nuova_playlist&description=Creata tramite restuful API\"'>Create Playlist</button>"+
    "<br><br><button onclick='window.location.href=\"/playlist/insertVideo\"'>Add Video</button>"+
    "<br><br><button onclick='window.location.href=\"/playlist/delete\"'>Delete Playlist</button>"+
    "<br><br><button onclick='window.location.href=\"/playlist/update\"'>Update Playlist</button>");
    });
    
    
})

//Try to get a film :)

app.get('/getVideo',function(req,res){


    var youtube = google.youtube('v3');

    var name = req.query.name;

    youtube.search.list({
        part: 'snippet',
        type: 'video',
        q : name+'Trailer'
    }).then((response)=>{
        console.log(response);
        var url_video = 'https://www.youtube.com/watch?v='+response.data.items[0].id.videoId;
        res.send({videoLink:url_video});
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
                title : response.data.items[i].snippet.title,
                id : response.data.items[i].id,
                playlistLink: url_playlist
            };
    
            array.push(obj);

            
        };
        res.send(array);
        //PlaylistDb('5eb6717f9fcdff2d983201c2',obj.title,obj.playlistLink);
        

        
    }).catch((err)=>{
        console.log(err);
        res.redirect('/login');
    });


})

//Try to create a playlist

app.get('/createPlaylist',function(req,res){

    var youtube = google.youtube('v3');

    var title = req.query.title;
    var description = req.query.description;


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
        PlaylistDb('5eb6717f9fcdff2d983201c2',title,playlist_url);
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

app.get('/playlist/insertVideo',function(req,res){

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

    var array = ["CwXOrWvPBPk","2xvEUt8lVNg","zg23CSUm1qk"]  //here go the video_id of the videos selected by the client
    
    for(i=0;i<array.length;i++) {
        resource.snippet.resourceId.videoId = array[i];
        youtube.playlistItems.insert({
            part : 'snippet',
            resource : resource,
        }).then((response)=>{
            console.log(response);
            VideoDb('5eb6717f9fcdff2d983201c2','La_mia_nuova_playlist',response.data.snippet.title,resource.snippet.resourceId.videoId);
            res.send({
                message : 'added video to your playlist',
                url : 'https://www.youtube.com/playlist?list='+resource.snippet.playlistId,
            });
        }).catch((err)=>{
            console.log(err);
            res.send('error in adding the video');
        });
    }
})

//Try to update a playlist

app.get('/playlist/update',function(req,res){

    var youtube = google.youtube('v3');

    var resource = {
        id : 'PLccv7pMO8il8o5drlMEygqi0l6MJb1hGa',
        snippet : {
            title : "Cambio_nome_test"
        }
    }

    youtube.playlists.update({
        part : 'snippet',
        resource : resource
    }).then((response)=>{
        console.log(response);
        PlaylistUp('5eb6717f9fcdff2d983201c2',"La_mia_nuova_playlist",resource.snippet.title);
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

app.get('/playlist/delete',function(req,res){

    var youtube = google.youtube('v3');

    youtube.playlists.delete({
        id : 'PLccv7pMO8il-YtkwGAUJEYSg0t9sTtFpT'
    }).then((response)=>{
        console.log(response);
        deletePL('5eb6717f9fcdff2d983201c2',"cavolo")
        res.send('Playlist deleted successfully');
    }).catch((err)=>{
        console.log(err);
        res.send('error in deleting the playlist');
    });

})

//FUNCTIONS USEFUL FOR THE INTERACTION WITH THE DB 

//Sing in of a new user

function login(mail,callback){
    
    var request = require('request');
    
    var body = {
        "mail":mail,
    };

    request.post({
        url : 'http://localhost:3001/user/',
        headers : {
            'Content-Type' : 'application/json; charset=utf-8',
        },
        body : JSON.stringify(body),
    },function(err,response,body){
        if(err) {
            console.log(err);
        }
        else{
            console.log(body);
            callback(response.statusCode);
        }
    })
}

//Add a playlist object in the db of the user identified by userid

function PlaylistDb(userid,nome,url) {

    var request = require('request');
    
    var body = {
        "nome" : nome,
        "pl_url" : url,
    };

    var url = 'http://localhost:3001/user/playlist/'+userid;

    request.post({
        url : url,
        headers : {
           'Content-Type' : 'application/json; charset=utf-8',
        },
        body : JSON.stringify(body),
    },function(error,response,body){
        if(error){
            console.log(error);
        }
        else{
            console.log(body);
        }
    });
    

    

};

//Add a video object in the db in the playlist pl_name of the user userid

function VideoDb(userid,pl_name,vd_name,vd_id) {

    var request = require('request');

    var body = {
        "nome":vd_name,
        "url": "https://www.youtube.com/watch?v="+vd_id,
    };

    var url = 'http://localhost:3001/user/playlist/elements/'+userid+'/'+pl_name;

    var headers = {
        'Content-Type' : 'application/json; charset=utf-8',
    };

    request.post({
        url : url,
        headers : headers,
        body : JSON.stringify(body)
    },function(error,response,body){
        if (error) {
            console.log(error);
        }
        else {
            console.log('daje\n');
            console.log(body);
        };
    });

}


//Delete a playlist pl_name of a user user_id from the db

function deletePL(userid,pl_name) {

    var request = require('request');

    var url = 'http://localhost:3001/user/playlist/'+userid;

    var body = {
        "nome":pl_name,
    };

    var headers = {
        'Content-Type' : 'application/json; charset=utf-8',
    };

    request.delete({
        url : url,
        headers : headers,
        body : JSON.stringify(body),
    },function(error,response,body){
        if(error) {
            console.log(error);
        }
        else{
            console.log(body);
        }
    });


}


//Update a playlist of a user user_id

function PlaylistUp(userid,vecchio_nome,nuovo_nome){

    var request = require('request');

    var url = "http://localhost:3001/user/playlist/"+userid;

    var headers = {
        'Content-Type' : 'application/json; charset=utf-8',
    };

    var obj = {
        "vecchio_nome" : vecchio_nome,
        "nuovo_nome" : nuovo_nome

    }

    request.put({
        url : url,
        headers : headers,
        body : JSON.stringify(obj)
    },function(error,response,body){
        if (error) {
            console.log(error);
        }
        else {
            console.log(body);
        }
    });

}


module.exports = app;
