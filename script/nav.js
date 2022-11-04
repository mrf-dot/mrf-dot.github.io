const PAGES = {
	Home: "index",
	Resume: "resume",
	Projects: "repos",
	WebToys: "toys"
};
document.writeln('<div class="nav">');
Object.keys(PAGES).forEach(function(page) {
	document.writeln('<a href="/' + PAGES[page] + '.html">' + page + '</a> ');
})
document.writeln('</div>');
