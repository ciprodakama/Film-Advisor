//qui andrà messo il codice per gestire l'auth con google

const base_url = 'http://localhost:3001';

var url = base_url+'/login?mail=';

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

$(document).ready(function() {
    $("#login").click(function(){
        var mail = $("#inputEmail4").val();
        if(!$("#inputEmail4").val()){
            alert("Per poter procedere devi inserire la tua mail!");
        }
        else{
            $.get(url+mail, function(data) {
                console.log(data.url)
                console.log(data.id)
                //document.cookie = "id="+data.id+"; path=/";
                console.log(getCookie("id"))
                if (getCookie("id") != data.id){
                    document.cookie = "id="+data.id+"; path=/";
                    window.location.href = data.url;
                }
                else{
                    window.location.href = data.url;
                }
            }).fail(function(){
                alert("Errore! Non è stato possibile autentificarsi con Google.");
            });
        }
    });
});
