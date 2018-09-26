/*jslint browser:true, esnext:true*/
/**
 * Main (and only) script to be loaded by the page. Manages all the dependencies.
 */
class App {
	/**
	 * Event callback called when everything is loaded : page and modules
	 * @returns {Promise} The Promise
	 */
	static load() {
		console.log("load", this.name);
		return new Promise(resolve => {
			return resolve();
		});
	}
	/**
	 * Returns a promise resolved when given dependency (css or js) is fully loaded
	 * @param   {string|array} file URL to module dependancy
	 * @returns {Promise}      A Promise object
	 */
	static addDependency(dependency) {
		if (dependency instanceof Array) {
			return Promise.all(dependency.map(d => this.addDependency(d)));
		} else if (dependency instanceof Promise) {
			return dependency;
		} else if (typeof dependency === "object") {
			return this.addDependency(Object.values(dependency));
		} else if (dependency.endsWith(".js")) {
			return this.addModule(dependency);
		} else if (dependency.endsWith(".css")) {
			return this.addStyle(dependency);
		}
	}
	/**
	 * Returns a promise resolved when given module is fully loaded
	 * @param   {string|array} file URL to module file
	 * @returns {Promise}      A Promise object
	 */
	static addModule(file) {
		if (file instanceof Array) {
			return Promise.all(file.map(f => this.addModule(f)));
		} else {
			return new Promise(resolve => {
				var element = document.createElement("script");
				element.setAttribute("src", this.app_path(file));
				element.setAttribute("type", "module");
				element.addEventListener("load", () => resolve(element));
				document.head.appendChild(element);
			});
		}
	}
	/**
	 * Returns a promise resolved when given css is fully loaded
	 * @param   {string|array} file URL to module file
	 * @returns {Promise}      A Promise object
	 */
	static addStyle(file) {
		if (file instanceof Array) {
			return Promise.all(file.map(f => this.addStyle(f)));
		} else {
			return new Promise(resolve => {
				var element = document.createElement("link");
				element.setAttribute("rel", "stylesheet");
				element.setAttribute("href", this.app_path(file));
				element.addEventListener("load", () => resolve(element));
				document.head.appendChild(element);
			});
		}
	}
	/**
	 * Returns a promise resolved when a json (or all jsons) is successfully loaded (and returned);
	 * @param   {string|array} url The url to json
	 * @returns {Promise}      A Promise object
	 */
	static loadJson(url) {
		if (url instanceof Array) {
			return Promise.all(url.map(u=>this.loadJson(u)));
		} else {
			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open("get", url);
				xhr.responseType = "json";
				xhr.addEventListener("load", function () {
					resolve(this.response);
				});
				xhr.addEventListener("error", function () {
					reject(this);
				});
				xhr.send(null);
			});
		}
	}
	/**
	 * Returns an absolute URL to a file
	 * @param   {string} file Relative (or already absolute) file URL
	 * @param   {string} root The url on witch to base the absolute url
	 * @returns {string} An absolute URL
	 */
	static absolutePath(file = "", root = this._appPath) {
		if (file.match(/^[a-zA-Z0-9]+\:\/\//)) {
			return file;
		}
		if (!file) {
			return root;
		}
		return root + "/" + file;
	}
	/**
	 * Returns absolute URL to script folder
	 * @param   {string} file Optional. A file in the App.js's folder
	 * @returns {string} The absolute URL
	 */
	static app_path(file) {
		var result = this.absolutePath(file, this._appPath);
		return result;
	}
	/**
	 * Returns absolute URL to original page folder
	 * @param   {string} file Optional. A file in the page folder
	 * @returns {string} The absolute URL
	 */
	static page_path(file) {
		var result = this.absolutePath(file, this._pagePath);
		return result;
	}
	/**
	 * Sets static properties in reference to the page ans to the script
	 * Is called by init
	 */
	static setPaths() {
		var pageDir = window.location.href.split("/").slice(0, -1);
		this._pagePath = pageDir.join("/");
		var scriptDir = document.currentScript.getAttribute("src").split("/").slice(0, -1);
		// Clean up Current = ./ or Parent = ../
		scriptDir = scriptDir.filter(i=>i!==".");
		var pos;
		while (pos = scriptDir.indexOf(".."), pos >= 0) {
			if (pos === 0) {
				pageDir.pop();
				scriptDir.shift();
			} else {
				scriptDir.splice(pos-1, 2);
			}
		}
		// Absolute = http://
		if (scriptDir.length >= 1 && scriptDir[0].match(/^[a-zA-Z0-9]+\:$/)) {
			this._appPath = scriptDir.join("/");
			return;
		}
		// Protocole relative = //
		if (scriptDir.length >= 2 && scriptDir[0] === "" && scriptDir[1] === "") {
			this._appPath = pageDir.slice(0,2).concat(scriptDir.slice(2)).join("/");
			return;
		}
		// Domain relative = /
		if (scriptDir.length >= 1 && scriptDir[0] === "") {
			this._appPath = pageDir.slice(0,3).concat(scriptDir.slice(1)).join("/");
			return;
		}
		// Page relative
		this._appPath = pageDir.concat(scriptDir).join("/");
	}
	/**
	 * Sets static properties and manages onload events
	 */
	static init() {
		console.log("init", this.name);
		this.setPaths();
		this.loadJson("config.json").then(cfg => {
			console.log(cfg);
			return Promise.all([
				new Promise(resolve => {
					window.addEventListener("load", () => resolve());
				}),
				this.addDependency("qx.css").then(data => data.setAttribute("id", "ss")),
				this.addDependency([
					"Qx.js",
					"Feuillet.js",
					"Question.js",
				]),
			]);
		}).then(data => {
			console.log("Everything loaded", data);
			return Promise.all([
				this.load(),
				this.Qx.load(),
			]);
		}).then(() => {
			console.log("Finished");
		});
	}
}
App.init();
