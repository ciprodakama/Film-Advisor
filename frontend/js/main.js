const base_url = 'http://localhost:3001';

var url_video = base_url+'/getVideo?name=';
var url_playlist = base_url+"/getPlaylist";

//evito di refreshare pagina on submit
var form = document.getElementById("cercaTrailer");


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

    $('#addPlaylist').click(function(){
        $.get(url_playlist, function(data){
            console.log(data)
            var playlist = data;
            for (var i=0; i< playlist.lenght; i++){
                console.log(playlist[i]);
            }
        })
    });
});