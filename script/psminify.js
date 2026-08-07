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

function setLineNumbers(textarea, lineNumbers) {
	if (!textarea || !lineNumbers) return;

	const lineCount = Math.max(1, textarea.value.split("\n").length);
	const entries = [];
	for (let i = 1; i <= lineCount; i++) entries.push(`<li>${i}</li>`);
	lineNumbers.innerHTML = entries.join("");
	lineNumbers.scrollTop = textarea.scrollTop;
}

function runMinify() {
	const input = document.getElementById("psInput");
	const output = document.getElementById("batchOutput");
	const asBatchCommand = document.getElementById("asBatchCommand");
	const outputHeading = document.getElementById("outputHeading");
	const outputLines = document.getElementById("batchOutputLines");
	if (!input || !output || !asBatchCommand || !outputHeading || !outputLines) return;

	const source = input.value || "";
	const minified = minifyPowerShell(source);
	const shouldUseBatch = asBatchCommand.checked;

	outputHeading.textContent = shouldUseBatch ? "Batch Command" : "Minified Script";

	if (!minified) {
		output.value = "";
		setLineNumbers(output, outputLines);
		return;
	}

	if (shouldUseBatch) {
		const escaped = quoteForSingleQuotedPowerShellArg(minified);
		output.value = `powershell -command '${escaped}'`;
	} else {
		output.value = minified;
	}

	setLineNumbers(output, outputLines);
}

function initializePsMinify() {
	const input = document.getElementById("psInput");
	const output = document.getElementById("batchOutput");
	const inputLines = document.getElementById("psInputLines");
	const outputLines = document.getElementById("batchOutputLines");
	const asBatchCommand = document.getElementById("asBatchCommand");
	if (!input || !output || !inputLines || !outputLines || !asBatchCommand) return;

	input.addEventListener("input", () => {
		setLineNumbers(input, inputLines);
		runMinify();
	});

	input.addEventListener("scroll", () => {
		inputLines.scrollTop = input.scrollTop;
	});

	output.addEventListener("scroll", () => {
		outputLines.scrollTop = output.scrollTop;
	});

	asBatchCommand.addEventListener("change", runMinify);

	setLineNumbers(input, inputLines);
	runMinify();
}

document.addEventListener("DOMContentLoaded", initializePsMinify);
