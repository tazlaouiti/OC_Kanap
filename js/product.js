/*********************************************************************************/
// Fonction de sortie de programme avec message.
/*********************************************************************************/
function exit( status ) {
	if (typeof status === 'string') {
        alert(status);
		throw new Error("Something went badly wrong!");
    }
}

/*********************************************************************************/
// Recuperation des donnees Id du canape de l'URL transmise par la page d'accueil.
/*********************************************************************************/
let paramsFromObjURLSearchParams = new URLSearchParams(document.location.search);
// Gestion erreur si page ouverte sans id en parametre => Empecher le deroulement avec un fetch envoye avec URLCanapeId=null.
let URLCanapeId = paramsFromObjURLSearchParams.get("id");
if (URLCanapeId == null) { 
	exit('Merci de revenir sur la page Accueil.');
};

// Variables globales.
// Récupération de l'élément du nom model de l'article pour creation ultérieure de la clé indexUniqueKey.
let articleName = '';

/*********************************************************************************/
// Fonction API de recuperation de data.
/*********************************************************************************/
async function fetchItem() {
    return fetch(`http://localhost:3000/api/products/${URLCanapeId}`)
        .then(result => result.json())
        .then(ressourcesDataProduct => ressourcesDataProduct)
        .catch(function (error) { console.log("fetch().catch error : ", error); window.alert("Message d'erreur") }); // Erreur si par exemple ressource non disponible.
}

/*********************************************************************************/
// Fonction d'affichage des produits obtenus de la ressource serveur.
/*********************************************************************************/
function loadCanape(ressourcesDataProduct) {
	const articleCanape = ressourcesDataProduct;
	
  	// Récupération de l'élément du DOM qui accueillera l'image du produit
	const canapeItem__img = document.querySelector(".item__img");

 	// Création de la balise img
	const canapeImage = document.createElement("img");
	canapeImage.src = articleCanape.imageUrl;
	canapeImage.alt = articleCanape.altTxt;	
		
	// On rattache la balise img à la balise div, le commentaire est toujours visible avec DevTools dans la balise class="item__img"
	canapeItem__img.appendChild(canapeImage);
	
	// Récupération de l'élément du DOM qui accueillera le nom du produit
	const canapeTitle = document.querySelector("#title");
	canapeTitle.innerText = articleCanape.name;
	
	// Récupération de l'élément du nom model de l'article pour creation ultérieure de la clé indexUniqueKey.
	articleName = articleCanape.name;
	
	// Récupération de l'élément du DOM qui accueillera le prix
	const canapePrice = document.querySelector("#price");
	canapePrice.innerText = articleCanape.price;
	
	// Récupération de l'élément du DOM qui accueillera la description
	const canapeDescription = document.querySelector("#description");
	canapeDescription.innerText = articleCanape.description;
	
	// Récupération de l'élément du DOM qui accueillera la liste des couleurs pour chaque produit
	const canapeColors = document.querySelector("#colors");
	
	for(i= 0; i < articleCanape.colors.length; i++) {
		const opt = document.createElement('option');
		opt.value = articleCanape.colors[i];
		opt.innerText = articleCanape.colors[i];
		// On rattache les balises opt generees par la boucle à la balise ("#colors")
		canapeColors.appendChild(opt);
	}	
}

/*********************************************************************************/
// main function
/*********************************************************************************/
async function attendAvantAffiche() {
    const ressourcesDataProduct = await fetchItem();
    loadCanape(ressourcesDataProduct);
}

// Je lance mon programme
attendAvantAffiche() ;

/*********************************************************************************/
// Creation de la class Basket
/*********************************************************************************/
class Basket {
	constructor (indexUniqueKey, canapeId, canapeColor, canapeQuantity){
	this.indexUniqueKey = indexUniqueKey,
	this.canapeId = canapeId;
	this.canapeColor = canapeColor;
	this.canapeQuantity = canapeQuantity;
	}
} 

/*********************************************************************************/
// Fonction d'analyse du localStorage en mode debug.
/*********************************************************************************/
function afficheLocalStorage() {
	const myTotalBasketInTheStorageJSON = localStorage.getItem('OC-Kanap');
//	let myTotalBasketInTheStorage = myTotalBasketInTheStorageJSON && JSON.parse(myTotalBasketInTheStorageJSON);
	let myTotalBasketInTheStorage = JSON.parse(myTotalBasketInTheStorageJSON);
	
	// Affichage du localstorage
	console.log("myTotalBasketInTheStorage : ", myTotalBasketInTheStorage);
	console.table("myTotalBasketInTheStorage (table) : ", myTotalBasketInTheStorage);
	console.log("myTotalBasketInTheStorage.length : ", myTotalBasketInTheStorage.length);
	for( let i= 0; i < myTotalBasketInTheStorage.length; i++ ) {
		console.log(`myTotalBasketInTheStorage [${i}] : `, myTotalBasketInTheStorage[i]);
	}
	// Normally : undefined
	console.log("myTotalBasketInTheStorage[0] : ", myTotalBasketInTheStorage[myTotalBasketInTheStorage.length + 1]);
}

/*********************************************************************************/
// Gestion du bouton panier.
/*********************************************************************************/
const boutonPanier = document.querySelector("#addToCart");

// J'ajoute ma selection au panier lorsque je clique sur le bouton si et seulement si ...
boutonPanier.addEventListener("click", function () {
	// afficheLocalStorage()
	
	// Récupération de l'élément du DOM ou se trouve la couleur selectionnée.
	const articleColor = document.querySelector("#colors");

	// TEST P01 : Si une couleur est selectionnée.
	if (articleColor.value == "") { 
		alert('Merci de choisir une couleur pour pouvoir ajouter un produit à votre panier. Merci.');
		return;
	};

	// Récupération de l'élément du DOM ou se trouve la quantite saisie.
	const articleQuantity = document.querySelector("#quantity");

	// TEST P02 : Si une quantité valide est renseignée.
	if (articleQuantity.value <= 0 || articleQuantity.value > 100) { 
		alert('Merci de saisir une quantité comprise entre 1 et 100 pour pouvoir ajouter à votre panier. Merci.');
		// Mise à jour de la quantité à 0.
		articleQuantity.value = 0;
		return;
	};	

	// Creation de clé unique : model-Color
	let indexUniqueKey = articleName + ' - ' + articleColor.value;
	
	// Attention string à parser en integer
	console.log(typeof articleQuantity.value)	
    let myBasket = new Basket (indexUniqueKey, URLCanapeId, articleColor.value, parseInt(articleQuantity.value));

	// TEST P03 : Si ma clé est deja présente dans le localStorage.
	const myTotalBasketInTheStorageJSON = localStorage.getItem('OC-Kanap');
//	let myTotalBasketInTheStorage = myTotalBasketInTheStorageJSON && JSON.parse(myTotalBasketInTheStorageJSON);
	let myTotalBasketInTheStorage = JSON.parse(myTotalBasketInTheStorageJSON);	
	
	let myTotalBasket = [];
	
	// if ( myTotalBasketInTheStorage.length == 0 ) {console.log("Cle existe dans localStorage mais vide car suppress total du panier : ", myTotalBasketInTheStorage.length);}
	// Si le test myTotalBasketInTheStorage.length == 0 n'est pas mis dans le if, alors on rentre dans le else avec une cle existante mais sans data.
	if ( myTotalBasketInTheStorage == null || myTotalBasketInTheStorage.length == 0) {
		// Ajout de la selection dans le panier
		const myTotalBasket__count = myTotalBasket.push(myBasket);
		//console.log("myTotalBasket__count : ", myTotalBasket__count);
		
		// Stockage des informations dans le localStorage.
		window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasket));
		window.alert('Merci, votre selection a été ajoutée au panier');
		return;
	}
	else {
		myTotalBasket = myTotalBasketInTheStorage;
		
		// Recuperation des informations dans le localStorage si elles existent ???
		function quelPetitI () {
			for( let i= 0; i < myTotalBasketInTheStorage.length; i++ ) {
				if ( myBasket.indexUniqueKey == myTotalBasketInTheStorage[i].indexUniqueKey ) {
					return i }
				else if (i == (myTotalBasketInTheStorage.length - 1) ) { 
					return 'Not found'}
			}	
		};
		let voilaLePetitI = quelPetitI ();

		let localStorageQuantity = 0;			
		let totalQuantity = 0;
		
		if ( voilaLePetitI == 'Not found' ) {
			totalQuantity = parseInt(myBasket.canapeQuantity);
		}
		else {
			localStorageQuantity = parseInt(myTotalBasket[voilaLePetitI].canapeQuantity)
			totalQuantity = localStorageQuantity + parseInt(myBasket.canapeQuantity);
		}
		//console.log("localStorageQuantity", localStorageQuantity);
		//console.log("totalQuantity", totalQuantity);		
		
		if ( voilaLePetitI != "Not found" && localStorageQuantity == 100 ){
			// TEST P04 : Si la quantité est deja à 100 dans le localStorage.
			window.alert("Vous aviez deja la quantité maximum à commander de 100 dans votre panier pour cet article, vous ne pouvez pas commander plus de 100 articles, Merci.");
			// Mise à jour de la selection à option value="" --SVP, choisissez une couleur--
			articleColor.value = ""
			// Mise à jour de la quantité à 0.
			articleQuantity.value = 0;
			return;
        }
		else if ( voilaLePetitI != "Not found" && totalQuantity < 100 ){
			// TEST P05 : Si la quantité totale localStorage+newBasketQuantity est <100.
			window.alert("Vous aviez deja " + localStorageQuantity + " de ce modèle dans votre panier, vous avez maintenant " + totalQuantity + " articles. (maximum 100 pièces)");
			// Modification de la quantité dans mon panier global
			myTotalBasket[voilaLePetitI].canapeQuantity = totalQuantity;

			// Stockage des informations dans le localStorage.			
			window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasket));
			return;
		}
		else if ( voilaLePetitI != "Not found" && totalQuantity == 100 ){
			// TEST P06 : Si le total localStorageQuantity + articleQuantity.value est =100.
			window.alert("Vous aviez deja " + localStorageQuantity + " article(s) de ce modèle dans votre panier, vous avez maintenant atteint la quantité maximum à commander de " + totalQuantity + " articles, Merci.");
			// Modification de la quantité dans mon panier global
			myTotalBasket[voilaLePetitI].canapeQuantity = totalQuantity;

			// Stockage des informations dans le localStorage.			
			window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasket));

			// Mise à jour de la selection à option value="" --SVP, choisissez une couleur--
			articleColor.value = ""
			// Mise à jour de la quantité à 0.
			articleQuantity.value = 0;
			return;
		}
		else if ( voilaLePetitI != "Not found" && totalQuantity > 100 ){
			// TEST P07 : Si le total localStorageQuantity + articleQuantity.value est >100.
			let myBasketQuantityMax = ( 100 - localStorageQuantity );
			window.alert("Vous aviez deja " + localStorageQuantity + " article(s) de ce modèle dans votre panier, vous ne pouvez pas ajouter " + articleQuantity.value + " articles, vous depassez la quantité maximum autorisée, vous ne pouvez à nouveau commander que " + myBasketQuantityMax + " articles.");

			// Mise à jour de la quantité avec la valeur maximum possible à saisir.
			articleQuantity.value = myBasketQuantityMax;
			return;
		}
		
		// Si l'article n'est pas trouve dans le localStorage, avec les precedents tests, on a deja verifié à la saisie totalQuantity < 100
		else if ( voilaLePetitI == "Not found" && totalQuantity < 100 ){
			// TEST P08 : Si l'article n'est pas trouve, il est ajouté au localStorage
			window.alert("Ce modèle est ajouté dans votre panier, vous avez maintenant " + totalQuantity + " articles. (maximum 100 pièces)");
			// Ajout de la selection dans mon panier global
			myTotalBasket.push(myBasket);

			// Stockage des informations dans le localStorage.			
			window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasket));
			return;
		}
		else if ( voilaLePetitI == "Not found" && totalQuantity == 100 ){
			// TEST P09 : Si le total localStorageQuantity + articleQuantity.value est =100.
			window.alert("Vous aviez deja " + localStorageQuantity + " de ce modèle dans votre panier, vous avez maintenant atteint la quantité maximum à commander de " + totalQuantity + " articles, Merci.");

			// Ajout de la selection dans mon panier global
			myTotalBasket.push(myBasket);

			// Stockage des informations dans le localStorage.			
			window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasket));
			return;
		}
		
		// Ce cas n'est pas possible car NORMALEMENT deja teste en amont, il ne peut pas saisir une quantite >100 && pas d'occurence dans le local Storage => La quantite ne sera jamais >100
		else if ( voilaLePetitI == "Not found" && totalQuantity > 100 ){
			// TEST P10 : Si le total localStorageQuantity + articleQuantity.value est >100.
			let myBasketQuantityMax = ( 100 - localStorageQuantity );
			window.alert("Vous aviez deja " + localStorageQuantity + " article(s) de ce modèle dans votre panier, vous ne pouvez pas ajouter " + articleQuantity.value + " articles, vous depassez la quantité maximum autorisée, vous ne pouvez à nouveau commander que " + myBasketQuantityMax + " articles.");

			// Mise à jour de la quantité avec la valeur maximum possible à saisir.
			articleQuantity.value = myBasketQuantityMax;
			return;
		}
		else {
			// TEST P11 : Si le cas n'est pas connu.
			window.alert("Nous avons rencontrer un problème, merci de contacter l'assistance.");
		return;
        } 

	}
});



