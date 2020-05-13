var max_Cat = 5;
var count = 0;

//salveremo qui in un array gli id delle singole categorie da mandare poi al server

$(document).ready(function(){
    $(".list-group-item").click(function(){
        if(count < max_Cat){
            if(($(this).hasClass("active"))){
                $(this).removeClass("active");
                count--;
            }
            else{
                $(this).addClass("active");
                count++;
            }
        }
        else{
            if(($(this).hasClass("active"))){
                $(this).removeClass("active");
                count--;
            }
            else{
                alert("Hai già selezionato 5 categorie!");
            }

        }
    });

    $("#conferma").click(function(){
        if(count < 1){
            alert("Seleziona almeno 1 categoria per poter proseguire!");
            return false;
        }
    });
});
