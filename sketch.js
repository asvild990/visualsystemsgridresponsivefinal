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
let message = "Visual\nSystems";
let rippleDelay = 1800; // ms
let gridVisible = true;

function preload() {
  for (let name of fontNames) {
    fonts.push(loadFont(https://asvild990.github.io/fonts/${name}.ttf));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;

  for (let i = 0; i < cols; i++) {
    fontIndex[i] = [];
    frozen[i] = [];
    cellGraphics[i] = [];
    for (let j = 0; j < rows; j++) {
      fontIndex[i][j] = floor(random(fonts.length));
      frozen[i][j] = false;
      cellGraphics[i][j] = createGraphics(cellW, cellH);
    }
  }

  renderGrid();

  document.getElementById("grid-toggle").addEventListener("click", () => {
    gridVisible = !gridVisible;
  });

  // Trigger ripple cycle
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

function renderGrid() {
  let tempPG = createGraphics(width, height);
  tempPG.background(0, 0);
  tempPG.fill(0);
  tempPG.textAlign(CENTER, CENTER);
  tempPG.textSize(min(width, height) * 0.15);
  tempPG.textLeading(tempPG.textSize() * 1.2);
  tempPG.textFont(fonts[0]); // Default font to start
  tempPG.text(message, width / 2, height / 2);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      updateCell(i, j, tempPG);
    }
  }
}

function updateCell(i, j, sourcePG = null) {
  let font = fonts[fontIndex[i][j]];
  let tempPG = sourcePG || createGraphics(width, height);
  if (!sourcePG) {
    tempPG.background(0, 0);
    tempPG.fill(0);
    tempPG.textAlign(CENTER, CENTER);
    tempPG.textSize(min(width, height) * 0.15);
    tempPG.textLeading(tempPG.textSize() * 1.2);
    tempPG.textFont(font);
    tempPG.text(message, width / 2, height / 2);
  }

  let img = tempPG.get(i * cellW, j * cellH, cellW, cellH);
  cellGraphics[i][j] = createGraphics(cellW, cellH);
  cellGraphics[i][j].image(img, 0, 0);
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
  renderGrid();
}
