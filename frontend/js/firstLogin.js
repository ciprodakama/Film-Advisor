const base_url = 'http://localhost:3001';

var url = base_url+'/categories';

var max_Cat = 5;
var count = 0;

var body = {
    "categories": []
};
//salveremo qui in un array gli id delle singole categorie da mandare poi al server

function findId(id){
    if(body.categories.includes(id)){
        return body.categories.indexOf(id);
    }
    else{
        return -1;
    }
}

$(document).ready(function(){
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
                }).done(function(){
                    window.location.href = "http://localhost:5500/frontend/main.html";
                }).fail(function(){
                    alert("Errore! Prova a rimandare le tue categorie!");
                })
        }
    });
});