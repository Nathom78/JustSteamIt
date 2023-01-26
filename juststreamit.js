const best = "titles/?sort_by=-imdb_score";
const path = "http://localhost:8000/api/v1/";

// Meilleur film dans le local storage
let best_films = window.localStorage.getItem("best_films");
if (best_films === null){
	// Récupération de la liste des films depuis le fichier JSON
	const reponse = await fetch(path + best, {Cross-Origin-Resource-Policy : "strict-origin-when-cross-origin"});
	if (reponse.ok){
		const films = await reponse.json();
		// Transformation des films en JSON
		const list_films = JSON.stringify(films);		

		// Stockage des informations dans le localStorage
		window.localStorage.setItem("best_films", list_films);
	}	
}

// Lorsqu’on clique sur le bouton du film en vedette ou sur l’image d’un des films une fenêtre modale s’ouvre. Dans cette fenêtre les informations suivantes doivent être présente :

// L’image de la pochette du film
// Le Titre du film
// Le genre complet du film
// Sa date de sortie
// Son Rated
// Son score Imdb
// Son réalisateur
// La liste des acteurs
// Sa durée
// Le pays d’origine
// Le résultat au Box Office
// Le résumé du film

// Création de la premiére section meilleur film
console.log(best_films.best_films[0]);
const bestFilm = best_films.best_films[0];
// Récupération de l'élément du DOM qui accueillera les fiches
const section1 = document.querySelector(".bestfilm");
// Création de l'image 
const imageFilm = document.createElement("img");
imageFilm.src = bestFilm;
// Création des balises 
// const imageElement = document.createElement("img");
// imageElement.src = article.image;
// const nomElement = document.createElement("h2");
// nomElement.innerText = article.nom;
// const prixElement = document.createElement("p");
// prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
// const categorieElement = document.createElement("p");
// categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
// const descriptionElement = document.createElement("p");
// descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
// const stockElement = document.createElement("p");
// stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

// On rattache la balise article a la section Fiches
section1.appendChild(imageFilm);