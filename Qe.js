/*jslint esnext:true, browser:true*/
class Qe {
	static composerTableau(tbody) {
		if (tbody.attributes.getNamedItem("taille")) {
			var taille = tbody.attributes.getNamedItem("taille").value;
			tbody.style.fontSize = taille;
		}
		var table = document.createElement("table");
		table.className = "qe";
		// Ajout de l'entete
		table.appendChild(this.creerEntete(tbody, document.title));
		// Ajout du pied
		table.appendChild(this.creerPied(tbody));
		table.appendChild(tbody.cloneNode(true));
		return table;
	}

	static preparerImpression() {
		var div = document.getElementById("printdiv");
		if (div) {
			div.parentNode.removeChild(div);
		}
		div = document.body.appendChild(document.createElement("div"));
		div.id = "printdiv";
		for (var i = 0; i < 4; i++) {
			if (i === 3 && window.courant.length === 3) {
				continue;
			}
			var table = this.composerTableau(window.courant[i % window.courant.length]);
			div.appendChild(table).className += " print";
		}
	}

	static imprimer() {
		this.preparerImpression();
		window.print();
	}

	static gererSolutions() {
		var ss = document.getElementsByTagName("solution");
		while (ss.length) {
			var s = ss[0];
			var divs = this.creerSolution(s);
			//s.parentNode.insertBefore(divs, s);
			//s.parentNode.removeChild(s);
			s.parentNode.replaceChild(divs, s);
		}
		return;
	}

	static creerSolution(s) {
		var pre = this.attr(s, "pre", "- ");
		if (pre === "") {
			pre = "\u00a0";
		}
		var post = this.attr(s, "post");
		var hauteur = this.attr(s, "hauteur");
		var largeur = this.attr(s, "largeur", 1);
		var div = document.createElement("div");
		if (this.attr(s, "cacher", "false") === "true") {
			div.style.display = "none";
		}
		if (hauteur !== "") {
			div.style.lineHeight = hauteur * 1.2;
		}
		if (largeur !== 1) {
			div.style.cssFloat = "left";
			div.style.width = 100 / largeur + "%";
		}
		//div.style.border = "1px solid black";
		var span = div.appendChild(document.createElement("span"));
		span.appendChild(document.createTextNode(pre));
		span = div.appendChild(document.createElement("span"));
		span.className = "solution";
		span.val = parseInt(this.attr(s, "val", "1"));
		//span.appendChild(document.createTextNode(s.innerHTML));
		span.innerHTML = s.innerHTML;
		span = div.appendChild(document.createElement("span"));
		span.style.cssFloat = "right";
		span.appendChild(document.createTextNode(post));
		return div;
	}

	static attr(element, nom, defaut) {
		defaut = defaut || "";
		var a = element.attributes.getNamedItem(nom);
		if (a) {
			a = a.value;
		} else {
			a = defaut;
		}
		return a;
	}

	static ajusterTitre(titre) {
		titre = titre || document.body.title + " " + window.courant[0].title;
		var th = document.getElementById("titreFormulaire");
		th.innerHTML = titre;
		document.title = titre;
	}

	static creerEntete(tbody, titre) {
		titre = titre || "Questions express";
		var thead = document.createElement("thead");
		var tr = thead.appendChild(document.createElement("tr"));
		var th = tr.appendChild(document.createElement("th"));
		th.className = "titre";
		th.colSpan = 2;
		th.innerHTML = titre;
		tr = thead.appendChild(this.creerIdentification(tbody));
		return thead;
	}

	static creerIdentification(tbody) {
		var sur = "/" + this.calculerValeur(tbody);
		var tfoot = document.createElement("tfoot");
		var tr = tfoot.appendChild(document.createElement("tr"));
		tr.className = "identification";
		var td = tr.appendChild(document.createElement("td"));
		td.innerHTML = "Nom:";
		td = tr.appendChild(document.createElement("td"));
		td.className = "reponse";
		td.innerHTML = "Total: <span>" + sur + "</span>";
		if (tbody.attributes.getNamedItem("colonne")) {
			var taille = tbody.attributes.getNamedItem("colonne").value;
			td.style.width = taille;
		}
		return tr;
	}

	static calculerValeur(tbody) {
		var sols = tbody.getElementsByTagName("SPAN");
		var resultat = 0;
		for (var i = 0; i < sols.length; i++) {
			var sol = sols[i];
			if (sol.className === "solution") {
				var val = sol.val;
				while (sol.tagName !== "TR") {
					sol = sol.parentNode;
				}
				if (sol.className !== "cacher" && sol.className !== "bonus") {
					resultat += val;
				}
			}
		}
		return resultat;
	}

	static creerPied(tbody) {
		var titre;
		if (tbody) {
			if (tbody.title) { // il s'agit d'un tbody
				titre = document.body.title + " " + tbody.title;
			} else {
				titre = tbody;
			}
		} else {
			titre = "";
		}
		var tfoot, tr;
		tfoot = document.createElement("tfoot");
		tr = tfoot.appendChild(document.createElement("tr"));
		var th = tr.appendChild(document.createElement("th"));
		th.id = "titreFormulaire";
		th.className = "pied";
		th.colSpan = 2;
		th.innerHTML = titre;
		return tfoot;
	}

	static validerHauteur(tableau) {
		while (tableau.nodeType !== 1) {
			tableau = tableau.nextSibling;
		}
		if (tableau.offsetHeight > 523) {
			tableau.style.backgroundColor = "pink";
		}
		else {
			tableau.style.backgroundColor = "";
		}
		return;
	}

	static trouverSS(regle) {
		var ss = document.getElementById("ss");
		ss = ss.sheet;
		ss = ss.cssRules;
		//alert(document.styleSheets[0]);
		//ss = document.styleSheets[0].cssRules;
		for (var i = 0; i < ss.length; i++) {
			if (ss[i].selectorText === regle) {
				return ss[i].style;
			}
		}
		return;
	}

	static augmenter() {
		var val = parseFloat(this.objet.value) || 12;
		this.objet.value = val + 1;
		this.objet.appliquer();
	}

	static reduire() {
		var val = parseFloat(this.objet.value) || 12;
		this.objet.value = val - 1;
		this.objet.appliquer();
	}

	static elargir() {
		var val = parseFloat(this.objet.value) || 9;
		this.objet.value = val + 1;
		this.objet.appliquer();
	}

	static retrecir() {
		var val = parseFloat(this.objet.value) || 9;
		this.objet.value = val - 1;
		this.objet.appliquer();
	}

	static toggleAfficherReponses() {
		if (this.ss === undefined) {
			//this.ss=this.trouverSS('td.reponse *, span.solution');	//XXX
			this.ss = this.trouverSS('span.solution');
		}
		if (this.checked) {
			this.ss.display = "";
		} else {
			this.ss.display = "none";
		}
		return;
	}

	static ajouterSS() {
		var head = document.getElementsByTagName("head");
		head = head[0];
		var l = document.createElement('link');
		l.id = "ss";
		l.rel = "stylesheet";
		l.href = "images/qe.css";
		l.type = "text/css";
		head.appendChild(l);
	}

	static evtChangerTbody() {
		for (var i = 0; i < window.courant.length; i++) {
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
//		this.ajusterTitre();
		this.preparerImpression();
	}

	static evtChgTaille() {
		var taille = parseFloat(this.value) || 12;
		if (this.value !== taille + "") {
			this.value = taille;
		}
		this.ss.fontSize = taille + "px";
	}

	static evtChgLargeur() {
		var taille = parseFloat(this.value) || 9;
		if (this.value !== taille + "") {
			this.value = taille;
		}
		this.ss.width = taille + "em";
	}

	static evtClicTr() {
		if (this.className === "cacher") {
			this.className = "";
		} else {
			this.className = "cacher";
		}
		this.preparerImpression();
	}
	// Fonctions se rapportant aux controles
	static creerControles() {
		var div = document.createElement('div');
		div.className = "controles";
		var h1 = div.appendChild(document.createElement('h1')); // Le titre
		h1.appendChild(document.createTextNode('Controles'));
		div.appendChild(this.ctrlLargeurColonne(9)); // La largeur de la colonne
		div.appendChild(this.ctrlTailleTexte(12)); // La taille du texte
		div.appendChild(this.ctrlAfficherSolutions()); // Affichage des réponses
		div.appendChild(this.ctrlTbody()); // Affichage des réponses
		//div.appendChild(ctrlBtnImprimer());	// Impression
		return div;
	}

	static ctrlLargeurColonne(val) {
		val = val || 9;
		var div = document.createElement('div');
		div.style.textAlign = "right";
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
		input.onchange = input.appliquer = this.evtChgLargeur;
		input.ss = this.trouverSS('td.reponse');
		div.appendChild(document.createTextNode('em '));
		// Le bouton hausser
		var img = div.appendChild(document.createElement('img'));
		img.src = "images/hausser.png";
		img.alt = "Élargir";
		img.objet = input;
		img.onclick = this.elargir;
		// Le bouton baisser
		img = div.appendChild(document.createElement('img'));
		img.src = "images/baisser.png";
		img.alt = "Rétrécir";
		img.objet = input;
		img.onclick = this.retrecir;
		return div;
	}

	static ctrlTailleTexte(val) {
		val = val || 14;
		var div = document.createElement('div');
		div.style.textAlign = "right";
		// Le texte
		var label = div.appendChild(document.createElement('label'));
		label.htmlFor = "taillefonte";
		label.appendChild(document.createTextNode('Taille du texte : '));
		// Le champ de texte
		var input = div.appendChild(document.createElement('input'));
		input.type = "text";
		input.id = label.htmlFor;
		input.size = 2;
		input.value = val;
		input.style.textAlign = "right";
		input.onchange = input.appliquer = this.evtChgTaille;
		input.ss = this.trouverSS('table.qe');
		div.appendChild(document.createTextNode('px '));
		// Le bouton hausser
		var img = div.appendChild(document.createElement('img'));
		img.src = "images/hausser.png";
		img.alt = "Augmenter";
		img.objet = input;
		img.onclick = this.augmenter;
		// Le bouton baisser
		img = div.appendChild(document.createElement('img'));
		img.src = "images/baisser.png";
		img.alt = "Réduire";
		img.objet = input;
		img.onclick = this.reduire;
		return div;
	}

	static ctrlAfficherSolutions(val) {
		val = val || true;
		var div = document.createElement('div');
		div.style.textAlign = "right";
		var label = div.appendChild(document.createElement('label'));
		label.htmlFor = "afficherreponses";
		label.appendChild(document.createTextNode('Afficher les réponses : '));
		// Le champ de texte
		var input = div.appendChild(document.createElement('input'));
		input.type = "checkbox";
		input.id = input.value = label.htmlFor;
		input.checked = val;
		input.onchange = this.toggleAfficherReponses;
		return div;
	}

	static ctrlTbody(val) {
		val = val || "";
		var div = document.createElement('div');
		div.style.textAlign = "right";
		var label = div.appendChild(document.createElement('label'));
		label.htmlFor = "choixformulaire";
		label.appendChild(document.createTextNode('Formulaire : '));
		// Le champ de texte
		var select = div.appendChild(document.createElement('select'));
		select.id = label.htmlFor;
		select.size = "10";
		select.multiple = "multiple";
		select.onchange = this.evtChangerTbody;
		var tbs = document.getElementsByTagName("TBODY");
		var option, courant;
		for (var i = 0; i < tbs.length; i++) {
			var tbody = tbs[i];
			if (tbody.className.substr(0, 7) !== "inactif") {
				option = select.appendChild(document.createElement('option'));
				courant = option;
				option.objet = tbody;
				option.text = option.value = tbody.title + " [" + this.calculerValeur(tbody) + "]";
			}
		}
		if (courant) {
			courant.selected = true;
		}
		option.onchange = null;
		return div;
	}

	static ctrlBtnImprimer() {
		var div = document.createElement('div');
		div.className = "bouton";
		div.innerHTML = "Imprimer";
		div.onclick = this.imprimer;
		return div;

	}
	static load() {
		//ajouterSS();
		// Trouver les tbody qui sont utilisables
		var tbs = document.getElementsByTagName("TBODY");
		for (var i = 0; i < tbs.length; i++) {
			var tbody = tbs[i];
			var c = tbody.className.substr(0, 7);
			tbody.style.display = "none";

			if (c !== "inactif") {
				window.courant = [tbody];
			}
			// On ajoute un evenement pour masquer
			var trs = tbody.getElementsByTagName("TR");
			for (var j = 0; j < trs.length; j++) {
				trs[j].addEventListener('mousedown', this.evtClicTr, true);
			}
		}
		if (window.courant) {
			window.courant[0].style.display = "";
		}
		this.gererSolutions();
		document.body.insertBefore(this.creerControles(), document.body.firstChild);
		var table = document.getElementById("qe");
		table.className = "qe";
		// Ajout du pied
		table.insertBefore(this.creerPied(window.courant[0]), table.firstChild);
		// Ajout de l'entete
		table.insertBefore(this.creerEntete(window.courant[0], document.title), table.firstChild);
	//	this.ajusterTitre();
		this.preparerImpression();
	}
	static init() {
		window.onload = function () {
			Qe.load();
		};
	}
}
Qe.init();
