/*********************************************************************************/
// Pour passer en mode debug (affichage des fonctions dans la console, ...) decommenter la ligne : mode_run_debug = "debug";
let mode_run_debug = ""; 
// mode_run_debug = "debug";

// Variables globales.
// Total panier Prix et Quantité
let totalQuantityG = 0;
let totalPriceG = 0;
	
/*********************************************************************************/
// Fonction de recuperation des data from localStorage
/*********************************************************************************/
function recuperationLocalStorage() {
	if (mode_run_debug == "debug") {console.log("function recuperationLocalStorage()")}
	
	const myTotalBasketInTheStorageJSON = localStorage.getItem('OC-Kanap');
	let myTotalBasketInTheStorage = JSON.parse(myTotalBasketInTheStorageJSON);
	
	// Fonction de tri des data extraite du localStorage.
	if (myTotalBasketInTheStorage != null) { 
		sortBeforeLoad(myTotalBasketInTheStorage)
	}
	return myTotalBasketInTheStorage;
}

/*********************************************************************************/
// Fonction de tri dans le localStorage par modèle et couleur (= indexUniqueKey) avant d'afficher. Si ajout dans le desordre lors de la constitution du panier, 
/*********************************************************************************/
function sortBeforeLoad(myTotalBasketInTheStorage){
	if (mode_run_debug == "debug") {console.log("function sortBeforeLoad(myTotalBasketInTheStorage)")}
	
	let myTotalBasketInTheStorageSorted = myTotalBasketInTheStorage.sort((a,b) => a.indexUniqueKey.localeCompare(b.indexUniqueKey))
	// Stockage des informations triées dans le localStorage.
	window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasketInTheStorageSorted));
	return;
}

/*********************************************************************************/
// Fonction de recuperation des donnees de l'API - Methode fetch .then .catch
/*********************************************************************************/
async function fetchItems() {
	if (mode_run_debug == "debug") {console.log("async function fetchItems()")}
	
    return fetch(`http://localhost:3000/api/products`)
        .then(result => result.json())
        .then(ressourcesDataProducts => ressourcesDataProducts)
        .catch(function (error) { window.alert("Message d'erreur") });
}

/*********************************************************************************/
// Fonction des balayage des ressources pour extraire les data d'un produit selon Id.
/*********************************************************************************/
function recuperationRessourceProduct(ressourcesDataProducts, productId) {
	if (mode_run_debug == "debug") {console.log("function recuperationRessourceProduct(ressourcesDataProducts, productId)")}
	
	for (let j = 0; j < ressourcesDataProducts.length; j++) {
		const ressourcesCanape = ressourcesDataProducts[j];
		if ( productId == ressourcesCanape._id ) {
			return ressourcesCanape;
		}
		else if (j == (ressourcesDataProducts.length - 1) ) { 
			return 'Not found'
		}
	}
}
/*********************************************************************************/
// Fonction d'affichage du panier extrait du localStorage
/*********************************************************************************/
function loadMyTotalBasket(myTotalBasketInTheStorage, ressourcesDataProducts) {
	if (mode_run_debug == "debug") {console.log("function loadMyTotalBasket(myTotalBasketInTheStorage, ressourcesDataProducts)")}
	
	// Récupération de l'élément du DOM qui accueillera les produits et mise à blanc dans le cas d'appel apres suppression.
	const sectionItems = document.querySelector("#cart__items");
	sectionItems.innerHTML = ""

	for (let i = 0; i < myTotalBasketInTheStorage.length; i++) {
		const articleCanape = myTotalBasketInTheStorage[i];

		// Création d’une balise article dédiée à un canapé
		const canapeArticleElement = document.createElement("article");
		canapeArticleElement.className = "cart__item";
		canapeArticleElement.dataset.id = articleCanape.canapeId;
		canapeArticleElement.dataset.color = articleCanape.canapeColor;
		
		const ressourceCanape = recuperationRessourceProduct(ressourcesDataProducts, articleCanape.canapeId);

		const articleDivImage = document.createElement("div");
		articleDivImage.className = "cart__item__img"
		// Création de la balise img
		const imageElement = document.createElement("img");
		imageElement.src = ressourceCanape.imageUrl;
		imageElement.alt = ressourceCanape.altTxt;

		const articleDivContent = document.createElement("div");
		articleDivContent.className = "cart__item__content"

		const divDescription = document.createElement("div");
		divDescription.className = "cart__item__content__description"
		const nameElement = document.createElement("h2");
		nameElement.innerText = ressourceCanape.name;
		const colorElement = document.createElement("p");
		colorElement.innerText = articleCanape.canapeColor; // Extraction de la value du panier
		const priceElement = document.createElement("p");
		priceElement.innerText = `${ressourceCanape.price} €`;		
		
		
		const divSettingsQ = document.createElement("div");
		divSettingsQ.className = "cart__item__content__settings"
		const divSettingsQuantity = document.createElement("div");
		divSettingsQuantity.className = "cart__item__content__settings__quantity"
		const SettingsQuantityTxt = document.createElement("p");
		SettingsQuantityTxt.innerText = "Qté : "
		const SettingsQuantityValue = document.createElement("input");
 		SettingsQuantityValue.setAttribute("type", "number");	
		SettingsQuantityValue.className = "itemQuantity"
        SettingsQuantityValue.name = "itemQuantity"
		SettingsQuantityValue.min = 1
		SettingsQuantityValue.max = 100
		SettingsQuantityValue.value = articleCanape.canapeQuantity
		
		const divSettingsD = document.createElement("div");
		divSettingsD.className = "cart__item__content__settings__delete"
		const SettingsDelete = document.createElement("p");
		SettingsDelete.className = "deleteItem"
		SettingsDelete.innerText = "Supprimer"
				
 		// On rattache la balise article a la section cart__items
		sectionItems.appendChild(canapeArticleElement);
		canapeArticleElement.appendChild(articleDivImage);
		
		articleDivImage.appendChild(imageElement);
	    
		canapeArticleElement.appendChild(articleDivContent);
		
		articleDivContent.appendChild(divDescription); 	
		divDescription.appendChild(nameElement); 
		divDescription.appendChild(colorElement); 
		divDescription.appendChild(priceElement); 
		
		articleDivContent.appendChild(divSettingsQ); 
		divSettingsQ.appendChild(divSettingsQuantity);
		divSettingsQuantity.appendChild(SettingsQuantityTxt);
		divSettingsQuantity.appendChild(SettingsQuantityValue);	
		
		articleDivContent.appendChild(divSettingsD);
		divSettingsD.appendChild(SettingsDelete);			
		
	}

	// Fonction qui attend la construction du DOM definitif si non pas possible de recuperer selector ".deleteItem"
	waitBeforeSuppress(myTotalBasketInTheStorage);
	// Fonction qui gere le changement de quantite avec mise à jour du localStorage
	waitBeforeUpdateQuantity(myTotalBasketInTheStorage, ressourcesDataProducts);
	
	// Affichage de la quantite totale et du prix total du panier.
	calculateQuantityAndPrice(myTotalBasketInTheStorage, ressourcesDataProducts);
	
}

/*********************************************************************************/
// Main function
/*********************************************************************************/
let myTotalBasketInTheStorage = {};
let ressourcesDataProducts = {};

//Fonction qui attend le retour du fetch avant d'afficher si non la variable ressourcesDataProducts est vide
async function attendAvantAffiche() {
	if (mode_run_debug == "debug") {console.log("async function attendAvantAffiche()")}
	
	const ressourcesDataProducts = await fetchItems();
	myTotalBasketInTheStorage = await recuperationLocalStorage();
	
	// Affichage du panier : Extrait du localStorage - Avec complement de données provenant du fetch (Price qui peut varier + name, imageURL, description, altTxt)
	if (myTotalBasketInTheStorage != null && myTotalBasketInTheStorage.length != 0) { 
			loadMyTotalBasket(myTotalBasketInTheStorage, ressourcesDataProducts);
	}
	else {
		window.alert('Votre panier est vide, Merci de selectionner au moins un de nos produits sur la page d\'accueil avant de consulter la page panier.');
		document.location.href = `../index.html`;
	}
}
attendAvantAffiche();

/*********************************************************************************/
// Fonction qui attend la construction du DOM definitif si non pas possible de recuperer selector ".deleteItem"
/*********************************************************************************/
function waitBeforeSuppress(myTotalBasketInTheStorage) {
	if (mode_run_debug == "debug") {console.log("function waitBeforeSuppress(myTotalBasketInTheStorage)")}
	
	// Gestion du bouton supprimer. Je supprime du panier si et seulement si confirmation
	const boutonSupprimer = document.querySelectorAll('.deleteItem');

	for (let i = 0; i < boutonSupprimer.length; i++) {
			boutonSupprimer[i].addEventListener("click", function () {
				// <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
				let articleToDelete = boutonSupprimer[i].closest('.cart__item')

				// https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
				if (window.confirm("Voulez-vous vraiment supprimer le\(s\) articles de votre panier ?")) {
					// Suppression dans DOM
					articleToDelete.remove()
					// Modification du localStorage avec suppression de l'article
					myTotalBasketInTheStorage.splice(i, 1)
					window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasketInTheStorage))
					// Absolument recharger sa page si non à partir du 2nd Del, tu supprimes pas les bons articles dans le localStorage car decallage entre le DOM et le localStorage

					// Refresh du pranier
					attendAvantAffiche();
				}
				else { 
					return;
				}
			});
	}
}

/*********************************************************************************/
// Fonction qui gere le changement de quantite avec mise à jour du localStorage
/*********************************************************************************/
function waitBeforeUpdateQuantity(myTotalBasketInTheStorage, ressourcesDataProducts) {
	if (mode_run_debug == "debug") {console.log("function waitBeforeUpdateQuantity(myTotalBasketInTheStorage, ressourcesDataProducts)")}

	// Gestion du changement de quantité.
	const changeQuantity = document.querySelectorAll('.itemQuantity');
	
	for (let i = 0; i < changeQuantity.length; i++) {
			changeQuantity[i].addEventListener("change", function () {

				// TEST C01 : Si une quantité valide est renseignée.
				if (changeQuantity[i].value <= 0 || changeQuantity[i].value > 100) { 
					alert('Merci de saisir une quantité comprise entre 1 et 100 avant de valider votre panier. Merci.');
					// Mise à jour de la quantité avec la valeur précedente extraite du localStorage.
					changeQuantity[i].value = parseInt(myTotalBasketInTheStorage[i].canapeQuantity);

				return;
				};	
				if (window.confirm("Do you really want to update the quantity of your article ?")) {

					// Mise à jour de la quantité avec la nouvelle valeur saisie.
					myTotalBasketInTheStorage[i].canapeQuantity = parseInt(changeQuantity[i].value)

					// Modification du localStorage
					window.localStorage.setItem('OC-Kanap', JSON.stringify(myTotalBasketInTheStorage))
					
					// Refresh de la quantite totale et du prix total du panier.
					calculateQuantityAndPrice(myTotalBasketInTheStorage, ressourcesDataProducts);
				}
				else { 
					return;
				}
			});
	}
}

/*********************************************************************************/
// Fonction qui affiche le prix total du pannier => called if there is a load, a change quantity or a suppress action
/*********************************************************************************/
function calculateQuantityAndPrice(myTotalBasketInTheStorage, ressourcesDataProducts) {
	if (mode_run_debug == "debug") {console.log("function calculateQuantityAndPrice(myTotalBasketInTheStorage, ressourcesDataProducts)")}
	
	let totalQuantity = 0;
	let totalPrice = 0;	
	
	for (let i = 0; i < myTotalBasketInTheStorage.length; i++) {
		const articleCanape = myTotalBasketInTheStorage[i];
		const ressourceCanape = recuperationRessourceProduct(ressourcesDataProducts, articleCanape.canapeId);

		totalQuantity = totalQuantity + parseInt(articleCanape.canapeQuantity)
		totalPrice = totalPrice + ressourceCanape.price * parseInt(articleCanape.canapeQuantity)
	}
	document.getElementById('totalQuantity').innerText = totalQuantity;
	document.getElementById('totalPrice').innerText = totalPrice;
	
	// Valorisation des variables globales.
	totalQuantityG = totalQuantity;
	totalPriceG = totalPrice;
};

/*********************************************************************************/
// Form completion
/*********************************************************************************/
const firstNameValidation = document.getElementById('firstName');
const lastNameValidation = document.getElementById('lastName');
const addressValidation = document.getElementById('address');	
const cityValidation = document.getElementById('city');
const emailValidation = document.getElementById('email');

firstNameValidation.addEventListener("change", function () {
		// Validation selon l'expression reguliere : Alphabetique only MAJ-Min, Ne doit pas contenir de chiffres ni des caracteres speciaux sauf le tiret "-".
	const firstNameExpressionReguliere = new RegExp("^([A-Za-z]+ ?-?)*$");
	
	if (!firstNameExpressionReguliere.test(firstNameValidation.value))  {
		alert("Votre prénom ne doit pas contenir de chiffres, ni de caractères spéciaux.");
		document.getElementById('firstNameErrorMsg').innerText = "Votre prénom ne doit pas contenir de chiffres, ni de caractères spéciaux.";
		firstNameValidation.value = "";
	}
	else {
		document.getElementById('firstNameErrorMsg').innerText = "";
	}
});
/***/
lastNameValidation.addEventListener("change", function () {
	const lastNameExpressionReguliere = new RegExp("^([A-Za-z]+ ?-?)*$");
	
	if (!lastNameExpressionReguliere.test(lastNameValidation.value))  {
		// Validation selon l'expression reguliere : Alphabetique only MAJ-Min, Ne doit pas contenir de chiffres ni des caracteres speciaux sauf le tiret "-".
		alert("Votre nom ne doit pas contenir de chiffres, ni de caractères spéciaux.");
		document.getElementById('lastNameErrorMsg').innerText = "Votre nom ne doit pas contenir de chiffres, ni de caractères spéciaux.";
		lastNameValidation.value = "";
	}
	else {
		document.getElementById('lastNameErrorMsg').innerText = "";
	}
});
/***/
addressValidation.addEventListener("change", function () {
	// Validation selon l'expression reguliere : doit contenir des caracteres alphanumeriques, pas de caracteres speciaux sauf le tiret "-".
	const addressExpressionReguliere = new RegExp("^([0-9A-Za-z,.]+ ?-?)*$");
	
	if (!addressExpressionReguliere.test(addressValidation.value))  {
		alert("L'adresse n'est pas valide. Exemple : 221, backerstreet.");
		document.getElementById('addressErrorMsg').innerText = "L'adresse n'est pas valide. Exemple : 221, backerstreet.";
		addressValidation.value = "";
	}
	else {
		document.getElementById('addressErrorMsg').innerText = "";
	}
});
/***/
cityValidation.addEventListener("change", function () {
	// Validation selon l'expression reguliere : doit contenir des caracteres alphanumeriques, pas de caracteres speciaux sauf le tiret "-".
	const cityExpressionReguliere = new RegExp("^([A-Za-z]+ ?-?)*$"); ///^[a-z ,.'-]+$/
	
	if (!cityExpressionReguliere.test(cityValidation.value))  {
		alert("Le nom de la ville n'est pas valide.");
		document.getElementById('cityErrorMsg').innerText = "Le nom de la ville n'est pas valide.";
		cityValidation.value = "";
	}
	else {
		document.getElementById('cityErrorMsg').innerText = "";
	}
});
/***/
emailValidation.addEventListener("change", function () {
	// Validation selon l'expression reguliere : doit contenir un arobase @.
	const emailExpressionReguliere = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
	
	if (!emailExpressionReguliere.test(emailValidation.value))  {
		alert("L'adresse mail n'est pas valide. Exemple : mlaouiti77@sfr.fr");
		document.getElementById('emailErrorMsg').innerText = "L'adresse mail n'est pas valide. Exemple : mlaouiti77@sfr.fr";
		emailValidation.value = "";
	}
	else {
		//alert("All is ok, you can submit the order");
		document.getElementById('emailErrorMsg').innerText = "";
	}
});

/*********************************************************************************/

/*********************************************************************************/
function validationEventEmpty() {
	if (mode_run_debug == "debug") {console.log("function validationEventEmpty()")}

	if (document.getElementById('firstName').value == "") {
		alert("Veuillez remplir tous les champs du formulaire, Le prénom n'est pas renseigné.");
		document.getElementById('firstNameErrorMsg').innerText = "Le prénom n'est pas renseigné.";
	}
	else {
		if (document.getElementById('lastName').value == "") {
			alert("Le nom n'est pas renseigné.");
			document.getElementById('lastNameErrorMsg').innerText = "Le nom n'est pas renseigné.";
		}
		else {
			if (document.getElementById('address').value == "") {
				alert("L'adressse n'est pas renseignée.");
				document.getElementById('addressErrorMsg').innerText = "L'adresse n'est pas renseignée.";
			}
			else {
				if (document.getElementById('city').value == "") {
					alert("Le nom de la ville n'est pas renseigné.");
					document.getElementById('cityErrorMsg').innerText = "Le nom de la ville n'est pas renseigné.";
				}
				else {
					if (document.getElementById('email').value == "") {
						alert("L'adresse mail n'est pas renseignée.");
						document.getElementById('emailErrorMsg').innerText = "L'adresse mail n'est pas renseignée.";
					}
					else {
						return true;
					}
				}
			}
		}
	}
};

/*********************************************************************************/
// Gestion du bouton validation.
/*********************************************************************************/
const boutonValidation = document.querySelector("#order");

boutonValidation.addEventListener("click", function () {
	if (mode_run_debug == "debug") {console.log("boutonValidation.addEventListener(click, function ())")};
	
	let totalQuantity = totalQuantityG;
	let totalPrice = totalPriceG;
	
	// Je valide le panier lorsque je clique sur le bouton si et seulement si ...
	let onPeutValider = totalQuantity != 0 && totalPrice != 0 ;
	let onPeutValiderNotEmpty = validationEventEmpty()
	
	// Test si le panier est valorisé. On trouvera pas dans le catalogue des canapes gratuits (0,00€).
	if ( onPeutValider ) {
		// alert("01 Juste pour bloquer avant de soumettre si non All is ok."); 
		
		// Test si tout les champs du formulaire sont bien remplis avant de soumettre avec la fonction 
		if (onPeutValiderNotEmpty) {
			
			let basketId  = new Array();
			
			myTotalBasketInTheStorage.forEach((canape) => {
				basketId.push(canape.canapeId);
			});
			
			const order = {
				contact: {
					firstName: firstName.value,
					lastName: lastName.value,
					address: address.value,
					city: city.value,
					email: email.value,
				},
				products: basketId,
			};

			if (mode_run_debug == "debug") {console.log("order : ", order)};
			
			fetch('http://localhost:3000/api/products/order',{	
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(order)

			})
			.then(result => result.json())
			.then(responseFromServer => {document.location.href = `./confirmation.html?orderId=${responseFromServer.orderId}`;
				localStorage.clear();
				// console.log("Local storage cleared, responseFromServer : ", responseFromServer);
			})
			.catch(function (error) { window.alert("Message d'erreur") });
		}
	}
});		

/*******************/
/*** End Of File ***/
/*******************/