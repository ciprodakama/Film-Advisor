API : interaction with youtube API

GET http://localhost:3001/getVideo?pamaters ---> search a youtube video
												parameter : name --> required

GET http://localhost:3001/getPlaylist ---> return all user youtube playlists, no parameters required

POST http://localhost:3001/createPlaylist ---> create a new youtube playlist
					       						body: 	titile --> required
						     							description --> optional

POST http://localhost:3001/playlist/insertVideo ---> insert a video in a client's playlist
														body : 	name --> required (name of the playlist where the client wants to add a video)
																video1 --> video1 id
																video2 --> video2 id
																video3 --> video3 id
																video4 --> video4 id
																video5 --> video5 id

PUT http://localhost:3001/playlist/update ---> update the name of an enxisting youtube playlist
												body : 	vecchio_nome --> required
														nuovo_nome --> required

DELETE http://localhost:3001/playlist/delete ---> delete an existing playlist on youtube
												body : name ---> required