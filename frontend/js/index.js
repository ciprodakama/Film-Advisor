//qui andrà messo il codice per gestire l'auth con google

const base_url = 'http://localhost:3001';

var url = base_url+'/login';

console.log(url);

$(document).ready(function() {
    $("#login").click(function(){
        $.get(url, function(data) {
            window.location.href = data;
        }).fail(function(){
            alert("Errore! Non è stato possibile autentificarsi con Google.");
        });
    });
});
