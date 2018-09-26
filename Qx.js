/*jslint esnext:true, browser:true*/
/*global App*/
class Qx {
	static preparerImpression() {
		var div = document.getElementById("printdiv");
		if (div) {
			div.parentNode.removeChild(div);
		}
		div = document.body.appendChild(document.createElement("div"));
		div.id = "printdiv";
		for (var i = 0; i < 4; i++) {
			if (i === 3 && Qx.courant.length === 3) {
				continue;
			}
			var table = this.composerTableau(Qx.courant[i % Qx.courant.length]);
			div.appendChild(table);
			table.classList.add("print");
		}
	}

	static set solutionsVisibles(val) {
		this.regles.solution.display = (val) ? "" : "none";
	}
	static get solutionsVisibles() {
		return this.regles.solution.display !== "none";
	}
	static imprimer() {
		this.preparerImpression();
		window.print();
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
		titre = titre || document.body.title + " " + Qx.courant[0].title;
		var th = document.getElementById("titreFeuillet");
		th.innerHTML = titre;
		document.title = titre;
	}

	static validerHauteur(tableau) {
		while (tableau.nodeType !== 1) {
			tableau = tableau.nextSibling;
		}
		if (tableau.offsetHeight > 523) {
			tableau.style.backgroundColor = "pink";
		} else {
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

	static changeAfficherSolutions() {
		this.obj.solutionsVisibles = this.checked;
	}

	// Fonctions se rapportant aux controles
	static creerControles() {
		var div = document.createElement('div');
		div.setAttribute("id", "controles");
		var h1 = div.appendChild(document.createElement('h1')); // Le titre
		h1.innerHTML = 'Controles';
		div.appendChild(this.ctrlLargeurColonne(this.largeur)); // La largeur de la colonne
		div.appendChild(this.ctrlTailleTexte(this.taille)); // La taille du texte
		div.appendChild(this.ctrlAfficherSolutions()); // Affichage des réponses
		div.appendChild(this.ctrlFeuillets()); // Affichage des réponses
		//div.appendChild(ctrlBtnImprimer());	// Impression
		return div;
	}

	static dom_label(texte, id) {
		var resultat = document.createElement('label');
		resultat.innerHTML = texte;
		if (id) {
			resultat.setAttribute("for", id);
		}
		return resultat;
	}

	static html_number(id, val, evt) {
		var resultat = document.createElement('input');
		resultat.setAttribute("type", "number");
		resultat.setAttribute("id", id);
		resultat.setAttribute("size", 2);
		resultat.setAttribute("value", val);
		resultat.addEventListener("change", evt);
		return resultat;
	}

	static html_select(id, elements, evt) {
		var resultat = document.createElement('select');
		resultat.id = id;
		resultat.size = "10";
		resultat.multiple = "multiple";
		resultat.addEventListener("change", evt);
		this.feuillets.forEach(function (feuillet) {
			var texte = feuillet.titre + " [" + feuillet.valeur + "]";
			var option = resultat.appendChild(document.createElement('option'));
			option.objet = feuillet;

			option.innerHTML = texte;
			option.setAttribute("value", texte);
		});
//		elements.forEach(function (e) {
//			if (!e.classList.contains("inactif")) {
//				var texte = e.title + " [" + e.obj.calculerValeur() + "]";
//				var option = resultat.appendChild(document.createElement('option'));
//				option.objet = e;
//
//				option.innerHTML = texte;
//				option.setAttribute("value", texte);
//			}
//
//		}, this);
		return resultat;
	}

	static ctrlLargeurColonne(val) {
		val = val || 30;
		var id = "largeurcolonne";
		var resultat = document.createElement('div');
		resultat.setAttribute("id", "champ_" + id);
		// Le texte
		resultat.appendChild(this.dom_label("Largeur des réponses", id));
		// Le champ
		var input = resultat.appendChild(this.html_number(id, val, this.evt.largeur.change));
		input.setAttribute("step", "1");
		var span = resultat.appendChild(document.createElement('span'));
		span.innerHTML = this.largeur_unite;
		return resultat;
	}

	static ctrlTailleTexte(val) {
		val = val || 14;
		var id = "taillefonte";
		var resultat = document.createElement('div');
		resultat.setAttribute("id", "champ_" + id);
		// Le texte
		resultat.appendChild(this.dom_label("Taille du texte", id));

		// Le champ de texte
		var input = resultat.appendChild(this.html_number(id, val, this.evt.taille.change));
		input.setAttribute("step", ".5");
		var span = resultat.appendChild(document.createElement('span'));
		span.innerHTML = this.taille_unite;
		return resultat;
	}

	static ctrlAfficherSolutions(val = true) {
		var name = "afficherreponses";
		var resultat = document.createElement('div');
		resultat.setAttribute("id", "champ_" + name);
		resultat.appendChild(this.dom_label("Afficher les réponses", name + "_true"));
		// Le champ de texte
		resultat.appendChild(this.dom_checkbox(name, "true", val, this.evt.afficherSolutions.change));
		return resultat;
	}

	static dom_checkbox(name, value, checked, change) {
		var resultat = document.createElement('input');
		resultat.setAttribute("type", "checkbox");
		resultat.setAttribute("name", name);
		resultat.setAttribute("id", name + "_" + value);
		resultat.setAttribute("value", value);
		resultat.setAttribute("type", "checkbox");
		resultat.checked = checked;
		resultat.addEventListener("change", change);
		resultat.obj = this;
		return resultat;
	}

	static ctrlFeuillets(val) {
		val = val || "";
		var id = "choixfeuillet";
		var resultat = document.createElement('div');
		resultat.setAttribute("id", "champ_" + id);
		resultat.appendChild(this.dom_label("Feuillet", id));
		// Le champ de texte
		var feuillets = document.querySelectorAll("*.feuillet");
		var select = resultat.appendChild(this.html_select(id, feuillets, this.evt.feuillet.change));
		select.setAttribute("size", feuillets.length);
		return resultat;
	}

	static ctrlBtnImprimer() {
		var div = document.createElement('div');
		div.className = "bouton";
		div.innerHTML = "Imprimer";
		div.onclick = this.imprimer;
		return div;

	}
	static get taille() {
		return this._taille;
	}
	static set taille(taille) {
		this._taille = parseFloat(taille) || 10;
		this.regles.feuille.fontSize = this._taille + this.taille_unite;
		return taille;
	}
	static get largeur() {
		return this._largeur;
	}
	static set largeur(largeur) {
		this._largeur = parseFloat(largeur) || 30;
		this.regles.reponse.flex = "0 0 " + this._largeur + this.largeur_unite;
		return largeur;
	}
	static ajouterStyle() {
		var resultat = document.head.appendChild(document.createElement("style"));
		resultat.innerHTML = "span.solution{}div.reponse{}div.feuillet{}";
		var regles = resultat.sheet.cssRules;
		this.regles = {
			solution: regles[0].style,
			reponse: regles[1].style,
			feuille: regles[2].style,
		};
	}
	static load() {
		this.ajouterStyle();
		this.titre = document.body.title;
		// Trouver les feuillet qui sont utilisables
		var feuillets = document.querySelectorAll("*.feuillet");
		feuillets.forEach(function (f) {
			var feuillet = new App.Feuillet(f);
			this.feuillets.push(feuillet);
			feuillet.formater();

			if (feuillet.actif) {
				Qx.courant = [feuillet];
			}
		}, this);
		document.body.insertBefore(this.creerControles(), document.body.firstChild);
		//		var table = document.getElementById("qx");
		//		table.className = "qx";
		// Ajout du pied
		//		table.insertBefore(this.creerPied(Qx.courant[0]), table.firstChild);
		// Ajout de l'entete
		//		table.insertBefore(this.creerEntete(Qx.courant[0], document.title), table.firstChild);
		//	this.ajusterTitre();
		//		this.preparerImpression();
		return Promise.resolve();
	}
	static init() {
		App[this.name] = this;
		this.taille_unite = "pt";
		this.largeur_unite = "%";
		this.courant = [];
		this.feuillets = [];
		this._taille = 10;
		this._largeur = 30;
		this.evt = {
			afficherSolutions: {
				change: function (e) {
					e.target.obj.solutionsVisibles = e.target.checked;
				}
			},
			feuillet: {
				change: function () {
					//					this.obj.changerTaille();
					Qx.courant.forEach(feuillet => {
						feuillet.courant = false;
					});
					Qx.courant = Array.from(this.children);
					Qx.courant = Qx.courant.filter(opt => opt.selected);
					Qx.courant = Qx.courant.map(opt => opt.objet);
					Qx.courant.forEach(feuillet => {
						feuillet.courant = true;
					});
					//		this.ajusterTitre();
					Qx.preparerImpression();
				}
			},
			taille: {
				change: function () {
					Qx.taille = this.value;
					if (this.value !== Qx.taille + "") {
						this.value = Qx.taille;
					}
				}
			},
			largeur: {
				change: function () {
					Qx.largeur = this.value;
					if (this.value !== Qx.largeur + "") {
						this.value = Qx.largeur;
					}
				}
			}

		};
	}
}
Qx.init();
