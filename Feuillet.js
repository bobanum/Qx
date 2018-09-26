/*jslint esnext:true, browser:true*/
/*global App*/
class Feuillet {
	constructor(domaine) {
		this.domaine = domaine;
		this.domaine.obj = this;
		this.questions = [];
		this.prendreQuestions();
	}
	get actif() {
		return this.domaine.classList.contains("actif");
	}
	set actif(val) {
		if (val) {
			this.domaine.classList.add("actif");
		} else {
			this.domaine.classList.remove("actif");
		}
	}
	get titre() {
		return this.domaine.getAttribute("title");
	}
	set titre(val) {
		this.domaine.setAttribute("title", val);
	}
	get valeur() {
		return this.calculerValeur();
	}
	prendreQuestions() {
		var questions = this.domaine.querySelectorAll("div.question");
		questions.forEach(function (question) {
			this.questions.push(new App.Question(question));
		}, this);
	}
	composerTableau() {
		var feuillet = this.domaine;
		//		return "a refaire";
		if (feuillet.attributes.getNamedItem("taille")) {
			var taille = feuillet.attributes.getNamedItem("taille").value;
			feuillet.style.fontSize = taille;
		}
		var resultat = document.createElement("table");
		resultat.className = "qx";
		// Ajout de l'entete
		//		resultat.appendChild(this.creerEntete(feuillet, document.title));
		// Ajout du pied
		//		resultat.appendChild(this.creerPied(feuillet));
		this.formater();
		resultat.appendChild(feuillet.cloneNode(true));
		return resultat;
	}

	formater() {
		//		debugger;
		this.domaine.appendChild(this.creerEntete());
		this.domaine.appendChild(this.creerPied());
		return this.domaine;
	}

	creerEntete() {
		var header = document.createElement("header");
		var h1 = header.appendChild(document.createElement("h1"));
		h1.className = "titre";
		h1.innerHTML = App.Qx.titre;
		header.appendChild(this.creerIdentification());
		return header;
	}

	creerIdentification() {
		var sur = "/" + this.calculerValeur(this.domaine);
		var footer = document.createElement("footer");
		var div = footer.appendChild(document.createElement("div"));
		div.className = "identification";
		// Le nom
		var span = div.appendChild(document.createElement("span"));
		span.setAttribute("data-label", "Nom");
		// Le total
		span = div.appendChild(document.createElement("span"));
		span.className = "total";
		span.setAttribute("data-label", "Total");
		span.innerHTML = "<span>" + sur + "</span>";
		if (this.domaine.attributes.getNamedItem("colonne")) {
			var taille = this.domaine.attributes.getNamedItem("colonne").value;
			span.style.width = taille;
		}
		return div;
	}

	calculerValeur() {
		var resultat = 0;

		this.questions.forEach(function (question) {
			if (question.actif && !question.bonus) {
				resultat += question.valeur;
			}
		});
		return resultat;
	}

	creerPied() {
		var titre;
		if (this.domaine.title) { // il s'agit d'un feuillet
			titre = document.body.title + " " + this.domaine.title;
		} else {
			titre = this.domaine;
		}
		var footer, div;
		footer = document.createElement("footer");
		div = footer.appendChild(document.createElement("div"));
		var span = div.appendChild(document.createElement("span"));
		span.innerHTML = titre;
		return footer;
	}

	static init() {
		App[this.name] = this;
		this.evt = {
		};
	}
}
Feuillet.init();
