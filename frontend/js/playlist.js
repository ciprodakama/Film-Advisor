const base_url = 'http://localhost:3001';

var url_getVideoPL = "/playlist/videos"
var title_query = "?title="
var plID_query = "pl_id="

var url_delPlaylist = "/playlist/delete"

function getUrlVars (url) {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value; });
    return vars;
}

var urlValues = getUrlVars(window.location.href);
console.log(urlValues)
var data = JSON.parse(decodeURIComponent(urlValues.playlist));
console.log(data)

data['Ispeziona'] = '<button type ="button" class ="btn btn-default btn-sm ispeziona">Recupera Dati</button>';
data['Mostra'] = '<button type ="button" class ="btn btn-default btn-sm mostra">Mostra Lista</button>';

var videoPL = [];
var nVideo;
var Title;
var plID;

var BackvideoPL= [
    {
        'video_name':'La mappa dei nuovi focolai di Coronavirus in Italia: “Attenzione ai casi dall’estero”',
        "video_url": "G3Sit1ub3cw"
    },
    {
        'video_name':"Ingressi limitati in Italia, il confronto tra Matteo Bassetti e Andrea Crisanti: La misura è ...",
        'video_url': "0FoGQZPftz8"
        
    },
    {
        'video_name': "Trova foto della moglie defunta sul pacchetto di sigarette: chiede 100 milioni di risarcimento",
        'video_url':"hnLa8IfowvE"
        
    }
]

function CreateTableFromURI() {
    var col = ["Titolo Playlist", "Link Youtube", "Ispeziona", "Mostra"];

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

function initLocalVideoPL(Title, plID){
    var url = base_url+url_getVideoPL+title_query+Title+"&"+plID_query+plID;

    videoPL = [];

    $.ajax(url).done(function(data) {
        console.log(data);
        nVideo = data.slice(-1)[0];
        console.log(nVideo);

        for (var j=0; j<nVideo; j++){
            videoPL.push(data[j])
            //console.log(videoPL); 
            videoPL[j]["button"] = '<button class="btn btn-danger rimuoviVid" style="background-color: red;">-</button>'
        }
        console.log("This is localVariable from getVideoPL")
        console.log(videoPL);
        alert("Dati recuperati con successo!")  
    });
}

$(document).ready(function() {
    CreateTableFromURI();

    $('.ispeziona').click(function(){
        Title = $(this).parent().parent().find(".Titolo").html();
        plID = $(this).attr("id");
        console.log(Title)
        console.log(plID)

        initLocalVideoPL(Title,plID);
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

    $('.rimuoviVid').click(function(){
        //da fare lato backend
    });

    $('.rimuoviPlaylist').click(function(){
        var url = base_url+url_delPlaylist+title_query+Title+"&"+plID_query+plID;
        $.ajax({           
            type: "DELETE",
            url: url
        }).done(function(data) {
            //dovrò rifare una get delle playlist ed inserirle nell'URL della pagina come redirect
            alert("Playlist Cancellata!")
        });
    });
});
