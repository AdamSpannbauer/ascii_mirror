const canvas_w = 640;
const canvas_h = 480;

const video_scale = 11;

let video_capture;
const draw_ascii = ['@', '&', 'E', 'F', 'L', 'I', '*', '-', ',', '.', ' '];
const draw_moji = ['⬛', '🌚', '💩', '🥦', '👽', '💨', '👀', ' '];
let draw_chars = draw_ascii;

let g_min = 0;
let g_max = 255;

let _g_min;
let _g_max;

function update_chars() {
  if (checkbox.checked()) {
    draw_chars = [...emoji_chars.value()];
  } else {
    draw_chars = [...ascii_chars.value()];
  }
}

function setup() {
  pixelDensity(1);
  textSize(video_scale);

  createCanvas(canvas_w, canvas_h);
  video_capture = createCapture(VIDEO);
  video_capture.size(width / video_scale, height / video_scale);
  video_capture.hide();

  ascii_chars = createInput();
  ascii_chars.value(draw_ascii.join(''));

  emoji_chars = createInput();
  emoji_chars.value(draw_moji.join(''));

  checkbox = createCheckbox('use emoji?');

  submit_btn = createButton('apply updates');
  submit_btn.mousePressed(update_chars);

  createP('if you want a blank you need to have a<br>space as the last character in text box');
}

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

      // Show pixlated image
      // noStroke();
      // fill(r, g, b);
      // rect(x * video_scale, y * video_scale, video_scale, video_scale);
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
