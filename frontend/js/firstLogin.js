const base_url = 'http://localhost:3001';

var url = base_url+'/categories';

var max_Cat = 5;
var count = 0;

//salveremo qui in un array gli id delle singole categorie da mandare poi al server
var categories = [];

function findId(id){
    if(categories.includes(id)){
        return categories.indexOf(id);
    }
    else{
        return -1;
    }
}

$(document).ready(function(){
    $(".list-group-item").click(function(){
        console.log(categories);
        console.log(count);
        var video_id = $(this).attr('id');
        if(count < max_Cat){
            if(($(this).hasClass("active"))){
                $(this).removeClass("active");
                count--;
                categories.splice(findId(video_id),1);
            }
            else{
                $(this).addClass("active");
                count++;
                categories.push(video_id);
            }
        }
        else{
            if(($(this).hasClass("active"))){
                $(this).removeClass("active");
                count--;
                categories.splice(findId(video_id),1);
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
            for(var i=0; i<max_Cat - categories.length(); i++){
                categories.push("-1");
            }
            console.log("the dimension of the cat array is: "+categories.length());
            $.ajax({
                url: url,
                type: 'POST',
                data: {categories: categories},
                }).done(function(){
                    window.location.href = "http://localhost:5500/frontend/main.html";
                }).fail(function(){
                    alert("Errore! Prova a rimandare le tue categorie!");
                })
        }
    });
});