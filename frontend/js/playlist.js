const base_url = 'http://localhost:3001';

var url_getVideoPL = base_url+"/user/playlist/";
var url_playlist = base_url+"/user/playlist/";

var url_delPlaylist = base_url+"/playlist/delete"
var url_delVideo = base_url+"/playlist/video"

var title_query = "?title="
var plID_query = "pl_id="



//cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

//get playlist names from main.html
function getUrlVars (url) {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value; });
    return vars;
}

var urlValues = getUrlVars(window.location.href);
console.log(urlValues)
var data = JSON.parse(decodeURIComponent(urlValues.playlist));
console.log(data)

var play = {
    name: [],
    id: []
}

var videoPL = [];
var nVideo;
var Title;
var plID;

function CreateTableFromURI() {
    var col = ["Titolo Playlist", "Link Youtube", "Ispeziona", "Mostra"];

    data['Ispeziona'] = '<button type ="button" class ="btn btn-default btn-sm ispeziona">Recupera Dati</button>';
    data['Mostra'] = '<button type ="button" class ="btn btn-default btn-sm mostra">Mostra Lista</button>';

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.className = "table-striped";

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    console.log("adding data to table")
    console.log(data)
    for (var i = 0; i < data.id.length; i++) {
    
        tr = table.insertRow(-1);
        for (var prop in data) {
            var buttonID;
            if(prop == "id"){
                buttonID = data[prop][i];
                var tabCell = tr.insertCell(-1);
                //console.log("Sto prendendo l'id con prop "+prop+" ed i "+i)
                //console.log(data[prop][i])
                var ext_link = "https://www.youtube.com/playlist?list="+data[prop][i]
                tabCell.innerHTML = "<a target='_blank' href="+ext_link+">"+"Link alla Playlist</a>";
            }
            else if(prop == "name"){
                var tabCell = tr.insertCell(-1);
                tabCell.className = "Titolo";
                //console.log("Sto prendendo il nome con prop "+prop+" ed i "+i)
                //console.log(data[prop][i])
                tabCell.innerHTML = data[prop][i];
            }
            else if(prop == "number"){
                var tabCell = tr.insertCell(-1);
                tabCell.className = "nVideo";
                //console.log("Sto prendendo il nome con prop "+prop+" ed i "+i)
                //console.log(data[prop][i])
                tabCell.innerHTML = data[prop][i];
            }
            else if(prop == "Ispeziona"){
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = '<button type ="button" class ="btn btn-default btn-sm ispeziona" id='+buttonID+'>Recupera Dati</button>';
            }
            else{
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = '<button type ="button" class ="btn btn-default btn-sm mostra" id='+buttonID+'>Mostra Lista</button>';
            }
        }
        
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("playlistUtente");
    
    //divContainer.innerHTML = "";
    divContainer.appendChild(table);  
}

function CreateTableFromPlaylist(){
    var col = [];
    for (var i = 0; i < videoPL.length; i++) {
        for (var key in videoPL[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    console.log(col);
    
    var Theader = ["Titolo Video", "Link Youtube","Rimuovi"];

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.className = "table-striped";

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < Theader.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = Theader[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < videoPL.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            if(j==1){
                var tabCell = tr.insertCell(-1);
                console.log(videoPL[i][col[j]])
                var link = "<a target='_blank' href="+videoPL[i][col[j]]+">"+"Link al Video</a>"
                tabCell.innerHTML = link;
            }
            else if (j==0){
                var tabCell = tr.insertCell(-1);
                tabCell.className = "Titolo";
                tabCell.innerHTML = videoPL[i][col[j]];
            }
            else{
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = videoPL[i][col[j]];
            }
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("dettaglioPlaylist");
    divContainer.innerHTML = "";

    $("#dettaglioPlaylist").append('<h3 style="justify-self: left;" id="plTitle">'+Title+'</h3><h5 style="justify-self: left;" id="nVideo">Questa Playlist ha '+nVideo+' Video!</h5><button class="btn btn-danger rimPlaylist" style="background-color: red;">Elimina Playlist</button><br><br>');
    divContainer.appendChild(table);
}

function initLocalVideoPL(Title, plID, cookieID){
    var url = url_getVideoPL+cookieID;
    
    videoPL = [];

    $.ajax(url).done(function(data) {
        console.log(data);
        console.log(data.playlist.length);

        var playIndex;

        for (var i=0; i<data.playlist.length; i++){
            console.log("Selecting right Playlist")
            console.log("val of data "+data.playlist[i].url_id)
            console.log("val of local "+plID)
            if(data.playlist[i].url_id == plID){
                playIndex = i;
                nVideo = data.playlist[playIndex].numero_elementi;
                console.log(data.playlist[playIndex].elements.lenghth)
                for (var z=0; z<nVideo; z++){
                    videoPL.push(data.playlist[playIndex].elements[z])
                    videoPL[z]["id_item"] = '<button class="btn btn-danger rimuoviVid" style="background-color: red;" id='+data.playlist[playIndex].elements[z]["id_elem"]+'>-</button>'
                    delete videoPL[z]["id_elem"];
                } 
            }
        }
    
        console.log(nVideo);
        console.log("This is localVariable from getVideoPL")
        console.log(videoPL);

        alert("Dati recuperati con successo!")  
    });
}

function getPlaylistDB(cookieID){
    $.get(url_playlist+cookieID, function(data) {
        //salvo playlist da mostrare
        console.log(data);
        console.log(data.playlist.length);

        for (var j= 0; j<data.playlist.length; j++){
            //console.log(data[j].url_id)
            //console.log(data[j].nome)
            play.name.push(data.playlist[j].nome)
            play.id.push(data.playlist[j].url_id)
        }
        //console.log(play);
        //console.log(JSON.stringify(play));
        console.log(play);
        }).fail(function(resp){
            //console.log("Sono nella fail della getPlaylist")
            //var g_url = resp;
            //console.log("Il server mi ha mandato "+ g_url)
            //alert("Errore! Non è stato possibile recuperare Playlist.");
            //$(location).attr("href", g_url);
    });
}

$(document).ready(function() {
    var cookieID = getCookie("id");
    console.log(cookieID);

    CreateTableFromURI();

    $('.ispeziona').click(function(){
        Title = $(this).parent().parent().find(".Titolo").html();
        plID = $(this).attr("id");
        console.log(Title)
        console.log(plID)

        initLocalVideoPL(Title,plID,cookieID);
    });
    
    $('.mostra').click(function(){
        $("#dettaglioPlaylist").empty();
        if (videoPL.lenght != 0){
            CreateTableFromPlaylist();
            $('#dettaglioPlaylist').show();
        }
        else{
            alert("Non hai ancora recuperato i Dati riguardo questa playlist! Premi il bottone Ispeziona!")
        }
    });

    $("#dettaglioPlaylist").on('click', '.rimuoviVid', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        var id_playlistItem = $(this).attr("id");
        console.log(id_playlistItem);

        var vd_name = $(this).parent().parent().find(".Titolo").html();;
        console.log(vd_name);
        console.log(Title);
        
        /*
        $.ajax({           
            type: "DELETE",
            url: url_delVideo,
            data: { "id_playlistItem": id_playlistItem, "vd_name": vd_name, "pl_name": Title},
        }).done(function() {
            alert("Video Rimosso!")
        //da fare lato backend
        }).fail(function(){
            alert("Problema con la rimozione del video!")
        })
        */
    });

    $("#dettaglioPlaylist").on('click', '.rimPlaylist', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log($(this).html())

        /*
        $.ajax({           
            type: "DELETE",
            url: url_delPlaylist,
            data: { "title": Title, "pl_id": plID},
        }).done(function(data) {
            //dovrò rifare una get delle playlist ed inserirle nell'URL della pagina come redirect
            alert("Playlist Cancellata!")
        }).fail(function(){
            alert("Problema con la rimozione del video!")
        });
        */
    })
});
