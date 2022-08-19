const SPACES = 5;
const PAGES = {
	Home: "index",
	Resume: "resume",
	Projects: "repos"
};
document.writeln('<div class="nav"> <p><strong>Navigation</strong>');
Object.keys(PAGES).forEach(function(page) {
	for (var i = 0; i < SPACES; i++)
		document.write('&nbsp;');
	document.writeln('<a href="/' + PAGES[page] + '.html">' + page + '</a> |');
})
document.writeln('</p></div>');
