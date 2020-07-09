# FilmAdvisor
FilmAdvisor è un progetto full-stack sviluppato per l'esame di Reti di Calcolatori da parte di 3 studenti della facoltà di Ing. Informatica della Sapienza, in particolare George Ciprian Telinoiu, Lorenzo Govoni ed Francesco D'Orazio.

FilmAdvisor è una web app interattiva che permette ai suoi utenti, una volta fatto il login ai servizi Google, di gestire in totale autonomia le proprie Playlist Youtube, nonchè cercare nuovi Trailer e ricevere ogni giorno nuovi suggerimenti sulla base delle categorie che più li appasiona.

### Tecnologie Utilizzate
FilmAdvisor si basa sulle seguenti tecnologie per funzionare:

* [NodeJS] - Gestione del Back End (Server & DB)
* [GoogleOauth2] - Login Account Google
* [YouTubeDatav3] - API Youtube
* [TheMovieDatabase(TMDb)] - API suggerimento Film
* [MongoDB] - Database
* [Jquery] - Dinamicità Front End
* [HTML/CSS] - Per modularizzare al meglio il Front End
* [AJAX] - Gestione chiamate al Back End
* [Swagger] -Documentazione delle nostre API

## Installazione
Qui di seguito gli step da seguire per installare le dipendenze necessarie:
```sh
$ git clone https://gitlab.com/ciprodakama/reti_2020.git
$ cd .\backend\
$ npm install
```
(Ignorare warning sulle vulnerabilità dei package)

## Setup
Per eseguire la nostra applicazione (easy way):
```sh
$ Aprire la cartella tramite VsCode (installare se necessario)
$ Installare il plugin LiveServer (porta 5500)
$ Avviare Index.html con LiveServer (si consiglia Chrome)
$ Dal terminale di VsCode assicurarsi di essere nella cartella backend 
$ npm start
```

Una volta finito il setup, questa sarà la situazione:
```sh
$ Front-End --> localhost:5500/frontend/index.html

$ Back-End --> localhost:3001
```
Per supervisionare il tutto, utilizzare il terminale del Back-End (VsCode) & la console di Chrome

## Test
Come già accennato all'inizio del ReadMe, la nostra applicazione è stata realizzata per essere a prova di Utente,
Di conseguenza è possibile testare tutte le funzionalità interagendo con il Front-End.

Il Front-End è robusto nella gestione degli errori o di eventuali arresti del main Server.

Qui una lista delle tante funzionalità offerte:

- Login con Google Oauth2; (assicurarsi di aver attivato il canale YouTube per il profilo selezionato)
- Suggeritore Trailer personalizzato in base alle categorie scelte; (main.html)
- Aggiunta dei video alla playlist desiderata; (main.html)
- Creazione di una Playlist, indicando Titolo, Status e Descrizione (main.html)
- Ricerca Trailer YouTube integrata (main.html)
- Visuallizzazione di tutte le proprie Playlist (playlist.html)
- Gestione modulare dei contenuti di ogni singola Playlist (playlist.html)
- Rimozione Playlist (playlist.html)
- etc.


## API REST
Per una documentazione completa visitare <<Insert Here>>

[//]: # (Abbreviazioni per i link utilizzati nella descrizione del progetto)
[NodeJS]:                   <https://nodejs.org/it/about/>
[GoogleOauth2]:             <https://developers.google.com/identity/protocols/oauth2>
[YouTubeDatav3]:            <https://developers.google.com/youtube/v3>
[TheMovieDatabase(TMDb)]:   <https://developers.themoviedb.org/3/getting-started/introduction>
[MongoDB]:                  <https://docs.mongodb.com/manual/>
[Jquery]:                   <https://api.jquery.com/>
[HTML/CSS]:                 <>
[AJAX]:                     <https://api.jquery.com/jquery.ajax/#jQuery-ajax-url-settings>
[Swagger]:                  <https://swagger.io/> 