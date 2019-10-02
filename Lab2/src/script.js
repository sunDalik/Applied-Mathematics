class CharNode {
    constructor(char = "", frequency = 0, probability = 0, shannon = "", huffman = "") {
        this.char = char;
        this.frequency = frequency;
        this.probability = probability;
        this.shannon = shannon;
        this.huffman = huffman;
    }
}

class HuffmanNode {
    constructor(char = "", probability = 0, left = null, right = null) {
        this.char = char;
        this.probability = probability;
        this.left = left;
        this.right = right;
    }
}

function encode_shannon(nodes) {
    if (nodes.length === 1) return;
    if (nodes.length === 2) {
        nodes[0].shannon += "0";
        nodes[1].shannon += "1";
        return;
    }
    nodes.sort((a, b) => {
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
    const diff2 = Math.abs(halfTotalP - nodes[i].probability - (totalP - halfTotalP + nodes[i].probability));
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

function encode_huffman(huffNodes) {
    if (huffNodes.length === 1) {
        return huffNodes[0];
    }
    huffNodes.sort((a, b) => {
        return a.probability - b.probability;
    });
    huffNodes.push(new HuffmanNode(null, huffNodes[0].probability + huffNodes[1].probability, huffNodes[0], huffNodes[1]));
    huffNodes = huffNodes.slice(2);
    return encode_huffman(huffNodes);
}

function assignCodes(huffNode, nodesList, code = "") {
    if (huffNode.left === null && huffNode.right === null) {
        for (const node of nodesList) {
            if (node.char === huffNode.char) {
                node.huffman = code;
                return;
            }
        }
    }
    assignCodes(huffNode.left, nodesList, code + "0");
    assignCodes(huffNode.right, nodesList, code + "1");
}

document.getElementById('file-input').oninput = function () {
    const file = document.getElementById('file-input').files[0];
    if (file != null) { // don't do anything if no file has been chosen
        document.getElementById("result").innerHTML = `<tr>
            <td>Symbol</td>
            <td>Probability P(x<sub>i</sub>)</td>
            <td>Shannon-Fano code</td>
            <td>Huffman code</td>
            </tr>`;
        document.getElementById("avg").innerText = "";
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

            for (const node of nodesList) {
                node.probability = node.frequency / sum;
            }
            encode_shannon(nodesList);
            let huffNodesList = [];
            for (const node of nodesList) {
                huffNodesList.push(new HuffmanNode(node.char, node.probability))
            }

            assignCodes(encode_huffman(huffNodesList), nodesList, "");
            let shannonLength = 0;
            let huffmanLength = 0;
            let charCount = 0;
            for (const node of nodesList) {
                shannonLength += node.probability * node.shannon.length;
                huffmanLength += node.probability * node.huffman.length;
                charCount++;
                const newRow = document.getElementById("result").insertRow(); // add a row to the table
                newRow.innerHTML = `<td>${node.char}</td>
                                    <td>${node.probability.toFixed(4)}</td>
                                    <td>${node.shannon}</td>
                                    <td>${node.huffman}</td>`
            }
            document.getElementById("avg").innerText = `Average symbol length (Shannon-Fano): ${shannonLength.toFixed(4)} 
            Average symbol length (Huffman): ${huffmanLength.toFixed(4)}`
        };
        fileReader.readAsText(file);
    }
};