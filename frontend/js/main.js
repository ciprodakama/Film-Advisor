const base_url = 'http://localhost:3001';

var url_video = base_url+'/getVideo?name=';
var url_playlist = base_url+"/getPlaylist";
var url_createPlaylist = base_url+"/createPlaylist";

//evito di refreshare pagina on submit
var form = document.getElementById("cercaTrailer");

function handleForm(event) { 
    event.preventDefault(); 
}

form.addEventListener('submit', handleForm);

var play = {
    name: [],
    id: []
}

var resp = [{
    "nome": "Horror",
    "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgWr9LWI3XalomY_kaIheh5G",
    "url_id": "PLpqvGu8plhgWr9LWI3XalomY_kaIheh5G"
}, {
    "nome": "Comedy",
    "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgXNkYhImNpiooVveA3uFJSK",
    "url_id": "PLpqvGu8plhgXNkYhImNpiooVveA3uFJSK"
}, {
    "nome": "Action",
    "url": "https://www.youtube.com/playlist?list=PLpqvGu8plhgWmHQUBnNvp2wrVLvL_UMqz",
    "url_id": "PLpqvGu8plhgWmHQUBnNvp2wrVLvL_UMqz"
}]


function getUrlVars (url) {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value; });
    return vars;
}

var urlValues = getUrlVars(window.location.href);
//console.log(urlValues)
var data = JSON.parse(decodeURIComponent(urlValues.trailers));
//console.log(data)


$(document).ready(function() {
    //retrieve playlist list and populate selector
    $.get(url_playlist, function(data) {
        //salvo playlist da mostrare
        console.log(data);
        console.log(data.length);
        for (var j= 0; j<data.length; j++){
            //console.log(data[j].url_id)
            //console.log(data[j].nome)
            play.name.push(data[j].nome)
            play.id.push(data[j].url_id)
        }
        //console.log(play);
        //console.log(JSON.stringify(play));
        console.log(play);
        
        console.log("nomi disp "+play.name);
        console.log("Numero di nomi "+play.name.length);
        for(var z=0; z<play.name.length; z++){
            console.log(play.name[z]);
            $("#list1").append($("<option></option>").text(play.name[z]));
            $("#list2").append($("<option></option>").text(play.name[z]));
            $("#list3").append($("<option></option>").text(play.name[z]));
            $("#list4").append($("<option></option>").text(play.name[z]));
        }
        }).fail(function(){
            alert("Errore! Non è stato possibile recuperare Playlist.");
    });
    //done

    //faccio embed di video date categorie
    console.log(data);
    var count_video = 0;
    var count_embed = 0;
    $(".box").children(".video").each(function(){
        $(this).attr("src",data.embedLink[count_video]);
        count_video++;    
    });
    $(".box").children(".link").each(function(){
        $(this).attr("href",data.videoLink[count_embed]);
        count_embed++;
    })
    $(".titolo").show;
    $('.contSuggeriti').css("display","flex");
    //done

    //crea Playlist Input Utente
    $('#creaPlaylist').click(function(){
        var title = $('#titPlaylist').val();
        var description = $('#descPlaylist').val();
        console.log(title);
        console.log(description);

        $.ajax({
            url: url_createPlaylist,
            type: 'POST',
            data: { "title": title, "description": description},
            }).done(function(body){
                console.log(JSON.stringify(body));
                //trailers = JSON.stringify(body);
                //window.location.href = "http://localhost:5500/frontend/main.html?trailers="+trailers;
            }).fail(function(){
                alert("Errore! Non è stato possibile creare la Playlist!");
            })
        //location.reload(true);
    });
    //done

    //cerca trailer input utente
    $('#findTrailer').click(function(){
        var q = $('#Ins_Title').val();
        console.log(q);
        $.get(url_video+q, function(data) {
            //salvo trailer da embeddare
            var trailer = data.embedLink;
            $("#risTrailer").attr("src",trailer);
            }).fail(function(){
                alert("Errore! Non è stato possibile caricare Trailer.");
         });
         $('#contTrailer').show();
    });
    //done

    $(".addPlaylist").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        
        //window.location.href = "http://localhost:5500/frontend/playlist.html?playlist="+playlist;
    });
});