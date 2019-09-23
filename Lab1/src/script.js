document.getElementById('file-input').oninput = function () {
    const file = document.getElementById('file-input').files[0];
    if (file != null) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            let p_i = new Map();
            let h_i = new Map();
            let H = 0;
            let HStar = 0;
            let sum = 0;
            let prevChar = " ";
            let p_pairs = new Map();
            const text = e.target.result;
            for (let i = 0; i < text.length; ++i) {
                let char = text[i].toUpperCase(); //ignore case of letters
                if (char.match("[\t\r\n\f]")) continue; //we don't include any space characters but whitespace
                if (!char.match("^[A-Z0-9 ]$")) char = "."; //all other symbols are treated as a punctuation symbol
                if (p_i.get(char) === undefined) { //Map initializes with undefined values
                    p_i.set(char, 1);
                } else {
                    p_i.set(char, p_i.get(char) + 1);
                }
                if (sum !== 0) {
                    if (p_pairs.get(prevChar + char) === undefined) { //Map initializes with undefined values
                        p_pairs.set(prevChar + char, 1);
                    } else {
                        p_pairs.set(prevChar + char, p_pairs.get(prevChar + char) + 1);
                    }
                }
                sum++;
                prevChar = char;
            }

            for (const char of Array.from(p_i.keys()).sort()) {
                p_i.set(char, p_i.get(char) / sum);
                h_i.set(char, Math.log2(1 / p_i.get(char)));
                H -= p_i.get(char) * Math.log2(p_i.get(char));
                const newRow = document.getElementById("result").insertRow();
                newRow.innerHTML = `<td>${char}</td><td>${p_i.get(char).toFixed(4)}</td><td>${h_i.get(char).toFixed(4)}</td>`
            }
            for (const [pair, p] of p_pairs) {
                p_pairs.set(pair, p / (sum - 1));
                HStar -= p_pairs.get(pair) * p_i.get(pair[0]) * Math.log2(p_pairs.get(pair));
            }
            document.getElementById("entropy-H").innerText = `Entropy H(X) = ${H.toFixed(4)} bit`;
            document.getElementById("entropy-H-star").innerText = `Entropy H*(X) = ${HStar.toFixed(4)} bit`;
        };
        fileReader.readAsText(file);
    }
};