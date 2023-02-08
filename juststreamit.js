
const path = "http://localhost:8000/api/v1/";
const pageArray = ["","page=2&"];



async function loadBestFilm() {
// Meilleurs films dans le local storage	
	/* Récupération de la liste des films dans les 2ére pages depuis l'API en JSON */
	var page = "";
	var best = "";
	var lists_films_array = [];
	var list_films = [];

	for(var i = 0; i < 2; i++){		
		page = pageArray[i];
		best = "titles/?"+page+"sort_by=-imdb_score";		
		var reponse = await fetch(path + best);				
		if (reponse.ok){
			var films = await reponse.json();
			// Transformation des films en JSON
			list_films = films.results;			
		}
		lists_films_array = lists_films_array.concat(list_films);		
	}
	var lists_films = "";	
	lists_films = JSON.stringify(lists_films_array);	
	// Stockage des informations dans le sessionStorage
	window.sessionStorage.setItem("best_films", lists_films);	
	/* n'ira jamais ici :( car erreur sera attrapé*/	
	return 200;	
}

async function loadCategorie(categorie) {
// Meilleurs films dans le local storage
	/* Récupération de la liste des films dans les 2ére pages depuis l'API en JSON */
	var page = "";
	var categorieAPI = "";
	var lists_films_array = [];
	var list_films = [];

	for(var i = 0; i < 2; i++){		
		page = pageArray[i];
		categorieAPI = "titles/?"+page+"sort_by=-imdb_score&genre_contains="+categorie;		
		var reponse = await fetch(path + categorieAPI);		
		if (reponse.ok){
			var films = await reponse.json();
			// Transformation des films en JSON
			list_films = films.results;
			lists_films_array = lists_films_array.concat(list_films);	
		}				
	}
	var lists_films = "";	
	lists_films = JSON.stringify(lists_films_array);	
	// Stockage des informations dans le sessionStorage
	window.sessionStorage.setItem(categorie, lists_films);	
	return 200;	
}

async function loadSessionStorage() {
/* Charge le sessionStorage */
	var bestOk = 0;	
	var categorie1OK = 0;
	var categorie2OK = 0;
	var categorie3OK = 0;
	// Meilleurs films dans le sessionStorage
	let best_films = window.sessionStorage.getItem("best_films");
	if ((best_films === null)||(best_films == "{}")){
		var result_load = await loadBestFilm().catch((err) => {		
			alert("Le serveur à repondu :" + err);		
		});
		if (result_load == 200){
			bestOk = 1;
		}
		else{
			return 0;
		}
	}
	else{
		bestOk = 1;
	}
	
	let filmsAdventure = window.sessionStorage.getItem("Adventure");
	if ((filmsAdventure === null)||(filmsAdventure == "{}")){
		var result_load2 = await loadCategorie("Adventure").catch((err) => {		
			alert("Le serveur à repondu :" + err);		
		});
		if (result_load2 == 200){
			categorie1OK = 1;
		}
		else{
			return 0;
		}
	}
	else{
		categorie1OK = 1;
	}

	let filmsComedy = window.sessionStorage.getItem("Comedy");
	if ((filmsComedy === null)||(filmsComedy == "{}")){
		var result_load3 = await loadCategorie("Comedy").catch((err) => {		
			alert("Le serveur à repondu :" + err);		
		});
		if (result_load3 == 200){
			categorie2OK = 1;
		}
		else{
			return 0;
		}
	}
	else{
		categorie2OK = 1;
	}

	let filmsFantasy = window.sessionStorage.getItem("Fantasy");
	if ((filmsFantasy === null)||(filmsFantasy == "{}")){		
		var result_load4 = await loadCategorie("Fantasy").catch((err) => {		
			alert("Le serveur à repondu :" + err);		
		});
		if (result_load4 == 200){
			categorie3OK = 1;
		}
		else{
			return 0;
		}
	}
	else{
		categorie3OK = 1;
	}

	if (bestOk == 1 && categorie1OK == 1 && categorie2OK == 1 && categorie3OK == 1 && window.sessionStorage.length == 4){
		return 1;
	}
	else{
		window.alert("erreur chargement du local storage");
		return 0;
	}
	
}

async function best_film(sessionStorageOK) {
/* Affichage dans le DOM du meilleur film */	
	/* Test du sessionStorage chargé */		
	if (sessionStorageOK){
		const categorie = "best_films";		
		var best_films = window.sessionStorage.getItem(categorie);
		/* Récupération dans le sessionStorage du 1er film*/
		const best_films_array = JSON.parse(best_films);		
		const bestFilm = best_films_array[0];		

		// Récupération de l'élément du DOM qui accueillera le film
		const section1 = document.querySelector(".bestfilm");

		// Création de l'image + titre du film
		const imageFilm = document.createElement("img");
		imageFilm.src = bestFilm.image_url;
		imageFilm.alt = "best film image";
		imageFilm.title = bestFilm.title;
		imageFilm.classList.add("imgBestFilm");					
		const zoneTitle = document.querySelector(".zoneButton p");
		zoneTitle.innerText = bestFilm.title;
		section1.appendChild(imageFilm);

		// Création du bouton Film
		const zoneBouton = document.querySelector(".zoneButton button");
		// Création du modale
		const zoneModale = document.createElement("div");
		zoneModale.classList.add("modal");		
		section1.appendChild(zoneModale);		
		
		zoneBouton.addEventListener("click", function() {
			modale(bestFilm.url, zoneModale);
			zoneModale.style.display = "block";
		});
	}	
}

async function modale(filmUrl, zoneModale){
/* Modale film_url: info du film, zoneModale: Element du DOM pour le rattachement*/		
	try{
		var film_string = await loadFilm(filmUrl);
	}
	catch (e){
		console.error(e.name);// affiche 'Error'
		console.error(e.message);
	}	
	var film = JSON.parse(film_string);	
	if (!document.getElementById("caption" + film.title)){
		const filmImage = document.createElement("img");	
		filmImage.src = film.image_url;
		filmImage.alt = "image du film";
		filmImage.title = film.title;
		filmImage.classList.add("modal-content");
		const spanX = document.createElement("span");
		spanX.classList.add("close");
		spanX.innerHTML = "&times;";
		spanX.id = "span" + film.title;
		const divCaption = document.createElement("div");
		divCaption.classList.add("caption");
		divCaption.id = "caption" + film.title;
		const filmTitle = document.createElement("p");	
		filmTitle.innerText = "Titre : " + film.title;
		const filmGenres = document.createElement("p");	
		filmGenres.innerText = "Genre(s) : " + film.genres.toString();
		const filmYear = document.createElement("p");	
		filmYear.innerText = " Date de sortie : " + film.date_published;
		const filmRated = document.createElement("p");	
		filmRated.innerText = "Votes moyens : " + film.avg_vote;
		const filmImdb = document.createElement("p");	
		filmImdb.innerText = "Score Imdb : " + film.imdb_score;
		const filmDirectors = document.createElement("p");	
		filmDirectors.innerText = "Realisateur : " + film.directors.toString();
		const filmActors = document.createElement("p");
		filmActors.innerText = "Acteurs : " + film.actors.toString();
		const filmDuration = document.createElement("p");
		filmDuration.innerText = "Durée : " + film.duration + "mins";
		const filmCountries = document.createElement("p");
		filmCountries.innerText = "Pays d'origine : " + film.countries.toString();
		const filmBoxOffice = document.createElement("p");
		filmBoxOffice.innerText = "Résultat au box office : " + (film.metascore ?? "pas de résultat.");
		const filmDescription = document.createElement("p");
		filmDescription.innerText = "Résumé : " + (film.long_description ?? film.description);
		zoneModale.appendChild(spanX);
		zoneModale.appendChild(filmImage);
		zoneModale.appendChild(divCaption);
		divCaption.appendChild(filmTitle);
		divCaption.appendChild(filmGenres);
		divCaption.appendChild(filmYear);
		divCaption.appendChild(filmRated);
		divCaption.appendChild(filmImdb);
		divCaption.appendChild(filmDirectors);
		divCaption.appendChild(filmActors);
		divCaption.appendChild(filmDuration);
		divCaption.appendChild(filmCountries);
		divCaption.appendChild(filmBoxOffice);
		divCaption.appendChild(filmDescription);
	}	
	// zoneModale.style.display = "block";

	// Get the <span> element that closes the modal
	const span = document.getElementById("span" + film.title);

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		zoneModale.style.display = "none";
	};	
}

async function loadFilm(url) {
/* récupére les infos de la page du film */		
	const reponse = await fetch(url);				
	if (reponse.ok){
		const films = await reponse.json();
		// Transformation du film en JSON			
		const filmsDetails = JSON.stringify(films);						
		return filmsDetails;
	}
	else{
		throw new Error(reponse.status); 			
	}	
}

async function sevenBestFilm(sessionStorageOK) {
/* Affichage dans le DOM des 7 autres meilleurs films */	
	/* Test du sessionStorage chargé */		
	if (sessionStorageOK){
		/* Récupération dans le sessionStorage des 7 autres films*/		
		var best_films = window.sessionStorage.getItem("best_films");
		const best_films_array = JSON.parse(best_films);		
		
		for (var i = 1; i < 8; i++){			
			var film = best_films_array[i];
			// Récupération de l'élément du DOM qui accueillera les films
			var section = document.querySelector("#categorie > div > div.slide");
			// Création de l'image + titre du film
			var imageFilm = document.createElement("img");
			imageFilm.src = film.image_url;
			imageFilm.alt = "best film image";
			imageFilm.title = film.title;
			imageFilm.classList.add("imgFilm");
			imageFilm.dataset.url = film.url;
			section.appendChild(imageFilm);		
			
			// Création du modale
			const zoneModale = document.createElement("div");
			zoneModale.classList.add("modal");
			// zoneModale.setAttribute("name", film.title);		
			section.appendChild(zoneModale);
			
			imageFilm.addEventListener("click", function(event) {
				modale(event.target.dataset.url, zoneModale);
				zoneModale.style.display = "block";
			});
		}
		slider("1");	
	}	
}

async function categorie(sessionStorageOK,categorie,nb){
/* Test du sessionStorage chargé */
			
	if (sessionStorageOK){
	/* Récupération dans le sessionStorage des 7 films*/		
		var best_films = window.sessionStorage.getItem(categorie);
		const best_films_array = JSON.parse(best_films);
		const nbmaxFilm = best_films_array.length;		
		
		for (var i = 0, y = 0; (i < nbmaxFilm) && (y < 7); i++){
			
			var film = best_films_array[i];
			// Récupération de l'élément du DOM qui accueillera les films
			var section = document.querySelector("#"+categorie+" > div > div.slide");
			// Création de l'image + titre du film

			var imageFilm = document.createElement("img");
			try{
				const reponse = await fetch(film.image_url); /* on part sur le fait que CORS soit une erreur par le browser, impossible de récuperer le status 404 */
				if (reponse.status == 404){
					throw new Error(404);
				}
			}	
			catch {				
				best_films_array.splice(i, 1);							
				window.sessionStorage.setItem(categorie, JSON.stringify(best_films_array));
				i -= 1;
				continue;
			}				
			
			imageFilm.src = film.image_url;			
			imageFilm.alt = "film image";
			imageFilm.title = film.title;
			imageFilm.classList.add("imgFilm");
			imageFilm.dataset.url = film.url;
			section.appendChild(imageFilm);

			// Création du modale
			const zoneModale = document.createElement("div");
			zoneModale.classList.add("modal");				
			section.appendChild(zoneModale);
			
			imageFilm.addEventListener("click", function(event) {
				modale(event.target.dataset.url, zoneModale);
				zoneModale.style.display = "block";
			});
			y += 1;
		}
		slider(nb);	
	}	
}

function slider(categorie){
	/* Décalage du carroussel */
	const widthOutput = window.innerWidth;
	var maxwidth = widthOutput < 1000 ? 850 : 1350;
	var slider = document.querySelector(".slider[name='slider"+categorie+"']");
	var prevBtn = document.querySelector("#prevBtn"+categorie);
	var nextBtn = document.querySelector("#nextBtn"+categorie);

	prevBtn.addEventListener("click", function() {
		slider.style.marginLeft = parseInt(slider.style.marginLeft || 0) + 100 + "px";
		
		if (parseInt(slider.style.marginLeft) > 0){
			slider.style.marginLeft = 0 + "px";
		}		
	});

	nextBtn.addEventListener("click", function() {
		slider.style.marginLeft = parseInt(slider.style.marginLeft || 0) - 100 + "px";
		if (parseInt(slider.style.marginLeft) < -maxwidth){
			slider.style.marginLeft = -maxwidth + "px"; 
		}		
	});
}

async function main(){
	var sessionStorageOK = await loadSessionStorage();
	best_film(sessionStorageOK);	
	sevenBestFilm(sessionStorageOK);
	categorie(sessionStorageOK,"Adventure","2");
	categorie(sessionStorageOK,"Comedy","3");
	categorie(sessionStorageOK,"Fantasy","4");
}

main();

