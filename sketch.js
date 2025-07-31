let fonts = [];
let fontNames = [
  'Georgia', 'Arial', 'Courier New', 'Verdana', 'Times New Roman',
  'Helvetica', 'Trebuchet MS', 'Garamond', 'Impact', 'Comic Sans MS'
];
let message = ["Visual", "Systems"];
let cols = 20;
let rows = 11;
let cellW, cellH;
let fontIndex = [];
let cellGraphics = [];
let showGrid = true;
let freezeMap = [];
let lastUpdateTimes = [];

function preload() {
  for (let name of fontNames) {
    fonts.push(name);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
  for (let i = 0; i < cols; i++) {
    fontIndex[i] = [];
    cellGraphics[i] = [];
    freezeMap[i] = [];
    lastUpdateTimes[i] = [];
    for (let j = 0; j < rows; j++) {
      fontIndex[i][j] = int(random(fonts.length));
      freezeMap[i][j] = false;
      lastUpdateTimes[i][j] = millis() + (i + j) * 60; // diagonal ripple
      cellGraphics[i][j] = createGraphics(cellW, cellH);
    }
  }
  renderGrid();
  document.getElementById("grid-toggle").onclick = () => {
    showGrid = !showGrid;
  };
}

function draw() {
  background("#f3f3f3");
  cellW = width / cols;
  cellH = height / rows;
  let currentTime = millis();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!freezeMap[i][j] && currentTime - lastUpdateTimes[i][j] > 1800) {
        fontIndex[i][j] = int(random(fonts.length));
        renderCell(i, j);
        lastUpdateTimes[i][j] = currentTime + (i + j) * 60;
      }
      image(cellGraphics[i][j], i * cellW, j * cellH, cellW, cellH);
      if (showGrid) {
        stroke("#ffffff");
        strokeWeight(0.25);
        noFill();
        rect(i * cellW, j * cellH, cellW, cellH);
      }
    }
  }
}

function renderGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      renderCell(i, j);
    }
  }
}

function renderCell(i, j) {
  cellGraphics[i][j].clear();
  cellGraphics[i][j].background(0, 0);
  cellGraphics[i][j].fill(0);
  cellGraphics[i][j].textAlign(CENTER, CENTER);
  cellGraphics[i][j].textSize(min(cellW, cellH) * 0.8);
  cellGraphics[i][j].textFont(fonts[fontIndex[i][j]]);
  let lineIndex = j < rows / 2 ? 0 : 1;
  cellGraphics[i][j].text(message[lineIndex], cellW / 2, cellH / 2);
}

function mousePressed() {
  let i = int(mouseX / cellW);
  let j = int(mouseY / cellH);
  let radius = 1;
  for (let x = i - radius; x <= i + radius; x++) {
    for (let y = j - radius; y <= j + radius; y++) {
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        freezeMap[x][y] = true;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      cellGraphics[i][j] = createGraphics(cellW, cellH);
      renderCell(i, j);
    }
  }
}
