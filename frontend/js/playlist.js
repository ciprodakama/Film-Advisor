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

/*
var urlValues = getUrlVars(window.location.href);
console.log(urlValues)
var data_url = JSON.parse(decodeURIComponent(urlValues.playlist));
console.log(data_url)
*/

var data = {
    name: [],
    id: []
}

var videoPL = [];
var nVideo;
var Title;
var plID;

function CreateTableFromDB() {
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

function GetInfoPlaylist(cookieID) {
    console.log("Retrieving Data from DB")

    $.ajax({
        url: url_playlist+cookieID,
        type: 'GET',
        }).then(function(res){
            console.log(res);
            console.log(res.playlist.length);

            for (var j= 0; j<res.playlist.length; j++){
                //console.log(data[j].url_id)
                //console.log(data[j].nome)
                data.name.push(res.playlist[j].nome)
                data.id.push(res.playlist[j].url_id)
            }
            //console.log(play);
            //console.log(JSON.stringify(play));
            console.log(data);
            alert("Dati recuperati con successo!")
        }).then(function(){
            console.log(data.id.length)
            if(data.name.length == 0){
                var r = confirm("Ci risulta che non possiedi nessuna Playlist! Torna alla pagina precedente e creane una!")
                if (r == true){
                    location.reload(true);
                }
            }
            else{
                CreateTableFromDB();
            }
        }).done(function(){
            //alert("Tabella Pronta!");
            $("#showPlaylist").hide();
        }).fail(function(data){
            alert("Errore tabella PL!")
    })
}

function CreateTableFromPlaylist(){
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

    var col = ["nome","url_film","id_elem"];

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < videoPL.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            if(col[j]=="url_film"){
                var tabCell = tr.insertCell(-1);
                console.log("Sono in url_film "+videoPL[i][col[j]])
                var link = "<a target='_blank' href="+videoPL[i][col[j]]+">"+"Link al Video</a>"
                tabCell.innerHTML = link;
            }
            else if (col[j]=="nome"){
                var tabCell = tr.insertCell(-1);
                tabCell.className = "Titolo";
                console.log("Sono in nome "+videoPL[i][col[j]])
                tabCell.innerHTML = videoPL[i][col[j]];
            }
            else{
                var tabCell = tr.insertCell(-1);
                console.log("Sono in butt "+videoPL[i][col[j]])
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
                console.log(nVideo)
                for (var z=0; z<nVideo; z++){
                    videoPL.push(data.playlist[playIndex].elements[z])
                    delete videoPL[z].url_id;
                    console.log(data.playlist[playIndex].elements[z].id_elem);
                    videoPL[z]["id_elem"] = '<button class="btn btn-danger rimuoviVid" style="background-color: red;" id='+data.playlist[playIndex].elements[z].id_elem+'>-</button>';  
                } 
            }
        }
    
        console.log(nVideo);
        console.log("This is localVariable from getVideoPL")
        console.log(videoPL);

        alert("Dati recuperati con successo!")  
    });
    
}

$(document).ready(function() {
    var cookieID = getCookie("id");
    console.log(cookieID);
    
    $('#showPlaylist').click(function(){
        GetInfoPlaylist(cookieID);
        $('#playlistUtente').show();
    });

    $("#playlistUtente").on('click', '.ispeziona', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        curTitle = $(this).parent().parent().find(".Titolo").html();
        curplID = $(this).attr("id");
        console.log(curTitle)
        console.log(curplID)

        if(curTitle == Title && curplID == plID){
            console.log("Dati già presenti")
            alert("Dati recuperati con successo!")
        }
        else{
            Title = curTitle;
            plID = curplID;
            initLocalVideoPL(Title,plID,cookieID);
        }
    });

    $("#playlistUtente").on('click', '.mostra', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        curTitle = $(this).parent().parent().find(".Titolo").html();
        curplID = $(this).attr("id");
        console.log(curTitle)
        console.log(curplID)
        console.log(Title)
        console.log(plID)

        if(((typeof Title == 'undefined')&&(typeof plID == 'undefined')) || (curTitle != Title && curplID != plID)){
            alert("Non hai ancora recuperato i Dati di questa Playlist!\nPremi 'Recupera Dati'!")
        }
        else{
            $("#dettaglioPlaylist").empty();
            CreateTableFromPlaylist();
            $('#dettaglioPlaylist').show();
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
        $(this).prop('disabled', true);
    });

    $("#dettaglioPlaylist").on('click', '.rimPlaylist', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log($(this).html())

        $.ajax({           
            type: "DELETE",
            url: url_delPlaylist,
            data: { "title": Title, "pl_id": plID},
        }).done(function(data) {
            var r = confirm("Playlist Cancellata con Successo! Premendo OK la pagina verrà ricaricata!")
                if (r == true){
                    location.reload(true);
                }
        }).fail(function(){
            alert("Problema con la rimozione della Playlist!")
        });
    })
});
