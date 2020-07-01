const base_url = 'http://localhost:3001';

var url_video = base_url+'/getVideo?name=';
var url_suggestions = base_url+'/trailers';

//evito di refreshare pagina on submit
var form = document.getElementById("cercaTrailer");

function handleForm(event) { 
    event.preventDefault(); 
}

form.addEventListener('submit', handleForm);


$(document).ready(function() {
    $('#mostraSuggeriti').click(function(){
        $.get(url_suggestions, function(data) {
            console.log(data);
            var count_video = 0;
            var count_embed = 0;
            $(".box").children(".video").each(function(){
                $(this).attr("src",data.trailers.embedLink[count_video]);
                count_video++;    
            });
            $(".box").children(".link").each(function(){
                $(this).attr("href",data.trailers.videoLink[count_embed]);
                count_embed++;
            })
        }).fail(function(){
            alert("Errore! Non è stato possibile caricare Trailer.");
        })
        $(".titolo").show;
        $('.contSuggeriti').css("display","flex");
    });

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

    $('#aggiungiRis').click(function(){
        //gestione chimate a DB + YT
    });

});