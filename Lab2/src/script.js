class CharNode {
    constructor(char = "", frequency = 0, probability = 0, shannon = "", huffman = "") {
        this.char = char;
        this.frequency = frequency;
        this.probability = probability;
        this.shannon = shannon;
        this.huffman = huffman;
    }
}

function encode_shannon(nodes) {
    if (nodes.length === 1) return;
    if (nodes.length === 2) {
        nodes[0].shannon += "0";
        nodes[1].shannon += "1";
        return;
    }
    nodes.sort(function (a, b) {
        return b.probability - a.probability;
    }); // reverse sort by probability
    let totalP = 0;
    let i;
    for (i = 0; i < nodes.length; ++i) {
        totalP += nodes[i].probability;
    }
    let halfTotalP = 0;
    i = nodes.length;
    while (i >= 0 && halfTotalP < (totalP - halfTotalP)) {
        i--;
        halfTotalP += nodes[i].probability;
    }
    const diff1 = halfTotalP - (totalP - halfTotalP);
    const diff2 = Math.abs(diff1 - (2 * nodes[i].probability));
    if (diff2 < diff1) i++;
    for (let j = 0; j < i; ++j) {
        nodes[j].shannon += "0"
    }
    for (let k = i; k < nodes.length; ++k) {
        nodes[k].shannon += "1";
    }
    encode_shannon(nodes.slice(0, i));
    encode_shannon(nodes.slice(i));
}

function encode_huffman(nodes) {
/*

 */
}

document.getElementById('file-input').oninput = function () {
    const file = document.getElementById('file-input').files[0];
    if (file != null) { // don't do anything if no file has been chosen
        document.getElementById("result").innerHTML = `<tr>
            <td>Symbol</td>
            <td>Probability P(x<sub>i</sub>), bit</td>
            <td>Shannon-Fano code</td>
            <td>Huffman code</td>
            </tr>`;
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            let nodesList = [];
            let sum = 0; // characters count
            const text = e.target.result;
            for (let i = 0; i < text.length; ++i) {
                let char = text[i].toUpperCase(); // ignore case of letters
                if (char.match("[\t\r\n\f]")) continue; // we don't include any space characters but whitespace
                if (!char.match("^[A-Z0-9 ]$")) char = "."; // all other symbols are treated as punctuation symbol
                sum++;
                let nodeI = undefined;
                for (let i = 0; i < nodesList.length; ++i) {
                    if (nodesList[i].char === char) {
                        nodeI = i;
                        break;
                    }
                }
                if (nodeI === undefined) {
                    nodesList.push(new CharNode(char));
                    nodeI = nodesList.length - 1;
                }
                nodesList[nodeI].frequency++;
            }

            for (let i = 0; i < nodesList.length; ++i) {
                const node = nodesList[i];
                node.probability = node.frequency / sum;
            }
            encode_shannon(nodesList);
            encode_huffman();
            for (let i = 0; i < nodesList.length; ++i) {
                const node = nodesList[i];
                const newRow = document.getElementById("result").insertRow(); // add a row to the table
                newRow.innerHTML = `<td>${node.char}</td>
                                    <td>${node.probability.toFixed(4)}</td>
                                    <td>${node.shannon}</td>
                                    <td>${node.huffman}</td>`
            }
        };
        fileReader.readAsText(file);
    }
};