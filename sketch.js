const canvas_w = 1280;
const canvas_h = 960;

const video_scale = 11;

let video_capture;
const draw_ascii = ['#', '@', 'M', 'N', 'D', 'X', '2', 'V', 'Y', 'J', '1', 'I', '*', '-', ',', '.', ' '];
const draw_moji = ['⬛', '🌚', '💩', '🥦', '👽', '💨', '👀', ' '];
let draw_chars = draw_ascii;

let g_min = 0;
let g_max = 255;

let _g_min;
let _g_max;

/**
 * Read chars from user input and separate into array
 *
 * @return {null}
 */
function update_chars() {
  let selected_chars;
  if (checkbox.checked()) {
    selected_chars = emoji_chars.value();
  } else {
    selected_chars = ascii_chars.value();
  }

  if (!selected_chars.includes(' ')) {
    selected_chars += ' ';
  }

  draw_chars = [...selected_chars];
}

/**
 * Resize canvas if too big for screen
 * Place/center all things based on canvas & window width
 *
 * @return {null}
 */
function position_things() {
  let w = canvas_w;
  let h = canvas_h;

  if (windowWidth < w * 1.1) {
    w = windowWidth * 0.8;
    h = (w / canvas_w) * canvas_h;
  }

  if (windowHeight < h * 1.2) {
    h = windowHeight * 0.8;
    w = (h / canvas_h) * canvas_w;
  }

  resizeCanvas(w, h);

  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  y -= h * 0.08;

  cnv.position(x, y);

  const cx = x + w / 2;
  const buffer = h * 0.01;

  x = cx - ascii_chars.width / 2;
  y += h + buffer;
  ascii_chars.position(x, y);

  x = cx - emoji_chars.width / 2;
  y += ascii_chars.height + buffer;
  emoji_chars.position(x, y);

  x = cx - ascii_chars.width / 2;
  y += emoji_chars.height + buffer;
  checkbox.position(x, y);

  x = cx - submit_btn.width / 2;
  y += checkbox.height + buffer;
  submit_btn.position(x, y);

  video_capture.show();
  video_capture.size(int(w / video_scale), int(h / video_scale));
  video_capture.hide();
}

/**
 * Callback to center canvas when browser window is resized
 *
 * @return {null}
 */
function windowResized() {
  position_things();
}

/**
 * Initialize:
 *   * video_capture (resized and hidden `createCapture()`)
 *   * ascii_chars & emoji_chars (`createInput()`s for drawing chars)
 *   * checkbox (`createCheckbox()` to indicate which input text to use)
 *   * submit_btn (`createButton()` to apply all user inputs)
 *
 * @return {null}
 */
function setup() {
  pixelDensity(1);
  textSize(video_scale);

  cnv = createCanvas(canvas_w, canvas_h);

  video_capture = createCapture(VIDEO);
  video_capture.size(width / video_scale, height / video_scale);
  // video_capture.hide();

  ascii_chars = createInput();
  ascii_chars.value(draw_ascii.join(''));

  emoji_chars = createInput();
  emoji_chars.value(draw_moji.join(''));

  checkbox = createCheckbox('Use 2nd text box?');

  submit_btn = createButton('Apply');
  submit_btn.mousePressed(update_chars);

  position_things();
}

/**
 * Main process:
 *   * Convert video_capture to grayscale
 *   * `map` grayscale value to index in character array
 *   * draw character at pixel location
 *
 * Additionally, a moving average of the prev min & max
 * grayscale values is kept.  Not all videos range 0-255;
 * this means the first and last characters wouldn't be used.
 * A moving average of these range values allows all chars
 * to be included.
 *
 * @return {null}
 */
function draw() {
  background(255);

  _g_min = 255;
  _g_max = 0;

  video_capture.loadPixels();
  for (let y = 0; y < video_capture.height; y++) {
    for (let x = 0; x < video_capture.width; x++) {
      const index = (x + y * video_capture.width) * 4;
      const r = video_capture.pixels[index + 0];
      const g = video_capture.pixels[index + 1];
      const b = video_capture.pixels[index + 2];

      stroke(0, 0, 0);
      fill(0, 0, 0);
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const char_i = floor(map(gray, g_min, g_max + 1, 0, draw_chars.length));

      if (gray > _g_max) _g_max = gray;
      if (gray < _g_min) _g_min = gray;

      text(draw_chars[char_i], x * video_scale, y * video_scale);
    }
  }

  g_min = (g_min + _g_min) / 2;
  g_max = (g_max + _g_max) / 2;
}
