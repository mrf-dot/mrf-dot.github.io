/* Unicode code points go:
 * king queen rook bishop knight pawn
 * each piece is assigned a number (king = 0, queen = 1, etc)
 */
let pieces = [ "rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook" ];
let startPiece = "<img src=\"/img/";
let endPiece = ".svg\" class=\"piece\">";
let tiles;
let i, j;
const BOARDSIZE = 64;
const BOARDWIDTH = 8;


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
	printPieces();
}

function printPawns() {
	for (i = 1; i <= BOARDWIDTH; i++) {
		tiles[BOARDWIDTH+i].innerHTML = startPiece + "black_pawn" + endPiece;
		tiles[BOARDSIZE - 2 * BOARDWIDTH + i].innerHTML = startPiece + "white_pawn" + endPiece;
	}
}

function shufflePieces() {
	for (i = pieces.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		[pieces[i], pieces[j]] = [pieces[j], pieces[i]];
	}
}



function printPieces() {
	for (let i = 1; i <= BOARDWIDTH; i++) {
		tiles[i].innerHTML = startPiece + "black_" + pieces[i-1] + endPiece;
		tiles[BOARDSIZE - BOARDWIDTH + i].innerHTML = startPiece + "white_" + pieces[i-1] + endPiece;
	}
}
