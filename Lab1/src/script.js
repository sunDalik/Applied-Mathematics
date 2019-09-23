document.getElementById('file-input').oninput = function () {
    const file = document.getElementById('file-input').files[0];
    if (file != null) { //don't do anything if no file has been chosen
        document.getElementById("result").innerHTML = "<tr>\n" +
            "        <td>Symbol</td>\n" +
            "        <td>Probability P(x<sub>i</sub>), bit</td>\n" +
            "        <td>Entropy H(x<sub>i</sub>), bit</td>\n" +
            "    </tr>";
        document.getElementById("entropy-H").innerText = "";
        document.getElementById("entropy-H-star").innerText = ""; //reset results
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            let p_i = new Map(); //keys: characters, values: their probabilities
            let h_i = new Map(); //keys: characters, values: their entropy
            let H = 0; // entropy for the whole text
            let HStar = 0; // linked entropy
            let sum = 0; // characters count
            let prevChar = " "; // used for calculating linked entropy
            let p_pairs = new Map(); // keys: pairs of characters, values: their probabilities
            const text = e.target.result;
            for (let i = 0; i < text.length; ++i) {
                let char = text[i].toUpperCase(); // ignore case of letters
                if (char.match("[\t\r\n\f]")) continue; // we don't include any space characters but whitespace
                if (!char.match("^[A-Z0-9 ]$")) char = "."; // all other symbols are treated as a punctuation symbol
                if (p_i.get(char) === undefined) { // Map initializes with undefined values
                    p_i.set(char, 0); // but we have to convert them to 0 to increment values
                }
                p_i.set(char, p_i.get(char) + 1); // each time we encounter a char we increment their "probability"

                if (sum !== 0) {
                    if (p_pairs.get(prevChar + char) === undefined) {
                        p_pairs.set(prevChar + char, 0);
                    }
                    p_pairs.set(prevChar + char, p_pairs.get(prevChar + char) + 1); // increment probability for a pair of symbols
                }
                sum++;
                prevChar = char;
            }

            for (const char of Array.from(p_i.keys()).sort()) {
                p_i.set(char, p_i.get(char) / sum);  // get actual probability by dividing char count by length of the whole text
                h_i.set(char, Math.log2(1 / p_i.get(char))); // get entropy of a character (log(1/p(xi)))
                H -= p_i.get(char) * Math.log2(p_i.get(char)); //entropy = -SUM( p(xi) * log(p(xi)) )
                const newRow = document.getElementById("result").insertRow(); //add a row to the table
                newRow.innerHTML = `<td>${char}</td><td>${p_i.get(char).toFixed(4)}</td><td>${h_i.get(char).toFixed(4)}</td>`
            }
            for (const [pair, p] of p_pairs) {
                p_pairs.set(pair, p / (sum - 1)); // get actual probability of encountering a char if a certain other char has appeared before
                HStar -= p_pairs.get(pair) * p_i.get(pair[0]) * Math.log2(p_pairs.get(pair)); // linked entropy = -SUM( p(xi/xj) * p(xj) * log(p(xi/xj)) )
            }
            document.getElementById("entropy-H").innerText = `Entropy H(X) = ${H.toFixed(4)} bit`;
            document.getElementById("entropy-H-star").innerText = `Entropy H*(X) = ${HStar.toFixed(4)} bit`;
        };
        fileReader.readAsText(file);
    }
};