/* standard starting position is 518 */
let pieces = new Array(8);
let startPiece = "<img src=\"/img/";
let endPiece = ".svg\" class=\"piece\">";
let tiles;
let i, j;
const BOARDSIZE = 64;
const BOARDWIDTH = 8;
let KRNCODE = {
	0: ["n","n","r","k","r"],
	1: ["n","r","n","k","r"],
	2: ["n","r","k","n","r"],
	3: ["n","r","k","r","n"],
	4: ["r","n","n","k","r"],
	5: ["r","n","k","n","r"],
	6: ["r","n","k","r","n"],
	7: ["r","k","n","n","r"],
	8: ["r","k","n","r","n"],
	9: ["r","k","r","n","n"]
};

function drawBoard() {
	for (i = 0; i < BOARDSIZE / BOARDWIDTH; i++)
		for (j = 0; j < BOARDWIDTH; j++)
			document.getElementById("chessboard").innerHTML += "<div id=\""
				+ String.fromCharCode("a".charCodeAt(0) + j)
				+ (i + 1)
				+ "\" class=\"piece-square "
				+ (j % 2 == 0 ^ i % 2 != 0? "light-square" : "dark-square")
				+ "\"></div>";
	tiles = document.getElementById("chessboard").children;
	printPawns();
	arrangePieces(518);
	printPieces();
}

function printPawns() {
	for (i = 0; i < BOARDWIDTH; i++) {
		tiles[BOARDWIDTH+i].innerHTML = startPiece + "bp" + endPiece;
		tiles[BOARDSIZE - 2 * BOARDWIDTH + i].innerHTML = startPiece + "wp" + endPiece;
	}
}

function shufflePieces() {
	i = Math.floor(Math.random() * 960);
	document.getElementById("select960").value = i;
	arrangePieces(i);
	printPieces();
}

function arrangePieces(id) {
	/* Position is 0-959 */
	/* https://www.museum.am/chess/com_chessguide/fisher_random_chess.html */
	console.log(id);
	for (i = 0; i < 8; i++)
		pieces[i] = null;
	pieces[id % 4 * 2 + 1] = "b";
	id = Math.floor(id / 4);
	pieces[id % 4 * 2] = "b";
	id = Math.floor(id / 4);
	for ([i, j] = [0, 0]; (j += pieces[i] == null) <= id % 6; i++);
	pieces[i] = "q";
	id = Math.floor(id / 6);
	let krn = KRNCODE[id];
	j = 0;
	for (i = 0; j < krn.length; i++)
		if (pieces[i] === null)
			pieces[i] = krn[j++];
	console.log(pieces);
}

function updatePieces() {
	i = Number(document.getElementById("select960").value);
	if (i < 0 || i > 959 ) {
		document.getElementById("error960").hidden = false;
	} else {
		document.getElementById("error960").hidden = true;
		arrangePieces(i);
		printPieces();
	}
}

function printPieces() {
	for (i = 0; i < BOARDWIDTH; i++) {
		tiles[i].innerHTML = startPiece + "b" + pieces[i] + endPiece;
		tiles[BOARDSIZE - BOARDWIDTH + i].innerHTML = startPiece + "w" + pieces[i] + endPiece;
	}
}
