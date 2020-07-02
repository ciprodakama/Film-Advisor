//FUNCTIONS USEFUL FOR THE INTERACTION WITH THE DB 

var config = require('../config.js');

var url_base = 'http://localhost:'+config.port;

//Sing in of a new user

function login(mail,callback){
    
    var request = require('request');
    
    var body = {
        "mail":mail,
    };

    request.post({
        url : url_base+'/user',
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

function PlaylistDb(userid,nome,url,pl_id,array) {

    var request = require('request');

    var body = {};

    if (array) {
        body = {
            "array" : array
        }
    } else {
        body = {
            "nome" : nome,
            "pl_url" : url,
            "url_id" : pl_id
        }
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
            console.log(body+'\n\n');
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

exports.login = login;
exports.PlaylistUp = PlaylistUp;
exports.deletePL = deletePL;
exports.VideoDb = VideoDb;
exports.PlaylistDb = PlaylistDb;
