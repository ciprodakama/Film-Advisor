const base_url = 'http://localhost:3001';


function getUrlVars (url) {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value; });
    return vars;
}

//var urlValues = getUrlVars(window.location.href);
//console.log(urlValues)
//var data = JSON.parse(decodeURIComponent(urlValues.playlist));
//console.log(data)


$(document).ready(function() {
    $('.ispeziona').click(function(){
        //invia ris server
        $('#dettaglioPlaylist').show();
    });

    $('.nascondi').click(function(){
        $('#dettaglioPlaylist').hide();
    });
});