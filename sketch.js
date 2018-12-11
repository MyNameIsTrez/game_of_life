// left-click to place/remove cells,
// press spacebar to play/pause the simulation

// Game of Life implementation inspiration from:
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

// editable
let game_width = 400;
let game_height = 400;
let canvas_height = 500;
let cell_width_count = 10;
let cell_height_count = 10;
let _frameRate = 30;

// non-editable
// let fs = require('fs');
let cells = [];
let cell_width = game_width / cell_width_count;
let cell_height = game_height / cell_height_count;
let play = false;
let input_load, button_load, input_save, button_save;
let inputFolder = 'saves';
let saves = ['r_pentomino', 'blinker'];

function setup() {
  frameRate(_frameRate);
  createCanvas(game_width + 1, canvas_height + 1); // '+ 1' is needed to show the bottom and right strokes
  for (let y = 0; y < cell_height_count; y++) {
    for (let x = 0; x < cell_width_count; x++) {
      cell = new Cell(x * cell_width, y * cell_height, cells.length);
      cells.push(cell)
    }
  }

  // create the input field for the 'Load game' button
  input_load = createInput();
  input_load.position(game_width / 2 - input_load.width / 2 - 83 / 2, canvas_height + 15);

  // create the 'Load game' button
  button_load = createButton('Load game');
  button_load.position(input_load.x + input_load.width + 5, input_load.y);
  button_load.mousePressed(load_game);

  // create the input field for the 'Save game' button
  input_save = createInput();
  input_save.position(game_width / 2 - input_load.width / 2 - 83 / 2, canvas_height + 15 + 25);

  // create the 'Save game' button
  button_save = createButton('Save game');
  button_save.position(input_save.x + input_save.width + 5, input_save.y);
  button_save.mousePressed(save_game);
}

function load_game() {
  if (saves.indexOf(input_load.value()) >= 0) {
    if (input_load.value().length !== 0) {
      let save = loadJSON(`saves/${input_load.value()}.json`);
      console.log(save);
      console.log('Loaded!');
    }
  } else {
    console.log('Enter one of the available names to load: ', saves);
  }
}

function save_game() {
  let temp1 = [];
  for (cell in cells) {
    temp1.push(cells[cell].alive);
  }
  console.log(temp1);
}

function draw() {
  background(220);

  for (let cell in cells) {
    cells[cell].neighbours();
  }
  for (let cell in cells) {
    cells[cell].calculate();
    cells[cell].draw();
  }

  // create the boundary box for the 'Playing: true' text
  rect(0, game_height, game_width, canvas_height - game_height);

  // create the 'Playing: true' text
  textSize(24);
  if (play === true) {
    fill(0, 191, 0);
  } else {
    fill(255, 0, 0);
  }
  text('Playing: ' + play, width / 2 - 70, canvas_height - 40);
}

class Cell {
  constructor(x, y, number) {
    this.x = x;
    this.y = y;
    this.number = number;
    this.alive = false;
    this.total = 0;
  }

  draw() {
    if (this.alive) {
      fill(0);
    } else {
      noFill();
    }
    rect(this.x, this.y, cell_width, cell_height);
  }

  neighbours() {
    if (play) {
      this.total = 0;
      // top-left
      if (this.number > cell_width_count && this.number % cell_width_count !== 0) {
        this.total += cells[this.number - cell_width_count - 1].alive;
      }
      // top
      if (this.number > cell_width_count - 1) {
        this.total += cells[this.number - cell_width_count].alive;
      }
      // top-right
      if (this.number > cell_width_count - 1 && this.number % cell_width_count !== cell_width_count - 1) {
        this.total += cells[this.number - cell_width_count + 1].alive;
      }

      // left
      if (this.number > 0 && this.number % cell_width_count !== 0) {
        this.total += cells[this.number - 1].alive;
      }
      // right
      if (this.number < cell_width_count * cell_height_count - 1 && this.number % cell_width_count !== cell_width_count - 1) {
        this.total += cells[this.number + 1].alive;
      }

      // bottom-left
      if (this.number < cell_width_count * cell_height_count - cell_width_count && this.number % cell_width_count !== 0) {
        this.total += cells[this.number + cell_width_count - 1].alive;
      }
      // bottom
      if (this.number < cell_width_count * cell_height_count - cell_width_count) {
        this.total += cells[this.number + cell_width_count].alive;
      }
      // bottom-right
      if (this.number < cell_width_count * cell_height_count - cell_width_count - 1 && this.number % cell_width_count !== cell_width_count - 1) {
        this.total += cells[this.number + cell_width_count + 1].alive;
      }
    }
  }

  calculate() {
    if (play) {
      switch (this.total) {
        case 2:
          break;
        case 3:
          if (!this.alive) {
            this.alive = true;
          }
          break;
        default:
          this.alive = false;
          break;
      }
    }
  }

  clicked() {
    if (mouseX > this.x &&
      mouseX < this.x + cell_width &&
      mouseY > this.y &&
      mouseY < this.y + cell_height) {
      if (this.alive === false) {
        this.alive = true;
      } else {
        this.alive = false;
      }
    }
  }
}

function mousePressed() {
  if (!play) {
    for (let cell in cells) {
      cells[cell].clicked();
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      if (play) {
        play = false;
      } else {
        play = true;
      }
      break;
  }
}