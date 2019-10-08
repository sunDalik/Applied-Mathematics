class CharNode {
    constructor(char = "", frequency = 0, probability = 0) {
        this.char = char;
        this.frequency = frequency;
        this.probability = probability;
    }
}

class Segment {
    constructor(left = 0.0, right = 0.0, char = "") {
        // left and right borders of a segment
        this.left = left;
        this.right = right;
        this.char = char;
    }
}

function arithmeticEncode(letters, nodeList, textToCode) {
    let segments = [];
    for (const letter of letters) {
        segments.push(new Segment(0.0, 0.0, letter));
    }
    // define borders for each segment
    let border = 0.0;
    for (let i = 0; i < segments.length; ++i) {
        segments[i].left = border;
        segments[i].right = border + nodeList[i].probability;
        border = segments[i].right;
    }
    let left = 0.0;
    let right = 1.0;
    // encoding each letter in the text
    for (let i = 0; i < textToCode.length; ++i) {
        for (const segment of segments) {
            if (segment.char === textToCode[i]) {
                // l1 = l0 + r0 * Q0; h1 = l0 + r0 * Q1
                const newLeft = left + (right - left) * segment.left;
                const newRight = left + (right - left) * segment.right;
                left = newLeft;
                right = newRight;
                break;
            }
        }
    }
    return left
}

function arithmeticDecoding(letters, nodeList, encodedText, originalText) {
    let border = 0.0;
    let segments = [];
    for (let i = 0; i < letters.length; ++i) {
        segments.push(new Segment());
    }
    for (let i = 0; i < segments.length; ++i) {
        segments[i].left = border;
        segments[i].right = border + nodeList[i].probability;
        segments[i].char = letters[i];
        border = segments[i].right;
    }
    let decodedText = "";
    for (let i = 0; i < originalText.length; ++i) {
        for (let j = 0; j < letters.length; ++j) {
            if (segments[j].left <= encodedText && encodedText < segments[j].right) {
                decodedText += segments[j].char;
                encodedText = (encodedText - segments[j].left) / (segments[j].right - segments[j].left);
                break;
            }
        }
    }
    return decodedText
}

document.getElementById('file-input').oninput = function () {
    const file = document.getElementById('file-input').files[0];
    if (file != null) { // don't do anything if no file has been chosen
        document.getElementById("result").innerText = ""; // clear results
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const text = e.target.result.toLowerCase();
            const letterSet = Array.from(new Set(text));
            const nodeList = [];
            for (const ch of text) {
                const char = ch;
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
            document.getElementById('result').innerText += `Compression ratio: ${encodedText.toString().length / decodedText.length * 100} %`;
        };
        fileReader.readAsText(file);
    }
};