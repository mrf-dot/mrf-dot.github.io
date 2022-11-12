const PAGES = {
	Home: "index",
	Resume: "resume",
	Projects: "repos",
	WebToys: "toys"
};
document.write('<div class="nav">');
Object.keys(PAGES).forEach(function(page) {
	document.write('<a href="/' + PAGES[page] + '.html">' + page + '</a> ');
})
document.write('</div><div class="container">');
