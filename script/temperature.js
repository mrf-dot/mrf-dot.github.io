let tval, sigfigs;

function fromF() {
	if (tval == 32)
		tval = 0;
	else
		tval = (tval - 32) / 1.8;
}

function fromK() {
	tval = tval - 273.15;
}

function fromR() {
	if (tval == 491.67)
		tval = 0;
	tval = (tval - 491.67) / 1.8;
}

function toC() {
	return tval;
}

function toF() {
	return tval * 1.8 + 32;
}

function toK() {
	return 1 * tval + 273.15;
}

function toR() {
	return tval * 1.8 + 491.67;
}


function countFigs() {
	var textNum = tval.toString();
	if (textNum.includes('e'))
		sigfigs = 1;
	else if (textNum.includes('.'))
		sigfigs = textNum.split('.')[1].length;
	else
		sigfigs = 0;
}

function tChange() {
	tval = document.getElementById("tempValue").value;
	if (tval == "")
		return;
	countFigs();
	switch (document.getElementById("tempUnit").value) {
	case "c":
		break;
	case "f":
		fromF();
		break;
	case "k":
		fromK();
		break;
	case "r":
		fromR();
		break;
	default:
		alert("Something has gone terribly wrong");
	}
	var c = Number(toC());
	var f = Number(toF());
	var k = Number(toK());
	var r = Number(toR());
	document.getElementById("celsius").value = c.toFixed(sigfigs);
	document.getElementById("fahrenheit").value = f.toFixed(sigfigs);
	document.getElementById("kelvin").value = k.toFixed(sigfigs);
	document.getElementById("rankine").value = r.toFixed(sigfigs);
}
