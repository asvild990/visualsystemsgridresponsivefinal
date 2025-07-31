let fonts = [];
let fontNames = [
  "Futura", "Didot", "Verdana", "Baskerville", "Avenir",
  "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"
];

let cols = 20;
let rows = 11;
let cellW, cellH;
let fontIndex = [];
let frozen = [];
let cellGraphics = [];
let fullTextCanvases = []; // new: holds the full message in each font
let message = "Visual\nSystems";
let rippleDelay = 1800;
let gridVisible = true;

function preload() {
  for (let name of fontNames) {
    fonts.push(loadFont(`https://asvild990.github.io/fonts/${name}.ttf`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;

  // Init arrays
  for (let i = 0; i < cols; i++) {
    fontIndex[i] = [];
    frozen[i] = [];
    cellGraphics[i] = [];
    for (let j = 0; j < rows; j++) {
      fontIndex[i][j] = floor(random(fonts.length));
      frozen[i][j] = false;
    }
  }

  createFullTextCanvases(); // render message once per font
  renderGrid();

  document.getElementById("grid-toggle").addEventListener("click", () => {
    gridVisible = !gridVisible;
  });

  setInterval(() => {
    let i = floor(random(cols));
    let j = floor(random(rows));
    rippleFontChange(i, j);
  }, rippleDelay);
}

function draw() {
  background("#F3F3F3");
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      image(cellGraphics[i][j], i * cellW, j * cellH, cellW, cellH);
      if (gridVisible) {
        stroke("#FFFFFF");
        strokeWeight(1);
        noFill();
        rect(i * cellW, j * cellH, cellW, cellH);
      }
    }
  }
}

function createFullTextCanvases() {
  fullTextCanvases = [];
  for (let f = 0; f < fonts.length; f++) {
    let pg = createGraphics(width, height);
    pg.background(0, 0);
    pg.fill(0);
    pg.textAlign(CENTER, CENTER);
    pg.textFont(fonts[f]);
    pg.textSize(min(width, height) * 0.15);
    pg.textLeading(pg.textSize() * 1.2);
    pg.text(message, width / 2, height / 2);
    fullTextCanvases.push(pg);
  }
}

function renderGrid() {
  cellGraphics = [];
  for (let i = 0; i < cols; i++) {
    cellGraphics[i] = [];
    for (let j = 0; j < rows; j++) {
      updateCell(i, j);
    }
  }
}

function updateCell(i, j) {
  let fontID = fontIndex[i][j];
  let fullCanvas = fullTextCanvases[fontID];

  let clipped = fullCanvas.get(i * cellW, j * cellH, cellW, cellH);
  let pg = createGraphics(cellW, cellH);
  pg.image(clipped, 0, 0);
  cellGraphics[i][j] = pg;
}

function rippleFontChange(i, j) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      let x = i + dx;
      let y = j + dy;
      if (x >= 0 && x < cols && y >= 0 && y < rows && !frozen[x][y]) {
        fontIndex[x][y] = floor(random(fonts.length));
        updateCell(x, y);
      }
    }
  }
}

function mousePressed() {
  let i = floor(mouseX / cellW);
  let j = floor(mouseY / cellH);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      let x = i + dx;
      let y = j + dy;
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        frozen[x][y] = true;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
  createFullTextCanvases();
  renderGrid();
}
