let fonts = [];
let fontNames = [
  "Georgia", "Verdana", "Times New Roman", "Courier New", "Arial",
  "Helvetica", "Trebuchet MS", "Lucida Console", "Garamond", "Impact"
];
let grid = [];
let fontIndex = [];
let frozen = [];
let cols = 20;
let rows = 11;
let cellW, cellH;
let pg;
let message = "Visual\nSystems";
let t = 0;
let freezeRadius = 2;
let gridVisible = true;
let gridButton;

function preload() {
  for (let name of fontNames) {
    fonts.push(loadFont(`https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/${name.replace(/ /g, '')}.ttf`, () => {}, () => {}));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0, 0);
  pg.fill(0);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(min(width, height) * 0.75);
  pg.textLeading(pg.textSize() * 0.9);
  pg.text(message, width / 2, height / 2);

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    fontIndex[i] = [];
    frozen[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = pg.get(i * cellW, j * cellH, cellW, cellH);
      fontIndex[i][j] = floor(random(fonts.length));
      frozen[i][j] = false;
    }
  }

  gridButton = createButton("grid");
  gridButton.mousePressed(() => gridVisible = !gridVisible);
}

function draw() {
  background("#F3F3F3");
  t += deltaTime / 1000;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!frozen[i][j] && ((i + j) * 0.1) < t % 10) {
        fontIndex[i][j] = floor(random(fonts.length));
      }

      push();
      translate(i * cellW, j * cellH);
      image(grid[i][j], 0, 0, cellW, cellH);
      if (fonts[fontIndex[i][j]]) {
        textFont(fonts[fontIndex[i][j]]);
        textSize(cellW);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(".", cellW / 2, cellH / 2); // optional dot to prevent warnings
      }
      if (gridVisible) {
        stroke("#FFFFFF");
        strokeWeight(0.5);
        noFill();
        rect(0, 0, cellW, cellH);
      }
      pop();
    }
  }
}

function mousePressed() {
  let i = floor(mouseX / cellW);
  let j = floor(mouseY / cellH);
  for (let dx = -freezeRadius; dx <= freezeRadius; dx++) {
    for (let dy = -freezeRadius; dy <= freezeRadius; dy++) {
      let ni = i + dx;
      let nj = j + dy;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
        frozen[ni][nj] = true;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(0, 0);
  pg.fill(0);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(min(width, height) * 0.75);
  pg.textLeading(pg.textSize() * 0.9);
  pg.text(message, width / 2, height / 2);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = pg.get(i * cellW, j * cellH, cellW, cellH);
    }
  }
}
