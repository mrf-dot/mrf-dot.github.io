let p, r, n, t, a;
function interest() {
	p = document.getElementById("P").value;
	r = document.getElementById("r").value;
	n = document.getElementById("n").value;
	t = document.getElementById("t").value;
	r /= 100;
	// continuous
	if (n == -1) {
		a = p * Math.pow(Math.E, r*t);
	}
	// simple
	else if (n == 0) {
		a = +p + p * r * t;
	}
	// compound
	else {
		a = p * Math.pow(1 + (r/n), n * t);
	}
	document.getElementById("A").value = a.toLocaleString("en-US", {style:"currency",  currency: "USD"});
}
