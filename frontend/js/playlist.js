const base_url = 'http://localhost:3001';

var url_getVideoPL = base_url+"/user/playlist/";
var url_playlist = base_url+"/user/playlist/";

var url_delPlaylist = base_url+"/playlist/delete"
var url_delVideo = base_url+"/playlist/video"

var title_query = "?title="
var plID_query = "pl_id="

var test = {
    "_id": "5f046133ed856b1ad88dd9da",
    "mail": "reti@gmail.com",
    "playlist": [{
        "numero_elementi": 3,
        "elements": [{
            "nome": "Eternal Eclipse - Dawn of Faith (The OA Part II Trailer Music)",
            "id_elem": "UExwcXZHdThwbGhnWE1wYlVWQ2VNeDYwNVlfNm5OMmxxcy41NkI0NEY2RDEwNTU3Q0M2",
            "url_film": "https://www.youtube.com/watch?v=6FTr73B4Wz0"
        }, {
            "nome": "Journey 2: The Mysterious Island Official Trailer #1 - Dwayne Johnson, Vanessa Hudgens (2012) HD",
            "id_elem": "UExwcXZHdThwbGhnWE1wYlVWQ2VNeDYwNVlfNm5OMmxxcy4yODlGNEE0NkRGMEEzMEQy",
            "url_film": "https://www.youtube.com/watch?v=qdFCjwcK8IE"
        }, {
            "nome": "ZOO Official Trailer (2019) NEW Apocalypse Movie Trailers HD",
            "id_elem": "UExwcXZHdThwbGhnWE1wYlVWQ2VNeDYwNVlfNm5OMmxxcy4wMTcyMDhGQUE4NTIzM0Y5",
            "url_film": "https://www.youtube.com/watch?v=7VWcfaoGBGo"
        }],
        "_id": "5f046ea2753adc0aa8200770",
        "nome": "ToBeDeleted",
        "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgXMpbUVCeMx605Y_6nN2lqs",
        "url_id": "PLpqvGu8plhgXMpbUVCeMx605Y_6nN2lqs"
    }, {
        "numero_elementi": 0,
        "elements": [],
        "_id": "5f046ea2753adc0aa8200771",
        "nome": "Comedy",
        "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgVFn42stYS5Q1Teb-OFOTBO",
        "url_id": "PLpqvGu8plhgVFn42stYS5Q1Teb-OFOTBO"
    }, {
        "numero_elementi": 2,
        "elements": [{
            "nome": "Suspiria - Official Trailer | Amazon Studios",
            "id_elem": "UExwcXZHdThwbGhnV3I5TFdJM1hhbG9tWV9rYUloZWg1Ry4yODlGNEE0NkRGMEEzMEQy",
            "url_film": "https://www.youtube.com/watch?v=BY6QKRl56Ok"
        }, {
            "nome": "Sonic The Hedgehog (2020) - New Official Trailer - Paramount Pictures",
            "id_elem": "UExwcXZHdThwbGhnV3I5TFdJM1hhbG9tWV9rYUloZWg1Ry4wMTcyMDhGQUE4NTIzM0Y5",
            "url_film": "https://www.youtube.com/watch?v=szby7ZHLnkA"
        }],
        "_id": "5f046ea2753adc0aa8200772",
        "nome": "Horror",
        "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgWr9LWI3XalomY_kaIheh5G",
        "url_id": "PLpqvGu8plhgWr9LWI3XalomY_kaIheh5G"
    }, {
        "numero_elementi": 1,
        "elements": [{
            "nome": "The foxes that go HEHEHE",
            "id_elem": "UExwcXZHdThwbGhnV21IUVVCbk52cDJ3clZMdkxfVU1xei41NkI0NEY2RDEwNTU3Q0M2",
            "url_film": "https://www.youtube.com/watch?v=fQVhppRP4Wo"
        }],
        "_id": "5f046ea2753adc0aa8200773",
        "nome": "Action",
        "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgWmHQUBnNvp2wrVLvL_UMqz",
        "url_id": "PLpqvGu8plhgWmHQUBnNvp2wrVLvL_UMqz"
    }, {
        "numero_elementi": 2,
        "elements": [{
            "nome": "The Dark Knight (2008) Official Trailer #1 - Christopher Nolan Movie HD",
            "id_elem": "UExwcXZHdThwbGhnVzNDbDByS3dlYUVRSnFiZ3ZMRkJxSS41NkI0NEY2RDEwNTU3Q0M2",
            "url_film": "https://www.youtube.com/watch?v=EXeTwQWrcwY"
        }, {
            "nome": "Journey 2: The Mysterious Island Official Trailer #1 - Dwayne Johnson, Vanessa Hudgens (2012) HD",
            "id_elem": "UExwcXZHdThwbGhnVzNDbDByS3dlYUVRSnFiZ3ZMRkJxSS4yODlGNEE0NkRGMEEzMEQy",
            "url_film": "https://www.youtube.com/watch?v=qdFCjwcK8IE"
        }],
        "_id": "5f046ea2753adc0aa820076f",
        "nome": "Test2",
        "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgW3Cl0rKweaEQJqbgvLFBqI",
        "url_id": "PLpqvGu8plhgW3Cl0rKweaEQJqbgvLFBqI"
    }]
}



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
        CreateTableFromPlaylist();
         $('#dettaglioPlaylist').show();

        /*
        if (videoPL.lenght != 0){
            CreateTableFromPlaylist();
            $('#dettaglioPlaylist').show();
        }
        else{
            alert("Non hai ancora recuperato i Dati riguardo questa playlist! Premi il bottone Ispeziona!")
        }
        */
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
    });

    //TROVARE UN MODO PER REFRESHARE PAGINA QUANDO VA A BUON FINE
    $("#dettaglioPlaylist").on('click', '.rimPlaylist', function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log($(this).html())

        $.ajax({           
            type: "DELETE",
            url: url_delPlaylist,
            data: { "title": Title, "pl_id": plID},
        }).done(function(data) {
            //dovrò rifare una get delle playlist ed inserirle nell'URL della pagina come redirect
            alert("Playlist Cancellata!")
        }).fail(function(){
            alert("Problema con la rimozione della Playlist!")
        });
    })
});
