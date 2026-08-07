function stripBlockComments(input) {
	let output = "";
	let inSingle = false;
	let inDouble = false;
	let i = 0;

	while (i < input.length) {
		const ch = input[i];
		const next = input[i + 1] || "";

		if (!inSingle && ch === '"' && input[i - 1] !== "`") {
			inDouble = !inDouble;
			output += ch;
			i++;
			continue;
		}

		if (!inDouble && ch === "'" && input[i - 1] !== "`") {
			inSingle = !inSingle;
			output += ch;
			i++;
			continue;
		}

		if (!inSingle && !inDouble && ch === "<" && next === "#") {
			i += 2;
			while (i < input.length && !(input[i] === "#" && input[i + 1] === ">")) {
				i++;
			}
			i += 2;
			continue;
		}

		output += ch;
		i++;
	}

	return output;
}

function stripLineComment(line) {
	let inSingle = false;
	let inDouble = false;

	for (let i = 0; i < line.length; i++) {
		const ch = line[i];

		if (!inSingle && ch === '"' && line[i - 1] !== "`") {
			inDouble = !inDouble;
			continue;
		}

		if (!inDouble && ch === "'" && line[i - 1] !== "`") {
			inSingle = !inSingle;
			continue;
		}

		if (!inSingle && !inDouble && ch === "#") {
			return line.slice(0, i).trimEnd();
		}
	}

	return line.trimEnd();
}

function minifyPowerShell(script) {
	const withoutBlockComments = stripBlockComments(script).replace(/\r/g, "");
	const lines = withoutBlockComments.split("\n");
	const cleaned = [];

	for (const rawLine of lines) {
		const line = stripLineComment(rawLine).trim();
		if (line.length > 0) cleaned.push(line);
	}

	return cleaned.join("; ");
}

function quoteForSingleQuotedPowerShellArg(text) {
	return text.replace(/'/g, "''");
}

function runMinify() {
	const input = document.getElementById("psInput");
	const output = document.getElementById("batchOutput");
	const minifiedOutput = document.getElementById("minifiedOutput");
	const status = document.getElementById("status");
	const source = input.value || "";
	const minified = minifyPowerShell(source);

	if (!minified) {
		status.textContent = "No script content to minify.";
		minifiedOutput.value = "";
		output.value = "";
		return;
	}

	const escaped = quoteForSingleQuotedPowerShellArg(minified);
	const command = `powershell -command '${escaped}'`;

	status.textContent = "Generated minified script and batch command.";
	minifiedOutput.value = minified;
	output.value = command;
}
