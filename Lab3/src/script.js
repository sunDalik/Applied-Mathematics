class CharNode {
    constructor(char = "", frequency = 0, probability = 0) {
        this.char = char;
        this.frequency = frequency;
        this.probability = probability;
    }
}

class Segment {
    constructor(left = 0.0, right = 0.0) {
        this.left = left;
        this.right = right;
    }
}

function arithmeticEncode(letters, nodeList, textToCode) {
    let border = 0.0;
    let segments = [];
    for (const letter of letters) {
        segments[letter] = new Segment();
    }
    for (let i = 0; i < letters.length; ++i) {
        const letter = letters[i];
        segments[letter].left = border;
        segments[letter].right = border + nodeList[i].probability;
        border = segments[letter].right;
    }
    let left = 0.0;
    let right = 1.0;
    for (let i = 0; i < textToCode.length; ++i) {
        const symbol = textToCode[i];
        left = left + (right - left) * segments[symbol].left;
        right = left + (right - left) * segments[symbol].right;
    }
    return (left + right) / 2
}

class SegmentDecode extends Segment {
    constructor(character) {
        super();
        this.character = null;
    }
}

function arithmeticDecoding(letters, nodeList, encodedText, originalText) {
    let border = 0.0;
    let segments = [];
    for (let i = 0; i < letters.length; ++i) {
        segments.push(new SegmentDecode());
    }
    for (let i = 0; i < letters.length; ++i) {
        segments[i].left = border;
        segments[i].right = border + nodeList[i].probability;
        segments[i].character = letters[i];
        border = segments[i].right;
    }
    let decode = "";
    for (let i = 0; i < originalText.length; ++i) {
        for (let j = 0; j < letters.length; ++j) {
            if (segments[j].left <= encodedText && encodedText < segments[j].right) {
                decode += segments[j].character;
                encodedText = (encodedText - segments[j].left) / (segments[j].right - segments[j].left);
                break;
            }
        }
    }
    return decode
}

document.getElementById('file-input').oninput = function () {
    const file = document.getElementById('file-input').files[0];
    if (file != null) { // don't do anything if no file has been chosen
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const text = e.target.result;
            const letterSet = new Set(text);
            const nodeList = [];
            for (const ch of text) {
                const char = ch.toLowerCase();
                let nodeI = undefined;
                for (let i = 0; i < nodeList.length; ++i) {
                    if (nodeList[i].char === char) {
                        nodeI = i;
                        break;
                    }
                }
                if (nodeI === undefined) {
                    nodeList.push(new CharNode(char));
                    nodeI = nodeList.length - 1;
                }
                nodeList[nodeI].frequency++;
            }
            for (const node of nodeList) {
                node.probability = node.frequency / text.length;
            }
            const encodedText = arithmeticEncode(letterSet, nodeList, text);
            const decodedText = arithmeticDecoding(letterSet, nodeList, encodedText, text);
            document.getElementById('result').innerText += `Arithmetically encoded text: ${encodedText}\n`;
            document.getElementById('result').innerText += `Decoded text: ${decodedText}\n`;
            document.getElementById('result').innerText += `Compression ratio: ${encodedText.length / decodedText.length * 100} %`;
        };
        fileReader.readAsText(file);
    }
};