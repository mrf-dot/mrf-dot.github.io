const pages = {
	Home: "index",
	Resume: "resume",
	Projects: "repos"
};
document.writeln('<div class="nav"> <p><strong>Navigation</strong>');
Object.keys(pages).forEach(function(page) {
	for (var i = 0; i < 3; i++)
		document.write('&nbsp;');
	document.writeln('<a href="/' + pages[page] + '.html">' + page + '</a> |');
})
document.writeln('</p></div>');