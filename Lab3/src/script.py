# NEVERMIND THIS SCRIPT
# IT WAS WRITTEN WHEN I THOUGHT JAVASCRIPT DOESN'T WORK
# BUT JS IS FINE

class Segment:
    # left and right borders of interval
    left = 0.0
    right = 0.0
    char = ""


def arith_encoding(letters, probabilities, text_to_code):
    segments = {}
    for letter in letters:
        segments[letter] = Segment()
    # define borders for each segment
    border = 0.0
    for i in range(len(letters)):
        letter = letters[i]
        segments[letter].left = border
        segments[letter].right = border + probabilities[i]
        border = segments[letter].right
    left = 0.0
    right = 1.0
    # encode each symbol in the text
    for i in range(len(text_to_code)):
        letter = text_to_code[i]
        # l1 = l0 + r0 * Q0; h1 = l0 + r0 * Q1
        new_right = left + (right - left) * segments[letter].right
        new_left = left + (right - left) * segments[letter].left
        left = new_left
        right = new_right
    # you can return any number in [left; right) interval
    return left


def arith_decoding(letters, probabilities, encoded_text, original_text_length):
    border = 0.0
    segments = [Segment() for i in range(len(letters))]
    for i in range(len(letters)):
        segments[i].left = border
        segments[i].right = border + probabilities[i]
        segments[i].char = letters[i]
        border = segments[i].right
    decoded = ""
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
