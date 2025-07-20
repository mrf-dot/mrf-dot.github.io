const PAGES = {
	Home: "index",
	Resume: "resume",
	Projects: "repos",
	WebToys: "toys",
};
let nav, foot;

function createNav() {
	nav = document.createElement("div");
	nav.id = "nav";
	Object.keys(PAGES).forEach(function(page) {
		var a = document.createElement("a");
		a.href = "/" + PAGES[page] + ".html";
		a.innerHTML = page;
		nav.appendChild(a);
	})
}

function createFoot() {
	foot = document.createElement("footer");
	foot.innerHTML = "&copy; " + new Date().getFullYear() + " ";
	var a = document.createElement("a");
	a.href = "mailto:mitch@mitchf.me";
	a.innerHTML="Mitch Feigenbaum";
	foot.append(a);
}

createNav();
createFoot();
let container = document.getElementById("container")
document.body.insertBefore(nav, container);
document.body.appendChild(foot);
