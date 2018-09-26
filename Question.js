/*jslint esnext:true, browser:true*/
/*global App */
class Question {
	constructor(domaine) {
		this.domaine = domaine;
		this.domaine.obj = this;
		this.init();
	}
	init() {
		this.domaine.addEventListener('mousedown', Question.evt.question.click);
		this.gererSolutions();
	}
	get actif() {
		return !this.domaine.classList.contains("cacher");
	}
	set actif(val) {
		if (val) {
			this.domaine.classList.remove("cacher");
		} else {
			this.domaine.classList.add("cacher");
		}
	}
	get bonus() {
		return !this.domaine.classList.contains("bonus");
	}
	set bonus(val) {
		if (val) {
			this.domaine.classList.remove("bonus");
		} else {
			this.domaine.classList.add("bonus");
		}
	}
	gererSolutions() {
		var solutions = this.domaine.querySelectorAll("solution, *.solution");
		solutions = [].slice.call(solutions, 0);
		solutions.forEach(function (solution) {
			var divs = this.creerSolution(solution);
			solution.parentNode.replaceChild(divs, solution);
		}, this);
		return;
	}
	calculerValeur() {
		var resultat = 0;
		if (!this.actif || this.bonus) {
			return resultat;
		}

		var solutions = this.domaine.querySelectorAll("span.solution");
		solutions.forEach(function (solution) {
			resultat += solution.val;
		}, this);
		return resultat;
	}
	creerSolution(solution) {
		var pre = solution.getAttribute("pre") || "-";
		if (pre === "") {
			pre = "\u00a0";
		}
		var post = solution.getAttribute("post") || "";
		var hauteur = solution.getAttribute("hauteur") || "";
		var largeur = solution.getAttribute("largeur") || 1;
		var div = document.createElement("div");
		if (solution.getAttribute("cacher") && solution.getAttribute("cacher") === "true") {
			div.style.display = "none";
		}
		if (hauteur !== "") {
			div.style.lineHeight = hauteur * 1.2;
		}
		if (largeur !== 1) {
			div.style.cssFloat = "left";
			div.style.width = 100 / largeur + "%";
		}
		var span = div.appendChild(document.createElement("span"));
		span.appendChild(document.createTextNode(pre));
		span = div.appendChild(document.createElement("span"));
		span.className = "solution";
		span.val = parseInt(solution.getAttribute("val")) || "1";
		span.innerHTML = solution.innerHTML;
		if (post) {
			span = div.appendChild(document.createElement("span"));
			span.style.cssFloat = "right";
			span.appendChild(document.createTextNode(post));
		}
		return div;
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

	static init() {
		App[this.name] = this;
		this.evt = {
			question: {
				click: function () {
					this.obj.actif = !this.obj.actif;
					Question.preparerImpression();
				}
			}
		};
	}
}
Question.init();
