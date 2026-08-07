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

function needsStatementSeparator(previousLine, currentLine) {
	if (!previousLine) return false;

	// Continuation contexts where a statement separator would change parsing.
	if (/[({\[,|]$/.test(previousLine)) return false;
	if (/`$/.test(previousLine)) return false;
	if (/^(?:[)\]}]|[|,]|\.|::|\?\.|\?\[)/.test(currentLine)) return false;

	return true;
}

function minifyPowerShell(script) {
	const withoutBlockComments = stripBlockComments(script).replace(/\r/g, "");
	const lines = withoutBlockComments.split("\n");
	const cleaned = [];
	let previousLine = "";

	for (const rawLine of lines) {
		const line = stripLineComment(rawLine).trim();
		if (line.length === 0) continue;

		if (needsStatementSeparator(previousLine, line)) {
			cleaned.push(";");
		}
		cleaned.push(line);
		previousLine = line;
	}

	return cleaned.join(" ").replace(/\s+/g, " ").trim();
}

function quoteForSingleQuotedPowerShellArg(text) {
	return text.replace(/'/g, "''");
}

function getElements() {
	const input = document.getElementById("psInput");
	const output = document.getElementById("batchOutput");
	const asBatchCommand = document.getElementById("asBatchCommand");
	const outputHeading = document.getElementById("outputHeading");
	const inputLines = document.getElementById("psInputLines");
	const outputLines = document.getElementById("batchOutputLines");

	if (!input || !output || !asBatchCommand || !outputHeading || !inputLines || !outputLines) return null;

	return { input, output, asBatchCommand, outputHeading, inputLines, outputLines };
}

function renderLineNumbers(textarea, lineNumbers) {
	const lineCount = Math.max(1, textarea.value.split("\n").length);
	const entries = [];
	for (let i = 1; i <= lineCount; i++) entries.push(`<li>${i}</li>`);
	lineNumbers.innerHTML = entries.join("");
	lineNumbers.scrollTop = textarea.scrollTop;
}

function runMinify() {
	const els = getElements();
	if (!els) return;

	const { input, output, asBatchCommand, outputHeading, outputLines } = els;
	const source = input.value || "";
	const minified = minifyPowerShell(source);
	const shouldUseBatch = asBatchCommand.checked;

	outputHeading.textContent = shouldUseBatch ? "Batch Command" : "Minified Script";

	if (!minified) {
		output.value = "";
		renderLineNumbers(output, outputLines);
		return;
	}

	if (shouldUseBatch) {
		const escaped = quoteForSingleQuotedPowerShellArg(minified);
		output.value = `powershell -command '${escaped}'`;
	} else {
		output.value = minified;
	}

	renderLineNumbers(output, outputLines);
}

function handlePsInput() {
	const els = getElements();
	if (!els) return;
	renderLineNumbers(els.input, els.inputLines);
	runMinify();
}

function handleToggleChange() {
	runMinify();
}

function syncInputScroll() {
	const els = getElements();
	if (!els) return;
	els.inputLines.scrollTop = els.input.scrollTop;
}

function syncOutputScroll() {
	const els = getElements();
	if (!els) return;
	els.outputLines.scrollTop = els.output.scrollTop;
}

function initializePsMinify() {
	const els = getElements();
	if (!els) return;
	const { input, output, asBatchCommand, inputLines } = els;

	input.addEventListener("input", handlePsInput);
	input.addEventListener("scroll", syncInputScroll);
	output.addEventListener("scroll", syncOutputScroll);
	asBatchCommand.addEventListener("change", handleToggleChange);

	renderLineNumbers(input, inputLines);
	runMinify();
}

window.handlePsInput = handlePsInput;
window.handleToggleChange = handleToggleChange;
window.syncInputScroll = syncInputScroll;
window.syncOutputScroll = syncOutputScroll;

document.addEventListener("DOMContentLoaded", initializePsMinify);
