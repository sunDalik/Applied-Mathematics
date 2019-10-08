class Segment:
    left = 0.0
    right = 0.0
    char = ""


def arith_encoding(letters, probabilities, text_to_code):
    border = 0.0
    # create segment for each letter
    segments = {}
    for letter in letters:
        segments[letter] = Segment()
    # create segment border for each letter
    for i in range(len(letters)):
        segments[letters[i]].left = border
        segments[letters[i]].right = border + probabilities[i]
        border = segments[letters[i]].right
    left = 0.0
    right = 1.0
    # loop for encoding symbols in interval
    for i in range(len(text_to_code)):
        symbol = text_to_code[i]  # get symbols
        # new borders
        new_right = left + (right - left) * segments[symbol].right
        new_left = left + (right - left) * segments[symbol].left
        left = new_left
        right = new_right
    #  returning some number in final interval
    return left


def arith_decoding(letters, probabilities, encoded_text, original_text_length):
    border = 0.0
    # create segment for each letter
    segments = [Segment() for i in range(len(letters))]
    # defining decoding segment for each letter
    for i in range(len(letters)):
        segments[i].left = border
        segments[i].right = border + probabilities[i]
        segments[i].char = letters[i]
        border = segments[i].right
    # decoded string
    decoded = ""
    # decoding
    for i in range(original_text_length):
        for j in range(len(letters)):
            if segments[j].left <= encoded_text < segments[j].right:
                decoded += segments[j].char
                encoded_text = (encoded_text - segments[j].left) / (segments[j].right - segments[j].left)
                break
    return decoded


def main():
    print("Enter name of the file to encode arithmetically:")
    try:
        # reading phrase from file
        filename = input()
        file = open(filename, 'r')
        text_to_code = file.read()  # string from file

        letters = set(list(text_to_code))  # get letters of phrase
        probabilities = [text_to_code.count(i) / len(text_to_code) for i in letters]  # list of letter probabilities

        encoded = arith_encoding(list(letters), probabilities, text_to_code)
        decoded = arith_decoding(list(letters), probabilities, encoded, len(text_to_code))

        print("Original text: " + str(text_to_code))
        print("Arithmetically encoded text: " + str(encoded))
        print("Decoded text: " + str(decoded))
        print("Compression ratio: " + str(len(str(encoded)) / len(text_to_code) * 100) + " %")

    except IOError:
        print("File not found")


main()
