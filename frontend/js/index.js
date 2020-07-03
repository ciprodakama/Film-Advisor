//qui andrà messo il codice per gestire l'auth con google

const base_url = 'http://localhost:3001';

var url = base_url+'/login?mail=';

$(document).ready(function() {
    $("#login").click(function(){
        var mail = $("#inputEmail4").val();
        if(!$("#inputEmail4").val()){
            alert("Per poter procedere devi inserire la tua mail!");
        }
        else{
            $.get(url+mail, function(data) {
                console.log(data)
                window.location.href = data;
            }).fail(function(){
                alert("Errore! Non è stato possibile autentificarsi con Google.");
            });
        }
    });
});
