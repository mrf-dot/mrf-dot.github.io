let base, val;
let bases = {
	"bin": 2,
	"octal": 8,
	"decimal": 10,
	"hex": 16,
	"base32": 32,
	"cbase": 2
};

function vchange() {
	val = document.getElementById("rawNum").value;
	if (isNaN(parseInt(val, base)))
		val = 0;
	fillBases();
}

function bchange() {
	base = document.getElementById("base").value;
	document.getElementById("custom").hidden = base != "custom";
	if (base == "custom")
		base=document.getElementById("custom").value;
	vchange();
}

function cbchange() {
	bases["cbase"] = document.getElementById("selectBase").value;
	if (base == null)
		bchange();
	else
		document.getElementById("cbase").value = parseInt(val, base).toString(bases["cbase"]);
}

function fillBases() {
	Object.keys(bases).forEach(function(b) {
		document.getElementById(b).value = parseInt(val, base).toString(bases[b]);
	});
}
