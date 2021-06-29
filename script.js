"use strict";

const board = new Array(9).fill().map(() => new Array(9).fill(null));
const rowsContain = new Array(9).fill().map(() => new Array(9).fill(false));
const columnsContain = new Array(9).fill().map(() => new Array(9).fill(false));
const cellsContain = new Array(9).fill().map(() => new Array(9).fill(false));

let selectedNumber = null;

const numbers = document.querySelectorAll(".number");
const message = document.querySelector(".message");

const selectNumber = function () {
  selectedNumber = this.textContent;
  message.textContent = "";
  numbers.forEach((number) => number.classList.remove("selected"));
  this.classList.add("selected");
};

numbers.forEach((number) => number.addEventListener("click", selectNumber));

const squares = document.querySelectorAll(".square");

const addNumberToSquare = function () {
  message.textContent = "";
  const row = Number(this.classList[1].charAt(3));
  const column = Number(this.classList[2].charAt(6));
  let cell = getCell(row, column);
  let isNumber = false;
  if (selectedNumber > 0 && selectedNumber < 10) isNumber = true;
  if (
    isNumber &&
    (rowsContain[row][selectedNumber - 1] ||
      columnsContain[column][selectedNumber - 1] ||
      cellsContain[cell][selectedNumber - 1])
  ) {
    message.textContent = "Invalid position";
  } else if (isNumber) {
    board[row][column] = Number(selectedNumber);
    rowsContain[row][selectedNumber - 1] = true;
    columnsContain[column][selectedNumber - 1] = true;
    cellsContain[cell][selectedNumber - 1] = true;
    console.log(board);
    console.log(rowsContain);
    console.log(columnsContain);
    console.log(cellsContain);
    this.textContent = selectedNumber;
  } else {
    const content = this.textContent - 1;
    console.log(content);
    board[row][column] = null;
    rowsContain[row][content] = false;
    columnsContain[column][content] = false;
    cellsContain[cell][content] = false;
    this.textContent = "";
  }
};

squares.forEach((square) =>
  square.addEventListener("click", addNumberToSquare)
);

const solver = document.querySelector(".solver");
solver.addEventListener("click", function () {
  let timeLimit = Date.now();
  let didIt = solve(0, 0, timeLimit);
  if (!didIt) message.textContent = "Unable to solve";
  fillSquares();
});

const clear = document.querySelector(".clear");
clear.addEventListener("click", function () {
  clearBoard();
  fillSquares();
});

// Solving

let getNextRow = function (row, col) {
  return row + Math.trunc((col + 1) / 9);
};

let getNextCol = function (col) {
  return (col + 1) % 9;
};

let getCell = function (row, col) {
  return Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
};

const nextEmptyPosition = function (row, col) {
  while (row != 9) {
    if (board[row][col] == null) {
      return [row, col];
    }
    row = getNextRow(row, col);
    col = getNextCol(col);
  }
  return [9, 0];
};

let solve = function (rowStart, colStart, timeLimit) {
  if (Date.now() - timeLimit > 1000) {
    return false;
  }
  let position = nextEmptyPosition(rowStart, colStart);
  let row = position[0];
  let col = position[1];
  if (row == 9) {
    return true;
  }
  let cell = getCell(row, col);
  let contains = new Array(9).fill(false);
  for (let i = 0; i < 9; ++i) {
    if (
      rowsContain[row][i] ||
      columnsContain[col][i] ||
      cellsContain[cell][i]
    ) {
      contains[i] = true;
    }
  }
  if (containsAll(contains)) {
    return false;
  }
  for (let digit_idx = 0; digit_idx < 9; ++digit_idx) {
    if (!contains[digit_idx]) {
      board[row][col] = digit_idx + 1;
      rowsContain[row][digit_idx] = true;
      columnsContain[col][digit_idx] = true;
      cellsContain[cell][digit_idx] = true;
      if (solve(row, col, timeLimit)) {
        return true;
      }

      rowsContain[row][digit_idx] = false;
      columnsContain[col][digit_idx] = false;
      cellsContain[cell][digit_idx] = false;
    }
  }
  board[row][col] = null;
  return false;
};

const containsAll = function (containsArray) {
  for (let value of containsArray) {
    if (!value) return false;
  }
  return true;
};

// Filling squares

const fillSquares = function () {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      let square = document.querySelector(`.row${i}.column${j}`);
      if (board[i][j] != null) {
        square.textContent = board[i][j];
      } else {
        square.textContent = "";
      }
    }
  }
};

// Clearing board
const clearBoard = function () {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      board[i][j] = null;
      rowsContain[i][j] = false;
      columnsContain[i][j] = false;
      cellsContain[i][j] = false;
    }
  }
};
