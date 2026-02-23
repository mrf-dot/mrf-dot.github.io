function addRow() {
    const tbody = document.getElementById('inventory');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="text" class="ticker" placeholder="Ticker" oninput="calculate()"></td>
        <td><input type="number" class="shares" value="0" min="0" oninput="calculate()"></td>
        <td><input type="number" class="price" value="0" min="0" oninput="calculate()"></td>
        <td><input type="number" class="target" value="0" min="0" max="100" oninput="calculate()"></td>
        <td style="text-align: center; vertical-align: middle;">
            <button onclick="deleteRow(this)" style="background-color: darkred; color: white; border-radius: 50%; width: 25px; height: 25px; border: none; outline: none; cursor: pointer; font-weight: bold; padding: 0; line-height: 25px; text-align: center; margin: 0 auto;">&minus;</button>
        </td>
    `;
    tbody.appendChild(row);
}

function deleteRow(buttonElement) {
    // Finds the closest table row (tr) to the button that was clicked and removes it
    const row = buttonElement.closest('tr');
    row.remove();

    // Instantly recalculate the action plan now that the asset is gone
    calculate();
}

function calculate() {
    const tickers = document.querySelectorAll('.ticker');
    const shares = document.querySelectorAll('.shares');
    const prices = document.querySelectorAll('.price');
    const targets = document.querySelectorAll('.target');
    const depositInput = document.getElementById('deposit');
    const allowSell = document.getElementById('allowSell').checked;

    // Validate deposit isn't negative
    if (depositInput.value < 0) depositInput.value = 0;
    const deposit = parseFloat(depositInput.value) || 0;

    let currentTotalValue = 0;
    let portfolio = [];

    // 1. Gather current state and enforce validation
    for (let i = 0; i < tickers.length; i++) {
        // Force inputs into valid ranges if the user types something illegal
        if (shares[i].value < 0) shares[i].value = 0;
        if (prices[i].value < 0) prices[i].value = 0;
        if (targets[i].value < 0) targets[i].value = 0;
        if (targets[i].value > 100) targets[i].value = 100;

        const s = parseFloat(shares[i].value) || 0;
        const p = parseFloat(prices[i].value) || 0;
        const t = parseFloat(targets[i].value) || 0;
        const val = s * p;

        currentTotalValue += val;
        portfolio.push({
            ticker: tickers[i].value || `Asset ${i+1}`,
            shares: s,
            price: p,
            targetPct: t / 100,
            currentVal: val
        });
    }

    const newTotalValue = currentTotalValue + deposit;
    document.getElementById('totalValue').value = '$' + newTotalValue.toFixed(2);

    // 2. Calculate requirements
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    if (allowSell) {
        portfolio.forEach(asset => {
            const targetValue = newTotalValue * asset.targetPct;
            const diffDollars = targetValue - asset.currentVal;
            const diffShares = asset.price > 0 ? (diffDollars / asset.price) : 0;

            if (Math.abs(diffDollars) > 0.01) {
                appendResultRow(resultsBody, asset.ticker, diffDollars, diffShares);
            }
        });
    } else {
        let shortfalls = portfolio.map(asset => {
            const idealTargetValue = newTotalValue * asset.targetPct;
            return Math.max(0, idealTargetValue - asset.currentVal);
        });

        const totalShortfall = shortfalls.reduce((a, b) => a + b, 0);

        portfolio.forEach((asset, i) => {
            let diffDollars = 0;

            if (totalShortfall > 0 && deposit > 0) {
                diffDollars = deposit * (shortfalls[i] / totalShortfall);
            }

            const diffShares = asset.price > 0 ? (diffDollars / asset.price) : 0;

            if (diffDollars > 0.01) {
                appendResultRow(resultsBody, asset.ticker, diffDollars, diffShares);
            }
        });
    }

    document.getElementById('resultsBlock').hidden = false;
}

// Helper function to keep the logic clean
function appendResultRow(tbody, ticker, diffDollars, diffShares) {
    const row = document.createElement('tr');
    const action = diffDollars > 0 ? "BUY" : "SELL";
    const color = diffDollars > 0 ? "lime" : "orange";

    row.innerHTML = `
        <td>${ticker}</td>
        <td style="color: ${color}"><strong>${action}</strong></td>
        <td>${Math.abs(diffShares).toFixed(2)}</td>
        <td>$${Math.abs(diffDollars).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
}
