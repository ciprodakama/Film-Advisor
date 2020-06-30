//evito di refreshare pagina on submit
var form = document.getElementById("cercaTrailer");

function handleForm(event) { 
    event.preventDefault(); 
}

form.addEventListener('submit', handleForm);


$(document).ready(function() {
    $('#findTrailer').click(function(){
        //invia ris server
        $('#risTrailer').show();
    });

    $('#nascondiRis').click(function(){
        $('#risTrailer').hide();
    });
});