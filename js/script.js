/*********************************************************************************/
// Recuperation des donnees de l'API - Methode fetch .then .catch
/*********************************************************************************/
async function fetchItems() {
    return fetch(`http://localhost:3000/api/products`)
        .then(result => result.json())
        .then(ressourcesDataProducts => ressourcesDataProducts)
        .catch(function (error) { console.log("fetch().catch error : ", error); window.alert("Bonjour, nos serveurs sont actuellement indisponibles, veuillez re-essayez ultérieurement, merci pour votre compréhension. Demarrer avec VSCode la partie serveur /back $ npm start") });
}

/*********************************************************************************/
// Fonction d'affichage 
/*********************************************************************************/
function loadCanapes(ressourcesDataProducts) {

	for (let i = 0; i < ressourcesDataProducts.length; i++) {
		const articleCanape = ressourcesDataProducts[i];
		
		// Récupération de l'élément du DOM qui accueillera les produits
		const sectionItems = document.querySelector(".items");
		
		// Création d’une balise hyperlink
		const canapeLinkElement = document.createElement("a");
		canapeLinkElement.href = "./html/product.html" + "?" + "id=" + articleCanape._id;

		
		// Création d’une balise article dédiée à un canapé
		const canapeArticleElement = document.createElement("article");
		canapeArticleElement.dataset.id = articleCanape._id;
		
		// Création de la balise img
		const imageElement = document.createElement("img");
		imageElement.src = articleCanape.imageUrl;
		imageElement.alt = articleCanape.altTxt;
		
		const nameElement = document.createElement("h3");
		// Add class : https://developer.mozilla.org/fr/docs/Web/API/Element/classList
		nameElement.className = "productName";
		nameElement.innerText = articleCanape.name;
		
		const descriptionElement = document.createElement("p");
		descriptionElement.className = "productDescription";
		descriptionElement.innerText = articleCanape.description ?? "Désoles, pas de description pour le moment.";
		
		// On rattache la balise hypertexte a la section items
		sectionItems.appendChild(canapeLinkElement);
		
		// On rattache la balise article a la balise ancre
		canapeLinkElement.appendChild(canapeArticleElement);
		canapeArticleElement.appendChild(imageElement);
	    canapeArticleElement.appendChild(nameElement);
		canapeArticleElement.appendChild(descriptionElement);
	}
}

/*********************************************************************************/
// main function
/*********************************************************************************/
async function attendAvantAffiche() {
    const ressourcesDataProducts = await fetchItems();
    loadCanapes(ressourcesDataProducts);
}

//Je lance mon programme
attendAvantAffiche() ;

/*******************/
/*** End Of File ***/
/*******************/
