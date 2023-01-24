const best = 'api/v1/titles/?sort_by=-imdb_score'
const path = 'http://127.0.0.1:8000/'

// Récupération de la liste des films depuis le fichier JSON
const reponse = await fetch(path + best);
const films = await reponse.json();
 
// Transformation des films en JSON
const list_films = JSON.stringify(films);
console.log(list_films[0])


 
// Stockage des informations dans le localStorage
// window.localStorage.setItem("best_films", valeurPieces);