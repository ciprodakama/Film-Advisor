const base_url = 'http://localhost:3001';

var url = base_url+'/categories';

var max_Cat = 5;
var count = 0;

var body = {
    "categories": [],
    "id_us": ""
};

var trailers = [];

function findId(id){
    if(body.categories.includes(id)){
        return body.categories.indexOf(id);
    }
    else{
        return -1;
    }
}

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

$(document).ready(function(){
    //al caricamento della pagina salvo cookie user_id
    var cookieID = getCookie("id");
    console.log(cookieID);
    body.id_us = cookieID;
    //confronto se ho salvato correttamente var locale
    console.log(body.id_us)

    //FUNZ POPOLA DB DATI YOUTUBE
    $.get(base_url+"/initDB?id_us="+cookieID, function(data) {
        console.log(data);
    }).fail(function(){
        console.log("Errore nella popolazione del DB!");
    });
    //done

    //aggiunta categorie var locale
    $(".list-group-item").click(function(){
        console.log(body.categories);
        console.log(count);
        var id = $(this).attr('id');
        if(count < max_Cat){
            if(($(this).hasClass("active"))){
                $(this).removeClass("active");
                count--;
                body.categories.splice(findId(id),1);
            }
            else{
                $(this).addClass("active");
                count++;
                body.categories.push(id);
            }
        }
        else{
            if(($(this).hasClass("active"))){
                $(this).removeClass("active");
                count--;
                body.categories.splice(findId(id),1);
            }
            else{
                alert("Hai già selezionato 5 categorie!");
            }

        }
    });
    //done

    //invio categorie DB + reindirizzamento main.html in base al risultato della POST
    $("#conferma").click(function(){
        if(count < 1){
            alert("Seleziona almeno 1 categoria per poter proseguire!");
            return false;
        }
        else{
            $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(body),
                }).done(function(body){
                    console.log(JSON.stringify(body));
                    trailers = JSON.stringify(body);
                    window.location.href = "http://localhost:5500/frontend/main.html?trailers="+trailers;
                }).fail(function(){
                    alert("Errore! Prova a rimandare le tue categorie!");
                })
        }
    });
    //done
});
