const base_url = 'http://localhost:3001';

var url_video = base_url+'/getVideo?name=';
var url_playlist = base_url+"/getPlaylist";

//evito di refreshare pagina on submit
var form = document.getElementById("cercaTrailer");

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

function handleForm(event) { 
    event.preventDefault(); 
}

form.addEventListener('submit', handleForm);


$(document).ready(function() {
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

    $(".addPlaylist").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log(resp);
        console.log(resp.length);
        for (var j= 0; j<resp.length; j++){
            console.log(resp[j].url_id)
            console.log(resp[j].nome)
            play.name.push(resp[j].nome)
            play.id.push(resp[j].url_id)
        }
        console.log(play)

        //populatePlaylist(resp);

        //console.log(resp[0].nome);

        /*
        $.get(url_playlist, function(data){
            console.log(data);
        })
        */
    });
    /*
    $('#addPlaylist').click(function(){
        var temp = $(this).html();
        console.log(temp);
        /*
        $.get(url_playlist, function(data){
            console.log(data)
            var playlist = data;
            for (var i=0; i< playlist.lenght; i++){
                console.log(playlist[i]);
            }
        })
        
    });
    */
});