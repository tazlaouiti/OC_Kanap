/*********************************************************************************/
// Recuperation de l'order id via URL transmise par la page panier.html.
/*********************************************************************************/
let paramsFromObjURLSearchParams = new URLSearchParams(document.location.search);
// Gestion erreur si page ouverte sans id en parametre => Empecher le deroulement avec un fetch envoye avec URLCanapeId=null.
let URLOrderId = paramsFromObjURLSearchParams.get("orderId");
if (URLOrderId == null) { 
	window.alert('Merci de revenir sur la page Accueil.');
	document.location.href = `../index.html`;
}
else {
	// Affichage de l'order id fourni par le serveur.
	document.getElementById("orderId").innerText = URLOrderId;
}

/*******************/
/*** End Of File ***/
/*******************/
