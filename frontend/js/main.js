const base_url = 'http://localhost:3001';

var url_video = base_url+'/getVideo?name=';
var url_playlist = base_url+"/user/playlist/";
var url_createPlaylist = base_url+"/createPlaylist";
var url_addvideo = base_url+"/playlist/insertVideo"

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

function sleep(ms) {
    return new Promise((resolve) => {
    setTimeout(resolve, ms);
    });
} 

//evito di refreshare pagina on submit
var formTrailer = document.getElementById("cercaTrailer");
var formPlaylist = document.getElementById("creaPlaylist");

function handleForm(event) { 
    event.preventDefault(); 
}

formTrailer.addEventListener('submit', handleForm);
formPlaylist.addEventListener('submit', handleForm);

var play = {
    name: [],
    id: []
}

function getUrlVars (url) {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value; });
    return vars;
}

var urlValues = getUrlVars(window.location.href);
//console.log(urlValues)
var data = JSON.parse(decodeURIComponent(urlValues.trailers));
//console.log(data)

function getPlaylistDB(cookieID, active){
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
        //console.log(JSON.stringify(play));
        console.log("Successo nella GET /user/playlist/ al DB")
        console.log(play);
        }).done(function(){
            active.hide();
            active.siblings(".show").show();
        }).fail(function(){
            console.log("Errore nella GET /user/playlist/ al DB")
            alert("Errore durante il recupero delle tue Playlist da DB! Riprova!\nSe il problema si ripropone, prova a rientrare dalla pagina di Login!")
    });
}

$(document).ready(function() {
    //al caricamento della pagina salvo cookie user_id
    var cookieID = getCookie("id");
    console.log(cookieID);

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
    //done

    //retrieve playlist list and populate local var
    $(".getPlaylist").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        var active = $(this);
        //console.log(active);

        if(play.name.length != 0){
            console.log("play già popolata")
            $(this).hide();
            $(this).siblings(".show").show();
        }
        else{
            console.log("play va inizializzata")
            getPlaylistDB(cookieID, active)
        }      
    })
    //done

    //populate list with value from local var
    $(".showPlaylist").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log("nomi disp "+play.name);
        console.log("Numero di nomi "+play.name.length);

        if(play.name.length == 0){
            alert("Ci risulta che non hai nessuna Playlist disponibile, prima di procedere, creane una sul nostro Sito!")
        }
        else{
            for(var z=0; z<play.name.length; z++){
                console.log(play.name[z]);
                var option = '<option id='+play.id[z]+'>'+play.name[z]+'</option>'
                $(this).parent().siblings('.list').find(".form-control").append(option);
            }
            $(this).hide();
            $(this).parent().siblings('.list').show();
            $(this).parent().siblings('.confirm').show();
        }
    })
    //done

    //confirm choice and contact backend
    $(".addPlaylist").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        var id_selected = $(this).parent().siblings(".list").find(":selected").attr("id");
        console.log(id_selected);
        
        var link = $(this).closest(".box_playlist").siblings(".link").attr("href");
        var start = link.indexOf("=")
        var id_video = link.substring(start+1)
        console.log(id_video);

        var pl_name = $(this).parent().siblings(".list").find(":selected").html();
        console.log(pl_name);

        
        $.ajax({
            url: url_addvideo,
            type: 'POST',
            data: { "pl_id": id_selected, "videoId": id_video, "pl_name": pl_name, "id_us": cookieID},
            }).done(function(body){
                console.log(JSON.stringify(body));
                alert("Video Aggiunto con Successo!")
            }).fail(function(){
                alert("Errore nell'aggiunta Video! Riprova!\nSe il problema si ripropone, prova a rientrare dalla pagina di Login!")
            })
    });


    //crea Playlist Input Utente
    $('#creaPlaylist').click(function(){
        var title = $('#titPlaylist').val();
        var status = $("#tipoPlaylist").find(":selected").attr("id");
        var description = $('#descPlaylist').val();

        console.log(title);
        console.log(status);
        console.log(description);

        if(!title){
            alert("Inserire un titolo!")
            return;
            if(!status){
                alert("Scegliere uno Status!")
                return; 
            }
        }
        
        $.ajax({
            url: url_createPlaylist,
            type: 'POST',
            data: {"title": title, "description": description, "status": status, "id_us": cookieID},
            }).done(function(body){
                console.log(JSON.stringify(body));
                var r = confirm("Playlist Creata con Successo! Premendo OK la pagina verrà ricaricata!")
                if (r == true){
                    location.reload(true);
                }
            }).fail(function(){
                alert("Errore durante la creazione della Playlist! Riprova!\nSe il problema si ripropone, prova a rientrare dalla pagina di Login!")
            })
    });
    //done

    //cerca trailer input utente
    $('#findTrailer').click(function(){
        var q = $('#Ins_Title').val();
        if (q == ""){
            alert("Per procedere devi inserire un titolo!")
            return;
        }
        console.log(q);
        $.get(url_video+q, function(data) {
            //salvo trailer da embeddare
            var trailer = data.embedLink;
            $("#risTrailer").attr("src",trailer);
            $('#contTrailer').css("display","flex");
            }).fail(function(){
                alert("Errore nella ricerca Trailer! Riprova!\nSe il problema si ripropone, prova a rientrare dalla pagina di Login!");
         });
    });
    //done

    //confirm choice and contact backend
    $(".addTrailer").click(function(){
        var id_selected = $(this).parent().siblings(".list").find(":selected").attr("id");
        console.log(id_selected);

        var link = $(this).closest(".box_risTrailer").siblings("#risTrailer").attr("src");
        var start = link.lastIndexOf("/")
        var id_video = link.substring(start+1)
        console.log(id_video);

        var pl_name = $(this).parent().siblings(".list").find(":selected").html();
        console.log(pl_name);

        $.ajax({
            url: url_addvideo,
            type: 'POST',
            data: { "pl_id": id_selected, "videoId": id_video, "pl_name": pl_name, "id_us": cookieID},
            }).done(function(body){
                console.log(JSON.stringify(body));
                alert("Video Aggiunto con Successo!")
            }).fail(function(data){
                alert("Errore nell'aggiunta Video! Riprova!\nSe il problema si ripropone, prova a rientrare dalla pagina di Login!");
            })
    });

    $("a[href='#top']").click(function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
});
