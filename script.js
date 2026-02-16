function generateTable() {
    let weightsInput = document.getElementById("weights").value.trim();
    let valuesInput = document.getElementById("values").value.trim();
    let W = document.getElementById("capacity").value.trim();

    // Number-only validation (allow spaces)
    let numberPattern = /^[0-9 ]+$/;

    if (!numberPattern.test(weightsInput) || !numberPattern.test(valuesInput)) {
        alert("Please enter only numbers separated by spaces!");
        return;
    }

    if (!/^[0-9]+$/.test(W)) {
        alert("Capacity must be a number!");
        return;
    }

    let weights = weightsInput.split(" ").map(Number);
    let values = valuesInput.split(" ").map(Number);
    W = parseInt(W);

    let n = weights.length;

    if (weights.length !== values.length) {
        alert("Number of weights and values must be same!");
        return;
    }

    let dp = Array.from({ length: n + 1 }, () =>
        Array(W + 1).fill(0)
    );

    // Build DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Create table
    let html = "<table><tr><th>i / w</th>";
    for (let w = 0; w <= W; w++) {
        html += `<th>${w}</th>`;
    }
    html += "</tr>";

    for (let i = 0; i <= n; i++) {
        html += `<tr><th>${i}</th>`;
        for (let w = 0; w <= W; w++) {
            html += `<td>${dp[i][w]}</td>`;
        }
        html += "</tr>";
    }

    fetch("/save-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            weights: weights,
            values: values,
            capacity: W,
            totalProfit: dp[n][W]
        })
    })
    .then(res => res.json())
    .then(data => console.log(data));


    html += "</table>";
    html += `<h3>Total Profit = ${dp[n][W]}</h3>`;

    document.getElementById("tableContainer").innerHTML = html;
}
 