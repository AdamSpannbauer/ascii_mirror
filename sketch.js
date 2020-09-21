const canvas_w = 640;
const canvas_h = 480;

const video_scale = 11;

let video_capture;
const draw_ascii = ['■', '@', 'B', 'E', 'F', 'L', 'I', 'i', '*', '-', '.', ' '];
const draw_moji = ['⬛', '⬛', '🌚', '💩', '🥦', '👽', '💨', '👀', '⬜'];
let draw_chars = draw_ascii;

function change_chars() {
  if (this.checked()) {
    draw_chars = draw_moji;
  } else {
    draw_chars = draw_ascii;
  }
}


function setup() {
  pixelDensity(1);
  textSize(video_scale);

  createCanvas(canvas_w, canvas_h);
  video_capture = createCapture(VIDEO);
  video_capture.size(width / video_scale, height / video_scale);
  video_capture.hide();

  checkbox = createCheckbox('Use Emoji?');
  checkbox.changed(change_chars);
}

function draw() {
  background(255);

  video_capture.loadPixels();
  for (let y = 0; y < video_capture.height; y++) {
    for (let x = 0; x < video_capture.width; x++) {
      const index = (x + y * video_capture.width) * 4;
      const r = video_capture.pixels[index + 0];
      const g = video_capture.pixels[index + 1];
      const b = video_capture.pixels[index + 2];

      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const char_i = floor(map(gray, 0, 256, 0, draw_chars.length));

      text(draw_chars[char_i], x * video_scale, y * video_scale);

      // Show pixlated image
      // noStroke();
      // fill(r, g, b);
      // rect(x * video_scale, y * video_scale, video_scale, video_scale);
    }
  }
}


