"""
Original source: http://alexmic.net/letter-pixel-count/
"""
from operator import itemgetter
from PIL import Image, ImageDraw, ImageFont


# Make a lowercase + uppercase alphabet.
alphabet = "abcdefghijklmnopqrstuvwxyz#.,'-=&@1234567890}]?<*~"
alphabet += "".join(map(str.upper, alphabet))


# We'll use Helvetica in big type.
helvetica = ImageFont.truetype("/Library/Fonts/Arial.ttf", 100)


def draw_letter(letter, save=True):
    img = Image.new("RGB", (100, 100), "white")

    draw = ImageDraw.Draw(img)
    draw.text((0, 0), letter, font=helvetica, fill="#000000")

    if save:
        img.save("letter_imgs/{}.png".format(letter), "PNG")

    return img


def count_black_pixels(img):
    pixels = list(img.getdata())
    return sum(sum(pixel) == 0 for pixel in pixels)


if __name__ == "__main__":
    counts = [(letter, count_black_pixels(draw_letter(letter))) for letter in alphabet]
    counts = set(counts)

    ordered = sorted(counts, key=itemgetter(1), reverse=True)
    print(ordered)
    print("".join(i[0] for i in ordered))
    # Output:

    # [('@', 2649), ('M', 2093), ('W', 2006), ('N', 1828), ('B', 1810), ('R', 1799), ('Q', 1725), ('D', 1678),
    #  ('E', 1648), ('&', 1623), ('#', 1607), ('G', 1600), ('O', 1538), ('H', 1528), ('S', 1464), ('m', 1462),
    #  ('K', 1453), ('8', 1435), ('P', 1435), ('U', 1431), ('6', 1391), ('A', 1388), ('Z', 1385), ('9', 1381),
    #  ('w', 1348), ('X', 1313), ('5', 1302), ('0', 1271), ('C', 1271), ('b', 1245), ('d', 1243), ('2', 1233),
    #  ('4', 1195), ('e', 1194), ('a', 1193), ('g', 1187), ('F', 1160), ('p', 1157), ('q', 1153), ('3', 1121),
    #  ('V', 1112), ('h', 1105), ('k', 1101), ('o', 1032), ('T', 1024), ('Y', 1003), ('s', 1001), ('z', 1000),
    #  ('n', 973), ('u', 965), ('7', 919), ('x', 882), ('J', 866), ('L', 864), ('c', 847), ('=', 828),
    #  ('y', 821), ('?', 814), ('f', 787), (']', 736), ('v', 734), ('1', 714), ('}', 658), ('t', 656), ('<', 609),
    #  ('I', 576), ('l', 576), ('j', 560), ('r', 538), ('i', 488), ('~', 442), ('*', 342), ('-', 208), ("'", 202),
    #  (',', 118), ('.', 81)]

    # @MWNBRQDE&#GOHSmK8PU6AZ9wX5C0bd24eagFpq3VhkoTYsznu7xJLc=y?f]v1}t<Iljri~*-',.
