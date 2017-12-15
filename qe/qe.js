window.onload = function() {
	//ajouterSS();
	// Trouver les tbody qui sont utilisables
	var tbs = document.getElementsByTagName("TBODY");
	for (var i=0; i<tbs.length; i++) {
		var tbody = tbs[i];
		var c = tbody.className.substr(0,7);
		tbody.style.display = "none";

		if (c!="inactif") {
			window.courant = [tbody];
		}
    // On ajoute un evenement pour masquer
    var trs = tbody.getElementsByTagName("TR");
    for (var j=0; j<trs.length; j++) {
      trs[j].addEventListener('mousedown', evtClicTr, true);
    }
	}
	if (window.courant) {
		window.courant[0].style.display = "";
	}
	gererSolutions();
	document.body.insertBefore(creerControles(), document.body.firstChild);
	var table = document.getElementById("qe");
  table.className = "qe";
  // Ajout du pied
  table.insertBefore(creerPied(window.courant[0]), table.firstChild);
  // Ajout de l'entete
  table.insertBefore(creerEntete(window.courant[0], document.title), table.firstChild);
	ajusterTitre();
  preparerImpression();
}
function composerTableau(tbody) {
  if (tbody.attributes.getNamedItem("taille")) {
    var taille = tbody.attributes.getNamedItem("taille").value;
    tbody.style.fontSize = taille;
  }
  var table = document.createElement("table");
  table.className = "qe";
  // Ajout de l'entete
  table.appendChild(creerEntete(tbody, document.title));
  // Ajout du pied
  table.appendChild(creerPied(tbody));
  table.appendChild(tbody.cloneNode(true));
  return table;
}
function preparerImpression() {
  var div = document.getElementById("printdiv");
  if (div) {
	div.parentNode.removeChild(div);
  }
  var div = document.body.appendChild(document.createElement("div"));
  div.id = "printdiv";
  for (var i=0; i<4; i++) {
    if (i==3 && window.courant.length == 3) continue;
		var table = composerTableau(window.courant[i%window.courant.length]);
    div.appendChild(table).className += " print";
  }
}
function imprimer() {
  preparerImpression();
  window.print();
}
function gererSolutions() {
	var ss = document.getElementsByTagName("solution");
	while (ss.length) {
		var s = ss[0];
		var divs = creerSolution(s);
		//s.parentNode.insertBefore(divs, s);
		//s.parentNode.removeChild(s);
		s.parentNode.replaceChild(divs, s);
	}
	return;
}
function creerSolution(s) {
	var pre = attr(s, "pre", "- ");
	if (pre == "") pre = "\u00a0";
	var post = attr(s, "post");
	var hauteur = attr(s, "hauteur");
	var largeur = attr(s, "largeur", 1);
	var div = document.createElement("div");
	if (attr(s, "cacher", "false") == "true") {
		div.style.display="none";
	}
	if (hauteur!="") div.style.lineHeight = hauteur * 1.2;
	if (largeur!=1) {
    div.style.cssFloat = "left";
    div.style.width = 100/largeur + "%";
  }
	//div.style.border = "1px solid black";
	var span = div.appendChild(document.createElement("span"));
	span.appendChild(document.createTextNode(pre));
	var span = div.appendChild(document.createElement("span"));
	span.className = "solution";
	span.val = parseInt(attr(s, "val", "1"));
	//span.appendChild(document.createTextNode(s.innerHTML));
	span.innerHTML = s.innerHTML;
	var span = div.appendChild(document.createElement("span"));
	span.style.cssFloat = "right";
	span.appendChild(document.createTextNode(post));
	return div;
}
function attr(element, nom, defaut) {
	defaut = defaut || "";
	var a = element.attributes.getNamedItem(nom);
	if (a) {
		a = a.value;
	}else{
		a = defaut;
	}
	return a;
}
function composerLayout() {
}
function ajusterTitre(titre) {
	/*titre = titre || document.body.title + " " + window.courant[0].title;
	var th = document.getElementById("titreFormulaire");
	th.innerHTML = titre;
	document.title = titre;*/
}
function creerEntete(tbody, titre){
  titre = titre || "Questions express";
  var thead = document.createElement("thead");
  var tr = thead.appendChild(document.createElement("tr"));
  th = tr.appendChild(document.createElement("th"));
  th.className = "titre";
  th.colSpan = 2;
  th.innerHTML = titre;
  var tr = thead.appendChild(creerIdentification(tbody));
  return thead;
}
function creerIdentification(tbody){
  var sur = "/"+calculerValeur(tbody);
  var tfoot = document.createElement("tfoot");
  var tr = tfoot.appendChild(document.createElement("tr"));
  tr.className = "identification";
  var td = tr.appendChild(document.createElement("td"));
  td.innerHTML = "Nom:";
  td = tr.appendChild(document.createElement("td"));
  td.className = "reponse";
  td.innerHTML = "Total: <span>"+sur+"</span>";
  if (tbody.attributes.getNamedItem("colonne")) {
    var taille = tbody.attributes.getNamedItem("colonne").value;
    td.style.width = taille;
  }
  return tr;
}
function calculerValeur(tbody){
  var sols = tbody.getElementsByTagName("SPAN");
  var resultat = 0;
  for (var i=0; i<sols.length; i++) {
    var sol = sols[i];
    if (sol.className == "solution") {
			var val = sol.val;
			while (sol.tagName != "TR") {
        sol = sol.parentNode;
      }
      if (sol.className != "cacher" && sol.className != "bonus") resultat+=val;
    }
  }
  return resultat;
}
function creerPied(tbody){
  if (tbody) {
    if (tbody.title) {  // il s'agit d'un tbody
      var titre = document.body.title + " " + tbody.title;
    }else{
      var titre = tbody;
    }
  }else{
    var titre = "";
  }
  var tfoot = document.createElement("tfoot");
  tr = tfoot.appendChild(document.createElement("tr"));
  var th = tr.appendChild(document.createElement("th"));
  th.id = "titreFormulaire";
  th.className = "pied";
  th.colSpan = 2;
  th.innerHTML = titre;
  return tfoot;
}
function validerHauteur(tableau){
	while (tableau.nodeType != 1) tableau = tableau.nextSibling;
	if (tableau.offsetHeight > 523) tableau.style.backgroundColor="pink";
	else tableau.style.backgroundColor="";
	return;
}
function trouverSS(regle){
	var ss = document.getElementById("ss");
	var ss = ss.sheet;
	var ss = ss.cssRules;
  //alert(document.styleSheets[0]);
  //var ss = document.styleSheets[0].cssRules;
	for (var i=0; i<ss.length; i++){
		if (ss[i].selectorText == regle){
			return ss[i].style;
		}
	}
	return;
}
function augmenter(){
	var val = parseFloat(this.objet.value) || 12;
	this.objet.value = val+1;
  this.objet.appliquer()
}
function reduire(){
	var val = parseFloat(this.objet.value) || 12;
	this.objet.value = val-1;
  this.objet.appliquer()
}
function elargir(){
	var val = parseFloat(this.objet.value) || 9;
	this.objet.value = val+1;
  this.objet.appliquer()
}
function retrecir(){
	var val = parseFloat(this.objet.value) || 9;
	this.objet.value = val-1;
  this.objet.appliquer()
}
function toggleAfficherReponses(){
	if (this.ss == undefined){
		//this.ss=trouverSS('td.reponse *, span.solution');	//XXX
		this.ss=trouverSS('span.solution');
	}
	if (this.checked){
		this.ss.display = "";
	}else{
		this.ss.display = "none";
	}
	return;
}
function ajouterSS(){
	var head = document.getElementsByTagName("head");
	head = head[0];
	var l = document.createElement('link');
	l.id = "ss";
  l.rel = "stylesheet";
	l.href = "qe/qe.css"
	l.type = "text/css";
	head.appendChild(l);
}
function evtChangerTbody(e){
	for (var i=0; i<window.courant.length; i++) {
    window.courant[i].style.display = "none";
  }
  window.courant = [];
	var opt = this.firstElementChild;
  while (opt) {
    if (opt.selected) {
      window.courant.push(opt.objet);
      opt.objet.style.display = "";
    }
    opt = opt.nextElementSibling;
  }
	ajusterTitre();
  preparerImpression();
}
function evtChgTaille(e) {
  var taille = parseFloat(this.value) || 12;
  if (this.value != taille+"") this.value = taille;
  this.ss.fontSize = taille+"px";
}
function evtChgLargeur(e) {
  var taille = parseFloat(this.value) || 9;
  if (this.value != taille+"") this.value = taille;
  this.ss.width = taille+"em";
}
function evtClicTr(e) {
  if (this.className == "cacher") {
    this.className = "";
  }else{
    this.className = "cacher";
  }
  preparerImpression();
}
// Fonctions se rapportant aux controles
function creerControles(){
	var div = document.createElement('div');
	div.className = "controles";
	var h1 = div.appendChild(document.createElement('h1'));	// Le titre
	h1.appendChild(document.createTextNode('Controles'));
	div.appendChild(ctrlLargeurColonne(9));	// La largeur de la colonne
	div.appendChild(ctrlTailleTexte(12));	// La taille du texte
	div.appendChild(ctrlAfficherSolutions());	// Affichage des réponses
	div.appendChild(ctrlTbody());	// Affichage des réponses
	//div.appendChild(ctrlBtnImprimer());	// Impression
	return div;
}
function ctrlLargeurColonne(val) {
	val = val || 9;
	var div = document.createElement('div');
	div.style.textAlign="right";
	// Le texte
	var label = div.appendChild(document.createElement('label'));
	label.htmlFor = "largeurcolonne";
	label.appendChild(document.createTextNode('Largeur de la colonne de réponses : '));
	// Le champ
	var input = div.appendChild(document.createElement('input'));
	input.type = "text";
	input.id = "largeurcolonne";
	input.size = 2;
	input.value = val;
	input.style.textAlign = "right";
  input.onchange = input.appliquer = evtChgLargeur;
  input.ss=trouverSS('td.reponse');
	div.appendChild(document.createTextNode('em '));
	// Le bouton hausser
	var img = div.appendChild(document.createElement('img'));
	img.src = "qe/hausser.png";
	img.alt = "Élargir";
  img.objet = input;
	img.onclick = elargir;
	// Le bouton baisser
	var img = div.appendChild(document.createElement('img'));
	img.src = "qe/baisser.png";
	img.alt = "Rétrécir";
  img.objet = input;
	img.onclick = retrecir;
	return div;
}
function ctrlTailleTexte(val) {
	val = val || 14;
	var div = document.createElement('div');
	div.style.textAlign="right";
	// Le texte
	var label = div.appendChild(document.createElement('label'));
	label.htmlFor = "taillefonte";
	label.appendChild(document.createTextNode('Taille du texte : '));
	// Le champ de texte
	var input = div.appendChild(document.createElement('input'));
	input.type = "text";
	input.id = 	label.htmlFor;
	input.size = 2;
	input.value = val;
	input.style.textAlign = "right";
  input.onchange = input.appliquer = evtChgTaille;
  input.ss=trouverSS('table.qe');
	div.appendChild(document.createTextNode('px '));
	// Le bouton hausser
	var img = div.appendChild(document.createElement('img'));
	img.src = "qe/hausser.png";
	img.alt = "Augmenter";
  img.objet = input;
	img.onclick = augmenter;
	// Le bouton baisser
	img = div.appendChild(document.createElement('img'));
	img.src = "qe/baisser.png";
	img.alt = "Réduire";
  img.objet = input;
	img.onclick = reduire;
	return div;
}
function ctrlAfficherSolutions(val) {
	val = val || true;
	var div = document.createElement('div');
	div.style.textAlign="right";
	var label = div.appendChild(document.createElement('label'));
	label.htmlFor = "afficherreponses";
	label.appendChild(document.createTextNode('Afficher les réponses : '));
	// Le champ de texte
	var input = div.appendChild(document.createElement('input'));
	input.type = "checkbox";
	input.id = input.value = label.htmlFor;
	input.checked = val;
	input.onchange = toggleAfficherReponses;
	return div;
}
function ctrlTbody(val) {
	val = val || "";
	var div = document.createElement('div');
	div.style.textAlign="right";
	var label = div.appendChild(document.createElement('label'));
	label.htmlFor = "choixformulaire";
	label.appendChild(document.createTextNode('Formulaire : '));
	// Le champ de texte
	var select = div.appendChild(document.createElement('select'));
	select.id = label.htmlFor;
  select.size = "10";
  select.multiple = "multiple";
	select.onchange = evtChangerTbody;
	var tbs = document.getElementsByTagName("TBODY");
	for (var i=0; i<tbs.length; i++) {
		var tbody = tbs[i]
		if (tbody.className.substr(0,7) != "inactif") {
			var option = select.appendChild(document.createElement('option'));
			var courant = option;
			option.objet = tbody;
			option.text = option.value = tbody.title + " ["+calculerValeur(tbody)+"]";
		}
	}
	if (courant) courant.selected = true;
	option.onchange = null;
	return div;
}
function ctrlBtnImprimer() {
	var div = document.createElement('div');
	div.className="bouton";
  div.innerHTML = "Imprimer";
	div.onclick = imprimer;
	return div;

}
